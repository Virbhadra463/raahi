from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, model_validator


class ChatMessage(BaseModel):
    """A message in the multi-turn trip planning conversation."""
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    """User input prompt for the travel assistant."""
    message: str = Field(
        default="",
        description="Natural language trip request message",
        examples=["I want to visit Shirdi for 4 days with my parents. Budget is ₹15,000."]
    )
    prompt: Optional[str] = Field(default=None, description="Alias for message")
    query: Optional[str] = Field(default=None, description="Alias for message")
    text: Optional[str] = Field(default=None, description="Alias for message")
    session_id: Optional[str] = Field(
        default=None,
        description="Active trip session ID to maintain conversation context and modify itinerary"
    )
    trip_name: Optional[str] = Field(
        default=None,
        description="Optional custom name for the trip"
    )
    chat_history: Optional[List[ChatMessage]] = Field(
        default=None,
        description="Optional conversation history for multi-turn editing"
    )
    overrides: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional structured overrides for replanning (e.g. duration_days, budget)"
    )

    @model_validator(mode="before")
    @classmethod
    def normalize_input(cls, data: Any) -> Any:
        if isinstance(data, str):
            return {"message": data.strip()}
        if isinstance(data, dict):
            msg = data.get("message") or data.get("prompt") or data.get("query") or data.get("text")
            if msg:
                data["message"] = str(msg).strip()
            elif not data.get("message"):
                data["message"] = "Plan a visit to Shirdi for 4 days with parents on a 15000 budget."
        return data


class PlaceItem(BaseModel):
    """Normalized real place retrieved from OpenStreetMap / Overpass."""
    name: str
    latitude: float
    longitude: float
    category: str
    description: Optional[str] = None
    source: str = "OpenStreetMap"
    opening_hours: Optional[str] = None
    wheelchair: Optional[str] = "Accessibility information unavailable"
    amenity: Optional[str] = None
    cuisine: Optional[str] = None
    website: Optional[str] = None
    distance_km_from_center: Optional[float] = None
    tags: Dict[str, Any] = Field(default_factory=dict)


class AttractionCandidate(BaseModel):
    """Enriched, structured candidate attraction with multidimensional scoring and scheduling metadata."""
    id: str
    name: str
    canonical_name: str
    latitude: float
    longitude: float
    category: str
    sub_category: Optional[str] = None
    fame_score: float = 0.5
    cultural_score: float = 0.5
    local_authenticity_score: float = 0.5
    uniqueness_score: float = 0.5
    user_interest_match: float = 0.5
    source_count: int = 1
    typical_duration_minutes: int = 60
    opening_hours: Optional[str] = None
    ideal_time_of_day: str = "any"  # "morning", "afternoon", "sunset", "evening", "any"
    tier: str = "RECOMMENDED"  # "ESSENTIAL", "RECOMMENDED", "OPTIONAL"
    explicit_user_requested: bool = False
    destination_essential: bool = False
    description: Optional[str] = None
    source: str = "Discovery Pipeline"
    wheelchair: Optional[str] = "Ground-level accessibility"
    website: Optional[str] = None
    distance_km_from_center: Optional[float] = None
    computed_score: Optional[float] = None
    score_breakdown: Optional[Dict[str, float]] = None
    tags: Dict[str, Any] = Field(default_factory=dict)

    def to_place_item(self) -> PlaceItem:
        return PlaceItem(
            name=self.name,
            latitude=self.latitude,
            longitude=self.longitude,
            category=self.category,
            description=self.description,
            source=self.source,
            opening_hours=self.opening_hours,
            wheelchair=self.wheelchair,
            website=self.website,
            distance_km_from_center=self.distance_km_from_center,
            tags=self.tags
        )


class RemovedAttractionRecord(BaseModel):
    """Explains why a candidate attraction was removed or relocated during self-healing."""
    name: str
    reason: str
    tier: str = "OPTIONAL"
    suggestion: Optional[str] = None


class TripObservability(BaseModel):
    """Observability metadata showing candidate discovery, scoring, and protection stages."""
    candidates_discovered_count: int = 0
    essential_candidates_count: int = 0
    selected_attractions_count: int = 0
    essential_places_included: List[str] = Field(default_factory=list)
    removed_attractions: List[RemovedAttractionRecord] = Field(default_factory=list)
    trip_style: str = "classic_sightseeing"
    clustering_strategy: str = "district_capacity_aware"




class BookingOption(BaseModel):
    """Specific booking provider and rate."""
    source: str
    price: Optional[float] = None
    booking_url: Optional[str] = None
    extracted_price: Optional[float] = None


class FlightAirportInfo(BaseModel):
    """Airport and schedule info for departure or arrival."""
    id: Optional[str] = None
    name: Optional[str] = None
    time: Optional[str] = None


class FlightItem(BaseModel):
    """Normalized flight option retrieved via SerpApi."""
    airline: str
    flight_number: Optional[str] = None
    departure_airport: FlightAirportInfo
    arrival_airport: FlightAirportInfo
    duration_minutes: int
    stops: int
    price: float
    currency: str = "INR"
    booking_url: Optional[str] = None
    class_type: Optional[str] = "Economy"
    score: Optional[float] = None
    rationale: str = ""


class HotelItem(BaseModel):
    """Normalized accommodation item with deterministic scoring."""
    name: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_night: float
    total_price: Optional[float] = None
    currency: str = "INR"
    rating: float
    reviews_count: Optional[int] = None
    reviews: Optional[int] = None
    hotel_class: Optional[int] = None
    free_cancellation: Optional[bool] = None
    distance_km: float = 0.0
    distance_reference: str = "City Center / Major Landmark"
    room_type: str = "Standard Double Room"
    amenities: List[str] = Field(default_factory=list)
    booking_url: str
    directions_url: Optional[str] = None
    booking_options: List[BookingOption] = Field(default_factory=list)
    property_token: Optional[str] = None
    score: Optional[float] = None
    rationale: str = ""


class ActivityItem(BaseModel):
    """A scheduled activity in a single day itinerary."""
    time: str
    place: str
    category: str
    duration_minutes: int
    travel_from_previous_minutes: int
    travel_distance_km: float = 0.0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None
    is_meal: bool = False
    accessibility: str = "Accessibility information unavailable"
    weather_suitability: Optional[int] = Field(default=None, description="Deterministic weather suitability (0-100)")
    weather_status: Optional[str] = Field(default="recommended", description="recommended | affected | replaced")
    weather_condition: Optional[str] = Field(default=None, description="Live or scenario condition summary")
    exposure: Optional[str] = Field(default=None, description="indoor | outdoor | mixed")


class ItineraryDay(BaseModel):
    """Itinerary for a single day."""
    day_number: int
    date: Optional[str] = None
    title: str
    theme: Optional[str] = None
    activities: List[ActivityItem] = Field(default_factory=list)
    day_total_travel_minutes: int = 0
    day_total_travel_km: float = 0.0


class EstimatedCost(BaseModel):
    """Breakdown of estimated costs for the trip."""
    accommodation: float
    food: float
    transport: float
    activities: float
    miscellaneous: float = 0.0
    total: float
    budget: float
    remaining_budget: float


class TripSummary(BaseModel):
    """Structured summary of the user's trip."""
    destination: str
    duration_days: int
    budget: float
    travellers: int = 1
    traveller_types: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    food_preferences: List[str] = Field(default_factory=list)
    accommodation_preferences: Dict[str, Any] = Field(default_factory=dict)
    transportation_preferences: Optional[str] = None
    pace: str = "moderate"
    accessibility_requirements: Optional[str] = None
    weather_preference: Optional[Dict[str, Any]] = Field(default=None, description="Structured Nugen-aligned weather preferences")


# ==========================================
# WEATHER SCHEMAS (Open-Meteo Normalized)
# ==========================================

class WeatherLocation(BaseModel):
    lat: float
    lon: float


class WeatherCurrent(BaseModel):
    temperature_c: float
    apparent_temperature_c: float
    precipitation_mm: float
    precipitation_probability: int
    wind_speed_kmh: float
    weather_code: int
    condition: str
    is_day: int = 1


class WeatherHourlyItem(BaseModel):
    time: str
    temperature_c: float
    precipitation_probability: int
    precipitation_mm: float
    weather_code: int
    condition: str
    wind_speed_kmh: float


class WeatherDailyItem(BaseModel):
    date: str
    weather_code: int
    condition: str
    temperature_max_c: float
    temperature_min_c: float
    precipitation_sum_mm: float
    precipitation_probability_max: int
    sunrise: Optional[str] = None
    sunset: Optional[str] = None


class WeatherReport(BaseModel):
    """Normalized structured Open-Meteo weather report."""
    location: WeatherLocation
    provider: str = "Open-Meteo"
    source_endpoint: str = "forecast"
    current: WeatherCurrent
    hourly: List[WeatherHourlyItem] = Field(default_factory=list)
    daily: List[WeatherDailyItem] = Field(default_factory=list)


# ==========================================
# DIGITAL TWIN SCHEMAS
# ==========================================

class DigitalTwinLocation(BaseModel):
    """A geographic location within the Digital Twin environment."""
    name: str
    latitude: float
    longitude: float
    category: str
    exposure: str = "outdoor"  # indoor | outdoor | mixed
    weather: Dict[str, Any] = Field(default_factory=dict)
    weather_suitability: int = 100
    status: str = "recommended"  # recommended | affected | replaced
    day_number: Optional[int] = None
    time: Optional[str] = None
    activity_type: Optional[str] = None


class TripDigitalTwin(BaseModel):
    """Structured virtual representation of the trip and its environment."""
    trip_id: str
    destination: str
    dates: List[str] = Field(default_factory=list)
    budget: float
    weather_state: Dict[str, Any] = Field(default_factory=dict)
    locations: List[DigitalTwinLocation] = Field(default_factory=list)
    itinerary: List[ItineraryDay] = Field(default_factory=list)
    routes: List[Dict[str, Any]] = Field(default_factory=list)
    constraints: Dict[str, Any] = Field(default_factory=dict)
    user_preferences: Dict[str, Any] = Field(default_factory=dict)
    quests: List[Dict[str, Any]] = Field(default_factory=list)
    badges: List[Dict[str, Any]] = Field(default_factory=list)
    simulation_state: Dict[str, Any] = Field(default_factory=lambda: {"active": False})


class SimulationScenarioWeather(BaseModel):
    """Weather parameters for hypothetical what-if simulation."""
    precipitation_probability: float = Field(default=85.0, ge=0.0, le=100.0)
    precipitation_mm: float = Field(default=15.0, ge=0.0)
    temperature_c: float = Field(default=24.0)
    wind_speed_kmh: float = Field(default=15.0, ge=0.0)
    weather_code: int = Field(default=65)
    weather_condition: Optional[str] = Field(default="Heavy Rain")
    duration_hours: int = Field(default=4, ge=1, le=24)
    affected_location: Optional[str] = Field(default=None)


class SimulationScenario(BaseModel):
    weather: SimulationScenarioWeather


class DigitalTwinSimulateRequest(BaseModel):
    """Request payload for POST /api/digital-twin/simulate."""
    trip_id: str
    scenario: SimulationScenario
    itinerary: Optional[List[ItineraryDay]] = None
    destination: Optional[str] = None
    budget: Optional[float] = None



class ActivityChangeRecord(BaseModel):
    """Explicit diff record of an activity modified or swapped during simulation."""
    activity: str
    day_number: int
    time: str
    change: str  # "replaced" | "rescheduled"
    replacement: Optional[str] = None
    reason: str


class SimulationValidation(BaseModel):
    """Constraint validation results for simulated trip."""
    budget_valid: bool = True
    time_valid: bool = True
    weather_valid: bool = True
    notes: List[str] = Field(default_factory=list)


class DigitalTwinSimulateResponse(BaseModel):
    """Response payload for Digital Twin simulation."""
    trip_id: str
    scenario: Dict[str, Any]
    changes: List[ActivityChangeRecord] = Field(default_factory=list)
    original_itinerary: List[ItineraryDay]
    simulated_itinerary: List[ItineraryDay]
    locations: List[DigitalTwinLocation] = Field(default_factory=list)
    travel_time_impact_minutes: int = 0
    cost_impact: float = 0.0
    validation: SimulationValidation


class ChatResponse(BaseModel):
    """Comprehensive response for POST /api/chat."""
    message: str
    trip: TripSummary
    hotels: List[HotelItem] = Field(default_factory=list)
    flights: List[FlightItem] = Field(default_factory=list)
    itinerary: List[ItineraryDay] = Field(default_factory=list)
    estimated_cost: EstimatedCost
    session_id: Optional[str] = Field(default=None, description="Trip session ID for continuing conversation")
    trip_name: Optional[str] = Field(default=None, description="Trip name")
    chat_history: List[ChatMessage] = Field(default_factory=list, description="Full conversation turns for this trip")
    sources: List[str] = Field(
        default_factory=lambda: [
            "OpenStreetMap",
            "Overpass API",
            "OSRM",
            "Accommodation Provider"
        ]
    )
    relaxation_notes: Optional[str] = None
    observability: Optional[TripObservability] = None
    removed_attractions: List[RemovedAttractionRecord] = Field(default_factory=list)
    weather: Optional[WeatherReport] = Field(default=None, description="Live Open-Meteo weather report")
    digital_twin: Optional[TripDigitalTwin] = Field(default=None, description="RAAHI Digital Twin model")


class CreateTripRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name of the trip")
    destination: Optional[str] = None


class UpdateTripRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Updated name of the trip")


class TripListItem(BaseModel):
    session_id: str
    name: str
    created_at: str
    updated_at: str
    destination: Optional[str] = None
    duration_days: Optional[int] = None
    budget: Optional[float] = None
    message_count: int = 0

