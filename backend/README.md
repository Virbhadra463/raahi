# Maharashtra AI Travel Planner Backend

Backend for an AI-powered personalized travel planning platform focused on Maharashtra, India. It accepts natural-language requests, parses user requirements via Gemini Agent orchestration, queries real-world data dynamically across external APIs (OpenStreetMap Overpass, OSRM, Open-Meteo, Accommodation providers), scores and ranks results deterministically, and synthesizes practical multi-day itineraries.

## Core Features

- **Natural Language Parsing**: Extracts structured travel constraints (destination, duration, budget, travellers, elderly/parent mobility, dietary preferences, pace) using Gemini API or intelligent heuristic parser.
- **Dynamic Overpass API (OSM)**: Real-time queries for temples, forts, heritage sites, viewpoints, parks, pure vegetarian dining, and transit stations across Maharashtra. Zero static tourism databases.
- **Routing Engine (OSRM)**: Calculates realistic driving travel times and road distances between consecutive stops, preventing unrealistic schedules.
- **Weather Forecasts (Open-Meteo)**: Live multi-day weather predictions influencing activity scheduling (e.g. favoring covered temples/museums over outdoor viewpoints on rainy days).
- **Accommodation Matching**: Automatically derives sensible nightly accommodation budgets after accounting for food, transit, and activities. Ranks verified hotel inventory deterministically with explainable rationale and constraint relaxation.
- **Zero Database Persistence**: In-memory, stateless processing for MVP readiness without database overhead.

---

## Directory Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point & lifespan
│   ├── api/
│   │   ├── __init__.py
│   │   └── chat.py              # POST /api/chat endpoint
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── agent.py             # Gemini orchestration & pipeline coordinator
│   │   ├── prompts.py           # Extraction & synthesis system prompts
│   │   └── schemas.py           # Agent extraction Pydantic schemas
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── osm.py               # Overpass API & Nominatim integration
│   │   ├── routing.py           # OSRM routing integration & fallback
│   │   ├── weather.py           # Open-Meteo forecast integration
│   │   └── accommodation.py     # Hotel search & budget breakdown
│   ├── services/
│   │   ├── __init__.py
│   │   ├── recommendation.py    # Deterministic hotel & place ranking
│   │   └── itinerary.py         # Multi-day scheduling & dynamic replanning
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Pydantic Settings & environment variables
│   │   └── http_client.py       # Shared async httpx client
│   └── models/
│       ├── __init__.py
│       └── schemas.py           # API request and response models
│
├── tests/
│   ├── test_osm.py              # OSM parsing & normalization tests
│   ├── test_recommendation.py   # Hotel scoring & budget tests
│   └── test_itinerary.py        # Itinerary & replanning tests
│
├── .env.example
├── .env
├── requirements.txt
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Python 3.10+ (tested on Python 3.13 / 3.14)
- Virtual environment recommended

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
- `GEMINI_API_KEY`: (Optional for basic testing, recommended for Gemini agent)
- `OVERPASS_URL`: `https://overpass-api.de/api/interpreter`
- `OSRM_URL`: `http://router.project-osrm.org/route/v1/driving`
- `OPEN_METEO_URL`: `https://api.open-meteo.com/v1/forecast`

### 4. Run the Dev Server
From the workspace root or `backend` folder:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Or with PYTHONPATH:
```bash
$env:PYTHONPATH="backend"
uvicorn app.main:app --reload
```

Interactive API documentation will be available at `http://127.0.0.1:8000/docs`.

---

## API Endpoints

### 1. Health Check
`GET /health`
```json
{
  "status": "healthy",
  "app": "Maharashtra AI Travel Planner",
  "environment": "development",
  "database": "none (in-memory dynamic processing)"
}
```

### 2. Plan Trip
`POST /api/chat`

**Request:**
```json
{
  "message": "I want to visit Shirdi for 4 days with my parents. My total budget is ₹15,000. I want a decent hotel near Sai Baba Temple, vegetarian food, temples and peaceful places. I don't want to travel too much."
}
```

**Response:**
```json
{
  "message": "Here is your personalized 4-day itinerary for Shirdi...",
  "trip": {
    "destination": "Shirdi",
    "duration_days": 4,
    "budget": 15000,
    "travellers": 3,
    "traveller_types": ["adult", "parents"],
    "interests": ["temples", "peaceful places"],
    "food_preferences": ["vegetarian"],
    "accommodation_preferences": {
      "type": "hotel",
      "near": "Sai Baba Temple"
    }
  },
  "hotels": [
    {
      "name": "Hotel Sai Jashan",
      "location": "Sai Baba Temple, Shirdi",
      "price_per_night": 2200,
      "rating": 4.3,
      "distance_km": 0.6,
      "amenities": ["Air Conditioning", "Pure Veg Dining", "Elevator/Lift"],
      "booking_url": "https://www.hotelsaijashan.com",
      "rationale": "Selected because it is within estimated nightly budget (₹2200/night), just 0.6 km from main temple, strong rating of 4.3/5, and has elevator/lift for elderly comfort."
    }
  ],
  "itinerary": [
    {
      "day_number": 1,
      "date": "2026-10-12",
      "title": "Day 1: Shirdi Darshan & Cultural Highlights",
      "weather_summary": {
        "date": "2026-10-12",
        "temperature": 27.5,
        "condition": "Mainly clear",
        "outdoor_friendly": true
      },
      "activities": [
        {
          "time": "09:00",
          "place": "Arrival & Check-in at Hotel Sai Jashan",
          "duration_minutes": 60,
          "travel_from_previous_minutes": 0
        },
        {
          "time": "10:15",
          "place": "Shri Saibaba Sansthan Temple",
          "duration_minutes": 90,
          "travel_from_previous_minutes": 15
        },
        {
          "time": "12:30",
          "place": "Sai Naivedyam Pure Veg Restaurant",
          "duration_minutes": 60,
          "travel_from_previous_minutes": 10,
          "is_meal": true
        }
      ]
    }
  ],
  "estimated_cost": {
    "accommodation": 6600,
    "food": 3000,
    "transport": 2800,
    "activities": 1350,
    "total": 13750,
    "budget": 15000,
    "remaining_budget": 1250
  },
  "sources": [
    "OpenStreetMap",
    "Overpass API",
    "OSRM",
    "Open-Meteo",
    "Accommodation Provider"
  ]
}
```

---

## Running Automated Tests

Run the test suite using pytest:
```bash
pytest backend/tests/ -v
```
All unit tests mock external API boundaries and validate:
- OSM response parsing, tag normalization, and handling missing coordinates/descriptions.
- Budget allocation, deterministic hotel scoring, and constraint relaxation.
- Travel time scheduling, meal break placement, weather-based adaptions, and dynamic replanning.
