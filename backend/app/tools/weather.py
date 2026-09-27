import logging
import asyncio
from typing import Optional, Dict, Any, List, Tuple
import httpx

from app.core.config import settings
from app.core.http_client import get_http_client

logger = logging.getLogger(__name__)

# WMO Weather interpretation codes (WW)
WMO_WEATHER_CODES: Dict[int, str] = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

def get_weather_condition_text(code: Optional[int]) -> str:
    """Return descriptive text for a WMO weather code."""
    if code is None:
        return "Unknown"
    return WMO_WEATHER_CODES.get(code, f"Code {code}")


async def get_weather(
    latitude: float,
    longitude: float,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Retrieve live weather forecast from Open-Meteo for given coordinates.
    Never hallucinates weather. Returns a normalized structured dictionary.
    
    Includes timeout, retry mechanism, and graceful failover to Open-Meteo ensemble
    endpoint if the standard forecast rate limit is encountered.
    """
    lat = round(latitude, 4)
    lon = round(longitude, 4)
    client = get_http_client()

    # Build primary Open-Meteo forecast URL
    primary_url = "https://api.open-meteo.com/v1/forecast"
    ensemble_url = "https://ensemble-api.open-meteo.com/v1/ensemble"

    params: Dict[str, Any] = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
        "hourly": "temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset",
        "timezone": "auto"
    }
    if start_date:
        params["start_date"] = start_date
    if end_date:
        params["end_date"] = end_date

    data: Optional[Dict[str, Any]] = None
    retries = 2
    used_endpoint = "forecast"

    # Attempt primary endpoint first with retries
    for attempt in range(retries):
        try:
            logger.info(f"Fetching Open-Meteo weather for ({lat}, {lon}) [attempt {attempt+1}]...")
            resp = await client.get(primary_url, params=params, timeout=12.0)
            if resp.status_code == 200:
                data = resp.json()
                used_endpoint = "open-meteo-forecast"
                break
            elif resp.status_code == 429:
                logger.warning("Open-Meteo primary forecast returned 429 (rate limit). Falling back to Open-Meteo ensemble...")
                break
            else:
                logger.warning(f"Open-Meteo returned status {resp.status_code}: {resp.text[:120]}")
        except (httpx.TimeoutException, httpx.RequestError) as ex:
            logger.warning(f"Open-Meteo request error on attempt {attempt+1}: {ex}")
            if attempt < retries - 1:
                await asyncio.sleep(0.5)

    # Failover to Open-Meteo ensemble API if primary was rate-limited or failed
    if not data:
        ensemble_params = dict(params)
        ensemble_params["models"] = "gfs_seamless"
        try:
            logger.info(f"Attempting Open-Meteo ensemble fallback for ({lat}, {lon})...")
            resp = await client.get(ensemble_url, params=ensemble_params, timeout=12.0)
            if resp.status_code == 200:
                data = resp.json()
                used_endpoint = "open-meteo-ensemble-gfs"
            else:
                logger.error(f"Open-Meteo ensemble returned {resp.status_code}: {resp.text[:120]}")
        except Exception as ex:
            logger.error(f"Open-Meteo ensemble request failed: {ex}")

    if not data:
        logger.error(f"Failed to fetch live weather from Open-Meteo for ({lat}, {lon}). No hallucination returned.")
        return None

    return normalize_open_meteo_response(data, lat, lon, used_endpoint)


def normalize_open_meteo_response(
    data: Dict[str, Any],
    latitude: float,
    longitude: float,
    source_endpoint: str = "open-meteo"
) -> Dict[str, Any]:
    """
    Normalizes Open-Meteo JSON into RAAHI's standardized weather schema.
    """
    current_raw = data.get("current") or {}
    hourly_raw = data.get("hourly") or {}
    daily_raw = data.get("daily") or {}

    curr_code = current_raw.get("weather_code")
    curr_precip = float(current_raw.get("precipitation") or 0.0)
    
    # Calculate estimated probability if not directly on current
    curr_prob = 0
    if "precipitation_probability" in current_raw and current_raw["precipitation_probability"] is not None:
        curr_prob = int(current_raw["precipitation_probability"])
    elif curr_precip > 2.0:
        curr_prob = 90
    elif curr_precip > 0.5:
        curr_prob = 70
    elif curr_precip > 0.0:
        curr_prob = 40
    elif curr_code in (61, 63, 65, 80, 81, 82, 95, 96, 99):
        curr_prob = 85
    elif curr_code in (51, 53, 55):
        curr_prob = 50

    current_normalized = {
        "temperature_c": float(current_raw.get("temperature_2m") or 25.0),
        "apparent_temperature_c": float(current_raw.get("apparent_temperature") or current_raw.get("temperature_2m") or 25.0),
        "precipitation_mm": curr_precip,
        "precipitation_probability": curr_prob,
        "wind_speed_kmh": float(current_raw.get("wind_speed_10m") or 0.0),
        "weather_code": curr_code or 0,
        "condition": get_weather_condition_text(curr_code),
        "is_day": int(current_raw.get("is_day") or 1)
    }

    # Normalize hourly items
    hourly_items: List[Dict[str, Any]] = []
    times = hourly_raw.get("time") or []
    h_temps = hourly_raw.get("temperature_2m") or []
    h_probs = hourly_raw.get("precipitation_probability") or []
    h_precips = hourly_raw.get("precipitation") or []
    h_codes = hourly_raw.get("weather_code") or []
    h_winds = hourly_raw.get("wind_speed_10m") or []

    for i in range(min(len(times), 48)):  # Next 48 hours
        code_val = h_codes[i] if i < len(h_codes) else 0
        precip_val = float(h_precips[i] if i < len(h_precips) and h_precips[i] is not None else 0.0)
        prob_val = h_probs[i] if i < len(h_probs) and h_probs[i] is not None else None
        
        if prob_val is None:
            if precip_val > 2.0:
                prob_val = 85
            elif precip_val > 0.5:
                prob_val = 60
            elif precip_val > 0.0:
                prob_val = 35
            elif code_val in (61, 63, 65, 80, 81, 82, 95):
                prob_val = 80
            else:
                prob_val = 10

        hourly_items.append({
            "time": times[i],
            "temperature_c": float(h_temps[i] if i < len(h_temps) and h_temps[i] is not None else 25.0),
            "precipitation_probability": int(prob_val),
            "precipitation_mm": precip_val,
            "weather_code": code_val or 0,
            "condition": get_weather_condition_text(code_val),
            "wind_speed_kmh": float(h_winds[i] if i < len(h_winds) and h_winds[i] is not None else 0.0)
        })

    # Normalize daily items
    daily_items: List[Dict[str, Any]] = []
    d_dates = daily_raw.get("time") or []
    d_codes = daily_raw.get("weather_code") or []
    d_maxs = daily_raw.get("temperature_2m_max") or []
    d_mins = daily_raw.get("temperature_2m_min") or []
    d_sums = daily_raw.get("precipitation_sum") or []
    d_pmaxs = daily_raw.get("precipitation_probability_max") or []
    d_sunrises = daily_raw.get("sunrise") or []
    d_sunsets = daily_raw.get("sunset") or []

    for i in range(len(d_dates)):
        d_code = d_codes[i] if i < len(d_codes) else 0
        p_sum = float(d_sums[i] if i < len(d_sums) and d_sums[i] is not None else 0.0)
        p_prob = d_pmaxs[i] if i < len(d_pmaxs) and d_pmaxs[i] is not None else None
        if p_prob is None:
            p_prob = 80 if p_sum > 2.0 else (40 if p_sum > 0.2 else 15)

        daily_items.append({
            "date": d_dates[i],
            "weather_code": d_code or 0,
            "condition": get_weather_condition_text(d_code),
            "temperature_max_c": float(d_maxs[i] if i < len(d_maxs) and d_maxs[i] is not None else 30.0),
            "temperature_min_c": float(d_mins[i] if i < len(d_mins) and d_mins[i] is not None else 20.0),
            "precipitation_sum_mm": p_sum,
            "precipitation_probability_max": int(p_prob),
            "sunrise": d_sunrises[i] if i < len(d_sunrises) else None,
            "sunset": d_sunsets[i] if i < len(d_sunsets) else None
        })

    return {
        "location": {
            "lat": latitude,
            "lon": longitude
        },
        "provider": "Open-Meteo",
        "source_endpoint": source_endpoint,
        "current": current_normalized,
        "hourly": hourly_items,
        "daily": daily_items
    }


def classify_activity_exposure(category: str, place_name: str) -> str:
    """
    Deterministically classify an activity place into:
    - 'indoor': museums, art galleries, artisan workshops, handicrafts, covered temples, indoor dining
    - 'outdoor': viewpoints, beaches, promenades, gardens, forts, treks, lakes, waterfalls, open monuments
    - 'mixed': markets, bazaar streets, large temple complexes with courtyards
    """
    c = (category or "").lower()
    p = (place_name or "").lower()
    combined = f"{c} {p}"

    # Indoor keywords
    indoor_keywords = [
        "museum", "gallery", "artisan", "workshop", "craft", "handloom", "textile",
        "pottery", "coppersmith", "weaving", "indoor", "mall", "theatre",
        "palace museum", "chhatrapati shivaji maharaj vastu sangrahalaya",
        "raja dinkar kelkar", "aquarium", "restaurant", "dining", "cafe",
        "bhojanalay", "mess", "hotel", "stay", "refresh"
    ]
    if any(k in combined for k in indoor_keywords):
        return "indoor"

    # Outdoor keywords
    outdoor_keywords = [
        "viewpoint", "view point", "garden", "park", "beach", "promenade",
        "marine drive", "chowpatty", "hanging garden", "fort", "trek", "plateau",
        "ghat", "lake", "waterfall", "falls", "hill", "point", "sanctuary",
        "safari", "valley", "dam", "camp", "outdoor", "boating", "shaniwar wada"
    ]
    if any(k in combined for k in outdoor_keywords):
        return "outdoor"

    # Mixed keywords
    mixed_keywords = ["market", "bazaar", "temple", "mandir", "caves", "elephanta", "monument"]
    if any(k in combined for k in mixed_keywords):
        return "mixed"

    return "outdoor"


def compute_weather_suitability(
    exposure: str,
    precipitation_probability: float,
    precipitation_mm: float,
    temperature_c: float,
    wind_speed_kmh: float = 10.0,
    weather_code: int = 0,
    weather_preference: Optional[Dict[str, Any]] = None
) -> Tuple[int, str]:
    """
    Deterministic numerical calculation of weather suitability score (0 to 100).
    NEVER uses LLM for arithmetic.
    
    Returns:
    (score: 0-100, reason: explainable string)
    """
    pref = weather_preference or {}
    avoid_rain = pref.get("avoid_outdoor_rain", True)

    score = 100
    penalties: List[str] = []
    bonuses: List[str] = []

    # Extreme weather: Thunderstorm (95, 96, 99) or violent rain (82, 65)
    is_severe_storm = weather_code in (95, 96, 99)
    is_heavy_rain = precipitation_mm >= 8.0 or weather_code in (65, 82)
    is_moderate_rain = precipitation_mm >= 2.5 or weather_code in (63, 81)
    is_light_rain = precipitation_mm > 0.2 or precipitation_probability >= 50 or weather_code in (51, 53, 55, 61, 80)

    if exposure == "outdoor":
        # 1. Rain and Storm Penalties
        if is_severe_storm:
            score -= 80
            penalties.append("severe thunderstorm hazard")
        elif is_heavy_rain or (precipitation_probability >= 80 and precipitation_mm >= 5.0):
            score -= 70
            penalties.append(f"heavy rainfall ({precipitation_mm:.1f}mm, {precipitation_probability}% prob)")
        elif is_moderate_rain or precipitation_probability >= 65:
            score -= 45
            penalties.append(f"moderate rain ({precipitation_mm:.1f}mm, {precipitation_probability}% prob)")
        elif is_light_rain:
            score -= 20 if avoid_rain else 10
            penalties.append(f"light drizzle / rain chance ({precipitation_probability}%)")

        # 2. Temperature Penalties (Extreme heat / cold)
        if temperature_c >= 40.0:
            score -= 40
            penalties.append(f"scorching heat ({temperature_c:.1f}°C)")
        elif temperature_c >= 35.0:
            score -= 20
            penalties.append(f"high heat ({temperature_c:.1f}°C)")
        elif temperature_c <= 6.0:
            score -= 25
            penalties.append(f"near-freezing temperature ({temperature_c:.1f}°C)")

        # 3. High Wind Penalties
        if wind_speed_kmh >= 45.0:
            score -= 25
            penalties.append(f"high winds ({wind_speed_kmh:.0f} km/h)")
        elif wind_speed_kmh >= 30.0:
            score -= 10
            penalties.append(f"gusty winds ({wind_speed_kmh:.0f} km/h)")

    elif exposure == "indoor":
        # Indoor spaces are sheltered from rain
        if is_heavy_rain or is_severe_storm or precipitation_probability >= 70:
            score = 95
            bonuses.append("rain-safe sheltered indoor haven")
        elif is_moderate_rain or is_light_rain:
            score = 98
            bonuses.append("comfortable indoor cultural experience")
        else:
            score = 95

        # Extreme building discomfort if severe heat without AC
        if temperature_c >= 42.0:
            score -= 15
            penalties.append("extreme heat wave")

    else:  # "mixed"
        if is_severe_storm or is_heavy_rain:
            score -= 50
            penalties.append("outdoor segments impacted by heavy rain")
        elif is_moderate_rain or precipitation_probability >= 65:
            score -= 30
            penalties.append("open courtyards wet from rain")
        elif is_light_rain:
            score -= 10
            penalties.append("minor drizzle on walkways")

        if temperature_c >= 38.0:
            score -= 20
            penalties.append("heat during open strolls")

    final_score = max(0, min(100, score))

    if penalties:
        reason = f"Weather penalty: {', '.join(penalties)}"
    elif bonuses:
        reason = f"Favorable conditions: {', '.join(bonuses)}"
    else:
        reason = "Favorable clear weather"

    return final_score, reason
