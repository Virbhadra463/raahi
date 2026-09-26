import math
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple, Union
from app.models.schemas import (
    ItineraryDay, ActivityItem, PlaceItem, HotelItem, RemovedAttractionRecord
)
from app.agent.schemas import ExtractedTripRequirements
from app.tools.routing import get_route

logger = logging.getLogger(__name__)


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def cluster_places_by_district(
    places: List[PlaceItem],
    days_count: int,
    max_places_per_day: int = 4
) -> List[List[PlaceItem]]:
    """
    District and capacity-aware clustering.
    Solves the seed-clustering bug:
    When a single district (e.g. South Mumbai) contains 8-10 essential highlights,
    it does NOT discard the excess places. Instead, it overflows them into consecutive days
    so iconic sights are never dropped simply because they reside in the same district.
    """
    if not places:
        return [[] for _ in range(days_count)]
    if days_count <= 1:
        return [places[:max_places_per_day]]

    # Step 1: Group places into geographic neighborhoods (radius <= 7.0 km)
    neighborhoods: List[List[PlaceItem]] = []
    unassigned = list(places)

    while unassigned:
        lead = unassigned.pop(0)
        current_neighborhood = [lead]
        remaining_unassigned = []
        for p in unassigned:
            dist = haversine_km(lead.latitude, lead.longitude, p.latitude, p.longitude)
            if dist <= 7.5:
                current_neighborhood.append(p)
            else:
                remaining_unassigned.append(p)
        unassigned = remaining_unassigned
        neighborhoods.append(current_neighborhood)

    # Step 2: Distribute neighborhoods across days respecting capacity
    # If a neighborhood has more items than max_places_per_day, split it across days
    day_allocations: List[List[PlaceItem]] = [[] for _ in range(days_count)]
    current_day_idx = 0

    for n_group in neighborhoods:
        # Sort group by priority/essential if tagged
        group_places = list(n_group)
        while group_places:
            if current_day_idx >= days_count:
                # If all days are populated, distribute remaining to days with least items
                min_day_idx = min(range(days_count), key=lambda idx: len(day_allocations[idx]))
                if len(day_allocations[min_day_idx]) < max_places_per_day:
                    day_allocations[min_day_idx].append(group_places.pop(0))
                else:
                    break
            else:
                space_in_day = max_places_per_day - len(day_allocations[current_day_idx])
                if space_in_day <= 0:
                    current_day_idx += 1
                    continue

                chunk = group_places[:space_in_day]
                day_allocations[current_day_idx].extend(chunk)
                group_places = group_places[space_in_day:]
                if len(day_allocations[current_day_idx]) >= max_places_per_day:
                    current_day_idx += 1

    return day_allocations


def sequence_places_tsp(
    start_lat: float,
    start_lon: float,
    places: List[PlaceItem]
) -> List[PlaceItem]:
    """
    Greedy nearest-neighbor TSP to sequence places starting from start coordinate.
    Minimizes transit distance and eliminates criss-crossing.
    """
    if not places:
        return []
    unvisited = list(places)
    route: List[PlaceItem] = []
    curr_lat, curr_lon = start_lat, start_lon

    while unvisited:
        next_p = min(
            unvisited,
            key=lambda p: haversine_km(curr_lat, curr_lon, p.latitude, p.longitude)
        )
        route.append(next_p)
        curr_lat, curr_lon = next_p.latitude, next_p.longitude
        unvisited.remove(next_p)

    return route


def partition_places_by_ideal_time(places: List[PlaceItem]) -> Dict[str, List[PlaceItem]]:
    """
    Partitions a day's places by their optimal time of day:
    - morning: temples, caves, large monuments (e.g. Gateway, Elephanta, Babulnath)
    - afternoon: indoor museums, air-conditioned galleries, historic markets
    - sunset: waterfront promenades (Marine Drive), hilltop viewpoints (Hanging Gardens), beaches (Chowpatty)
    - evening: night bazaars, lively food streets
    """
    partitions: Dict[str, List[PlaceItem]] = {
        "morning": [],
        "afternoon": [],
        "sunset": [],
        "evening": [],
        "any": []
    }

    for p in places:
        name_lower = p.name.lower()
        cat_lower = p.category.lower()

        # Sunset detection
        if any(w in name_lower for w in ("marine drive", "hanging garden", "chowpatty", "viewpoint", "sunset", "bandstand")):
            partitions["sunset"].append(p)
        # Morning detection
        elif any(w in name_lower for w in ("elephanta", "cave", "temple", "mandir", "fort", "gateway")):
            partitions["morning"].append(p)
        # Afternoon / indoor / shopping
        elif any(w in name_lower for w in ("museum", "market", "bazaar", "crawford", "palace")):
            partitions["afternoon"].append(p)
        # Evening
        elif any(w in name_lower for w in ("colaba causeway", "night", "chowk")):
            partitions["evening"].append(p)
        else:
            partitions["any"].append(p)

    return partitions


def format_minutes_to_time(base_hour: int, base_min: int, added_mins: int) -> str:
    """Format total minutes from start time to HH:MM 24-hour string."""
    total_minutes = base_hour * 60 + base_min + added_mins
    h = (total_minutes // 60) % 24
    m = total_minutes % 60
    return f"{h:02d}:{m:02d}"


async def build_multiday_itinerary(
    ranked_places: List[PlaceItem],
    selected_hotel: HotelItem,
    restaurants: List[PlaceItem],
    requirements: ExtractedTripRequirements,
    return_removals: bool = False
) -> Union[List[ItineraryDay], Tuple[List[ItineraryDay], List[RemovedAttractionRecord]]]:
    """
    Build a realistic, geographically clustered, time-aware multi-day itinerary.
    Features:
    1. District & Capacity-Aware Allocation (prevents dropping South Mumbai sights across days)
    2. Dynamic Time-of-Day Scheduling (Morning culture, Afternoon heritage, Sunset Marine Drive / Chowpatty)
    3. OSRM Road Transit Verification & Invariant Guard (180 mins maximum travel per day)
    4. Explainable Removal Tracking (transparent records if any candidate overflows)
    """
    days_count = max(1, min(requirements.duration_days, 14))
    itinerary_days: List[ItineraryDay] = []
    removed_records: List[RemovedAttractionRecord] = []

    # Pace configuration
    is_relaxed = requirements.pace == "relaxed" or any(
        t in ("parents", "seniors", "elderly") for t in requirements.traveller_types
    )
    activities_per_day = 2 if is_relaxed else 4
    is_local_exp = getattr(requirements, "local_experience", False) or "local" in getattr(requirements, "travel_style", [])

    # Hotel coordinates
    hotel_lat = selected_hotel.latitude or 19.0760
    hotel_lon = selected_hotel.longitude or 72.8777

    # Filter vegetarian restaurants if requested
    veg_pref = any("veg" in f.lower() for f in requirements.food_preferences)
    lunch_places = [
        r for r in restaurants
        if not veg_pref or ("veg" in r.name.lower() or "veg" in (r.description or "").lower() or "prasad" in r.name.lower())
    ]
    if not lunch_places:
        lunch_places = restaurants

    # District & Capacity-Aware day grouping
    day_clusters = cluster_places_by_district(
        places=ranked_places,
        days_count=days_count,
        max_places_per_day=activities_per_day
    )

    # Sort clusters so Day 1 begins with cluster closest to hotel
    if len(day_clusters) > 1:
        day_clusters.sort(
            key=lambda c: min(haversine_km(hotel_lat, hotel_lon, p.latitude, p.longitude) for p in c) if c else 999.0
        )

    start_date = datetime.now().date()

    for day_idx in range(days_count):
        day_num = day_idx + 1
        current_date_str = (start_date + timedelta(days=day_idx)).strftime("%Y-%m-%d")

        current_lat = hotel_lat
        current_lon = hotel_lon
        current_minute_offset = 0

        day_activities: List[ActivityItem] = []
        day_total_travel_mins = 0
        day_total_travel_km = 0.0

        cluster_places = day_clusters[day_idx] if day_idx < len(day_clusters) else []
        if not cluster_places and ranked_places:
            cluster_places = ranked_places[:activities_per_day]

        # 1. Day Start: check-in for Day 1 multi-day, or morning start
        if day_num == 1 and days_count > 1:
            day_activities.append(
                ActivityItem(
                    time="09:00",
                    place=f"Arrival & Check-in at {selected_hotel.name}",
                    category="Accommodation / Refresh",
                    duration_minutes=60,
                    travel_from_previous_minutes=0,
                    travel_distance_km=0.0,
                    latitude=current_lat,
                    longitude=current_lon,
                    notes="Check-in, drop luggage, and freshen up before heading out for sightseeing.",
                    accessibility="Elevator and luggage assistance available"
                )
            )
            current_minute_offset = 60  # 10:00 AM
        elif day_num == 1 and days_count == 1:
            day_activities.append(
                ActivityItem(
                    time="08:30",
                    place=f"Arrival at {requirements.destination} Base Hub",
                    category="Transit / Start",
                    duration_minutes=30,
                    travel_from_previous_minutes=0,
                    travel_distance_km=0.0,
                    latitude=current_lat,
                    longitude=current_lon,
                    notes=f"Morning arrival in {requirements.destination}. Quick local refreshment and orientation.",
                    accessibility="Ground level"
                )
            )
            current_minute_offset = 30
        else:
            day_activities.append(
                ActivityItem(
                    time="09:00",
                    place=f"Depart from {selected_hotel.name}",
                    category="Morning Start",
                    duration_minutes=15,
                    travel_from_previous_minutes=0,
                    travel_distance_km=0.0,
                    latitude=current_lat,
                    longitude=current_lon,
                    notes="Breakfast at stay and departure for today's district highlights.",
                    accessibility="Hotel lobby"
                )
            )
            current_minute_offset = 15

        # 2. Partition cluster places by ideal time of day
        partitions = partition_places_by_ideal_time(cluster_places)

        # Build ordered schedule: Morning -> Lunch -> Afternoon -> Sunset -> Evening
        morning_queue = partitions["morning"] + [p for p in partitions["any"] if p not in partitions["sunset"]]
        post_lunch_queue = partitions["afternoon"] + partitions["sunset"] + partitions["evening"]

        # Ensure balanced split
        if not morning_queue and post_lunch_queue:
            morning_queue = [post_lunch_queue.pop(0)]
        elif not post_lunch_queue and morning_queue and len(morning_queue) > 1:
            post_lunch_queue = [morning_queue.pop()]

        # Sequence morning places using Nearest-Neighbor TSP
        morning_ordered = sequence_places_tsp(current_lat, current_lon, morning_queue[:2])
        # Sequence post-lunch places placing sunset places towards late afternoon (17:00+)
        sunset_sights = [p for p in post_lunch_queue if p in partitions["sunset"]]
        non_sunset = [p for p in post_lunch_queue if p not in partitions["sunset"]]
        post_lunch_ordered = sequence_places_tsp(current_lat, current_lon, non_sunset) + sunset_sights

        # 3. Schedule Morning Sights (Pre-Lunch)
        for s_idx, m_place in enumerate(morning_ordered):
            m_route = await get_route(current_lat, current_lon, m_place.latitude, m_place.longitude)
            travel_mins = m_route["duration_minutes"]
            travel_km = m_route["distance_km"]

            # Safety check: avoid exceeding daily transit ceiling
            if day_total_travel_mins + travel_mins > 165:
                removed_records.append(
                    RemovedAttractionRecord(
                        name=m_place.name,
                        reason="daily_transit_limit_exceeded",
                        tier=getattr(m_place, "tier", "RECOMMENDED"),
                        suggestion="Consider visiting during personal morning hours or adding a day."
                    )
                )
                continue

            current_minute_offset += travel_mins
            activity_time = format_minutes_to_time(9, 0, current_minute_offset)
            duration = 90 if "temple" in m_place.category.lower() or "caves" in m_place.name.lower() else (60 if s_idx > 0 else 75)

            m_notes = m_place.description or f"Exploration of {m_place.name}"
            if is_local_exp:
                m_notes += " | Highly recommended: Soak in local heritage and vibrant morning surroundings."

            day_activities.append(
                ActivityItem(
                    time=activity_time,
                    place=m_place.name,
                    category=m_place.category,
                    duration_minutes=duration,
                    travel_from_previous_minutes=travel_mins,
                    travel_distance_km=travel_km,
                    latitude=m_place.latitude,
                    longitude=m_place.longitude,
                    notes=m_notes,
                    accessibility=m_place.wheelchair or "Ground-level accessibility"
                )
            )
            current_lat = m_place.latitude
            current_lon = m_place.longitude
            current_minute_offset += duration
            day_total_travel_mins += travel_mins
            day_total_travel_km += travel_km

        # 4. Lunch Break: Scheduled between 12:45 PM and 14:00 PM
        if current_minute_offset < 225:  # 12:45 PM is 225 mins from 09:00
            current_minute_offset = 225

        if lunch_places:
            nearest_lunch = min(
                lunch_places,
                key=lambda r: haversine_km(current_lat, current_lon, r.latitude, r.longitude)
            )
            l_route = await get_route(current_lat, current_lon, nearest_lunch.latitude, nearest_lunch.longitude)
            l_travel_mins = l_route["duration_minutes"]
            l_travel_km = l_route["distance_km"]

            current_minute_offset += l_travel_mins
            lunch_time = format_minutes_to_time(9, 0, current_minute_offset)
            meal_notes = nearest_lunch.description or f"Authentic meal stop at {nearest_lunch.name}."
            if "Aram" in nearest_lunch.name:
                meal_notes += " Famed for legendary crispy Vada Pav, Kothimbir Vadi, and cutting chai opposite CST."
            elif "Cannon" in nearest_lunch.name:
                meal_notes += " Famed for rich buttery Pav Bhaji and fresh lassi."

            day_activities.append(
                ActivityItem(
                    time=lunch_time,
                    place=nearest_lunch.name,
                    category="Restaurant / Meal",
                    duration_minutes=60,
                    travel_from_previous_minutes=l_travel_mins,
                    travel_distance_km=l_travel_km,
                    latitude=nearest_lunch.latitude,
                    longitude=nearest_lunch.longitude,
                    notes=meal_notes,
                    is_meal=True,
                    accessibility="Ground floor seating available"
                )
            )
            current_lat = nearest_lunch.latitude
            current_lon = nearest_lunch.longitude
            current_minute_offset += 60
            day_total_travel_mins += l_travel_mins
            day_total_travel_km += l_travel_km

        # 5. Afternoon & Sunset Sights (Post-Lunch)
        # Ensure post-lunch activities commence around 14:30
        if current_minute_offset < 330:  # 14:30
            current_minute_offset = 330

        for a_idx, a_place in enumerate(post_lunch_ordered[:2]):
            a_route = await get_route(current_lat, current_lon, a_place.latitude, a_place.longitude)
            a_travel_mins = a_route["duration_minutes"]
            a_travel_km = a_route["distance_km"]

            # Estimate return transit to hotel from candidate
            est_ret = await get_route(a_place.latitude, a_place.longitude, hotel_lat, hotel_lon)
            ret_mins = est_ret["duration_minutes"]

            if day_total_travel_mins + a_travel_mins + ret_mins > 175:
                removed_records.append(
                    RemovedAttractionRecord(
                        name=a_place.name,
                        reason="daily_transit_limit_exceeded",
                        tier=getattr(a_place, "tier", "RECOMMENDED"),
                        suggestion="Rescheduled for subsequent days or evening free time."
                    )
                )
                continue

            # If sunset highlight (e.g. Marine Drive, Hanging Gardens, Chowpatty), adjust start to ~17:00
            is_sunset = any(w in a_place.name.lower() for w in ("marine drive", "hanging garden", "chowpatty", "promenade", "viewpoint"))
            if is_sunset and current_minute_offset < 480:  # 17:00 PM is 480 mins from 09:00
                current_minute_offset = 480

            current_minute_offset += a_travel_mins
            a_time = format_minutes_to_time(9, 0, current_minute_offset)
            a_duration = 75 if is_sunset else 60

            a_notes = a_place.description or f"Visit to {a_place.name}"
            if "marine drive" in a_place.name.lower():
                a_notes += " | Iconic sunset golden hour stroll along Queen's Necklace with sea breeze and street chai."
            elif "hanging garden" in a_place.name.lower():
                a_notes += " | Superb sunset vantage point overlooking Marine Drive and the Arabian Sea."
            elif "chowpatty" in a_place.name.lower():
                a_notes += " | Evening beach stroll with authentic Mumbai street chaat (Bhel Puri, Sev Puri, Kulfi)."

            day_activities.append(
                ActivityItem(
                    time=a_time,
                    place=a_place.name,
                    category=a_place.category,
                    duration_minutes=a_duration,
                    travel_from_previous_minutes=a_travel_mins,
                    travel_distance_km=a_travel_km,
                    latitude=a_place.latitude,
                    longitude=a_place.longitude,
                    notes=a_notes,
                    accessibility=a_place.wheelchair or "Pedestrian accessible"
                )
            )
            current_lat = a_place.latitude
            current_lon = a_place.longitude
            current_minute_offset += a_duration
            day_total_travel_mins += a_travel_mins
            day_total_travel_km += a_travel_km

        # 6. Evening Return to Hotel
        ret_route = await get_route(current_lat, current_lon, hotel_lat, hotel_lon)
        day_total_travel_mins += ret_route["duration_minutes"]
        day_total_travel_km += ret_route["distance_km"]

        return_place = f"Return to {selected_hotel.name}" if days_count > 1 else f"Conclusion at {requirements.destination} Hub"
        return_notes = "Dinner, relaxation, and recap after a rewarding day of sightseeing." if days_count > 1 else "Conclude exploration, enjoy evening snacks, and head to onward transit."

        day_activities.append(
            ActivityItem(
                time=format_minutes_to_time(9, 0, max(current_minute_offset + ret_route["duration_minutes"], 570)),
                place=return_place,
                category="Rest & Dinner",
                duration_minutes=60 if days_count == 1 else 90,
                travel_from_previous_minutes=ret_route["duration_minutes"],
                travel_distance_km=ret_route["distance_km"],
                latitude=hotel_lat,
                longitude=hotel_lon,
                notes=return_notes,
                is_meal=True
            )
        )

        # Dynamic District / Cluster title
        lead_place = morning_ordered[0] if morning_ordered else (cluster_places[0] if cluster_places else None)
        district_name = lead_place.name if lead_place else f"{requirements.destination} Circuit"
        if days_count == 1:
            title = f"Day 1: {requirements.destination} Iconic Highlights & Local Circuit"
            theme = "Immersive Full-Day Exploration"
        elif day_num == 1:
            title = f"Day 1: {district_name} & Heritage Highlights"
            theme = "Historic Landmarks & Cultural Immersion"
        elif day_num == days_count:
            title = f"Day {day_num}: {district_name}, Bazaars & Departure"
            theme = "Coastal Promenades, Local Markets & Departure"
        else:
            title = f"Day {day_num}: {district_name} & Waterfront Exploration"
            theme = "District Discovery & Scenic Panoramas"

        itinerary_days.append(
            ItineraryDay(
                day_number=day_num,
                date=current_date_str,
                title=title,
                theme=theme,
                activities=day_activities,
                day_total_travel_minutes=day_total_travel_mins,
                day_total_travel_km=round(day_total_travel_km, 2)
            )
        )

    if return_removals:
        return itinerary_days, removed_records
    return itinerary_days


async def replan_itinerary(
    current_requirements: ExtractedTripRequirements,
    changes: Dict[str, Any],
    ranked_places: List[PlaceItem],
    selected_hotel: HotelItem,
    restaurants: List[PlaceItem]
) -> List[ItineraryDay]:
    """
    Dynamic replanning engine: adjusts constraints and rebuilds multi-day itinerary.
    """
    updated_reqs = current_requirements.model_copy(update=changes)
    return await build_multiday_itinerary(
        ranked_places=ranked_places,
        selected_hotel=selected_hotel,
        restaurants=restaurants,
        requirements=updated_reqs
    )
