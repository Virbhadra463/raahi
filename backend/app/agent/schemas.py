from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ExtractedAccommodationPref(BaseModel):
    type: Optional[str] = "hotel"
    preferred_type: Optional[str] = "hotel"  # "hostel", "dormitory", "guesthouse", "hotel", "resort"
    near: Optional[str] = None
    amenities: List[str] = Field(default_factory=list)
    target_price_per_night: Optional[float] = None
    max_price_per_night: Optional[float] = None
    priority: Optional[str] = "medium"  # "high", "medium", "low"


class ExtractedTripRequirements(BaseModel):
    """Structured requirements extracted from natural language request."""
    destination: str = Field(
        ...,
        description="Main destination town or city in Maharashtra (e.g. Shirdi, Pune, Nashik, Lonavala, Aurangabad, Mahabaleshwar)"
    )
    duration_days: int = Field(
        default=3,
        ge=1,
        le=14,
        description="Number of trip days"
    )
    budget: float = Field(
        default=15000.0,
        ge=100.0,
        description="Total trip budget in INR"
    )
    travellers: int = Field(
        default=1,
        ge=1,
        description="Total number of travellers"
    )
    traveller_types: List[str] = Field(
        default_factory=list,
        description="Types of travellers: 'solo', 'couple', 'family', 'parents', 'friends', 'seniors', 'kids'"
    )
    interests: List[str] = Field(
        default_factory=list,
        description="Trip interests: 'temples', 'forts', 'nature', 'peaceful places', 'history', 'food', etc."
    )
    preferred_activities: List[str] = Field(
        default_factory=list,
        description="Specific requested activities or attractions"
    )
    accommodation_preferences: ExtractedAccommodationPref = Field(
        default_factory=ExtractedAccommodationPref,
        description="Accommodation preferences"
    )
    food_preferences: List[str] = Field(
        default_factory=lambda: ["vegetarian"],
        description="Food preferences: 'vegetarian', 'pure vegetarian', 'vegan', 'local maharashtrian', etc."
    )
    transportation_preferences: Optional[str] = Field(
        default="cab/auto",
        description="Preferred local transit mode: 'walking', 'auto', 'cab', 'public bus', 'train'"
    )
    transport_preferences: List[str] = Field(
        default_factory=list,
        description="List of preferred transit options: ['local_train', 'bus', 'walking', 'auto', 'cab']"
    )
    travel_style: List[str] = Field(
        default_factory=list,
        description="Travel style tags: ['budget', 'local', 'cultural', 'comfort', 'luxury']"
    )
    trip_style_preference: Optional[str] = Field(
        default="classic_sightseeing",
        description="Trip style: 'first_time_tourist', 'classic_sightseeing', 'hidden_gems', 'food_focused', 'relaxed', 'packed'"
    )
    explicit_attractions_requested: List[str] = Field(
        default_factory=list,
        description="List of specific attractions or landmarks explicitly requested by user"
    )
    local_experience: bool = Field(
        default=False,
        description="Whether user requested an authentic local/cultural experience"
    )
    maximum_acceptable_travel_distance_km: Optional[float] = Field(
        default=35.0,
        description="Maximum travel radius from base"
    )
    pace: str = Field(
        default="relaxed",
        description="Pacing: 'relaxed', 'moderate', 'packed'"
    )
    accessibility_requirements: Optional[str] = Field(
        default=None,
        description="Accessibility considerations (e.g. elderly parents, minimal walking)"
    )
    flight_required: bool = Field(
        default=False,
        description="Whether the user explicitly requested or requires flight search"
    )
    departure_city: Optional[str] = Field(
        default=None,
        description="Departure city or origin (e.g. Mumbai, Delhi, BOM)"
    )
    departure_airport_code: Optional[str] = Field(
        default=None,
        description="3-letter IATA departure airport code (e.g. BOM, DEL, PNQ, SAG)"
    )
    arrival_airport_code: Optional[str] = Field(
        default=None,
        description="3-letter IATA arrival airport code (e.g. DEL, BOM, SAG, PNQ)"
    )
    outbound_date: Optional[str] = Field(
        default=None,
        description="Outbound flight date in YYYY-MM-DD format"
    )
    return_date: Optional[str] = Field(
        default=None,
        description="Return flight date in YYYY-MM-DD format if round trip"
    )
    hard_constraints: Dict[str, Any] = Field(
        default_factory=dict,
        description="Strict non-negotiable boundaries: budget, stay_limit, duration"
    )
    soft_preferences: Dict[str, Any] = Field(
        default_factory=dict,
        description="Relaxable preferences"
    )
    other_constraints: List[str] = Field(
        default_factory=list,
        description="Any other constraints mentioned"
    )
