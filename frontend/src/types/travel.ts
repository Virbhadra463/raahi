export interface TripSummary {
  destination: string;
  duration_days: number;
  budget: number;
  travellers: number;
  traveller_types: string[];
  interests: string[];
  food_preferences: string[];
  accommodation_preferences: {
    type?: string;
    near?: string;
    amenities?: string[];
  };
  transportation_preferences?: string;
  pace: string;
  accessibility_requirements?: string;
}

export interface BookingOption {
  source: string;
  price?: number;
  booking_url?: string;
  extracted_price?: number;
}

export interface FlightAirportInfo {
  id?: string;
  name?: string;
  time?: string;
}

export interface FlightItem {
  airline: string;
  flight_number?: string;
  departure_airport: FlightAirportInfo;
  arrival_airport: FlightAirportInfo;
  duration_minutes: number;
  stops: number;
  price: number;
  currency: string;
  booking_url?: string;
  class_type?: string;
  score?: number;
  rationale: string;
}

export interface HotelItem {
  name: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  total_price?: number;
  currency: string;
  rating: number;
  reviews_count?: number;
  reviews?: number;
  hotel_class?: number;
  free_cancellation?: boolean;
  distance_km: number;
  distance_reference: string;
  room_type: string;
  amenities: string[];
  booking_url: string;
  directions_url?: string;
  booking_options?: BookingOption[];
  property_token?: string;
  score?: number;
  rationale: string;
}

export interface ActivityItem {
  time: string;
  place: string;
  category: string;
  duration_minutes: number;
  travel_from_previous_minutes: number;
  travel_distance_km: number;
  latitude?: number;
  longitude?: number;
  notes?: string;
  is_meal?: boolean;
  accessibility: string;
  weather_suitability?: number;
  weather_status?: "recommended" | "affected" | "replaced";
  weather_condition?: string;
  exposure?: "indoor" | "outdoor" | "mixed";
}

export interface ItineraryDay {
  day_number: number;
  date?: string;
  title: string;
  theme?: string;
  activities: ActivityItem[];
  day_total_travel_minutes: number;
  day_total_travel_km: number;
}

export interface EstimatedCost {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  miscellaneous: number;
  total: number;
  budget: number;
  remaining_budget: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface TripListItem {
  session_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  destination?: string;
  duration_days?: number;
  budget?: number;
  message_count: number;
}

export interface RemovedAttractionRecord {
  name: string;
  reason: string;
  tier?: string;
  suggestion?: string;
}

export interface TripObservability {
  candidates_discovered_count: number;
  essential_candidates_count: number;
  selected_attractions_count: number;
  essential_places_included: string[];
  removed_attractions: RemovedAttractionRecord[];
  trip_style: string;
  clustering_strategy: string;
}

export interface WeatherCurrent {
  temperature_c: number;
  apparent_temperature_c: number;
  precipitation_mm: number;
  precipitation_probability: number;
  wind_speed_kmh: number;
  weather_code: number;
  condition: string;
  is_day: number;
}

export interface WeatherHourlyItem {
  time: string;
  temperature_c: number;
  precipitation_probability: number;
  precipitation_mm: number;
  weather_code: number;
  condition: string;
  wind_speed_kmh: number;
}

export interface WeatherDailyItem {
  date: string;
  weather_code: number;
  condition: string;
  temperature_max_c: number;
  temperature_min_c: number;
  precipitation_sum_mm: number;
  precipitation_probability_max: number;
  sunrise?: string;
  sunset?: string;
}

export interface WeatherReport {
  location: { lat: number; lon: number };
  provider: string;
  source_endpoint: string;
  current: WeatherCurrent;
  hourly: WeatherHourlyItem[];
  daily: WeatherDailyItem[];
}

export interface DigitalTwinLocation {
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  exposure: "indoor" | "outdoor" | "mixed";
  weather: {
    temperature_c?: number;
    precipitation_probability?: number;
    precipitation_mm?: number;
    condition?: string;
  };
  weather_suitability: number;
  status: "recommended" | "affected" | "replaced";
  day_number?: number;
  time?: string;
  activity_type?: string;
}

export interface TripDigitalTwin {
  trip_id: string;
  destination: string;
  dates: string[];
  budget: number;
  weather_state: any;
  locations: DigitalTwinLocation[];
  itinerary: ItineraryDay[];
  routes: Array<{
    from_place: string;
    to_place: string;
    day_number: number;
    travel_minutes: number;
    distance_km: number;
  }>;
  constraints: Record<string, any>;
  user_preferences: Record<string, any>;
  quests: any[];
  badges: any[];
  simulation_state: { active: boolean };
}

export interface SimulationScenarioWeather {
  precipitation_probability: number;
  precipitation_mm: number;
  temperature_c: number;
  wind_speed_kmh: number;
  weather_code: number;
  weather_condition?: string;
  duration_hours: number;
  affected_location?: string;
}

export interface SimulationScenario {
  weather: SimulationScenarioWeather;
}

export interface ActivityChangeRecord {
  activity: string;
  day_number: number;
  time: string;
  change: string;
  replacement?: string;
  reason: string;
}

export interface SimulationValidation {
  budget_valid: boolean;
  time_valid: boolean;
  weather_valid: boolean;
  notes: string[];
}

export interface DigitalTwinSimulateResponse {
  trip_id: string;
  scenario: any;
  changes: ActivityChangeRecord[];
  original_itinerary: ItineraryDay[];
  simulated_itinerary: ItineraryDay[];
  locations: DigitalTwinLocation[];
  travel_time_impact_minutes: number;
  cost_impact: number;
  validation: SimulationValidation;
}

export interface ChatResponse {
  message: string;
  trip: TripSummary;
  hotels: HotelItem[];
  flights?: FlightItem[];
  itinerary: ItineraryDay[];
  estimated_cost: EstimatedCost;
  session_id?: string;
  trip_name?: string;
  chat_history?: ChatMessage[];
  sources: string[];
  relaxation_notes?: string;
  observability?: TripObservability;
  removed_attractions?: RemovedAttractionRecord[];
  weather?: WeatherReport;
  digital_twin?: TripDigitalTwin;
}




