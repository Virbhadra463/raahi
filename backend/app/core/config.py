from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration settings."""

    # Gemini API
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.8-flash"

    # External APIs
    OVERPASS_URL: str = "https://overpass-api.de/api/interpreter"
    OVERPASS_TIMEOUT: int = 25
    OSRM_URL: str = "http://router.project-osrm.org/route/v1/driving"
    NOMINATIM_URL: str = "https://nominatim.openstreetmap.org/search"
    ACCOMMODATION_API_KEY: Optional[str] = None
    SERPAPI_KEY: Optional[str] = None
    SERPAPI_SEARCH_URL: str = "https://serpapi.com/search"

    # App Environment
    APP_NAME: str = "Maharashtra AI Travel Planner"
    ENVIRONMENT: str = "development"
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # HTTP Client Configuration
    HTTP_TIMEOUT_SECONDS: float = 20.0
    USER_AGENT: str = "MaharashtraTourismBot/2.0 (student.project.sih@gmail.com) httpx/0.27"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
