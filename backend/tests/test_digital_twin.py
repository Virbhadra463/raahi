import pytest
from app.models.schemas import (
    TripSummary, ItineraryDay, ActivityItem, SimulationScenario,
    SimulationScenarioWeather
)
from app.services.digital_twin import (
    build_digital_twin_from_trip_data, simulate_digital_twin
)


@pytest.mark.asyncio
async def test_digital_twin_creation_and_simulation():
    """Verify Digital Twin creation and what-if simulation replanning."""
    summary = TripSummary(
        destination="Pune",
        duration_days=1,
        budget=6000.0,
        travellers=1,
        interests=["culture", "heritage"],
        food_preferences=["vegetarian"],
        accommodation_preferences={},
        pace="moderate"
    )
    
    # Original itinerary with outdoor activities
    day = ItineraryDay(
        day_number=1,
        title="Day 1: Pune Heritage Trail",
        activities=[
            ActivityItem(
                time="09:00",
                place="Hotel Central Pune",
                category="hotel",
                duration_minutes=30,
                travel_from_previous_minutes=0,
                latitude=18.5204,
                longitude=73.8567
            ),
            ActivityItem(
                time="10:00",
                place="Pune-Okayama Friendship Garden",
                category="garden",
                duration_minutes=60,
                travel_from_previous_minutes=15,
                latitude=18.4912,
                longitude=73.8344
            ),
            ActivityItem(
                time="13:00",
                place="Vaishali Restaurant",
                category="restaurant",
                duration_minutes=60,
                travel_from_previous_minutes=15,
                is_meal=True,
                latitude=18.5210,
                longitude=73.8400
            ),
            ActivityItem(
                time="15:00",
                place="Shaniwar Wada Fort",
                category="fort",
                duration_minutes=90,
                travel_from_previous_minutes=15,
                latitude=18.5196,
                longitude=73.8553
            )
        ]
    )

    twin = build_digital_twin_from_trip_data(
        trip_id="test_trip_123",
        trip_summary=summary,
        itinerary_days=[day],
        weather_state={
            "current": {
                "temperature_c": 26.0,
                "precipitation_probability": 10,
                "condition": "Clear"
            }
        },
        budget=6000.0
    )

    assert twin.trip_id == "test_trip_123"
    assert twin.destination == "Pune"
    assert len(twin.locations) == 4
    # Initially outdoor garden has recommended status
    assert twin.itinerary[0].activities[1].place == "Pune-Okayama Friendship Garden"

    # Now execute What-If adverse weather simulation: 90% rain, 15mm
    scenario = SimulationScenario(
        weather=SimulationScenarioWeather(
            precipitation_probability=90.0,
            precipitation_mm=15.0,
            temperature_c=23.0,
            weather_condition="Heavy Rain",
            duration_hours=4
        )
    )

    sim_res = await simulate_digital_twin("test_trip_123", scenario)

    # 1. Original itinerary remains untouched
    assert twin.itinerary[0].activities[1].place == "Pune-Okayama Friendship Garden"

    # 2. Simulated itinerary replaced outdoor garden and fort with indoor cultural gems
    assert len(sim_res.changes) >= 1
    outdoor_places = [c.activity for c in sim_res.changes]
    assert "Pune-Okayama Friendship Garden" in outdoor_places

    # 3. Replacements are rain-safe indoor museum or artisan workshops
    replacements = [c.replacement for c in sim_res.changes]
    assert any("Museum" in r or "Workshop" in r for r in replacements)

    # 4. Validation passed
    assert sim_res.validation.budget_valid is True
    assert sim_res.validation.time_valid is True
    assert sim_res.validation.weather_valid is True
