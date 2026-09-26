import asyncio
from typing import Optional
import httpx
from app.core.config import settings

_http_client: Optional[httpx.AsyncClient] = None
_client_loop: Optional[asyncio.AbstractEventLoop] = None


def get_http_client() -> httpx.AsyncClient:
    """Return the global shared httpx AsyncClient instance bound to the current running event loop."""
    global _http_client, _client_loop
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if (
        _http_client is None
        or _http_client.is_closed
        or _client_loop is not loop
        or (loop is not None and loop.is_closed())
    ):
        _http_client = httpx.AsyncClient(
            timeout=httpx.Timeout(settings.HTTP_TIMEOUT_SECONDS, connect=10.0),
            headers={"User-Agent": settings.USER_AGENT},
            follow_redirects=True,
        )
        _client_loop = loop
    return _http_client


async def close_http_client():
    """Gracefully close the global httpx AsyncClient."""
    global _http_client, _client_loop
    if _http_client is not None and not _http_client.is_closed:
        await _http_client.aclose()
        _http_client = None
        _client_loop = None

