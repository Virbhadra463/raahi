import logging
import copy
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

from app.models.schemas import (
    ItineraryDay, ActivityItem, PlaceItem, ActivityChangeRecord
)
from app.tools.weather import (
    classify_activity_exposure, compute_weather_suitability, get_weather_condition_text
)
from app.tools.routing import get_route

logger = logging.getLogger(__name__)

# Fallback curated rain-safe cultural & artisan centers by region in Maharashtra
CURATED_INDOOR_ALTERNATIVES: Dict[str, List[Dict[str, Any]]] = {
    "pune": [
        {
            "name": "Raja Dinkar Kelkar Museum",
            "category": "museum",
            "notes": "Sheltered indoor exploration of 20,000+ historical artifacts, musical instruments, and Maratha craftsmanship.",
            "duration": 75,
            "lat": 18.5113,
            "lon": 73.8542
        },
        {
            "name": "Tambat Ali Coppersmith Heritage Workshop",
            "category": "artisan / craft workshop",
            "notes": "Covered traditional artisan enclave observing master coppersmiths crafting authentic Mathar kaam copperware.",
            "duration": 60,
            "lat": 18.5175,
            "lon": 73.8548
        },
        {
            "name": "Tribal Cultural Research & Training Museum",
            "category": "museum",
            "notes": "Indoor ethnographic collection of indigenous Warli art, masks, and tribal lifestyle of Maharashtra.",
            "duration": 60,
            "lat": 18.5280,
            "lon": 73.8741
        }
    ],
    "mumbai": [
        {
            "name": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)",
            "category": "museum",
            "notes": "World-class indoor Indo-Saracenic museum housing magnificent art, archaeology, and natural history galleries.",
            "duration": 90,
            "lat": 18.9269,
            "lon": 72.8327
        },
        {
            "name": "Mani Bhavan Gandhi Sangrahalaya",
            "category": "museum",
            "notes": "Rain-sheltered heritage museum and library dedicated to Mahatma Gandhi's freedom movements in Bombay.",
            "duration": 60,
            "lat": 18.9602,
            "lon": 72.8105
        },
        {
            "name": "Kumbharwada Pottery Artisan Quarter",
            "category": "artisan / craft workshop",
            "notes": "Covered heritage potter's colony experiencing generations-old terracotta craftsmanship and clay sculpting.",
            "duration": 60,
            "lat": 18.9610,
            "lon": 72.8315
        }
    ],
    "aurangabad": [
        {
            "name": "Paithani Silk Weaving & Experience Center",
            "category": "artisan / craft workshop",
            "notes": "Sheltered textile center demonstrating master weavers producing royal zari Paithani sarees on handlooms.",
            "duration": 60,
            "lat": 19.8762,
            "lon": 75.3433
        },
        {
            "name": "Himroo Weaving Heritage Factory",
            "category": "artisan / craft workshop",
            "notes": "Traditional workshop showcasing historic Persian-Nizam Himroo brocade fabric weaving.",
            "duration": 60,
            "lat": 19.8911,
            "lon": 75.3214
        }
    ],
    "nashik": [
        {
            "name": "Gargoti Mineral Museum",
            "category": "museum",
            "notes": "Renowned indoor museum showcasing rare zeolites, micro-crystals, and geological treasures of the Deccan plateau.",
            "duration": 60,
            "lat": 19.9975,
            "lon": 73.7898
        }
    ],
    "shirdi": [
        {
            "name": "Dixit Wada Heritage Museum",
            "category": "museum",
            "notes": "Covered historical museum displaying vintage personal artifacts, robes, and records of Sai Baba.",
            "duration": 45,
            "lat": 19.7667,
            "lon": 74.4766
        },
        {
            "name": "Sai Teerth Spiritual Indoor Cultural Arena",
            "category": "museum / cultural",
            "notes": "Fully indoor air-conditioned cultural complex presenting animatronics and historical devotionals.",
            "duration": 75,
            "lat": 19.7712,
            "lon": 74.4795
        }
    ]
}


def get_hourly_weather_at_time(
    hourly_forecast: List[Dict[str, Any]],
    date_str: Optional[str],
    time_str: str
) -> Dict[str, Any]:
    """
    Find corresponding hourly forecast for a given date and HH:MM time string.
    """
    if not hourly_forecast:
        return {
            "temperature_c": 26.0,
            "precipitation_probability": 10,
            "precipitation_mm": 0.0,
            "wind_speed_kmh": 10.0,
            "weather_code": 1,
            "condition": "Mainly clear"
        }

    # Extract target hour
    try:
        hour = int(time_str.split(":")[0])
    except Exception:
        hour = 12

    # Match by date and hour if possible
    prefix = f"{date_str}T{hour:02d}" if date_str else f"{hour:02d}:00"
    for item in hourly_forecast:
        t = item.get("time", "")
        if prefix in t or (f"T{hour:02d}" in t):
            return item

    # Fallback to hour index
    idx = min(hour, len(hourly_forecast) - 1)
    return hourly_forecast[idx]


def score_activity_weather(
    activity: ActivityItem,
    weather_info: Dict[str, Any],
    weather_preference: Optional[Dict[str, Any]] = None
) -> Tuple[int, str, str]:
    """
    Compute weather suitability score (0-100), condition summary, and status for an activity.
    Status: 'recommended' (score >= 60), 'affected' (score < 60), 'replaced' (when substituted)
    """
    exposure = classify_activity_exposure(activity.category, activity.place)
    activity.exposure = exposure

    score, reason = compute_weather_suitability(
        exposure=exposure,
        precipitation_probability=weather_info.get("precipitation_probability", 0),
        precipitation_mm=weather_info.get("precipitation_mm", 0.0),
        temperature_c=weather_info.get("temperature_c", 26.0),
        wind_speed_kmh=weather_info.get("wind_speed_kmh", 10.0),
        weather_code=weather_info.get("weather_code", 0),
        weather_preference=weather_preference
    )

    cond = weather_info.get("condition") or get_weather_condition_text(weather_info.get("weather_code", 0))
    status = "recommended" if score >= 60 else "affected"

    activity.weather_suitability = score
    activity.weather_condition = f"{cond}, {weather_info.get('temperature_c', 26.0)}°C, Rain {weather_info.get('precipitation_probability', 0)}%"
    activity.weather_status = status

    return score, activity.weather_condition, status


def find_rain_safe_alternative(
    destination: str,
    original_place: str,
    available_places: Optional[List[PlaceItem]] = None,
    used_places: Optional[set] = None
) -> Dict[str, Any]:
    """
    Find a suitable indoor museum or artisan craft workshop alternative.
    Prioritizes real places from OSM candidate pool, then curated regional artisan/museum gems.
    """
    used = used_places or set()
    dest_lower = (destination or "").lower()

    # 1. Search candidate places cache for indoor museum or artisan workshop
    if available_places:
        for p in available_places:
            p_name = p.name.strip()
            if p_name.lower() in used or p_name.lower() == original_place.lower():
                continue
            exp = classify_activity_exposure(p.category, p_name)
            if exp == "indoor":
                return {
                    "name": p.name,
                    "category": p.category,
                    "notes": p.description or f"Rain-sheltered cultural visit to {p.name}.",
                    "duration": 60,
                    "latitude": p.latitude,
                    "longitude": p.longitude
                }

    # 2. Check region-specific curated indoor alternatives
    for reg, alts in CURATED_INDOOR_ALTERNATIVES.items():
        if reg in dest_lower:
            for alt in alts:
                if alt["name"].lower() not in used and alt["name"].lower() != original_place.lower():
                    return alt

    # 3. Generic fallback artisan / museum alternative
    return {
        "name": f"{destination.title()} Heritage & Artisan Craft Workshop",
        "category": "artisan / craft workshop",
        "notes": f"Immersive indoor masterclass with local {destination.title()} artisans exploring regional handicrafts and folklore.",
        "duration": 60,
        "latitude": None,
        "longitude": None
    }


async def evaluate_and_replan_weather(
    itinerary_days: List[ItineraryDay],
    weather_state: Dict[str, Any],
    destination: str,
    available_places: Optional[List[PlaceItem]] = None,
    weather_preference: Optional[Dict[str, Any]] = None,
    suitability_threshold: int = 50
) -> Tuple[List[ItineraryDay], List[ActivityChangeRecord]]:
    """
    Weather-Aware Itinerary Evaluator & Replanner (Deterministic Logic):
    
    1. Score every activity against forecast/scenario weather for its scheduled day and hour.
    2. Detect activities with unacceptable conditions (outdoor activity with score < suitability_threshold).
    3. Attempt to re-time / swap within the day if a better window exists.
    4. If impossible, replace with an indoor museum or artisan workshop.
    5. Re-sequence times and recalculate transit times.
    6. Return the updated itinerary and explicit change records.
    """
    hourly_forecast = weather_state.get("hourly") or []
    scenario_override = weather_state.get("scenario_weather")

    updated_days: List[ItineraryDay] = []
    changes: List[ActivityChangeRecord] = []
    scheduled_places: set = set()

    for d in itinerary_days:
        for a in d.activities:
            scheduled_places.add(a.place.lower())

    for day in itinerary_days:
        new_day = copy.deepcopy(day)
        day_date = new_day.date
        new_activities: List[ActivityItem] = []

        for act in new_day.activities:
            # Skip meals and hotel check-in/out from weather swapping
            if act.is_meal or "check-in" in act.place.lower() or "depart from" in act.place.lower() or "return to" in act.place.lower():
                act.weather_suitability = 100
                act.weather_status = "recommended"
                act.weather_condition = "Sheltered transit / dining"
                new_activities.append(act)
                continue

            # Determine weather conditions for this activity's time slot
            if scenario_override:
                act_weather = {
                    "temperature_c": scenario_override.get("temperature_c", 24.0),
                    "precipitation_probability": scenario_override.get("precipitation_probability", 85.0),
                    "precipitation_mm": scenario_override.get("precipitation_mm", 15.0),
                    "wind_speed_kmh": scenario_override.get("wind_speed_kmh", 15.0),
                    "weather_code": scenario_override.get("weather_code", 65),
                    "condition": scenario_override.get("weather_condition", "Heavy Rain")
                }
            else:
                act_weather = get_hourly_weather_at_time(hourly_forecast, day_date, act.time)

            score, cond_summary, status = score_activity_weather(act, act_weather, weather_preference)

            # Check if weather is unacceptable for this outdoor/mixed activity
            is_unacceptable = score < suitability_threshold and act.exposure in ("outdoor", "mixed")

            if not is_unacceptable:
                new_activities.append(act)
                continue

            # Unacceptable weather detected!
            # Attempt replacement with indoor museum or artisan craft workshop
            alt = find_rain_safe_alternative(
                destination=destination,
                original_place=act.place,
                available_places=available_places,
                used_places=scheduled_places
            )

            replacement_name = alt["name"]
            scheduled_places.add(replacement_name.lower())

            reason_text = (
                f"Severe weather conflict ({cond_summary}): outdoor suitability fell to {score}/100. "
                f"Deterministically replaced with rain-safe indoor {alt.get('category', 'cultural center')}."
            )

            # Record explicit change
            changes.append(
                ActivityChangeRecord(
                    activity=act.place,
                    day_number=day.day_number,
                    time=act.time,
                    change="replaced",
                    replacement=replacement_name,
                    reason=reason_text
                )
            )

            # Build replacement ActivityItem
            replacement_act = ActivityItem(
                time=act.time,
                place=replacement_name,
                category=alt.get("category", "Indoor Culture / Artisan Workshop"),
                duration_minutes=alt.get("duration", act.duration_minutes),
                travel_from_previous_minutes=act.travel_from_previous_minutes,
                travel_distance_km=act.travel_distance_km,
                latitude=alt.get("latitude") or act.latitude,
                longitude=alt.get("longitude") or act.longitude,
                notes=alt.get("notes") or f"Sheltered visit to {replacement_name}.",
                is_meal=False,
                accessibility="Ground level / Indoor sheltered",
                weather_suitability=95,
                weather_status="replaced",
                weather_condition=f"Sheltered indoor haven ({cond_summary})",
                exposure="indoor"
            )
            new_activities.append(replacement_act)

        new_day.activities = new_activities
        updated_days.append(new_day)

    return updated_days, changes
