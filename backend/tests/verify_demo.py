import httpx

client = httpx.Client(base_url="http://127.0.0.1:8000", timeout=120.0)

# Step 1: Health check
h = client.get("/health")
print("1. Backend Health:", h.json().get("status"))

# Step 2: Plan trip
print("2. Planning trip to Pune via POST /api/chat...")
chat_resp = client.post("/api/chat", json={
    "message": "Plan a 2-day visit to Pune for heritage and culture with budget 8000."
})
assert chat_resp.status_code == 200, f"Chat failed: {chat_resp.text}"
trip_data = chat_resp.json()
session_id = trip_data["session_id"]
dest = trip_data["trip"]["destination"]
weather_provider = trip_data.get("weather", {}).get("provider")
weather_current = trip_data.get("weather", {}).get("current", {})
days_count = len(trip_data.get("itinerary", []))

print(f"   Session ID: {session_id}")
print(f"   Destination: {dest}")
print(f"   Live Weather Provider: {weather_provider}")
print(f"   Live Weather Current: {weather_current.get('condition')}, {weather_current.get('temperature_c')}°C")
print(f"   Itinerary Days: {days_count}")

# Step 3: Fetch Digital Twin
print(f"3. Fetching Digital Twin via GET /api/digital-twin/{session_id}...")
twin_resp = client.get(f"/api/digital-twin/{session_id}")
assert twin_resp.status_code == 200, f"Twin failed: {twin_resp.text}"
twin_data = twin_resp.json()
print(f"   Digital Twin ID: {twin_data.get('trip_id')}")
print(f"   Digital Twin Locations count: {len(twin_data.get('locations', []))}")

# Step 4: Run What-If Simulation
print("4. Running What-If Weather Simulation via POST /api/digital-twin/simulate...")
sim_resp = client.post("/api/digital-twin/simulate", json={
    "trip_id": session_id,
    "scenario": {
        "weather": {
            "precipitation_probability": 95.0,
            "precipitation_mm": 25.0,
            "temperature_c": 21.0,
            "weather_condition": "Monsoon Downpour",
            "duration_hours": 5
        }
    }
})
assert sim_resp.status_code == 200, f"Simulation failed: {sim_resp.text}"
sim_data = sim_resp.json()
changes = sim_data.get("changes", [])
print(f"   Simulated Changes Count: {len(changes)}")
for ch in changes:
    print(f"   -> Day {ch.get('day_number')} {ch.get('time')}: {ch.get('activity')} [{ch.get('change')}] --> {ch.get('replacement')}")
    print(f"      Reason: {ch.get('reason')}")

print(f"   Validation: {sim_data.get('validation')}")

# Step 5: Verify Live Weather Isolation
twin_after = client.get(f"/api/digital-twin/{session_id}").json()
print("5. Verifying live weather isolation: untouched!")
assert twin_after["weather_state"]["current"]["condition"] == weather_current["condition"]
print("=== ALL DEMO SCENARIO CHECKS PASSED PERFECTLY ===")
