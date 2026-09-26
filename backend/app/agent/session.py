import uuid
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.models.schemas import ChatMessage, TripListItem

logger = logging.getLogger(__name__)

# In-memory session store (Zero external database)
# Schema: session_id -> {
#   "session_id": str,
#   "name": str,
#   "created_at": str,
#   "updated_at": str,
#   "chat_history": List[ChatMessage],
#   "requirements": Optional[ExtractedTripRequirements],
#   "last_response": Optional[ChatResponse],
#   "places_cache": List[PlaceItem],
#   "hotels_cache": List[HotelItem]
# }
TRIP_SESSIONS: Dict[str, Dict[str, Any]] = {}


def generate_session_id() -> str:
    """Generate a clean, unique trip session ID."""
    return f"trip_{uuid.uuid4().hex[:10]}"


def create_trip_session(
    name: Optional[str] = None,
    session_id: Optional[str] = None,
    destination: Optional[str] = None
) -> Dict[str, Any]:
    """Create a new trip session in memory."""
    s_id = session_id or generate_session_id()
    now_str = datetime.now().isoformat()
    trip_title = name.strip() if name and name.strip() else (f"Trip to {destination}" if destination else f"New Trip #{len(TRIP_SESSIONS) + 1}")

    session_data = {
        "session_id": s_id,
        "name": trip_title,
        "created_at": now_str,
        "updated_at": now_str,
        "chat_history": [],
        "requirements": None,
        "last_response": None,
        "places_cache": [],
        "hotels_cache": []
    }
    TRIP_SESSIONS[s_id] = session_data
    logger.info(f"Created trip session '{trip_title}' ({s_id})")
    return session_data


def get_trip_session(session_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve an existing trip session by session_id."""
    return TRIP_SESSIONS.get(session_id)


def list_trip_sessions() -> List[TripListItem]:
    """List all trip sessions sorted by updated_at descending."""
    results: List[TripListItem] = []
    for s_id, data in TRIP_SESSIONS.items():
        reqs = data.get("requirements")
        dest = reqs.destination if reqs else None
        days = reqs.duration_days if reqs else None
        budget = reqs.budget if reqs else None

        results.append(
            TripListItem(
                session_id=s_id,
                name=data.get("name", "Untitled Trip"),
                created_at=data.get("created_at", ""),
                updated_at=data.get("updated_at", ""),
                destination=dest,
                duration_days=days,
                budget=budget,
                message_count=len(data.get("chat_history", []))
            )
        )
    # Sort newest first
    results.sort(key=lambda x: x.updated_at, reverse=True)
    return results


def update_trip_name(session_id: str, new_name: str) -> bool:
    """Rename a trip session."""
    session = TRIP_SESSIONS.get(session_id)
    if not session:
        return False
    session["name"] = new_name.strip()
    session["updated_at"] = datetime.now().isoformat()
    return True


def delete_trip_session(session_id: str) -> bool:
    """Delete a trip session."""
    if session_id in TRIP_SESSIONS:
        del TRIP_SESSIONS[session_id]
        logger.info(f"Deleted trip session {session_id}")
        return True
    return False


def save_session_turn(
    session_id: str,
    user_message: str,
    assistant_message: str,
    requirements: Any,
    response: Any,
    places: Optional[List[Any]] = None,
    hotels: Optional[List[Any]] = None,
    trip_name: Optional[str] = None
) -> Dict[str, Any]:
    """Save a user-assistant conversation turn and cached data in the session."""
    session = TRIP_SESSIONS.get(session_id)
    now_str = datetime.now().isoformat()

    if not session:
        auto_name = trip_name or (f"Trip to {requirements.destination}" if requirements and getattr(requirements, "destination", None) else "Active Trip")
        session = {
            "session_id": session_id,
            "name": auto_name,
            "created_at": now_str,
            "updated_at": now_str,
            "chat_history": [],
            "requirements": requirements,
            "last_response": response,
            "places_cache": places or [],
            "hotels_cache": hotels or []
        }
        TRIP_SESSIONS[session_id] = session
    else:
        session["updated_at"] = now_str
        session["requirements"] = requirements
        session["last_response"] = response
        if places:
            session["places_cache"] = places
        if hotels:
            session["hotels_cache"] = hotels
        if trip_name and session.get("name") in (None, "", "Active Trip", "New Trip #1"):
            session["name"] = trip_name

    # Append to chat history
    time_display = datetime.now().strftime("%I:%M %p")
    session["chat_history"].append(
        ChatMessage(role="user", content=user_message, timestamp=time_display)
    )
    session["chat_history"].append(
        ChatMessage(role="assistant", content=assistant_message, timestamp=time_display)
    )

    return session
