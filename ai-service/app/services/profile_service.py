"""
Profile Service - Fetch User Financial Profiles

Fetches user profiles from Finance Service with Redis caching.
Reduces load on Finance Service by caching profiles for 5 minutes.
"""

import httpx
import redis.asyncio as redis
import json
from typing import Dict, Any

from app.utils.logger import get_logger
from app.utils.exceptions import ProfileNotFoundException, ProfileFetchException

logger = get_logger(__name__)


class ProfileService:
    """
    Service for fetching user financial profiles from Finance Service

    Features:
    - HTTP client to Finance Service
    - Redis caching (5min TTL) for performance
    - JWT authentication
    - Error handling
    """

    def __init__(
        self,
        finance_service_url: str,
        redis_client: redis.Redis,
        cache_ttl: int = 300
    ):
        """
        Initialize profile service

        Args:
            finance_service_url: Finance Service base URL
            redis_client: Async Redis client
            cache_ttl: Cache time-to-live in seconds (default: 300 = 5min)
        """
        self.finance_service_url = finance_service_url.rstrip('/')
        self.redis = redis_client
        self.cache_ttl = cache_ttl
        logger.info(f"ProfileService initialized: {finance_service_url}")

    async def get_user_profile(self, user_id: str, jwt_token: str) -> Dict[str, Any]:
        """
        Get user financial profile (with caching)

        Flow:
        1. Check Redis cache
        2. If hit: return cached profile
        3. If miss: fetch from Finance Service
        4. Cache the result
        5. Return profile

        Args:
            user_id: User ID
            jwt_token: JWT token for authentication

        Returns:
            User profile dictionary

        Raises:
            ProfileNotFoundException: If profile doesn't exist
            ProfileFetchException: If fetch fails
        """
        cache_key = f"user:profile:{user_id}"

        # Try cache first
        try:
            cached = await self.redis.get(cache_key)
            if cached:
                logger.info(f"Profile cache HIT for user: {user_id}")
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Redis cache error (continuing without cache): {e}")

        # Cache miss - fetch from Finance Service
        logger.info(f"Profile cache MISS for user: {user_id}, fetching from Finance Service")

        url = f"{self.finance_service_url}/api/profile"
        headers = {"Authorization": f"Bearer {jwt_token}"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers)

                if response.status_code == 404:
                    logger.warning(f"Profile not found for user: {user_id}")
                    raise ProfileNotFoundException(user_id)

                response.raise_for_status()
                profile = response.json()

                # Cache the profile
                try:
                    await self.redis.setex(
                        cache_key,
                        self.cache_ttl,
                        json.dumps(profile)
                    )
                    logger.debug(f"Cached profile for user: {user_id}")
                except Exception as e:
                    logger.warning(f"Failed to cache profile: {e}")

                return profile

        except ProfileNotFoundException:
            raise  # Re-raise without wrapping

        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching profile for user {user_id}: {e}")
            raise ProfileFetchException(user_id, f"HTTP error: {str(e)}")

        except Exception as e:
            logger.error(f"Unexpected error fetching profile for user {user_id}: {e}")
            raise ProfileFetchException(user_id, f"Unexpected error: {str(e)}")

    async def invalidate_cache(self, user_id: str):
        """
        Invalidate cached profile for a user

        Call this when profile is updated (via Kafka event)
        """
        cache_key = f"user:profile:{user_id}"
        try:
            await self.redis.delete(cache_key)
            logger.info(f"Invalidated cache for user: {user_id}")
        except Exception as e:
            logger.warning(f"Failed to invalidate cache: {e}")


if __name__ == "__main__":
    """Test profile service"""
    import asyncio

    async def test():
        redis_client = redis.from_url("redis://localhost:6379")
        service = ProfileService("http://localhost:8081", redis_client)

        # Test with dummy token (will fail without real token)
        try:
            profile = await service.get_user_profile("test123", "dummy_token")
            print(f"Profile: {profile}")
        except Exception as e:
            print(f"Expected error: {e}")

    asyncio.run(test())
