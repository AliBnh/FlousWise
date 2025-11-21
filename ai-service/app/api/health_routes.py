# Health Check Routes
#
# PURPOSE:
# - Provide /health endpoint for Docker health checks
# - Return service status and timestamp
#
# IMPLEMENTATION STEPS:
# 1. Import APIRouter from fastapi
# 2. Create router: router = APIRouter(tags=["Health"])
# 3. Define GET /health endpoint
# 4. Return JSON with status, service name, timestamp
#
# EXAMPLE:
# from fastapi import APIRouter
# from datetime import datetime
#
# router = APIRouter(tags=["Health"])
#
# @router.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "service": "ai-service",
#         "timestamp": datetime.utcnow().isoformat()
#     }
