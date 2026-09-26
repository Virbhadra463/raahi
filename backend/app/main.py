import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.http_client import get_http_client, close_http_client
from app.api.chat import router as chat_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown events."""
    logger.info("Starting up Maharashtra AI Travel Planner Backend...")
    # Initialize shared HTTP client
    get_http_client()
    yield
    logger.info("Shutting down Maharashtra AI Travel Planner Backend...")
    await close_http_client()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description=(
        "Backend for an AI-powered personalized travel planning platform focused on "
        "Maharashtra, India. Orchestrates Gemini agent, OpenStreetMap Overpass API, "
        "OSRM routing, SerpApi integrations, and deterministic accommodation ranking."
    ),
    lifespan=lifespan
)

# CORS middleware for local frontend and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request

# Include API routes
app.include_router(chat_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    try:
        raw_body = await request.body()
    except Exception:
        raw_body = b""
    logger.warning(f"422 Validation Error on {request.url}: errors={exc.errors()}, raw_body={raw_body.decode('utf-8', errors='ignore')}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "message": "Invalid request body format. Expected JSON: {\"message\": \"your travel prompt here\"}"
        }
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "database": "none (in-memory dynamic processing)"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
