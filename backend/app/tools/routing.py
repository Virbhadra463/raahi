import logging
import math
from typing import Dict, Any, Tuple
import httpx
from app.core.config import settings
from app.core.http_client import get_http_client
from app.tools.osm import haversine_distance

logger = logging.getLogger(__name__)


async def get_route(
    origin_lat: float,
    origin_lon: float,
    dest_lat: float,
    dest_lon: float,
    mode: str = "driving"
) -> Dict[str, Any]:
    """
    Get realistic road distance (km) and travel duration (minutes) between coordinates.
    Uses OSRM public API with automatic fallback to road-factored calculation.
    """
    # Quick short-circuit if points are identical or virtually identical
    if abs(origin_lat - dest_lat) < 0.0001 and abs(origin_lon - dest_lon) < 0.0001:
        return {
            "distance_km": 0.1,
            "duration_minutes": 5,
            "source": "Local walk / adjacent"
        }

    client = get_http_client()
    # OSRM coordinates order: lon,lat;lon,lat
    coords = f"{origin_lon},{origin_lat};{dest_lon},{dest_lat}"
    url = f"{settings.OSRM_URL}/{coords}?overview=false"

    try:
        response = await client.get(url, timeout=6.0)
        if response.status_code == 200:
            data = response.json()
            if data.get("code") == "Ok" and data.get("routes"):
                route = data["routes"][0]
                distance_meters = route.get("distance", 0.0)
                duration_seconds = route.get("duration", 0.0)

                distance_km = round(distance_meters / 1000.0, 2)
                # Traffic buffer + minimum transit buffer
                duration_minutes = max(5, int(round((duration_seconds / 60.0) * 1.15)))

                return {
                    "distance_km": distance_km,
                    "duration_minutes": duration_minutes,
                    "source": "OSRM"
                }
    except Exception as e:
        logger.info(f"OSRM routing request failed ({e}), using road-factor estimation.")

    # Fallback: Great circle distance * 1.35 road tortuosity factor
    straight_dist = haversine_distance(origin_lat, origin_lon, dest_lat, dest_lon)
    road_dist = round(max(0.5, straight_dist * 1.35), 2)

    # Average city/semi-urban speed in Maharashtra ~ 28 km/h + 5 min base
    duration_min = max(5, int(round((road_dist / 28.0) * 60 + 5)))

    return {
        "distance_km": road_dist,
        "duration_minutes": duration_min,
        "source": "Estimated Road Factor (1.35x)"
    }
