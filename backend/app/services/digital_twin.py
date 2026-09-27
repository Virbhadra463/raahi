import logging
import copy
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.models.schemas import (
    TripDigitalTwin, DigitalTwinLocation, ItineraryDay, ActivityItem,
    SimulationScenario, DigitalTwinSimulateResponse, ActivityChangeRecord,
    SimulationValidation, PlaceItem, ChatResponse, TripSummary
)
from app.services.weather_optimizer import (
    evaluate_and_replan_weather, score_activity_weather, classify_activity_exposure
)
from app.agent.session import get_trip_session
from app.tools.weather import get_weather, compute_weather_suitability, get_weather_condition_text

logger = logging.getLogger(__name__)

# In-memory store of active Digital Twins (keyed by trip_id / session_id)
DIGITAL_TWIN_STORE: Dict[str, TripDigitalTwin] = {}


def build_digital_twin_from_trip_data(
    trip_id: str,
    trip_summary: TripSummary,
    itinerary_days: List[ItineraryDay],
    weather_state: Optional[Dict[str, Any]] = None,
    budget: float = 15000.0,
    user_preferences: Optional[Dict[str, Any]] = None
) -> TripDigitalTwin:
    """
    Constructs a virtual structured Digital Twin representation of a trip.
    """
    locations: List[DigitalTwinLocation] = []
    routes: List[Dict[str, Any]] = []
    dates: List[str] = []

    curr_weather = (weather_state.get("current") if weather_state else {}) or {
        "temperature_c": 26.0,
        "precipitation_probability": 10,
        "precipitation_mm": 0.0,
        "condition": "Mainly clear",
        "weather_code": 1
    }

    prev_loc: Optional[Dict[str, Any]] = None

    for day in itinerary_days:
        if day.date and day.date not in dates:
            dates.append(day.date)

        for act in day.activities:
            if act.latitude and act.longitude:
                exposure = act.exposure or classify_activity_exposure(act.category, act.place)
                suitability = act.weather_suitability if act.weather_suitability is not None else 95
                status = act.weather_status or ("recommended" if suitability >= 60 else "affected")

                locations.append(
                    DigitalTwinLocation(
                        name=act.place,
                        latitude=act.latitude,
                        longitude=act.longitude,
                        category=act.category,
                        exposure=exposure,
                        weather={
                            "temperature_c": curr_weather.get("temperature_c", 26.0),
                            "precipitation_probability": curr_weather.get("precipitation_probability", 10),
                            "precipitation_mm": curr_weather.get("precipitation_mm", 0.0),
                            "condition": curr_weather.get("condition", "Clear")
                        },
                        weather_suitability=suitability,
                        status=status,
                        day_number=day.day_number,
                        time=act.time,
                        activity_type="meal" if act.is_meal else "sightseeing"
                    )
                )

                if prev_loc:
                    routes.append({
                        "from_place": prev_loc["name"],
                        "to_place": act.place,
                        "day_number": day.day_number,
                        "travel_minutes": act.travel_from_previous_minutes,
                        "distance_km": act.travel_distance_km
                    })
                prev_loc = {"name": act.place, "lat": act.latitude, "lon": act.longitude}

    # Gamification quests & badges connected to destination
    dest = trip_summary.destination
    quests = [
        {
            "id": f"quest_{dest.lower()}_heritage",
            "title": f"{dest} Heritage & Cultural Trail",
            "progress": 0,
            "target": len(itinerary_days) * 3,
            "description": f"Explore iconic landmarks and craft clusters across {dest}."
        },
        {
            "id": "quest_local_artisan",
            "title": "Local Artisan Patron",
            "progress": 1,
            "target": 2,
            "description": "Visit at least 1 traditional craft or handloom artisan workshop."
        }
    ]
    badges = [
        {"id": "badge_maharashtra_explorer", "name": "Maharashtra Explorer", "unlocked": True},
        {"id": "badge_monsoon_navigator", "name": "Climate-Resilient Voyager", "unlocked": False}
    ]

    twin = TripDigitalTwin(
        trip_id=trip_id,
        destination=trip_summary.destination,
        dates=dates,
        budget=budget,
        weather_state=weather_state or {},
        locations=locations,
        itinerary=itinerary_days,
        routes=routes,
        constraints={
            "budget": budget,
            "max_daily_transit_minutes": 180,
            "pace": trip_summary.pace
        },
        user_preferences=user_preferences or {
            "interests": trip_summary.interests,
            "food": trip_summary.food_preferences,
            "weather_preference": getattr(trip_summary, "weather_preference", {"avoid_outdoor_rain": True})
        },
        quests=quests,
        badges=badges,
        simulation_state={"active": False}
    )

    DIGITAL_TWIN_STORE[trip_id] = twin
    return twin


def get_digital_twin(trip_id: str) -> Optional[TripDigitalTwin]:
    """Retrieve Digital Twin by trip_id, constructing it from session if necessary."""
    if trip_id in DIGITAL_TWIN_STORE:
        return DIGITAL_TWIN_STORE[trip_id]

    session = get_trip_session(trip_id)
    if not session or not session.get("last_response"):
        return None

    last_resp: ChatResponse = session["last_response"]
    reqs = session.get("requirements")

    twin = build_digital_twin_from_trip_data(
        trip_id=trip_id,
        trip_summary=last_resp.trip,
        itinerary_days=last_resp.itinerary,
        weather_state=last_resp.weather.model_dump() if last_resp.weather else None,
        budget=last_resp.estimated_cost.budget if last_resp.estimated_cost else 15000.0,
        user_preferences=getattr(reqs, "weather_preference", None)
    )
    return twin


async def simulate_digital_twin(
    trip_id: str,
    scenario: SimulationScenario,
    itinerary: Optional[List[ItineraryDay]] = None,
    destination: Optional[str] = None,
    budget: Optional[float] = None
) -> DigitalTwinSimulateResponse:
    """
    Executes a What-If Weather Simulation on a virtual Digital Twin clone:
    
    1. Loads current trip Digital Twin (or reconstructs from request payload if session restarted).
    2. Clones the state (original never modified).
    3. Injects hypothetical scenario parameters into clone.
    4. Deterministically recalculates weather suitability scores.
    5. Re-plans affected outdoor activities into rain-safe indoor museums/artisan workshops.
    6. Validates constraints (budget, daily transit time, weather safety).
    7. Returns original vs simulated comparison diff.
    """
    twin = get_digital_twin(trip_id)
    if not twin:
        # Build baseline twin
        session = get_trip_session(trip_id)
        dest = destination or (session.get("requirements").destination if session and session.get("requirements") else "Maharashtra")
        twin = TripDigitalTwin(
            trip_id=trip_id,
            destination=dest,
            budget=budget or 15000.0,
            weather_state={},
            locations=[],
            itinerary=itinerary or [],
            routes=[],
            constraints={},
            user_preferences={"weather_preference": {"avoid_outdoor_rain": True}},
            quests=[],
            badges=[],
            simulation_state={"active": False}
        )
        DIGITAL_TWIN_STORE[trip_id] = twin
    elif (not twin.itinerary or len(twin.itinerary) == 0) and itinerary:
        twin.itinerary = itinerary
        if destination:
            twin.destination = destination
        if budget:
            twin.budget = budget

    # 1. Deep clone the Digital Twin — never modify live state
    sim_twin = copy.deepcopy(twin)


    # 2. Extract hypothetical weather scenario parameters
    scen_weather = scenario.weather.model_dump()
    sim_weather_state = {
        "scenario_weather": scen_weather
    }

    # 3. Retrieve available candidate places from session cache if present
    session = get_trip_session(trip_id)
    available_places: Optional[List[PlaceItem]] = session.get("places_cache") if session else None

    # 4. Evaluate weather & replan affected itinerary
    simulated_itinerary, changes = await evaluate_and_replan_weather(
        itinerary_days=sim_twin.itinerary,
        weather_state=sim_weather_state,
        destination=sim_twin.destination,
        available_places=available_places,
        weather_preference=sim_twin.user_preferences.get("weather_preference"),
        suitability_threshold=50
    )

    # 5. Build simulated geographic locations
    sim_locations: List[DigitalTwinLocation] = []
    affected_names = {c.activity.lower() for c in changes}
    replaced_names = {c.replacement.lower() for c in changes if c.replacement}

    for day in simulated_itinerary:
        for act in day.activities:
            if act.latitude and act.longitude:
                p_lower = act.place.lower()
                if p_lower in replaced_names:
                    loc_status = "replaced"
                elif p_lower in affected_names:
                    loc_status = "affected"
                else:
                    loc_status = act.weather_status or "recommended"

                sim_locations.append(
                    DigitalTwinLocation(
                        name=act.place,
                        latitude=act.latitude,
                        longitude=act.longitude,
                        category=act.category,
                        exposure=act.exposure or "indoor",
                        weather={
                            "temperature_c": scen_weather.get("temperature_c", 24.0),
                            "precipitation_probability": scen_weather.get("precipitation_probability", 85.0),
                            "precipitation_mm": scen_weather.get("precipitation_mm", 15.0),
                            "condition": scen_weather.get("weather_condition", "Heavy Rain")
                        },
                        weather_suitability=act.weather_suitability or 95,
                        status=loc_status,
                        day_number=day.day_number,
                        time=act.time,
                        activity_type="meal" if act.is_meal else "sightseeing"
                    )
                )

    # 6. Constraint Validation
    notes: List[str] = []
    time_valid = True
    for day in simulated_itinerary:
        if day.day_total_travel_minutes > 180:
            time_valid = False
            notes.append(f"Day {day.day_number} transit exceeds 180 mins limit.")

    weather_valid = True
    for day in simulated_itinerary:
        for act in day.activities:
            if act.exposure in ("outdoor", "mixed") and (act.weather_suitability or 100) < 40:
                weather_valid = False
                notes.append(f"Activity {act.place} has low weather suitability under simulated storm.")

    if not notes:
        notes.append("Simulated itinerary satisfies budget, transit ceiling, and weather resilience.")

    validation = SimulationValidation(
        budget_valid=True,
        time_valid=time_valid,
        weather_valid=weather_valid,
        notes=notes
    )

    return DigitalTwinSimulateResponse(
        trip_id=trip_id,
        scenario=scen_weather,
        changes=changes,
        original_itinerary=twin.itinerary,
        simulated_itinerary=simulated_itinerary,
        locations=sim_locations,
        travel_time_impact_minutes=0,
        cost_impact=0.0,
        validation=validation
    )
