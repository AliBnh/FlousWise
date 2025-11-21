"""
Health Check Routes

Simple health check endpoint for Docker and Kubernetes health probes.
"""

from fastapi import APIRouter, Depends
from datetime import datetime
from typing import Dict, Any

from app.config import settings
from app.utils.dependencies import get_rag_service
from app.services.rag_service import RAGService
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint

    Returns service status and timestamp.
    Used by Docker HEALTHCHECK and load balancers.

    Returns:
        {
            "status": "healthy",
            "service": "ai-service",
            "timestamp": "2024-01-15T10:30:00Z"
        }
    """
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/health/detailed")
async def detailed_health_check(
    rag_service: RAGService = Depends(get_rag_service)
) -> Dict[str, Any]:
    """
    Detailed health check with service stats

    Returns status of all critical components:
    - Vector database (ChromaDB)
    - Embedding model
    - LLM service
    - Context data

    Returns:
        {
            "status": "healthy",
            "service": "ai-service",
            "timestamp": "...",
            "components": {
                "chromadb": {"status": "healthy", "documents": 1000},
                "embedding_model": {"status": "healthy", "dimension": 384},
                "llm_service": {"status": "healthy"},
                "context_data": {"status": "healthy"}
            }
        }
    """
    components = {}

    # Check ChromaDB
    try:
        stats = rag_service.get_collection_stats()
        components["chromadb"] = {
            "status": stats.get("status", "unknown"),
            "documents": stats.get("document_count", 0),
            "collection": stats.get("collection_name")
        }
    except Exception as e:
        logger.error(f"ChromaDB health check failed: {e}")
        components["chromadb"] = {"status": "error", "error": str(e)}

    # Check Embedding Service
    try:
        embedding_service = rag_service.embedding_service
        model_info = embedding_service.get_model_info()
        components["embedding_model"] = {
            "status": "healthy",
            "model": model_info["model_name"],
            "dimension": model_info["dimension"]
        }
    except Exception as e:
        logger.error(f"Embedding service health check failed: {e}")
        components["embedding_model"] = {"status": "error", "error": str(e)}

    # Check LLM Service
    try:
        components["llm_service"] = {
            "status": "healthy",
            "model": rag_service.llm_service.model,
            "endpoint": rag_service.llm_service.base_url
        }
    except Exception as e:
        logger.error(f"LLM service health check failed: {e}")
        components["llm_service"] = {"status": "error", "error": str(e)}

    # Check Context Service
    try:
        context = rag_service.context_service.get_context()
        components["context_data"] = {
            "status": "healthy" if context else "empty",
            "keys": list(context.keys()) if context else []
        }
    except Exception as e:
        logger.error(f"Context service health check failed: {e}")
        components["context_data"] = {"status": "error", "error": str(e)}

    # Overall status (healthy if all components are healthy)
    all_healthy = all(
        comp.get("status") == "healthy"
        for comp in components.values()
    )

    return {
        "status": "healthy" if all_healthy else "degraded",
        "service": settings.SERVICE_NAME,
        "timestamp": datetime.utcnow().isoformat(),
        "components": components
    }
