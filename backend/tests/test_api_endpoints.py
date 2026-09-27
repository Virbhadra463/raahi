import pytest
import httpx
from app.main import app
from app.models.schemas import (
    TripSummary, ItineraryDay, ActivityItem, SimulationScenario,
    SimulationScenarioWeather
)
from app.services.digital_twin import build_digital_twin_from_trip_data


@pytest.mark.asyncio
async def test_digital_twin_api_endpoints():
    """Verify GET /api/digital-twin/{trip_id} and POST /api/digital-twin/simulate."""
    # Pre-populate a test digital twin
    summary = TripSummary(
        destination="Pune",
        duration_days=1,
        budget=5000.0,
        travellers=1,
        interests=["culture"],
        food_preferences=["vegetarian"],
        accommodation_preferences={},
        pace="moderate"
    )
    day = ItineraryDay(
        day_number=1,
        title="Day 1",
        activities=[
            ActivityItem(
                time="10:00",
                place="Pune-Okayama Friendship Garden",
                category="garden",
                duration_minutes=60,
                travel_from_previous_minutes=0,
                latitude=18.4912,
                longitude=73.8344
            )
        ]
    )
    build_digital_twin_from_trip_data(
        trip_id="api_test_twin_1",
        trip_summary=summary,
        itinerary_days=[day],
        weather_state={"current": {"temperature_c": 27.0, "condition": "Sunny"}},
        budget=5000.0
    )

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # 1. GET Digital Twin
        resp = await client.get("/api/digital-twin/api_test_twin_1")
        assert resp.status_code == 200
        twin_json = resp.json()
        assert twin_json["trip_id"] == "api_test_twin_1"
        assert twin_json["destination"] == "Pune"
        assert len(twin_json["locations"]) == 1

        # 2. POST Simulate Scenario
        sim_payload = {
            "trip_id": "api_test_twin_1",
            "scenario": {
                "weather": {
                    "precipitation_probability": 90.0,
                    "precipitation_mm": 18.0,
                    "temperature_c": 22.0,
                    "weather_condition": "Torrential Downpour",
                    "duration_hours": 4
                }
            }
        }
        sim_resp = await client.post("/api/digital-twin/simulate", json=sim_payload)
        assert sim_resp.status_code == 200
        sim_data = sim_resp.json()
        assert sim_data["trip_id"] == "api_test_twin_1"
        assert len(sim_data["changes"]) == 1
        assert sim_data["changes"][0]["activity"] == "Pune-Okayama Friendship Garden"
        assert sim_data["validation"]["weather_valid"] is True
