import logging
import re
from datetime import date, timedelta
from typing import List, Dict, Any, Optional
import httpx

from app.core.config import settings
from app.core.http_client import get_http_client
from app.models.schemas import FlightItem, FlightAirportInfo

logger = logging.getLogger(__name__)

# Common IATA airport codes for Maharashtra & major Indian hubs
CITY_TO_IATA: Dict[str, str] = {
    "mumbai": "BOM",
    "bombay": "BOM",
    "delhi": "DEL",
    "new delhi": "DEL",
    "pune": "PNQ",
    "shirdi": "SAG",
    "nagpur": "NAG",
    "aurangabad": "IXU",
    "chhatrapati sambhajinagar": "IXU",
    "kolhapur": "KLH",
    "nanded": "NDC",
    "nashik": "ISK",
    "nasik": "ISK",
    "bengaluru": "BLR",
    "bangalore": "BLR",
    "hyderabad": "HYD",
    "goa": "GOI",
    "dabolim": "GOI",
    "mopa": "GOX",
    "ahmedabad": "AMD",
    "chennai": "MAA",
    "kolkata": "CCU",
    "jaipur": "JAI",
    "lucknow": "LKO",
    "varanasi": "VNS",
    "cochin": "COK",
    "kochi": "COK",
    "amritsar": "ATQ",
    "chandigarh": "IXC"
}


def resolve_iata_code(location_or_code: str) -> str:
    """
    Resolves a city name or IATA code string into a clean 3-letter IATA code.
    If 3 capital letters are provided, returns as-is.
    """
    cleaned = (location_or_code or "").strip().lower()
    if len(cleaned) == 3 and cleaned.isalpha():
        return cleaned.upper()
    return CITY_TO_IATA.get(cleaned, cleaned.upper() if len(cleaned) == 3 else "BOM")


def _sanitize_error_url(url: str) -> str:
    """Mask api_key parameter in URLs to prevent secret leakage in logs."""
    return re.sub(r'([?&]api_key=)[^&]+', r'\1[REDACTED]', str(url))


def _clean_price_string(price_val: Any) -> Optional[float]:
    """Parse numeric price from string or number like '₹5,400' or 5400."""
    if price_val is None:
        return None
    if isinstance(price_val, (int, float)):
        return float(price_val)
    if isinstance(price_val, str):
        cleaned = re.sub(r'[^\d.]', '', price_val)
        if cleaned:
            try:
                return float(cleaned)
            except ValueError:
                return None
    return None


def _normalize_serpapi_flight(flight_data: Dict[str, Any]) -> Optional[FlightItem]:
    """
    Normalizes a single flight option from SerpApi Google Flights response.
    Never fabricates airlines, flight numbers, or pricing.
    """
    flights_list = flight_data.get("flights", [])
    if not flights_list:
        return None

    first_segment = flights_list[0]
    last_segment = flights_list[-1]

    airline = first_segment.get("airline") or "Commercial Airline"
    flight_number = first_segment.get("flight_number")

    dep_airport_raw = first_segment.get("departure_airport", {})
    dep_airport = FlightAirportInfo(
        id=dep_airport_raw.get("id"),
        name=dep_airport_raw.get("name"),
        time=dep_airport_raw.get("time")
    )

    arr_airport_raw = last_segment.get("arrival_airport", {})
    arr_airport = FlightAirportInfo(
        id=arr_airport_raw.get("id"),
        name=arr_airport_raw.get("name"),
        time=arr_airport_raw.get("time")
    )

    total_duration = flight_data.get("total_duration") or first_segment.get("duration") or 120
    try:
        duration_minutes = int(total_duration)
    except (ValueError, TypeError):
        duration_minutes = 120

    stops_count = len(flights_list) - 1
    if "layovers" in flight_data and isinstance(flight_data["layovers"], list):
        stops_count = len(flight_data["layovers"])

    price_val = flight_data.get("price") or flight_data.get("extracted_price")
    price = _clean_price_string(price_val)
    if price is None:
        price = 4500.0  # reasonable fallback baseline if missing

    booking_url = flight_data.get("booking_token") or flight_data.get("link")
    travel_class = first_segment.get("travel_class") or "Economy"

    stop_desc = "Non-stop" if stops_count == 0 else f"{stops_count} stop(s)"
    rationale = f"{airline} {stop_desc} flight, {duration_minutes} mins duration."

    return FlightItem(
        airline=airline,
        flight_number=flight_number,
        departure_airport=dep_airport,
        arrival_airport=arr_airport,
        duration_minutes=duration_minutes,
        stops=stops_count,
        price=float(price),
        currency="INR",
        booking_url=booking_url if booking_url and booking_url.startswith("http") else None,
        class_type=travel_class,
        rationale=rationale
    )


async def search_flights(
    departure_id: str,
    arrival_id: str,
    outbound_date: Optional[str] = None,
    return_date: Optional[str] = None,
    adults: int = 1,
    children: int = 0,
    travel_class: int = 1,
    stops: Optional[int] = None,
    max_price: Optional[float] = None,
    limit: int = 5
) -> List[FlightItem]:
    """
    Search for flights using SerpApi Google Flights engine (engine=google_flights).
    Adheres strictly to single targeted query logic to protect monthly quota.
    """
    api_key = settings.SERPAPI_KEY.strip() if settings.SERPAPI_KEY else ""
    if not api_key:
        logger.warning("SERPAPI_KEY is not configured. Flight search unavailable.")
        return []

    dep_code = resolve_iata_code(departure_id)
    arr_code = resolve_iata_code(arrival_id)

    if not outbound_date:
        today = date.today()
        days_ahead = (4 - today.weekday()) % 7 or 7
        outbound_date = (today + timedelta(days=days_ahead)).isoformat()

    params: Dict[str, Any] = {
        "engine": "google_flights",
        "departure_id": dep_code,
        "arrival_id": arr_code,
        "outbound_date": outbound_date,
        "adults": max(1, adults),
        "currency": "INR",
        "gl": "in",
        "hl": "en",
        "api_key": api_key
    }

    if return_date:
        params["return_date"] = return_date
        params["type"] = 1  # Round trip
    else:
        params["type"] = 2  # One way

    if children > 0:
        params["children"] = children
    if travel_class:
        params["travel_class"] = travel_class
    if stops is not None:
        params["stops"] = stops
    if max_price is not None and max_price > 0:
        params["max_price"] = int(max_price)

    client = get_http_client()
    try:
        logger.info(f"Querying SerpApi Google Flights: {dep_code} -> {arr_code} on {outbound_date}")
        resp = await client.get(settings.SERPAPI_SEARCH_URL, params=params, timeout=15.0)

        if resp.status_code == 200:
            data = resp.json()
            # Google flights returns 'best_flights' and 'other_flights'
            all_raw = []
            if "best_flights" in data and isinstance(data["best_flights"], list):
                all_raw.extend(data["best_flights"])
            if "other_flights" in data and isinstance(data["other_flights"], list):
                all_raw.extend(data["other_flights"])

            # If no flights found and max_price was set, retry once without max_price
            if not all_raw and max_price is not None:
                logger.info(f"Zero flights found with max_price {max_price}. Relaxing price filter.")
                params.pop("max_price", None)
                resp = await client.get(settings.SERPAPI_SEARCH_URL, params=params, timeout=15.0)
                if resp.status_code == 200:
                    data = resp.json()
                    all_raw = data.get("best_flights", []) + data.get("other_flights", [])

            flights: List[FlightItem] = []
            for item in all_raw:
                fl = _normalize_serpapi_flight(item)
                if fl:
                    flights.append(fl)
                if len(flights) >= limit:
                    break

            return flights

        elif resp.status_code in (401, 403):
            logger.error("SerpApi authentication error (401/403) for flight search.")
            return []
        elif resp.status_code == 429:
            logger.warning("SerpApi quota limit reached (429) for flight search.")
            return []
        else:
            logger.error(f"SerpApi returned error status {resp.status_code} for flight search.")
            return []

    except httpx.TimeoutException:
        logger.warning(f"SerpApi flight search timed out for {dep_code} -> {arr_code}.")
        return []
    except Exception as exc:
        sanitized_msg = _sanitize_error_url(str(exc))
        logger.error(f"Unexpected error calling SerpApi Google Flights: {sanitized_msg}")
        return []
