"""
Custom Exception Classes

This module defines custom exceptions for the AI service.

Why custom exceptions?
1. Better error messages (user-friendly, specific)
2. Easier to catch and handle specific errors
3. Consistent error handling across service
4. Better logging (know exact error type)
5. Easier testing (mock specific exceptions)

Exception Hierarchy:
    Exception (Python built-in)
        └── AIServiceException (our base)
            ├── ProfileException
            │   ├── ProfileNotFoundException
            │   └── ProfileFetchException
            ├── LLMException
            │   ├── LLMServiceException
            │   └── LLMTimeoutException
            ├── EmbeddingException
            └── AuthenticationException
                └── InvalidTokenException
"""


# ============================================================================
# BASE EXCEPTION
# ============================================================================

class AIServiceException(Exception):
    """
    Base exception for all AI service errors

    All custom exceptions inherit from this.
    Allows catching all AI service errors with one except block:

    try:
        rag_service.query(...)
    except AIServiceException as e:
        # Catches ANY AI service error
        logger.error(f"AI service error: {e}")
    """

    def __init__(self, message: str, details: dict = None):
        """
        Initialize base exception

        Args:
            message: Human-readable error message
            details: Additional context (dict with error details)
        """
        self.message = message
        self.details = details or {}
        super().__init__(self.message)

    def __str__(self):
        """String representation of the error"""
        if self.details:
            return f"{self.message} | Details: {self.details}"
        return self.message


# ============================================================================
# PROFILE-RELATED EXCEPTIONS
# ============================================================================

class ProfileException(AIServiceException):
    """Base exception for profile-related errors"""
    pass


class ProfileNotFoundException(ProfileException):
    """
    Raised when user profile doesn't exist

    When this happens:
    - User hasn't completed onboarding yet
    - User ID is invalid
    - Profile was deleted

    How to handle:
    - Return 404 error to user
    - Suggest completing onboarding
    """

    def __init__(self, user_id: str):
        message = f"Profile not found for user: {user_id}"
        details = {
            "user_id": user_id,
            "error_type": "profile_not_found",
            "suggestion": "User must complete onboarding first"
        }
        super().__init__(message, details)
        self.user_id = user_id


class ProfileFetchException(ProfileException):
    """
    Raised when fetching profile fails

    When this happens:
    - Finance Service is down
    - Network error
    - Timeout
    - Invalid response

    How to handle:
    - Retry with exponential backoff
    - Return 503 (Service Unavailable)
    - Alert ops team
    """

    def __init__(self, user_id: str, reason: str):
        message = f"Failed to fetch profile for user {user_id}: {reason}"
        details = {
            "user_id": user_id,
            "reason": reason,
            "error_type": "profile_fetch_failed"
        }
        super().__init__(message, details)
        self.user_id = user_id
        self.reason = reason


# ============================================================================
# LLM-RELATED EXCEPTIONS
# ============================================================================

class LLMException(AIServiceException):
    """Base exception for LLM-related errors"""
    pass


class LLMServiceException(LLMException):
    """
    Raised when LLM service fails

    When this happens:
    - Ollama is not running
    - Ollama model not pulled
    - Invalid response from Ollama
    - Ollama crashed

    How to handle:
    - Check if Ollama is running
    - Return 503 (Service Unavailable)
    - Suggest fallback response
    """

    def __init__(self, reason: str):
        message = f"LLM service error: {reason}"
        details = {
            "reason": reason,
            "error_type": "llm_service_failed",
            "suggestion": "Check if Ollama is running: ollama serve"
        }
        super().__init__(message, details)
        self.reason = reason


class LLMTimeoutException(LLMException):
    """
    Raised when LLM request times out

    When this happens:
    - LLM generation taking too long (>60s)
    - Ollama is overloaded
    - Prompt is too long

    How to handle:
    - Reduce prompt size
    - Increase timeout setting
    - Return 504 (Gateway Timeout)
    """

    def __init__(self, timeout_seconds: int):
        message = f"LLM request timed out after {timeout_seconds} seconds"
        details = {
            "timeout_seconds": timeout_seconds,
            "error_type": "llm_timeout",
            "suggestion": "Reduce prompt size or increase timeout"
        }
        super().__init__(message, details)
        self.timeout_seconds = timeout_seconds


# ============================================================================
# EMBEDDING-RELATED EXCEPTIONS
# ============================================================================

class EmbeddingException(AIServiceException):
    """
    Raised when embedding generation fails

    When this happens:
    - Sentence Transformers model not loaded
    - Input text is empty or invalid
    - Model file corrupted

    How to handle:
    - Validate input text
    - Reload model
    - Return 500 (Internal Server Error)
    """

    def __init__(self, reason: str):
        message = f"Embedding generation failed: {reason}"
        details = {
            "reason": reason,
            "error_type": "embedding_failed"
        }
        super().__init__(message, details)
        self.reason = reason


# ============================================================================
# VECTOR DATABASE EXCEPTIONS
# ============================================================================

class VectorDBException(AIServiceException):
    """Base exception for ChromaDB errors"""
    pass


class CollectionNotFoundException(VectorDBException):
    """
    Raised when ChromaDB collection doesn't exist

    When this happens:
    - Book ingestion script not run yet
    - ChromaDB data directory deleted
    - Wrong collection name

    How to handle:
    - Run: python scripts/ingest_books.py
    - Check CHROMA_COLLECTION_NAME in config
    - Return 503 (Service Unavailable)
    """

    def __init__(self, collection_name: str):
        message = f"ChromaDB collection not found: {collection_name}"
        details = {
            "collection_name": collection_name,
            "error_type": "collection_not_found",
            "suggestion": "Run book ingestion script: python scripts/ingest_books.py"
        }
        super().__init__(message, details)
        self.collection_name = collection_name


class VectorSearchException(VectorDBException):
    """
    Raised when vector similarity search fails

    When this happens:
    - ChromaDB crashed
    - Invalid query embedding
    - Collection is empty (no books ingested)

    How to handle:
    - Check if books are ingested
    - Validate embedding dimensions
    - Return 500
    """

    def __init__(self, reason: str):
        message = f"Vector search failed: {reason}"
        details = {
            "reason": reason,
            "error_type": "vector_search_failed"
        }
        super().__init__(message, details)
        self.reason = reason


# ============================================================================
# AUTHENTICATION EXCEPTIONS
# ============================================================================

class AuthenticationException(AIServiceException):
    """Base exception for authentication errors"""
    pass


class InvalidTokenException(AuthenticationException):
    """
    Raised when JWT token is invalid

    When this happens:
    - Token expired
    - Token signature invalid (wrong JWT_SECRET)
    - Token format is wrong
    - Token was tampered with

    How to handle:
    - Return 401 (Unauthorized)
    - Ask user to login again
    """

    def __init__(self, reason: str):
        message = f"Invalid JWT token: {reason}"
        details = {
            "reason": reason,
            "error_type": "invalid_token",
            "suggestion": "Please login again"
        }
        super().__init__(message, details)
        self.reason = reason


class MissingTokenException(AuthenticationException):
    """
    Raised when JWT token is missing from request

    When this happens:
    - User didn't include Authorization header
    - Frontend forgot to send token

    How to handle:
    - Return 401 (Unauthorized)
    - Check frontend auth implementation
    """

    def __init__(self):
        message = "Authorization header missing or invalid"
        details = {
            "error_type": "missing_token",
            "suggestion": "Include Authorization: Bearer <token> header"
        }
        super().__init__(message, details)


# ============================================================================
# CHAT HISTORY EXCEPTIONS
# ============================================================================

class ChatHistoryException(AIServiceException):
    """Base exception for chat history errors"""
    pass


class ChatHistorySaveException(ChatHistoryException):
    """
    Raised when saving chat message fails

    When this happens:
    - MongoDB is down
    - Database is full
    - Invalid message format

    How to handle:
    - Retry saving
    - Log error but don't fail chat request
    - Return chat response even if save fails
    """

    def __init__(self, reason: str):
        message = f"Failed to save chat history: {reason}"
        details = {
            "reason": reason,
            "error_type": "chat_history_save_failed"
        }
        super().__init__(message, details)
        self.reason = reason


# ============================================================================
# RATE LIMITING EXCEPTIONS
# ============================================================================

class RateLimitException(AIServiceException):
    """
    Raised when user exceeds rate limit

    When this happens:
    - User sending too many requests
    - Potential abuse
    - DDoS attack

    How to handle:
    - Return 429 (Too Many Requests)
    - Include Retry-After header
    """

    def __init__(self, user_id: str, retry_after_seconds: int):
        message = f"Rate limit exceeded for user {user_id}"
        details = {
            "user_id": user_id,
            "retry_after_seconds": retry_after_seconds,
            "error_type": "rate_limit_exceeded"
        }
        super().__init__(message, details)
        self.user_id = user_id
        self.retry_after_seconds = retry_after_seconds


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
HOW TO USE THESE EXCEPTIONS:

1. RAISING EXCEPTIONS
   In your service code:

   if not user_profile:
       raise ProfileNotFoundException(user_id)

   try:
       response = await ollama_client.generate()
   except TimeoutError:
       raise LLMTimeoutException(timeout_seconds=60)

2. CATCHING EXCEPTIONS
   In your API routes:

   try:
       result = await rag_service.query(user_id, question)
   except ProfileNotFoundException as e:
       # Return 404
       raise HTTPException(status_code=404, detail=e.message)
   except LLMServiceException as e:
       # Return 503
       raise HTTPException(status_code=503, detail=e.message)
   except AIServiceException as e:
       # Catch all other AI service errors
       logger.error(f"AI service error: {e}", exc_info=True)
       raise HTTPException(status_code=500, detail="Internal server error")

3. LOGGING EXCEPTIONS
   Always log exceptions with context:

   except ProfileFetchException as e:
       logger.error(
           f"Profile fetch failed for user {e.user_id}: {e.reason}",
           exc_info=True
       )
       # Then re-raise or convert to HTTPException

4. CUSTOM EXCEPTION WITH EXTRA DATA
   Create new exceptions when needed:

   class BookIngestionException(AIServiceException):
       def __init__(self, book_name: str, reason: str):
           message = f"Failed to ingest book {book_name}: {reason}"
           details = {"book_name": book_name, "reason": reason}
           super().__init__(message, details)
"""


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    """
    Test exception classes
    Run: python -m app.utils.exceptions
    """

    print("=== Testing Custom Exceptions ===\n")

    # Test ProfileNotFoundException
    try:
        raise ProfileNotFoundException(user_id="test123")
    except ProfileNotFoundException as e:
        print(f"✅ ProfileNotFoundException: {e}")
        print(f"   Details: {e.details}\n")

    # Test LLMServiceException
    try:
        raise LLMServiceException(reason="Ollama not running")
    except LLMServiceException as e:
        print(f"✅ LLMServiceException: {e}")
        print(f"   Details: {e.details}\n")

    # Test InvalidTokenException
    try:
        raise InvalidTokenException(reason="Token expired")
    except InvalidTokenException as e:
        print(f"✅ InvalidTokenException: {e}")
        print(f"   Details: {e.details}\n")

    # Test catching base exception
    try:
        raise ProfileFetchException(user_id="test123", reason="Service down")
    except AIServiceException as e:
        print(f"✅ Caught as AIServiceException: {e}")
        print(f"   Details: {e.details}\n")

    print("✅ All exception tests passed!")
