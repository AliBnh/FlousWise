"""
FastAPI Dependencies - Dependency Injection

Provides singleton service instances and authentication utilities.
"""

import jwt
import redis.asyncio as redis
from fastapi import Depends, HTTPException, Header
from typing import Optional

from app.config import settings
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.context_service import ContextService
from app.services.profile_service import ProfileService
from app.services.chat_history_service import ChatHistoryService
from app.services.rag_service import RAGService
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Global service instances (initialized once, reused for all requests)
_embedding_service: Optional[EmbeddingService] = None
_llm_service: Optional[LLMService] = None
_context_service: Optional[ContextService] = None
_redis_client: Optional[redis.Redis] = None
_profile_service: Optional[ProfileService] = None
_chat_history_service: Optional[ChatHistoryService] = None
_rag_service: Optional[RAGService] = None


def get_embedding_service() -> EmbeddingService:
    """Get or create embedding service singleton"""
    global _embedding_service
    if _embedding_service is None:
        logger.info("Initializing EmbeddingService...")
        _embedding_service = EmbeddingService(model_name=settings.EMBEDDING_MODEL)
    return _embedding_service


def get_llm_service() -> LLMService:
    """Get or create LLM service singleton"""
    global _llm_service
    if _llm_service is None:
        logger.info("Initializing LLMService...")
        _llm_service = LLMService(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL,
            timeout=settings.OLLAMA_TIMEOUT
        )
    return _llm_service


def get_context_service() -> ContextService:
    """Get or create context service singleton"""
    global _context_service
    if _context_service is None:
        logger.info("Initializing ContextService...")
        _context_service = ContextService(
            context_file_path=settings.MOROCCAN_CONTEXT_FILE
        )
    return _context_service


async def get_redis_client() -> redis.Redis:
    """Get or create Redis client singleton"""
    global _redis_client
    if _redis_client is None:
        logger.info("Initializing Redis client...")
        _redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis_client


async def get_profile_service() -> ProfileService:
    """Get or create profile service singleton"""
    global _profile_service
    if _profile_service is None:
        logger.info("Initializing ProfileService...")
        redis_client = await get_redis_client()
        _profile_service = ProfileService(
            finance_service_url=settings.FINANCE_SERVICE_URL,
            redis_client=redis_client,
            cache_ttl=settings.PROFILE_CACHE_TTL
        )
    return _profile_service


def get_chat_history_service() -> ChatHistoryService:
    """Get or create chat history service singleton"""
    global _chat_history_service
    if _chat_history_service is None:
        logger.info("Initializing ChatHistoryService...")
        _chat_history_service = ChatHistoryService(
            mongodb_uri=settings.MONGODB_URI,
            database=settings.MONGODB_DATABASE,
            collection="chat_history"
        )
    return _chat_history_service


async def get_rag_service() -> RAGService:
    """Get or create RAG service singleton"""
    global _rag_service
    if _rag_service is None:
        logger.info("Initializing RAGService...")

        # Initialize all required services
        embedding_service = get_embedding_service()
        llm_service = get_llm_service()
        context_service = get_context_service()
        profile_service = await get_profile_service()

        # Initialize RAG service
        _rag_service = RAGService(
            chroma_persist_dir=settings.CHROMA_PERSIST_DIR,
            collection_name=settings.CHROMA_COLLECTION_NAME,
            embedding_service=embedding_service,
            llm_service=llm_service,
            profile_service=profile_service,
            context_service=context_service,
            top_k=settings.RAG_TOP_K
        )

    return _rag_service


async def verify_jwt_token(authorization: Optional[str] = Header(None)) -> str:
    """
    Verify JWT token and extract user ID

    Args:
        authorization: Authorization header (format: "Bearer <token>")

    Returns:
        User ID from token

    Raises:
        HTTPException: If token is missing or invalid
    """
    # Check if authorization header exists
    if not authorization:
        logger.warning("Missing Authorization header")
        raise HTTPException(
            status_code=401,
            detail="Missing authorization header"
        )

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        logger.warning("Invalid authorization header format")
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected: Bearer <token>"
        )

    token = parts[1]

    # Verify and decode JWT
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )

        # Extract user ID from payload
        user_id = payload.get("userId") or payload.get("sub")

        if not user_id:
            logger.warning("Token missing userId/sub claim")
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user ID"
            )

        logger.debug(f"Token verified for user: {user_id}")
        return user_id

    except jwt.ExpiredSignatureError:
        logger.warning("Expired JWT token")
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )

    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


async def get_current_user_id(user_id: str = Depends(verify_jwt_token)) -> str:
    """
    Dependency to get current user ID from JWT token

    Usage in routes:
        @router.post("/chat")
        async def chat(
            user_id: str = Depends(get_current_user_id)
        ):
            # user_id is now available
    """
    return user_id


# Cleanup function for graceful shutdown
async def cleanup_services():
    """Close all service connections on shutdown"""
    global _redis_client, _chat_history_service

    logger.info("Cleaning up services...")

    if _redis_client:
        await _redis_client.close()
        logger.info("Redis connection closed")

    if _chat_history_service:
        await _chat_history_service.close()
        logger.info("MongoDB connection closed")

    logger.info("✅ All services cleaned up")
