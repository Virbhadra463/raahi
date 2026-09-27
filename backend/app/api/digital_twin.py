import logging
from fastapi import APIRouter, HTTPException, Path

from app.models.schemas import (
    TripDigitalTwin, DigitalTwinSimulateRequest, DigitalTwinSimulateResponse
)
from app.services.digital_twin import (
    get_digital_twin, simulate_digital_twin
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/digital-twin", tags=["Digital Twin"])


@router.get("/{trip_id}", response_model=TripDigitalTwin)
async def get_trip_digital_twin(
    trip_id: str = Path(..., description="Active trip session ID")
):
    """
    Retrieve the virtual Digital Twin representation of a trip, including
    geographic locations, live weather state, routes, and constraints.
    """
    twin = get_digital_twin(trip_id)
    if not twin:
        raise HTTPException(
            status_code=404,
            detail=f"Digital Twin for trip '{trip_id}' not found. Please plan a trip first."
        )
    return twin


@router.post("/simulate", response_model=DigitalTwinSimulateResponse)
async def simulate_weather_scenario(
    request: DigitalTwinSimulateRequest
):
    """
    Execute a What-If Weather Simulation on a virtual Digital Twin clone.
    Hypothetical weather conditions are tested against the itinerary without
    modifying live weather data or the original itinerary.
    """
    try:
        response = await simulate_digital_twin(
            trip_id=request.trip_id,
            scenario=request.scenario,
            itinerary=request.itinerary,
            destination=request.destination,
            budget=request.budget
        )
        return response

    except Exception as ex:
        logger.error(f"Error during digital twin simulation: {ex}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Simulation error: {str(ex)}"
        )
