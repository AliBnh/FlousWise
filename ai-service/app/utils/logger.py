"""
Logging Configuration Module

This module sets up structured logging for the entire AI service.
Proper logging is CRITICAL for:
1. Debugging issues in production
2. Monitoring service health
3. Tracking performance
4. Auditing user actions
5. Analyzing errors

Logging levels (in order of severity):
- DEBUG: Detailed information for diagnosing problems
- INFO: Confirmation that things are working as expected
- WARNING: Something unexpected happened, but app still works
- ERROR: More serious problem, some functionality failed
- CRITICAL: Very serious error, app may not be able to continue
"""

import logging
import sys
from typing import Optional


def setup_logging(
    level: int = logging.INFO,
    format_string: Optional[str] = None
) -> None:
    """
    Configure application-wide logging

    This function should be called ONCE at application startup (in main.py)

    Args:
        level: Logging level (default: INFO)
               - Use DEBUG for development (more verbose)
               - Use INFO for production (balanced)
               - Use WARNING for production with less noise

        format_string: Custom log format (optional)
                      If None, uses default format

    Example:
        from app.utils.logger import setup_logging
        setup_logging(level=logging.DEBUG)  # Development
        setup_logging(level=logging.INFO)   # Production
    """

    # Default log format if none provided
    if format_string is None:
        format_string = (
            # Timestamp in ISO format
            '%(asctime)s '
            # Logger name (usually module name)
            '- %(name)s '
            # Log level (INFO, ERROR, etc.)
            '- %(levelname)s '
            # The actual log message
            '- %(message)s'
        )
        """
        Example output:
        2024-01-15 10:30:45,123 - app.services.rag_service - INFO - Processing query for user 123

        Breaking it down:
        - 2024-01-15 10:30:45,123 → When it happened (asctime)
        - app.services.rag_service → Which module logged it (name)
        - INFO → Severity level (levelname)
        - Processing query for user 123 → The message (message)
        """

    # Configure the root logger
    # This affects ALL loggers in the application
    logging.basicConfig(
        level=level,
        format=format_string,
        handlers=[
            # StreamHandler = write to console (stdout)
            # stdout = standard output (visible in terminal/Docker logs)
            logging.StreamHandler(sys.stdout)
        ]
    )

    """
    Why StreamHandler to stdout?

    In containerized applications (Docker):
    - stdout is captured by Docker
    - Visible with: docker logs <container_name>
    - Centralized logging systems (ELK, Splunk) collect from stdout
    - No need for separate log files in containers

    In production, you might also add:
    - FileHandler: Write to rotating log files
    - SysLogHandler: Send to system log
    - HTTPHandler: Send to logging service
    """

    # Suppress noisy third-party library logs
    # These libraries log too much DEBUG/INFO that clutters our logs
    logging.getLogger("httpx").setLevel(logging.WARNING)
    """httpx: HTTP client library (used for API calls)"""

    logging.getLogger("chromadb").setLevel(logging.WARNING)
    """ChromaDB: Vector database (logs every query otherwise)"""

    logging.getLogger("sentence_transformers").setLevel(logging.WARNING)
    """Sentence Transformers: Embedding model (logs model loading details)"""

    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    """Uvicorn access logs: HTTP request logs (we log important ones manually)"""

    # Log that logging is configured
    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured with level: {logging.getLevelName(level)}")


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module

    This is a convenience function that wraps logging.getLogger()
    Use this in your modules to create logger instances

    Args:
        name: Logger name (typically __name__ of the module)

    Returns:
        Logger instance configured with application settings

    Usage in other modules:
        from app.utils.logger import get_logger

        logger = get_logger(__name__)
        logger.info("Service started")
        logger.error("Something went wrong", exc_info=True)

    Why pass __name__?
    - __name__ = full module path (e.g., "app.services.rag_service")
    - Helps identify which module logged the message
    - Allows fine-grained log level control per module
    """
    return logging.getLogger(name)


# ============================================================================
# LOGGING BEST PRACTICES
# ============================================================================

"""
BEST PRACTICES FOR LOGGING IN THIS PROJECT:

1. CREATE MODULE-LEVEL LOGGER
   At top of each Python file:

   from app.utils.logger import get_logger
   logger = get_logger(__name__)

2. LOG AT APPROPRIATE LEVELS

   DEBUG - Detailed diagnostic information
   logger.debug(f"Generated embedding with {len(vector)} dimensions")

   INFO - Routine operations
   logger.info(f"Processing chat query for user {user_id}")

   WARNING - Something unexpected but not critical
   logger.warning(f"Cache miss for user {user_id}, fetching from DB")

   ERROR - Operation failed, but service continues
   logger.error(f"Failed to fetch profile for user {user_id}: {e}")

   CRITICAL - Service is broken
   logger.critical("MongoDB connection failed, cannot store chat history")

3. INCLUDE CONTEXT IN MESSAGES
   BAD:  logger.info("Query processed")
   GOOD: logger.info(f"Query processed for user {user_id} in {elapsed}ms")

4. LOG EXCEPTIONS WITH STACK TRACES
   try:
       risky_operation()
   except Exception as e:
       logger.error(f"Operation failed: {e}", exc_info=True)
       # exc_info=True includes full stack trace

5. NEVER LOG SENSITIVE DATA
   NEVER LOG:
   - Passwords
   - JWT tokens (full token)
   - API keys
   - Personal financial details

   OK TO LOG:
   - User IDs (hashed if needed)
   - Request IDs
   - Timestamps
   - Aggregated/anonymized data

6. USE STRUCTURED LOGGING FOR METRICS
   logger.info(f"llm_response_time={elapsed}ms user_id={user_id}")
   This allows parsing logs for metrics

7. LOG AT SERVICE BOUNDARIES
   Always log when:
   - HTTP request received
   - External API called
   - Database query executed
   - Error occurred
   - Operation completed

Example from rag_service.py:

   logger.info(f"RAG query started for user {user_id}")
   logger.debug(f"Retrieved {len(chunks)} book chunks from ChromaDB")
   logger.debug(f"Profile fetch took {profile_time}ms")
   logger.info(f"LLM generation took {llm_time}ms")
   logger.info(f"RAG query completed for user {user_id} in {total_time}ms")
"""


# ============================================================================
# USAGE EXAMPLE
# ============================================================================

if __name__ == "__main__":
    """
    Test logging configuration
    Run: python -m app.utils.logger
    """

    # Setup logging at INFO level
    setup_logging(level=logging.INFO)

    # Get a test logger
    logger = get_logger(__name__)

    # Test different log levels
    logger.debug("This is a DEBUG message (won't show at INFO level)")
    logger.info("This is an INFO message ✅")
    logger.warning("This is a WARNING message ⚠️")
    logger.error("This is an ERROR message ❌")

    # Test with variables
    user_id = "test123"
    elapsed_ms = 1234
    logger.info(f"Processed query for user {user_id} in {elapsed_ms}ms")

    # Test exception logging
    try:
        # Intentionally cause an error
        result = 1 / 0
    except Exception as e:
        logger.error(f"Error occurred: {e}", exc_info=True)

    print("\n✅ Logging test complete!")
