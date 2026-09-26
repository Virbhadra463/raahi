import logging
from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.models.schemas import (
    ChatRequest, ChatResponse, CreateTripRequest, UpdateTripRequest, TripListItem
)
from app.agent.agent import plan_trip_pipeline
from app.agent.session import (
    create_trip_session, get_trip_session, list_trip_sessions,
    update_trip_name, delete_trip_session
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Travel Planning"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Process natural-language travel planning request",
    description=(
        "Analyzes natural language requests for Maharashtra trips, queries real OpenStreetMap "
        "places, OSRM routes, verified hotels, and generates an "
        "explainable itinerary with cost breakdown. Supports session-based multi-turn conversations."
    )
)
async def chat_travel_planner(request: ChatRequest) -> ChatResponse:
    """Handle trip planning and dynamic replanning requests."""
    try:
        response = await plan_trip_pipeline(request)
        return response
    except Exception as e:
        logger.error(f"Error executing trip planning pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate travel plan: {str(e)}"
        )


@router.get(
    "/trips",
    response_model=List[TripListItem],
    summary="List all active and saved trip sessions"
)
async def get_all_trips() -> List[TripListItem]:
    """Retrieve all trip sessions."""
    return list_trip_sessions()


@router.post(
    "/trips",
    response_model=TripListItem,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new trip session"
)
async def create_new_trip(body: CreateTripRequest) -> TripListItem:
    """Create a new named trip session."""
    session = create_trip_session(name=body.name, destination=body.destination)
    return TripListItem(
        session_id=session["session_id"],
        name=session["name"],
        created_at=session["created_at"],
        updated_at=session["updated_at"],
        destination=body.destination,
        duration_days=None,
        budget=None,
        message_count=0
    )


@router.get(
    "/trips/{session_id}",
    summary="Get trip session detail including conversation and itinerary"
)
async def get_trip_detail(session_id: str) -> Dict[str, Any]:
    """Get full state for a trip session."""
    session = get_trip_session(session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    last_resp = session.get("last_response")
    return {
        "session_id": session["session_id"],
        "name": session.get("name", "Untitled Trip"),
        "created_at": session.get("created_at"),
        "updated_at": session.get("updated_at"),
        "chat_history": [
            m.model_dump() if hasattr(m, "model_dump") else m
            for m in session.get("chat_history", [])
        ],
        "response": last_resp.model_dump() if hasattr(last_resp, "model_dump") else last_resp
    }


@router.put(
    "/trips/{session_id}",
    summary="Rename a trip session"
)
async def rename_trip(session_id: str, body: UpdateTripRequest) -> Dict[str, Any]:
    """Rename an existing trip session."""
    success = update_trip_name(session_id, body.name)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return {"status": "success", "session_id": session_id, "name": body.name.strip()}


@router.delete(
    "/trips/{session_id}",
    summary="Delete a trip session"
)
async def delete_trip(session_id: str) -> Dict[str, Any]:
    """Delete a trip session from memory."""
    success = delete_trip_session(session_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return {"status": "deleted", "session_id": session_id}

