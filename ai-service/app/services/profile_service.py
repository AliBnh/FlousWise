# Profile Service
#
# PURPOSE:
# - Fetch user financial profile from Finance Service
# - Cache profiles in Redis to reduce latency (5 min TTL)
# - Pass JWT token for authentication
#
# IMPLEMENTATION STEPS:
# 1. Import httpx, redis.asyncio, json, logging
# 2. Create ProfileService class
# 3. In __init__(finance_service_url, redis_client, cache_ttl=300):
#    - Store finance_service_url (e.g., "http://finance-service:8081")
#    - Store redis_client (async Redis connection)
#    - Store cache_ttl (default 300 seconds = 5 minutes)
# 4. Create async get_user_profile(user_id: str, jwt_token: str) -> Dict:
#    - Build cache key: f"user:profile:{user_id}"
#    - Try to get from Redis: await self.redis.get(cache_key)
#    - If cache HIT: parse JSON and return
#    - If cache MISS:
#      a. Call Finance Service: GET {finance_service_url}/api/profile
#      b. Add header: Authorization: Bearer {jwt_token}
#      c. Use httpx.AsyncClient with timeout=10
#      d. Parse response JSON
#      e. Save to Redis: await self.redis.setex(cache_key, ttl, json.dumps(profile))
#      f. Return profile
#    - Handle HTTPError exceptions
#
# KEY NOTES:
# - Finance Service requires JWT for authentication
# - Redis caching reduces load on Finance Service (70%+ cache hits)
# - Cache is invalidated when profile is updated (Finance Service publishes Kafka event)
# - Profile contains: income, expenses, debts, goals, skills, etc.
#
# EXAMPLE PROFILE STRUCTURE:
# {
#   "userId": "123",
#   "income": {"totalMonthlyIncome": 9000, ...},
#   "fixedExpenses": {"totalFixedExpenses": 4500, ...},
#   "debts": [{...}],
#   "goals": [{...}]
# }
