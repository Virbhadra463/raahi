import pytest
import asyncio
from app.tools.weather import (
    classify_activity_exposure, compute_weather_suitability,
    get_weather_condition_text, normalize_open_meteo_response
)


def test_classify_activity_exposure():
    """Verify deterministic categorization of activities into indoor, outdoor, mixed."""
    assert classify_activity_exposure("museum", "Raja Dinkar Kelkar Museum") == "indoor"
    assert classify_activity_exposure("artisan", "Tambat Ali Coppersmiths") == "indoor"
    assert classify_activity_exposure("craft", "Paithani Handloom Weaving Center") == "indoor"
    assert classify_activity_exposure("restaurant", "Cafe Goodluck") == "indoor"
    
    assert classify_activity_exposure("viewpoint", "Hanging Gardens") == "outdoor"
    assert classify_activity_exposure("beach", "Girgaon Chowpatty") == "outdoor"
    assert classify_activity_exposure("fort", "Sinhagad Fort") == "outdoor"
    assert classify_activity_exposure("garden", "Pune-Okayama Friendship Garden") == "outdoor"
    assert classify_activity_exposure("trek", "Kalsubai Peak Trek") == "outdoor"
    
    assert classify_activity_exposure("market", "Crawford Market") == "mixed"
    assert classify_activity_exposure("temple", "Babulnath Mandir") == "mixed"


def test_weather_suitability_deterministic_scoring():
    """Verify deterministic Python logic for weather suitability scoring (0-100)."""
    # 1. Clear sunny outdoor day (25°C, 0mm rain, light wind) -> High suitability
    score, reason = compute_weather_suitability(
        exposure="outdoor",
        precipitation_probability=10,
        precipitation_mm=0.0,
        temperature_c=25.0,
        wind_speed_kmh=10.0,
        weather_code=1
    )
    assert score >= 90
    assert "Favorable" in reason or "Clear" in reason

    # 2. Outdoor sightseeing with heavy rain (15mm, 90% probability, storm code 65) -> Severe penalty
    rain_score, rain_reason = compute_weather_suitability(
        exposure="outdoor",
        precipitation_probability=90,
        precipitation_mm=15.0,
        temperature_c=22.0,
        wind_speed_kmh=15.0,
        weather_code=65
    )
    assert rain_score <= 35
    assert "heavy rainfall" in rain_reason

    # 3. Indoor museum during heavy rain -> Sheltered bonus / high suitability
    indoor_score, indoor_reason = compute_weather_suitability(
        exposure="indoor",
        precipitation_probability=90,
        precipitation_mm=15.0,
        temperature_c=22.0,
        wind_speed_kmh=15.0,
        weather_code=65
    )
    assert indoor_score >= 90
    assert "rain-safe" in indoor_reason

    # 4. Extreme heat wave (42°C) -> Outdoor penalty
    heat_score, heat_reason = compute_weather_suitability(
        exposure="outdoor",
        precipitation_probability=0,
        precipitation_mm=0.0,
        temperature_c=42.0,
        wind_speed_kmh=8.0,
        weather_code=0
    )
    assert heat_score <= 60
    assert "heat" in heat_reason


def test_weather_condition_codes():
    """Ensure WMO weather codes map to human-readable strings."""
    assert get_weather_condition_text(0) == "Clear sky"
    assert get_weather_condition_text(2) == "Partly cloudy"
    assert get_weather_condition_text(65) == "Heavy rain"
    assert get_weather_condition_text(95) == "Thunderstorm"


def test_open_meteo_normalization():
    """Ensure raw Open-Meteo payload parses cleanly without hallucination."""
    raw_sample = {
        "current": {
            "time": "2026-09-27T10:00",
            "temperature_2m": 27.2,
            "apparent_temperature": 28.5,
            "precipitation": 0.0,
            "weather_code": 2,
            "wind_speed_10m": 12.4
        },
        "hourly": {
            "time": ["2026-09-27T10:00", "2026-09-27T11:00"],
            "temperature_2m": [27.2, 28.1],
            "precipitation_probability": [5, 10],
            "precipitation": [0.0, 0.0],
            "weather_code": [2, 1],
            "wind_speed_10m": [12.4, 13.0]
        },
        "daily": {
            "time": ["2026-09-27"],
            "weather_code": [2],
            "temperature_2m_max": [30.5],
            "temperature_2m_min": [21.0],
            "precipitation_sum": [0.0],
            "precipitation_probability_max": [10],
            "sunrise": ["2026-09-27T06:20"],
            "sunset": ["2026-09-27T18:25"]
        }
    }
    normalized = normalize_open_meteo_response(raw_sample, 18.5204, 73.8567)
    assert normalized["location"]["lat"] == 18.5204
    assert normalized["current"]["temperature_c"] == 27.2
    assert normalized["current"]["condition"] == "Partly cloudy"
    assert len(normalized["hourly"]) == 2
    assert len(normalized["daily"]) == 1
