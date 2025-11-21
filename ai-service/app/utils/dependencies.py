# FastAPI Dependencies
#
# PURPOSE:
# - Provide dependency injection for services
# - Initialize services once and reuse across requests
# - Verify JWT tokens
#
# IMPLEMENTATION STEPS:
# 1. Import all service classes
# 2. Import redis.asyncio, jwt
# 3. Create global service instances (initialize once)
# 4. Create dependency functions:
#    - get_rag_service() -> RAGService
#    - get_chat_history_service() -> ChatHistoryService
#    - get_redis_client() -> redis.Redis
# 5. Create verify_jwt(token: str) -> str:
#    - Decode JWT using settings.JWT_SECRET
#    - Extract user_id from payload
#    - Handle InvalidTokenException
#    - Return user_id
#
# EXAMPLE:
# from fastapi import Depends, HTTPException
# import jwt
# from app.config import settings
# from app.services.rag_service import RAGService
#
# # Initialize services once (singleton pattern)
# _rag_service = None
#
# def get_rag_service() -> RAGService:
#     global _rag_service
#     if _rag_service is None:
#         _rag_service = RAGService(...)
#     return _rag_service
#
# async def verify_jwt(token: str) -> str:
#     try:
#         payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
#         return payload.get("userId")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")
#
# USAGE IN ROUTES:
# @router.post("/chat")
# async def chat(
#     request: ChatRequest,
#     rag_service: RAGService = Depends(get_rag_service)
# ):
#     ...
