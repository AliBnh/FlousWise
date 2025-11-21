"""
Configuration Management Module

This module handles all configuration settings for the AI service.
It uses Pydantic Settings to:
1. Load environment variables from .env file
2. Validate configuration values (type checking)
3. Provide defaults for non-sensitive values
4. Ensure required values are present (no defaults for secrets)

Why Pydantic Settings?
- Automatic type validation
- Environment variable loading
- IDE autocomplete support
- Clear error messages if config is wrong
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application Settings Class

    This class defines ALL configuration for the AI service.
    Values are loaded from:
    1. Environment variables (highest priority)
    2. .env file (if exists)
    3. Defaults defined here (lowest priority)

    Naming convention: UPPERCASE_WITH_UNDERSCORES
    This matches environment variable naming convention.
    """

    # ============================================================================
    # SERVICE CONFIGURATION
    # ============================================================================

    SERVICE_NAME: str = "ai-service"
    """Name of this service (used in logs, metrics)"""

    SERVICE_PORT: int = 8000
    """Port number the FastAPI app will listen on"""

    ENVIRONMENT: str = "development"
    """Environment: development, staging, production"""

    # ============================================================================
    # MONGODB CONFIGURATION (Chat History Storage)
    # ============================================================================

    MONGODB_URI: str = "mongodb://admin:password123@mongodb:27017/flouswise?authSource=admin"
    """
    MongoDB connection string
    Format: mongodb://username:password@host:port/database?authSource=admin
    - username/password: Credentials for MongoDB
    - host: MongoDB hostname (mongodb = Docker service name)
    - port: MongoDB port (27017 = default)
    - database: Database name (flouswise)
    - authSource: Authentication database (admin)
    """

    MONGODB_DATABASE: str = "flouswise"
    """Database name where chat messages will be stored"""

    MONGODB_CHAT_COLLECTION: str = "chat_messages"
    """Collection name for storing chat conversations"""

    # ============================================================================
    # REDIS CONFIGURATION (Caching Layer)
    # ============================================================================

    REDIS_HOST: str = "redis"
    """Redis hostname (redis = Docker service name)"""

    REDIS_PORT: int = 6379
    """Redis port (6379 = default)"""

    REDIS_DB: int = 0
    """Redis database number (0-15, using 0 = default)"""

    REDIS_CACHE_TTL: int = 300
    """
    Cache Time-To-Live in seconds
    300 seconds = 5 minutes
    User profiles cached for 5 min to reduce Finance Service calls
    """

    # ============================================================================
    # KAFKA CONFIGURATION (Event Bus)
    # ============================================================================

    KAFKA_BOOTSTRAP_SERVERS: str = "kafka:9092"
    """
    Kafka broker address
    Format: host:port
    Used to publish events when chat messages are sent
    """

    KAFKA_CHAT_TOPIC: str = "chat.message.sent"
    """
    Kafka topic name for chat events
    Published when AI responds to user question
    """

    # ============================================================================
    # OLLAMA LLM CONFIGURATION (Language Model)
    # ============================================================================

    OLLAMA_BASE_URL: str = "http://host.docker.internal:11434"
    """
    Ollama API base URL

    IMPORTANT: host.docker.internal = special DNS name that resolves to host machine
    This allows Docker container to access Ollama running on host

    Why not localhost?
    - localhost inside container = the container itself
    - host.docker.internal = the actual host machine

    Port 11434 = Ollama default port
    """

    OLLAMA_MODEL: str = "mistral"
    """
    LLM model name to use
    Options: mistral, llama2, codellama, etc.
    Must be pulled first: ollama pull mistral
    """

    OLLAMA_TIMEOUT: int = 60
    """
    Request timeout in seconds
    LLM generation takes 1-3 seconds typically
    60s allows for slow responses without timing out
    """

    # ============================================================================
    # CHROMADB CONFIGURATION (Vector Database)
    # ============================================================================

    CHROMA_PERSIST_DIR: str = "./chroma_data"
    """
    ChromaDB storage directory
    Stores vector embeddings of finance book chunks
    Persisted to disk so data survives restarts
    """

    CHROMA_COLLECTION_NAME: str = "finance_books"
    """
    Collection name in ChromaDB
    Like a "table" in traditional databases
    Stores all book chunk embeddings
    """

    # ============================================================================
    # EMBEDDINGS CONFIGURATION (Text → Vectors)
    # ============================================================================

    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    """
    Sentence Transformers model for generating embeddings

    all-MiniLM-L6-v2 specs:
    - Size: 80MB
    - Output: 384 dimensions
    - Speed: ~30ms per query
    - Quality: Good for semantic search
    - Language: English (works ok for French too)

    Alternative models:
    - all-mpnet-base-v2 (better quality, slower)
    - paraphrase-multilingual (multiple languages)
    """

    EMBEDDING_DIMENSION: int = 384
    """
    Embedding vector dimension
    Must match EMBEDDING_MODEL output size
    384 = all-MiniLM-L6-v2 output dimension
    """

    # ============================================================================
    # RAG CONFIGURATION (Retrieval-Augmented Generation)
    # ============================================================================

    RAG_TOP_K: int = 5
    """
    Number of book chunks to retrieve for each query

    How it works:
    1. User asks: "How can I save money?"
    2. Convert question to embedding vector
    3. Find top K most similar book chunks
    4. Include these chunks in LLM prompt

    5 = good balance between context and prompt size
    - Too few (1-2): Not enough context
    - Too many (10+): Prompt too long, slower, confusing
    """

    RAG_CHUNK_SIZE: int = 500
    """
    Book chunk size in words

    Books are split into chunks of this size
    500 words ≈ 2-3 paragraphs

    Why chunk?
    - Embeddings work better on focused content
    - Retrieval is more precise
    - LLM can process relevant sections, not entire books
    """

    RAG_CHUNK_OVERLAP: int = 50
    """
    Overlap between consecutive chunks in words

    Example with chunk_size=500, overlap=50:
    - Chunk 1: words 0-500
    - Chunk 2: words 450-950 (overlaps by 50)
    - Chunk 3: words 900-1400 (overlaps by 50)

    Why overlap?
    - Prevents splitting ideas across chunks
    - Maintains context at chunk boundaries
    """

    # ============================================================================
    # FINANCE SERVICE CONFIGURATION (User Profile Source)
    # ============================================================================

    FINANCE_SERVICE_URL: str = "http://finance-service:8081"
    """
    Finance Service API base URL

    Used to fetch user financial profiles (income, expenses, debts, goals)
    finance-service = Docker service name
    8081 = Finance Service port
    """

    # ============================================================================
    # JWT CONFIGURATION (Authentication)
    # ============================================================================

    JWT_SECRET: str
    """
    JWT signing secret key

    CRITICAL: Must match auth-service JWT_SECRET exactly!

    Why required with no default?
    - Security: Secret keys should never have defaults
    - Forces explicit configuration
    - Pydantic will raise error if not provided

    Set in .env file:
    JWT_SECRET=your-secret-key-here
    """

    JWT_ALGORITHM: str = "HS256"
    """
    JWT signing algorithm
    HS256 = HMAC with SHA-256
    Standard, secure, fast
    """

    # ============================================================================
    # PYDANTIC CONFIGURATION
    # ============================================================================

    class Config:
        """
        Pydantic Settings Configuration

        Tells Pydantic how to load settings
        """

        env_file = ".env"
        """
        Load variables from .env file
        Variables in actual environment override .env file
        """

        case_sensitive = True
        """
        Environment variable names must match exactly
        MONGODB_URI ≠ mongodb_uri ≠ MongoDB_Uri
        """


# ============================================================================
# GLOBAL SETTINGS INSTANCE
# ============================================================================

settings = Settings()
"""
Singleton settings instance

Import this in other modules:
    from app.config import settings

Usage:
    settings.MONGODB_URI
    settings.OLLAMA_MODEL

Why singleton?
- Settings loaded once at startup
- Same instance shared across entire application
- No need to reload environment variables repeatedly
"""


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

if __name__ == "__main__":
    """
    Test configuration loading
    Run: python -m app.config
    """
    print("=== AI Service Configuration ===\n")

    print(f"Service: {settings.SERVICE_NAME}")
    print(f"Port: {settings.SERVICE_PORT}")
    print(f"Environment: {settings.ENVIRONMENT}\n")

    print(f"MongoDB URI: {settings.MONGODB_URI}")
    print(f"Redis Host: {settings.REDIS_HOST}:{settings.REDIS_PORT}")
    print(f"Kafka Servers: {settings.KAFKA_BOOTSTRAP_SERVERS}\n")

    print(f"Ollama URL: {settings.OLLAMA_BASE_URL}")
    print(f"Ollama Model: {settings.OLLAMA_MODEL}")
    print(f"Embedding Model: {settings.EMBEDDING_MODEL}\n")

    print(f"ChromaDB Dir: {settings.CHROMA_PERSIST_DIR}")
    print(f"Finance Service: {settings.FINANCE_SERVICE_URL}")

    print("\n✅ Configuration loaded successfully!")
