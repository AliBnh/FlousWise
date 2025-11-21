"""
FastAPI Application - AI Service Entry Point

Main application file that initializes FastAPI and registers all routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.utils.logger import setup_logging, get_logger
from app.utils.dependencies import cleanup_services
from app.api import health_routes, chat_routes

# Setup logging first
setup_logging(level=settings.LOG_LEVEL)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup/shutdown events

    Startup:
    - Log service initialization
    - Services are lazily initialized on first request

    Shutdown:
    - Close all service connections
    - Clean up resources
    """
    # Startup
    logger.info("=" * 60)
    logger.info(f"🚀 Starting {settings.SERVICE_NAME}")
    logger.info(f"   Environment: {settings.ENVIRONMENT}")
    logger.info(f"   Version: 1.0.0")
    logger.info(f"   Ollama URL: {settings.OLLAMA_BASE_URL}")
    logger.info(f"   MongoDB: {settings.MONGODB_URI.split('@')[1] if '@' in settings.MONGODB_URI else 'configured'}")
    logger.info(f"   Redis: {settings.REDIS_URL}")
    logger.info(f"   ChromaDB: {settings.CHROMA_PERSIST_DIR}")
    logger.info("=" * 60)

    yield  # Application runs here

    # Shutdown
    logger.info("Shutting down AI service...")
    await cleanup_services()
    logger.info("✅ AI service shut down successfully")


# Create FastAPI application
app = FastAPI(
    title="FlousWise AI Service",
    description=(
        "AI-powered financial advisor for Moroccans. "
        "Provides personalized financial advice using RAG "
        "(Retrieval-Augmented Generation) with local economic context."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc UI
)

# CORS Configuration
# Allow requests from frontend and other services
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React frontend (development)
        "http://localhost:8080",  # Gateway
        settings.FRONTEND_URL,    # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register route modules
app.include_router(health_routes.router)  # Health check endpoints
app.include_router(chat_routes.router)    # Chat endpoints


@app.get("/")
async def root():
    """
    Root endpoint

    Returns basic service information.
    """
    return {
        "service": settings.SERVICE_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }


# Exception handlers
from fastapi import Request
from fastapi.responses import JSONResponse
from app.utils.exceptions import (
    AIServiceException,
    ProfileNotFoundException,
    RAGException,
    LLMServiceException
)


@app.exception_handler(ProfileNotFoundException)
async def profile_not_found_handler(request: Request, exc: ProfileNotFoundException):
    """Handle profile not found errors"""
    logger.warning(f"Profile not found: {exc}")
    return JSONResponse(
        status_code=404,
        content={
            "error": "profile_not_found",
            "message": str(exc),
            "details": exc.details
        }
    )


@app.exception_handler(RAGException)
async def rag_exception_handler(request: Request, exc: RAGException):
    """Handle RAG pipeline errors"""
    logger.error(f"RAG error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "rag_error",
            "message": "Failed to generate response",
            "details": str(exc)
        }
    )


@app.exception_handler(LLMServiceException)
async def llm_exception_handler(request: Request, exc: LLMServiceException):
    """Handle LLM service errors"""
    logger.error(f"LLM error: {exc}")
    return JSONResponse(
        status_code=503,
        content={
            "error": "llm_service_unavailable",
            "message": "AI service is temporarily unavailable",
            "details": str(exc)
        }
    )


@app.exception_handler(AIServiceException)
async def ai_service_exception_handler(request: Request, exc: AIServiceException):
    """Handle general AI service errors"""
    logger.error(f"AI service error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "ai_service_error",
            "message": str(exc),
            "details": exc.details
        }
    )


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn

    logger.info("Starting AI service with uvicorn...")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
        log_level=settings.LOG_LEVEL.lower()
    )
