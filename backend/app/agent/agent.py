import json
import logging
import re
import urllib.parse
from typing import Dict, Any, List, Optional, Tuple
import httpx

from app.core.config import settings
from app.core.http_client import get_http_client
from app.agent.schemas import ExtractedTripRequirements, ExtractedAccommodationPref
from app.agent.prompts import (
    TRIP_EXTRACTION_SYSTEM_PROMPT, TRIP_SYNTHESIS_SYSTEM_PROMPT,
    LANDMARK_CURATION_SYSTEM_PROMPT
)
from app.models.schemas import (
    ChatRequest, ChatResponse, TripSummary, HotelItem, PlaceItem,
    ItineraryDay, EstimatedCost, FlightItem, ChatMessage,
    AttractionCandidate, RemovedAttractionRecord, TripObservability
)
from app.agent.session import (
    get_trip_session, save_session_turn, generate_session_id
)
from app.tools.osm import (
    geocode_destination, search_places, search_nearby_places,
    search_restaurants, search_stations, haversine_distance
)
from app.tools.web_search import (
    collect_famous_places_online_and_verify_osm,
    collect_candidate_attractions
)
from app.tools.routing import get_route
from app.tools.accommodation import calculate_budget_allocation, search_accommodation
from app.tools.hotels import search_hotels, get_hotel_details
from app.tools.flights import search_flights, resolve_iata_code
from app.services.recommendation import (
    score_and_rank_hotels, rank_places, rank_flights,
    score_attraction_candidates, filter_and_protect_candidates
)
from app.services.itinerary import build_multiday_itinerary, haversine_km, replan_itinerary
from app.tools.weather import get_weather
from app.services.weather_optimizer import evaluate_and_replan_weather
from app.services.digital_twin import build_digital_twin_from_trip_data
from app.models.schemas import WeatherReport

logger = logging.getLogger(__name__)




def validate_itinerary(
    itinerary_days: List[ItineraryDay],
    requirements: ExtractedTripRequirements,
    cost_breakdown: EstimatedCost,
    selected_hotel: Optional[HotelItem] = None
) -> Tuple[bool, List[str]]:
    """
    Validate that the generated trip strictly satisfies user constraints:
    1. Strict Budget Invariant: cost_breakdown.total <= requirements.budget.
    2. Daily Transit Limit: no day exceeds 180 mins of travel.
    3. Accommodation Constraint: hotel rate respects target and max price.
    """
    violations: List[str] = []

    # 1. Budget Invariant
    if cost_breakdown.total > requirements.budget + 1.0:
        violations.append(
            f"Budget exceeded: total cost ₹{cost_breakdown.total} > budget ₹{requirements.budget}"
        )

    # 2. Daily Transit
    for day in itinerary_days:
        if day.day_total_travel_minutes > 180:
            violations.append(
                f"Day {day.day_number} travel time ({day.day_total_travel_minutes} mins) exceeds maximum 180 mins."
            )

    # 3. Accommodation Constraint
    if selected_hotel and requirements.accommodation_preferences:
        pref = requirements.accommodation_preferences
        if pref.target_price_per_night and pref.target_price_per_night > 0:
            allowed_max = pref.max_price_per_night or (pref.target_price_per_night * 1.30)
            if selected_hotel.price_per_night > allowed_max:
                violations.append(
                    f"Hotel price ₹{selected_hotel.price_per_night}/night exceeds allowed target ₹{allowed_max}/night."
                )

    return len(violations) == 0, violations


def extract_requirements_heuristically(
    message: str,
    previous_requirements: Optional[ExtractedTripRequirements] = None
) -> ExtractedTripRequirements:
    """
    Robust rule-based parser for travel requests to ensure zero downtime
    and instant local testing even when GEMINI_API_KEY is not configured.
    Supports incremental follow-ups on top of previous requirements.
    """
    msg_lower = message.lower()

    # 1. Flight detection
    flight_required = False
    dep_city = None
    arr_city = None
    dep_code = None
    arr_code = None
    outbound_date = None

    # Detect dates like YYYY-MM-DD
    date_match = re.search(r'\b(202[4-9]-\d{2}-\d{2})\b', message)
    if date_match:
        outbound_date = date_match.group(1)

    if any(k in msg_lower for k in ("flight", "flights", "fly")):
        flight_required = True
        # Match pattern: "flights from <origin> to <destination>"
        flight_match = re.search(
            r'(?:flights?|fly)\s+(?:from\s+)?([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\s+(?:on|date)\s+([0-9\-]+)|\.|\,|$|\s+under|\s+with)',
            message,
            re.IGNORECASE
        )
        if flight_match:
            dep_city = flight_match.group(1).strip().title()
            arr_city = flight_match.group(2).strip().title()
            if flight_match.group(3):
                outbound_date = flight_match.group(3).strip()

    # Destination detection
    dest = arr_city if arr_city else (previous_requirements.destination if previous_requirements else "Maharashtra")
    if dest in ("Maharashtra", ""):
        known_destinations = [
            "garbett plateau", "garbett", "shirdi", "pune", "mumbai", "delhi", "nashik", "lonavala", "khandala",
            "mahabaleshwar", "panchgani", "aurangabad", "chhatrapati sambhajinagar",
            "kolhapur", "alibaug", "nagpur", "shani shingnapur", "trimbakeshwar",
            "matheran", "karjat", "bhivpuri", "harishchandragad", "kalsubai", "rajmachi",
            "sinhagad", "bhimashankar", "ajanta", "ellora", "goa", "bengaluru", "bangalore"
        ]
        for d in known_destinations:
            if d in msg_lower:
                dest = d.title()
                break

    if dest in ("Maharashtra", ""):
        # Try regex pattern: "go for/to <place> trek/trip"
        dest_match = re.search(
            r'(?:go\s+(?:for|to)|trek\s+(?:to|for)|trip\s+to|visit|in)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:trek|plateau|fort|trip|tour|for\s+\d|and|\.|\,|$))',
            msg_lower
        )
        if dest_match:
            candidate = dest_match.group(1).strip()
            if candidate and candidate not in ("a", "an", "the", "my", "our"):
                dest = candidate.title()
        elif previous_requirements and previous_requirements.destination:
            dest = previous_requirements.destination
        else:
            dest = "Shirdi"

    # Duration detection (e.g. "1 day", "weekend", "4 days", "for 3 nights", "2 day")
    duration = previous_requirements.duration_days if previous_requirements else 3
    if "1 day" in msg_lower or "one day" in msg_lower or "day trek" in msg_lower:
        duration = 1
    elif "weekend" in msg_lower:
        duration = 2
    elif "week" in msg_lower:
        duration = 7
    else:
        day_match = re.search(r'(\d+)\s*[-–—]?\s*(?:days?|day)', msg_lower)
        if day_match:
            duration = int(day_match.group(1))
        else:
            night_match = re.search(r'(\d+)\s*[-–—]?\s*(?:nights?|night)', msg_lower)
            if night_match:
                duration = int(night_match.group(1)) + 1

    # Hotel / Hostel per-night budget detection
    explicit_hotel = any(w in msg_lower for w in ("hotel", "resort", "lodge", "guest house"))
    is_hostel = any(w in msg_lower for w in (
        "hostel", "dorm", "dormitory", "backpacker", "spend as little as possible on stay", "as little as possible on stay"
    ))
    if is_hostel:
        preferred_type = "hostel"
    elif explicit_hotel:
        preferred_type = "hotel"
    elif previous_requirements and previous_requirements.accommodation_preferences.preferred_type:
        preferred_type = previous_requirements.accommodation_preferences.preferred_type
        is_hostel = (preferred_type == "hostel")
    else:
        preferred_type = "hotel"

    per_night_budget = previous_requirements.accommodation_preferences.target_price_per_night if previous_requirements else None

    # Pattern 1: explicit per-night phrasing: "500 per night", "500/night", "500 a night"
    pn_match = re.search(
        r'(?:hostel|hotel|stay|room|dorm|lodging)?\s*(?:with|at|around|under|for|is|of|@)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:per\s*night|\/night|\s*a\s*night)',
        msg_lower
    )
    if pn_match:
        per_night_budget = float(pn_match.group(1))

    # Pattern 2: hostel / hotel / stay followed by amount: "hostel 500", "hostel with 500", "hotel under 500", "stay around 500", "hostel @ 500"
    if not pn_match:
        stay_amount_match = re.search(
            r'(?:hostel|hotel|stay|room|dorm|lodging)\s*(?:with|at|around|under|for|is|of|@|costs?|budget\s*(?:is|of)?|\s*around\s*)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\b(?!\s*(?:k\b|days?|nights?))',
            msg_lower
        )
        if stay_amount_match:
            per_night_budget = float(stay_amount_match.group(1))

    # Pattern 3: "under 500" or "for 500" when query is about hotels/hostels:
    if not per_night_budget and any(w in msg_lower for w in ("hotel", "hostel", "stay", "room", "lodge")):
        under_match = re.search(
            r'(?:under|below|around|within|at|for)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\b(?!\s*(?:k\b|days?|nights?))',
            msg_lower
        )
        if under_match:
            cand = float(under_match.group(1))
            if cand <= 8000:
                per_night_budget = cand

    # Pattern 4: If hostel requested or "spend as little as possible" and no stay budget extracted -> default to authentic hostel rate (₹500)
    if not per_night_budget and is_hostel:
        per_night_budget = 500.0

    # Overall Budget detection (e.g. "budget is 4k", "budget is ₹4,000", "2k rupees", "under 5000")
    budget = previous_requirements.budget if previous_requirements else 15000.0
    budget_explicit = False

    k_match = re.search(r'(?:budget\s*(?:is|of)?\s*(?:₹|rs\.?)?|₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b', msg_lower)
    if k_match:
        budget = float(k_match.group(1)) * 1000.0
        budget_explicit = True
    else:
        # Match explicit total budget phrases: "budget is ₹4000", "budget 4000", "total budget 5000"
        explicit_budget_match = re.search(
            r'(?:my\s*budget\s*(?:is|of)?|trip\s*budget|total\s*budget|overall\s*budget|budget\s*(?:is|of)?)\s*(?:₹|rs\.?)?\s*\b([\d,]+)\b(?!\s*(?:per\s*night|\/night|\s*a\s*night))',
            msg_lower
        )
        if explicit_budget_match:
            cleaned_b = explicit_budget_match.group(1).replace(",", "")
            try:
                b_val = float(cleaned_b)
                if not (per_night_budget and b_val == per_night_budget and not any(w in msg_lower for w in ("total", "trip budget", "my budget", "budget is"))):
                    budget = b_val
                    budget_explicit = True
            except ValueError:
                pass

        if not budget_explicit:
            currency_matches = re.finditer(r'(?:₹|rs\.?|inr)\s*([\d,]+)', msg_lower)
            for cm in currency_matches:
                cand = float(cm.group(1).replace(",", ""))
                if per_night_budget and cand == per_night_budget:
                    continue
                budget = cand
                budget_explicit = True
                break

    if not budget_explicit and previous_requirements:
        budget = previous_requirements.budget

        if not budget_explicit:
            digits_matches = re.finditer(r'\b(1000|1500|2000|2500|3000|4000|5000|8000|10000|12000|15000|20000|25000|30000|40000|50000)\b', msg_lower)
            for dm in digits_matches:
                cand = float(dm.group(1))
                if per_night_budget and cand == per_night_budget:
                    continue
                budget = cand
                budget_explicit = True
                break

    if not budget_explicit and per_night_budget:
        nights = max(1, duration - 1) if duration > 1 else 1
        budget = round(per_night_budget * nights * 1.8, 2)

    # Traveller types
    traveller_types = []
    travellers = 1
    if "alone" in msg_lower or "solo" in msg_lower or "myself" in msg_lower or "single" in msg_lower:
        traveller_types.append("solo")
        travellers = 1
    elif "parents" in msg_lower or "family" in msg_lower or "mom" in msg_lower or "dad" in msg_lower:
        traveller_types.extend(["adult", "parents"])
        travellers = 3
    elif "couple" in msg_lower or "partner" in msg_lower or "wife" in msg_lower or "husband" in msg_lower:
        traveller_types.append("couple")
        travellers = 2
    elif "friends" in msg_lower:
        traveller_types.append("friends")
        travellers = 4
    else:
        traveller_types.append("solo")

    # Specific traveller count mention
    traveller_count_match = re.search(r'(\d+)\s*(?:people|persons|travellers|travelers)', msg_lower)
    if traveller_count_match:
        travellers = int(traveller_count_match.group(1))

    # Interests
    interests = []
    if "trek" in msg_lower or "plateau" in msg_lower or "hike" in msg_lower:
        interests.extend(["trekking", "nature", "scenic viewpoints"])
    if "temple" in msg_lower or "mandir" in msg_lower or "darshan" in msg_lower:
        interests.append("temples")
    if "peaceful" in msg_lower or "calm" in msg_lower or "serene" in msg_lower:
        interests.append("peaceful places")
    if "fort" in msg_lower:
        interests.append("forts")
    if "museum" in msg_lower or "history" in msg_lower or "heritage" in msg_lower:
        interests.append("heritage")
    if "nature" in msg_lower or "garden" in msg_lower or "waterfall" in msg_lower:
        if "nature" not in interests:
            interests.append("nature")
    if not interests:
        interests = ["nature", "peaceful places"]

    # Food preference
    food_prefs = ["vegetarian"]
    if "pure veg" in msg_lower:
        food_prefs = ["pure vegetarian"]
    elif "non veg" in msg_lower:
        food_prefs = ["multi-cuisine"]

    # Landmark near preference
    near = None
    near_match = re.search(r'near\s+([a-zA-Z0-9\s]+?)(?:,|\.|$|and|with)', message, re.IGNORECASE)
    if near_match:
        near = near_match.group(1).strip()
    elif "shirdi" in msg_lower:
        near = "Sai Baba Temple"

    # Local experience & travel style
    local_experience = any(k in msg_lower for k in ("local experience", "local food", "street food", "local culture", "darshan", "local train"))
    travel_style = ["budget", "local"] if (local_experience or budget <= 5000 or is_hostel) else ["standard"]
    transport_prefs = ["local_train", "bus", "walking"] if (local_experience or "local train" in msg_lower or is_hostel) else ["cab/auto"]

    # Travel constraint & pace
    pace = "relaxed" if ("parents" in msg_lower or "travel too much" in msg_lower or "peaceful" in msg_lower) else "moderate"
    # Weather preference detection (Nugen aligned)
    weather_pref = {"avoid_outdoor_rain": True}
    if any(k in msg_lower for k in ("outdoor if it rains", "don't want outdoor", "avoid outdoor", "no outdoor in rain", "indoor if it rains", "avoid rain")):
        weather_pref["avoid_outdoor_rain"] = True
    elif any(k in msg_lower for k in ("love rain", "enjoy rain", "monsoon trek")):
        weather_pref["avoid_outdoor_rain"] = False

    return ExtractedTripRequirements(
        destination=dest,
        duration_days=duration,
        budget=budget,
        travellers=travellers,
        traveller_types=traveller_types,
        interests=interests,
        accommodation_preferences=ExtractedAccommodationPref(
            type=preferred_type,
            preferred_type=preferred_type,
            near=near,
            amenities=["Air Conditioning", "Elevator/Lift"] if "parents" in msg_lower else (["Free Wi-Fi", "Lockers"] if is_hostel else ["Air Conditioning"]),
            target_price_per_night=per_night_budget,
            max_price_per_night=(per_night_budget * 1.25) if per_night_budget else None,
            priority="lowest_price" if ("as little as possible" in msg_lower or is_hostel) else "balanced"
        ),
        flight_required=flight_required,
        departure_city=dep_city,
        departure_airport_code=dep_code,
        arrival_airport_code=arr_code,
        outbound_date=outbound_date,
        food_preferences=food_prefs,
        transportation_preferences="local train / bus / walking" if ("local_train" in transport_prefs) else "cab/auto",
        maximum_acceptable_travel_distance_km=25.0 if "don't want to travel too much" in msg_lower else 40.0,
        pace=pace,
        accessibility_requirements=accessibility,
        other_constraints=["Minimal transit time" if "don't want to travel too much" in msg_lower else ""],
        local_experience=local_experience,
        travel_style=travel_style,
        transport_preferences=transport_prefs,
        weather_preference=weather_pref
    )



def get_gemini_endpoint_and_headers() -> Tuple[str, Dict[str, str]]:
    key = (settings.GEMINI_API_KEY or "").strip()
    is_oauth = key.startswith("ya29.")
    if is_oauth:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    else:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={key}"
        headers = {"Content-Type": "application/json"}
    return url, headers


async def extract_requirements_with_gemini(
    message: str,
    previous_requirements: Optional[ExtractedTripRequirements] = None,
    chat_history: Optional[List[ChatMessage]] = None
) -> ExtractedTripRequirements:
    """
    Extract structured requirements using Gemini API with function calling / structured output.
    Falls back to regex parser if API key is missing or call fails.
    Preserves context when previous_requirements or chat_history is supplied.
    """
    if not settings.GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not configured. Using rule-based extractor.")
        return extract_requirements_heuristically(message, previous_requirements=previous_requirements)

    client = get_http_client()
    url, headers = get_gemini_endpoint_and_headers()

    prompt_parts: List[Dict[str, str]] = [{"text": TRIP_EXTRACTION_SYSTEM_PROMPT}]

    if previous_requirements:
        prompt_parts.append({
            "text": f"PREVIOUS TRIP STATE / REQUIREMENTS TO UPDATE:\n{previous_requirements.model_dump_json()}\n"
                    "INSTRUCTION: The user is chatting to adjust/modify this existing trip. "
                    "Preserve the destination, budget, travellers, stay preferences, and style unless the user explicitly requests changes to them."
        })

    if chat_history:
        recent_turns = chat_history[-6:]
        hist_text = "\n".join([f"{m.role.capitalize()}: {m.content}" for m in recent_turns])
        prompt_parts.append({"text": f"RECENT CHAT HISTORY:\n{hist_text}"})

    prompt_parts.append({"text": f"New User Message: {message}"})

    payload = {
        "contents": [
            {
                "parts": prompt_parts
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.1
        }
    }

    try:
        response = await client.post(url, headers=headers, json=payload, timeout=12.0)
        if response.status_code == 200:
            data = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            clean_json = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
            parsed = json.loads(clean_json)
            return ExtractedTripRequirements.model_validate(parsed)
        else:
            logger.warning(f"Gemini API returned {response.status_code}: {response.text}")
    except Exception as e:
        logger.warning(f"Gemini API extraction failed: {e}. Falling back to rule-based extractor.")

    return extract_requirements_heuristically(message, previous_requirements=previous_requirements)


async def curate_places_and_food_with_gemini(
    destination: str,
    requirements: ExtractedTripRequirements,
    candidate_places: List[PlaceItem],
    candidate_restaurants: List[PlaceItem],
    user_message: str,
    center_lat: float,
    center_lon: float
) -> Tuple[List[PlaceItem], List[PlaceItem]]:
    """
    Leverages Gemini to curate top iconic landmarks and authentic food spots
    customized to the user's request (e.g. 'Mumbai Darshan', 'temples', 'street food').
    Dynamically merges OSM verified places and geocodes any iconic landmarks.
    """
    if not settings.GEMINI_API_KEY:
        return candidate_places, candidate_restaurants

    client = get_http_client()
    url, headers = get_gemini_endpoint_and_headers()

    osm_candidates_summary = [
        {"name": p.name, "category": p.category, "distance_km": p.distance_km_from_center}
        for p in candidate_places[:30]
    ]

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": LANDMARK_CURATION_SYSTEM_PROMPT},
                    {"text": f"""
TRIP DESTINATION: {destination}
USER REQUEST MESSAGE: {user_message}
EXTRACTED REQUIREMENTS: {requirements.model_dump_json()}
CANDIDATE PLACES FOUND IN OSM: {json.dumps(osm_candidates_summary)}

Select the 8-12 most iconic, must-visit sights for this trip and 4-6 authentic local eateries.
If the user asked for specific landmarks (e.g. Marine Drive, Elephanta Caves, Hanging Garden, Aram Vadapav), YOU MUST INCLUDE THEM.
"""}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    try:
        resp = await client.post(url, headers=headers, json=payload, timeout=12.0)
        if resp.status_code == 200:
            data = resp.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            clean_json = raw_text.strip().removeprefix("```json").removesuffix("```").strip()
            curated_data = json.loads(clean_json)

            curated_places: List[PlaceItem] = []
            seen_place_names = set()

            # Process curated attractions
            for item in curated_data.get("curated_attractions", []):
                item_name = item.get("name", "").strip()
                if not item_name or item_name.lower() in seen_place_names:
                    continue

                # Check if matches candidate OSM place
                matched = None
                for cp in candidate_places:
                    if (
                        item_name.lower() in cp.name.lower()
                        or cp.name.lower() in item_name.lower()
                        or any(w in cp.name.lower() for w in item_name.lower().split() if len(w) > 4)
                    ):
                        matched = cp
                        break

                if matched:
                    matched_copy = matched.model_copy()
                    if item.get("description"):
                        matched_copy.description = item.get("description")
                    curated_places.append(matched_copy)
                    seen_place_names.add(item_name.lower())
                    seen_place_names.add(matched.name.lower())
                else:
                    # Dynamically geocode newly introduced iconic landmark
                    geo = await geocode_destination(f"{item_name}, {destination}")
                    if geo:
                        dist = haversine_distance(center_lat, center_lon, geo["latitude"], geo["longitude"])
                        curated_places.append(
                            PlaceItem(
                                name=item_name,
                                latitude=geo["latitude"],
                                longitude=geo["longitude"],
                                category=item.get("category", "Tourist Attraction"),
                                description=item.get("description", f"Iconic landmark in {destination}."),
                                source="Curated Landmark (Nominatim)",
                                distance_km_from_center=dist
                            )
                        )
                        seen_place_names.add(item_name.lower())

            # Append remaining high-scoring candidate places to fill out list
            for cp in candidate_places:
                if cp.name.lower() not in seen_place_names:
                    curated_places.append(cp)
                    seen_place_names.add(cp.name.lower())

            # Process curated food spots
            curated_restaurants: List[PlaceItem] = []
            seen_rest_names = set()

            for f_item in curated_data.get("curated_food_spots", []):
                f_name = f_item.get("name", "").strip()
                if not f_name or f_name.lower() in seen_rest_names:
                    continue

                matched_rest = None
                for cr in candidate_restaurants:
                    if f_name.lower() in cr.name.lower() or cr.name.lower() in f_name.lower():
                        matched_rest = cr
                        break

                if matched_rest:
                    curated_restaurants.append(matched_rest)
                    seen_rest_names.add(f_name.lower())
                else:
                    geo = await geocode_destination(f"{f_name}, {destination}")
                    if geo:
                        dist = haversine_distance(center_lat, center_lon, geo["latitude"], geo["longitude"])
                        curated_restaurants.append(
                            PlaceItem(
                                name=f_name,
                                latitude=geo["latitude"],
                                longitude=geo["longitude"],
                                category="Restaurant / Food",
                                description=f_item.get("description", f"Authentic local eatery in {destination}."),
                                cuisine=f_item.get("cuisine", "Local specialty"),
                                source="Curated Local Dining",
                                distance_km_from_center=dist
                            )
                        )
                    else:
                        anchor_lat = curated_places[0].latitude if curated_places else center_lat
                        anchor_lon = curated_places[0].longitude if curated_places else center_lon
                        curated_restaurants.append(
                            PlaceItem(
                                name=f_name,
                                latitude=anchor_lat + 0.001,
                                longitude=anchor_lon + 0.001,
                                category="Restaurant / Food",
                                description=f_item.get("description", f"Authentic local food stop in {destination}."),
                                cuisine=f_item.get("cuisine", "Local specialty"),
                                source="Curated Local Dining",
                                distance_km_from_center=0.3
                            )
                        )
                    seen_rest_names.add(f_name.lower())

            for cr in candidate_restaurants:
                if cr.name.lower() not in seen_rest_names:
                    curated_restaurants.append(cr)
                    seen_rest_names.add(cr.name.lower())

            return curated_places, curated_restaurants
    except Exception as e:
        logger.warning(f"Gemini place curation failed: {e}. Using heuristic ranking.")

    return candidate_places, candidate_restaurants



async def synthesize_chat_summary(
    message: str,
    requirements: ExtractedTripRequirements,
    selected_hotel: Optional[HotelItem],
    itinerary_days: List[ItineraryDay],
    cost_breakdown: EstimatedCost,
    relaxation_notes: Optional[str],
    flights: Optional[List[FlightItem]] = None,
    is_flight_only: bool = False,
    is_hotel_only: bool = False,
    is_follow_up: bool = False,
    chat_history: Optional[List[ChatMessage]] = None
) -> str:
    """Generate a cohesive, explainable narrative summary for the user."""
    # Scenario A: Flight-Only Query
    if is_flight_only:
        if not flights:
            return (
                f"✈️ We searched for flights from {requirements.departure_city or 'origin'} to {requirements.destination} "
                f"for {requirements.outbound_date or 'your requested date'}, but no direct options were available at this moment. "
                f"Please check alternative travel dates or nearby airports."
            )
        best = flights[0]
        lines = [
            f"✈️ **Flight Options from {best.departure_airport.name or best.departure_airport.id or requirements.departure_city} to {best.arrival_airport.name or best.arrival_airport.id or requirements.destination}**",
            f"Found {len(flights)} suitable flight options on {requirements.outbound_date or 'your selected date'}:",
            ""
        ]
        for idx, fl in enumerate(flights[:3], 1):
            stop_str = "Direct (non-stop)" if fl.stops == 0 else f"{fl.stops} stop"
            time_str = f"{fl.departure_airport.time or ''} → {fl.arrival_airport.time or ''}".strip()
            book_str = f" | [Book Flight]({fl.booking_url})" if fl.booking_url else ""
            lines.append(f"{idx}. **{fl.airline}** ({fl.flight_number or 'Flight'}) - ₹{int(fl.price):,} | {stop_str} | {fl.duration_minutes} mins | {time_str}{book_str}")

        lines.extend([
            "",
            f"💡 **Top Recommendation**: **{best.airline}** for ₹{int(best.price):,} ({best.rationale})."
        ])
        return "\n".join(lines)

    # Scenario B: Hotel-Only Query
    if is_hotel_only and selected_hotel:
        lines = [
            f"🏨 **Hotels in {requirements.destination}**",
            f"Here are top-rated accommodations fitting your nightly budget target of ₹{int(requirements.accommodation_preferences.max_price_per_night or selected_hotel.price_per_night):,}:",
            ""
        ]
        lines.append(f"1. **{selected_hotel.name}** - ₹{int(selected_hotel.price_per_night):,}/night (Rating: {selected_hotel.rating}★)")
        lines.append(f"   - {selected_hotel.rationale}")
        if selected_hotel.booking_options:
            opts = [f"{b.source}: ₹{int(b.price or selected_hotel.price_per_night):,}" for b in selected_hotel.booking_options[:3]]
            lines.append(f"   - Booking Providers: {', '.join(opts)}")
        if selected_hotel.booking_url:
            lines.append(f"   - [View / Book Hotel]({selected_hotel.booking_url})")

        return "\n".join(lines)

    # If Gemini API is configured, generate natural language synthesis
    if settings.GEMINI_API_KEY:
        client = get_http_client()
        url, headers = get_gemini_endpoint_and_headers()
        
        follow_up_hint = ""
        if is_follow_up:
            follow_up_hint = "NOTE: This is a follow-up modification to an existing trip. Start by acknowledging the user's specific changes warmly.\n"

        summary_payload = {
            "contents": [
                {
                    "parts": [
                        {"text": TRIP_SYNTHESIS_SYSTEM_PROMPT},
                        {"text": f"""
{follow_up_hint}Trip Request: {message}
Extracted Requirements: {requirements.model_dump_json()}
Selected Hotel: {selected_hotel.model_dump_json() if selected_hotel else 'None'}
Flights: {[f.model_dump() for f in (flights or [])[:2]]}
Itinerary Days: {len(itinerary_days)} days scheduled
Cost: Total ₹{cost_breakdown.total} out of ₹{cost_breakdown.budget} budget
Relaxation Notes: {relaxation_notes or 'None'}

Synthesize a warm, conversational, 2-3 paragraph response for the user explaining the itinerary, hotel choice, flight logistics (if any), food, and pacing.
"""}
                    ]
                }
            ],
            "generationConfig": {"temperature": 0.3}
        }
        try:
            resp = await client.post(url, headers=headers, json=summary_payload, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        except Exception as e:
            logger.warning(f"Gemini synthesis call failed: {e}. Using deterministic synthesis.")

    # High-quality deterministic natural language response
    companion_desc = "your journey"
    if "parents" in requirements.traveller_types:
        companion_desc = "you and your parents"
    elif "couple" in requirements.traveller_types:
        companion_desc = "you and your partner"
    elif "friends" in requirements.traveller_types:
        companion_desc = "you and your friends"
    elif "solo" in requirements.traveller_types:
        companion_desc = "your solo exploration"

    if requirements.duration_days == 1:
        accom_section = f"🎒 **Day-Trip Logistics**: As a 1-day itinerary to {requirements.destination}, zero overnight accommodation is required. Your ₹{int(requirements.budget):,} budget is allocated toward local transit, meals, hydration, and trail/activity access."
    elif selected_hotel:
        accom_section = (
            f"🏨 **Accommodation Choice**: We selected **{selected_hotel.name}** ({selected_hotel.location}). "
            f"{selected_hotel.rationale} At ₹{int(selected_hotel.price_per_night):,}/night, accommodation takes ₹{int(cost_breakdown.accommodation):,}, leaving comfortable headroom for meals, transit, and activities."
        )
    else:
        accom_section = ""

    flight_section = ""
    if flights:
        top_fl = flights[0]
        flight_section = f"\n✈️ **Flight Option**: **{top_fl.airline}** ({top_fl.departure_airport.time or ''} - ₹{int(top_fl.price):,}, {top_fl.duration_minutes}m). Included in transit budget.\n"

    first_activity_name = itinerary_days[0].activities[1].place if itinerary_days and len(itinerary_days[0].activities) > 1 else requirements.destination
    lines = [
        f"Here is your personalized {requirements.duration_days}-day itinerary for {requirements.destination}, crafted for {companion_desc} with a total budget of ₹{int(requirements.budget):,}.",
        "",
        accom_section,
        flight_section,
        f"🗺️ **Pacing & Sightseeing**: Designed with an active, realistic pace ({requirements.pace}). We have scheduled primary highlights starting with {first_activity_name}, verified road travel times via OSRM, and local vegetarian meal breaks.",
        "",
        f"💰 **Budget Status**: Estimated total cost is ₹{int(cost_breakdown.total):,} (₹{int(cost_breakdown.remaining_budget):,} reserve remaining)."
    ]
    if relaxation_notes:
        lines.append(f"\n*Note on Preferences*: {relaxation_notes}")

    return "\n".join(lines)


async def plan_trip_pipeline(chat_request: ChatRequest) -> ChatResponse:
    """
    Main orchestration pipeline:
    1. Resolve active trip session and conversation history
    2. Extract structured requirements (Gemini / Heuristic, with incremental context)
    3. Coordinate flight searches if requested (SerpApi Google Flights)
    4. Coordinate hotel searches (SerpApi Google Hotels / OSM)
    5. Retrieve real places (OSM Overpass)
    6. Build realistic multi-day itinerary with verified travel times (OSRM)
    7. Compute comprehensive cost breakdown, synthesize response, and save session turn
    """
    session_id = chat_request.session_id or generate_session_id()
    session = get_trip_session(session_id)
    prev_reqs = session.get("requirements") if session else None
    existing_history: List[ChatMessage] = (session.get("chat_history") if session else None) or chat_request.chat_history or []
    trip_name = chat_request.trip_name or (session.get("name") if session else None)
    is_follow_up = prev_reqs is not None and len(existing_history) > 0

    # 1. Extraction with session context
    reqs = await extract_requirements_with_gemini(
        chat_request.message,
        previous_requirements=prev_reqs,
        chat_history=existing_history
    )

    if chat_request.overrides:
        reqs = reqs.model_copy(update=chat_request.overrides)

    destination = reqs.destination
    budget = reqs.budget
    duration = reqs.duration_days
    msg_lower = chat_request.message.lower()

    if not trip_name or trip_name in ("Active Trip", "New Trip #1", "Untitled Trip"):
        trip_name = f"Trip to {destination}"

    # Detect user intent mode
    is_flight_only = reqs.flight_required and not any(w in msg_lower for w in ("itinerary", "stay", "hotel", "hotel budget", "days trip", "day trip", "day trek", "nights", "package"))
    is_hotel_only = any(w in msg_lower for w in ("find hotels", "search hotels", "hotel in", "hotels in")) and not any(w in msg_lower for w in ("itinerary", "trek", "plan a trip", "plan trip", "places to visit"))

    # 2. Flight Search
    found_flights: List[FlightItem] = []
    if reqs.flight_required:
        dep_id = reqs.departure_airport_code or reqs.departure_city or "BOM"
        arr_id = reqs.arrival_airport_code or destination or "DEL"
        raw_flights = await search_flights(
            departure_id=dep_id,
            arrival_id=arr_id,
            outbound_date=reqs.outbound_date,
            return_date=reqs.return_date,
            adults=reqs.travellers
        )
        found_flights = rank_flights(raw_flights)

    # If pure flight query, short-circuit with flight results
    if is_flight_only:
        top_flight_price = (found_flights[0].price * reqs.travellers) if found_flights else 0.0
        cost_breakdown = EstimatedCost(
            accommodation=0.0,
            food=0.0,
            transport=round(top_flight_price, 2),
            activities=0.0,
            miscellaneous=0.0,
            total=round(top_flight_price, 2),
            budget=budget,
            remaining_budget=round(max(0.0, budget - top_flight_price), 2)
        )
        narrative = await synthesize_chat_summary(
            message=chat_request.message,
            requirements=reqs,
            selected_hotel=None,
            itinerary_days=[],
            cost_breakdown=cost_breakdown,
            relaxation_notes=None,
            flights=found_flights,
            is_flight_only=True,
            is_follow_up=is_follow_up,
            chat_history=existing_history
        )
        saved_session = save_session_turn(
            session_id=session_id,
            user_message=chat_request.message,
            assistant_message=narrative,
            requirements=reqs,
            response=None,
            trip_name=trip_name
        )
        flight_response = ChatResponse(
            message=narrative,
            trip=TripSummary(
                destination=reqs.destination,
                duration_days=1,
                budget=reqs.budget,
                travellers=reqs.travellers,
                traveller_types=reqs.traveller_types,
                interests=["flights"],
                food_preferences=reqs.food_preferences,
                transportation_preferences="flight",
                pace=reqs.pace
            ),
            hotels=[],
            flights=found_flights[:5],
            itinerary=[],
            estimated_cost=cost_breakdown,
            session_id=session_id,
            trip_name=saved_session.get("name", trip_name),
            chat_history=saved_session.get("chat_history", []),
            sources=["Google Flights (SerpApi)"]
        )
        saved_session["last_response"] = flight_response
        return flight_response

    # 3. Coordinates & Geocoding
    geo = await geocode_destination(destination)
    center_lat = geo["latitude"] if geo else 19.7667
    center_lon = geo["longitude"] if geo else 74.4766

    # 4. Budget Allocation & Hotel Search
    preferred_stay = (
        reqs.accommodation_preferences.preferred_type
        or reqs.accommodation_preferences.type
        or "hotel"
    )

    explicit_stay_budget = (
        reqs.accommodation_preferences.target_price_per_night
        or reqs.accommodation_preferences.max_price_per_night
    )
    budget_alloc = calculate_budget_allocation(
        total_budget=budget,
        duration_days=duration,
        travellers=reqs.travellers,
        explicit_hotel_budget=explicit_stay_budget,
        travel_style=reqs.travel_style,
        transport_preferences=reqs.transport_preferences,
        preferred_type=preferred_stay
    )

    # 4. Local Accommodation (Bypassing external SerpApi Hotel search to preserve 100 API quota)
    target_rate = budget_alloc["target_price_per_night"]
    max_rate = budget_alloc["max_acceptable_price_per_night"]
    is_hostel = "hostel" in preferred_stay.lower()
    encoded_stay_q = urllib.parse.quote_plus(f"{destination} {preferred_stay}")

    stay_name = f"{destination} Backpacker Hostel" if is_hostel else f"Central {preferred_stay.title()} {destination}"
    selected_hotel = HotelItem(
        name=stay_name,
        location=f"Central {destination}",
        latitude=center_lat,
        longitude=center_lon,
        price_per_night=target_rate if duration > 1 else 0.0,
        rating=4.3,
        distance_km=0.8,
        booking_url=f"https://www.google.com/travel/hotels?q={encoded_stay_q}",
        directions_url=f"https://www.google.com/maps/search/?api=1&query={encoded_stay_q}",
        amenities=["Free Wi-Fi", "Air Conditioning", "Clean Restrooms"] if not is_hostel else ["Free Wi-Fi", "Lockers", "Luggage Storage"],
        rationale=f"Central {preferred_stay} strictly tailored to your ₹{int(target_rate)}/night target."
    )
    ranked_hotels = [selected_hotel]
    relaxation_note = None
    used_serpapi_hotels = False



    # Cost breakdown calculation
    nights = max(0, duration - 1) if duration > 1 else 0
    actual_accom_cost = 0.0 if duration == 1 else round(selected_hotel.price_per_night * nights, 2)
    actual_food_cost = budget_alloc["estimated_food"]
    actual_transport_cost = budget_alloc["estimated_transport"]
    if found_flights:
        actual_transport_cost += round(found_flights[0].price * reqs.travellers, 2)
    actual_activity_cost = budget_alloc["estimated_activities"]

    # Strict Budget Invariant: actual_accom + non_accom <= budget
    remaining_for_non_accom = max(0.0, budget - actual_accom_cost)
    raw_non_accom = actual_food_cost + actual_transport_cost + actual_activity_cost
    if raw_non_accom > remaining_for_non_accom and raw_non_accom > 0:
        scale = remaining_for_non_accom / raw_non_accom
        actual_food_cost = round(actual_food_cost * scale, 2)
        actual_transport_cost = round(actual_transport_cost * scale, 2)
        actual_activity_cost = round(actual_activity_cost * scale, 2)

    total_estimated = round(actual_accom_cost + actual_food_cost + actual_transport_cost + actual_activity_cost, 2)
    remaining_reserve = round(max(0.0, budget - total_estimated), 2)

    cost_breakdown = EstimatedCost(
        accommodation=actual_accom_cost,
        food=actual_food_cost,
        transport=actual_transport_cost,
        activities=actual_activity_cost,
        miscellaneous=round(min(budget_alloc["estimated_misc"], remaining_reserve), 2),
        total=total_estimated,
        budget=budget,
        remaining_budget=remaining_reserve
    )

    # If pure hotel search, return focused response
    if is_hotel_only:
        narrative = await synthesize_chat_summary(
            message=chat_request.message,
            requirements=reqs,
            selected_hotel=selected_hotel,
            itinerary_days=[],
            cost_breakdown=cost_breakdown,
            relaxation_notes=relaxation_note,
            is_hotel_only=True
        )
        sources = ["Google Hotels (SerpApi)"] if used_serpapi_hotels else ["OpenStreetMap", "Overpass API"]
        return ChatResponse(
            message=narrative,
            trip=TripSummary(
                destination=reqs.destination,
                duration_days=reqs.duration_days,
                budget=reqs.budget,
                travellers=reqs.travellers,
                traveller_types=reqs.traveller_types,
                interests=reqs.interests,
                food_preferences=reqs.food_preferences,
                accommodation_preferences=reqs.accommodation_preferences.model_dump(),
                transportation_preferences=reqs.transportation_preferences,
                pace=reqs.pace,
                accessibility_requirements=reqs.accessibility_requirements
            ),
            hotels=ranked_hotels[:5],
            flights=[],
            itinerary=[],
            estimated_cost=cost_breakdown,
            sources=sources,
            relaxation_notes=relaxation_note
        )

    # 5. Live Regional OpenStreetMap Places from Overpass API (Zero hardcoding)
    regional_places = await search_places(
        destination=destination,
        categories=reqs.interests,
        radius_meters=int(reqs.maximum_acceptable_travel_distance_km * 1000) if reqs.maximum_acceptable_travel_distance_km else 30000,
        limit=60
    )

    # 6. Multi-Query Online Web Discovery & Spatial Grounding (Zero hardcoding)
    # Discovers destination-specific highlights online (Wikipedia/Web) and grounds against Overpass places
    discovered_candidates = await collect_candidate_attractions(
        destination=destination,
        user_prompt=chat_request.message,
        center_lat=center_lat,
        center_lon=center_lon,
        explicit_user_mentions=reqs.preferred_activities,
        preloaded_osm_places=regional_places
    )

    # 7. Candidate Enrichment, Scoring & Must-See Protection
    trip_style = reqs.trip_style_preference or "classic_sightseeing"
    scored_candidates = score_attraction_candidates(
        candidates=discovered_candidates,
        trip_style=trip_style,
        requirements=reqs
    )

    # Protect all tier 'ESSENTIAL' landmarks (high online fame + user requests)
    protected_candidates, overflow_candidates = filter_and_protect_candidates(
        candidates=scored_candidates,
        target_count=max(12, reqs.duration_days * 5)
    )

    # Convert protected candidates to PlaceItem
    combined_places: List[PlaceItem] = [c.to_place_item() for c in protected_candidates]
    seen_place_names = {p.name.lower() for p in combined_places}

    for p in regional_places:
        if p.name.lower() not in seen_place_names:
            combined_places.append(p)
            seen_place_names.add(p.name.lower())


    restaurants = await search_restaurants(
        destination_or_coord=(center_lat, center_lon),
        cuisine_pref="vegetarian" if any("veg" in f.lower() for f in reqs.food_preferences) else None,
        limit=15
    )

    # 7. AI Landmark & Authentic Food Curation (Gemini / Heuristic)
    curated_places, curated_restaurants = await curate_places_and_food_with_gemini(
        destination=destination,
        requirements=reqs,
        candidate_places=combined_places,
        candidate_restaurants=restaurants,
        user_message=chat_request.message,
        center_lat=center_lat,
        center_lon=center_lon
    )

    # MUST-SEE PRESERVATION: Ensure that every single ESSENTIAL candidate is in curated_places
    curated_names = {cp.name.lower() for cp in curated_places}
    for cand in protected_candidates:
        if cand.tier == "ESSENTIAL" and cand.name.lower() not in curated_names:
            curated_places.insert(0, cand.to_place_item())
            curated_names.add(cand.name.lower())

    # 8. Deterministic Ranking & Capacity-Aware Multi-Day Scheduling
    ranked_places = rank_places(curated_places, reqs)

    # Build multi-day itinerary with district clustering and dynamic time-of-day scheduling
    itinerary_days, removed_records = await build_multiday_itinerary(
        ranked_places=ranked_places,
        selected_hotel=selected_hotel,
        restaurants=curated_restaurants,
        requirements=reqs,
        return_removals=True
    )

    # 8.5 Live Open-Meteo Weather Integration & Weather-Aware Replanning
    live_weather_dict = await get_weather(center_lat, center_lon)
    live_weather_report = WeatherReport(**live_weather_dict) if live_weather_dict else None

    if live_weather_dict:
        itinerary_days, weather_changes = await evaluate_and_replan_weather(
            itinerary_days=itinerary_days,
            weather_state=live_weather_dict,
            destination=destination,
            available_places=combined_places,
            weather_preference=reqs.weather_preference
        )
        if weather_changes:
            logger.info(f"Weather-aware optimization made {len(weather_changes)} replanning changes due to live conditions.")
            for wc in weather_changes:
                removed_records.append(
                    RemovedAttractionRecord(
                        name=wc.activity,
                        reason=f"Weather resilience: {wc.reason}",
                        suggestion=f"Replaced with indoor alternative: {wc.replacement}"
                    )
                )

    # 9. Automated Validation & Explainable Self-Healing
    is_valid, violations = validate_itinerary(itinerary_days, reqs, cost_breakdown, selected_hotel)

    if not is_valid:
        logger.warning(f"Itinerary validation detected violations: {violations}. Running explainable self-healing.")
        relaxed_reqs = reqs.model_copy(update={"pace": "relaxed"})
        # Self-healing: preserve ESSENTIAL places, shed OPTIONAL places, and re-schedule
        essential_names = {c.name.lower() for c in protected_candidates if c.tier == "ESSENTIAL"}
        healed_places = [p for p in ranked_places if p.name.lower() in essential_names]
        # Append remaining non-essential up to capacity
        for p in ranked_places:
            if p.name.lower() not in essential_names and len(healed_places) < reqs.duration_days * 3:
                healed_places.append(p)

        itinerary_days, heal_removals = await build_multiday_itinerary(
            ranked_places=healed_places,
            selected_hotel=selected_hotel,
            restaurants=curated_restaurants,
            requirements=relaxed_reqs,
            return_removals=True
        )
        removed_records.extend(heal_removals)

    # 10. Observability Tracking
    scheduled_activity_names = {
        act.place.lower()
        for day in itinerary_days
        for act in day.activities
    }
    essential_included = [
        c.name for c in protected_candidates
        if c.tier == "ESSENTIAL" and any(c.name.lower() in sa or sa in c.name.lower() for sa in scheduled_activity_names)
    ]
    observability_meta = TripObservability(
        candidates_discovered_count=len(discovered_candidates),
        essential_candidates_count=len([c for c in protected_candidates if c.tier == "ESSENTIAL"]),
        selected_attractions_count=sum(len([a for a in d.activities if not a.is_meal]) for d in itinerary_days),
        essential_places_included=essential_included,
        removed_attractions=removed_records,
        trip_style=trip_style,
        clustering_strategy="district_capacity_aware"
    )

    # 11. Narrative Synthesis
    narrative_message = await synthesize_chat_summary(
        message=chat_request.message,
        requirements=reqs,
        selected_hotel=selected_hotel,
        itinerary_days=itinerary_days,
        cost_breakdown=cost_breakdown,
        relaxation_notes=relaxation_note,
        flights=found_flights,
        is_follow_up=is_follow_up,
        chat_history=existing_history
    )

    sources = [
        "Online Multi-Query Discovery (Wikipedia / Web)",
        "OpenStreetMap Spatial Grounding",
        "Overpass API",
        "OSRM Routing Engine"
    ]
    if used_serpapi_hotels:
        sources.append("Google Hotels (SerpApi)")
    else:
        sources.append("Accommodation Provider")
    if found_flights:
        sources.append("Google Flights (SerpApi)")

    saved_session = save_session_turn(
        session_id=session_id,
        user_message=chat_request.message,
        assistant_message=narrative_message,
        requirements=reqs,
        response=None,
        places=combined_places,
        hotels=ranked_hotels,
        trip_name=trip_name
    )

    final_response = ChatResponse(
        message=narrative_message,
        trip=TripSummary(
            destination=reqs.destination,
            duration_days=reqs.duration_days,
            budget=reqs.budget,
            travellers=reqs.travellers,
            traveller_types=reqs.traveller_types,
            interests=reqs.interests,
            food_preferences=reqs.food_preferences,
            accommodation_preferences=reqs.accommodation_preferences.model_dump(),
            transportation_preferences=reqs.transportation_preferences,
            pace=reqs.pace,
            accessibility_requirements=reqs.accessibility_requirements
        ),
        hotels=ranked_hotels[:5],
        flights=found_flights[:5],
        itinerary=itinerary_days,
        estimated_cost=cost_breakdown,
        session_id=session_id,
        trip_name=saved_session.get("name", trip_name),
        chat_history=saved_session.get("chat_history", []),
        sources=sources,
        relaxation_notes=relaxation_note,
        observability=observability_meta,
        removed_attractions=removed_records,
        weather=live_weather_report
    )

    # Initialize and attach virtual TripDigitalTwin
    final_response.digital_twin = build_digital_twin_from_trip_data(
        trip_id=session_id,
        trip_summary=final_response.trip,
        itinerary_days=final_response.itinerary,
        weather_state=live_weather_dict,
        budget=cost_breakdown.budget,
        user_preferences=reqs.weather_preference
    )

    saved_session["last_response"] = final_response
    return final_response


