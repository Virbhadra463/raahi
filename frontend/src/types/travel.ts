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
}



