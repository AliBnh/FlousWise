# FlousWise AI Service

RAG-powered financial advisor service using FastAPI, ChromaDB, and Ollama.

## Architecture

```
User Question → Embedding → ChromaDB Retrieval → User Profile → LLM → Personalized Advice
                               (Book Knowledge)    (Finance Service)  (Mistral 7B)
```

## Features

- **RAG Pipeline**: Retrieves relevant wisdom from finance books
- **Context-Aware**: Accesses user's complete financial profile
- **Moroccan-Specific**: Includes local economic data and programs
- **Caching**: Redis caching for fast responses
- **Chat History**: MongoDB storage for conversations
- **Streaming**: Optional token-by-token streaming

## Prerequisites

1. **Ollama** running on host machine
   ```bash
   curl https://ollama.ai/install.sh | sh
   ollama pull mistral
   ```

2. **Docker** installed

3. **Python 3.11+** (for local development)

## Quick Start

### 1. Install Dependencies (Local Development)

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Create .env File

```bash
cp .env.example .env
# Edit .env and set JWT_SECRET
```

### 3. Add Finance Books

Add text files to `data/books/`:
- `rich_dad_poor_dad.txt`
- `total_money_makeover.txt`
- `psychology_of_money.txt`
- ... (see data/books/README.md)

### 4. Ingest Books (Run Once)

```bash
python scripts/ingest_books.py
```

This creates the ChromaDB vector database.

### 5. Run Service

**Option A: Local Development**
```bash
uvicorn app.main:app --reload --port 8000
```

**Option B: Docker**
```bash
docker-compose up ai-service
```

### 6. Test

```bash
# Health check
curl http://localhost:8000/health

# Chat (requires JWT token)
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"question":"How can I save money?"}'
```

## Project Structure

```
ai-service/
├── app/
│   ├── api/                    # FastAPI routes
│   │   ├── chat_routes.py      # Chat endpoints
│   │   └── health_routes.py    # Health check
│   ├── services/               # Core services
│   │   ├── rag_service.py      # Main RAG orchestration
│   │   ├── llm_service.py      # Ollama client
│   │   ├── embedding_service.py # Sentence Transformers
│   │   ├── profile_service.py  # Finance Service client
│   │   ├── context_service.py  # Moroccan context
│   │   └── chat_history_service.py # MongoDB chat storage
│   ├── models/                 # Pydantic models
│   ├── utils/                  # Utilities
│   ├── config.py               # Configuration
│   └── main.py                 # FastAPI app
├── data/
│   ├── books/                  # Finance book texts
│   └── moroccan_context.json   # Economic data
├── chroma_data/                # Vector database (created by ingest script)
├── scripts/
│   └── ingest_books.py         # Populate ChromaDB
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Key Technologies

- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for similarity search
- **Sentence Transformers**: Generate embeddings (all-MiniLM-L6-v2)
- **Ollama + Mistral 7B**: Local LLM for generation
- **MongoDB**: Chat history storage
- **Redis**: Profile caching
- **httpx**: Async HTTP client

## API Endpoints

### POST /api/chat
Main chat endpoint.

**Request:**
```json
{
  "question": "How can I save 3000 MAD per month?",
  "conversationId": "optional-uuid"
}
```

**Response:**
```json
{
  "answer": "Based on your 9,000 MAD salary...",
  "conversationId": "uuid"
}
```

### GET /api/chat/history/{conversationId}
Get conversation history.

**Response:**
```json
{
  "messages": [
    {
      "role": "user",
      "message": "How can I save money?",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "role": "assistant",
      "message": "Here are personalized strategies...",
      "timestamp": "2024-01-15T10:30:02Z"
    }
  ]
}
```

### GET /health
Health check.

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-service",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `JWT_SECRET`: Must match auth-service (required)
- `OLLAMA_BASE_URL`: Ollama API endpoint
- `MONGODB_URI`: MongoDB connection string
- `REDIS_HOST`: Redis host
- `FINANCE_SERVICE_URL`: Finance service endpoint

## How RAG Works

1. **User asks question**: "How can I save 3000 MAD per month?"
2. **Generate embedding**: Convert question to 384-dimensional vector
3. **Retrieve from ChromaDB**: Find top 5 most similar book chunks
4. **Fetch user profile**: Get complete financial data from Finance Service
5. **Load Moroccan context**: Get local economic data
6. **Construct prompt**: Combine everything into structured prompt
7. **Call LLM**: Send to Ollama (Mistral 7B)
8. **Return response**: Personalized financial advice
9. **Save history**: Store conversation in MongoDB

## Performance

- Embedding generation: ~30ms
- ChromaDB retrieval: ~50ms
- Profile fetch: ~20ms (cached), ~100ms (uncached)
- LLM inference: ~1500ms
- **Total**: ~1.7 seconds per query

## Troubleshooting

**Problem**: "Connection refused to Ollama"
- **Solution**: Make sure Ollama is running on host: `ollama serve`

**Problem**: "ChromaDB collection empty"
- **Solution**: Run ingestion script: `python scripts/ingest_books.py`

**Problem**: "Profile not found"
- **Solution**: User must complete onboarding first (Finance Service)

**Problem**: "Invalid JWT token"
- **Solution**: Check JWT_SECRET matches auth-service

## Development Workflow

1. Make changes to code
2. Test locally: `uvicorn app.main:app --reload`
3. Run tests (TODO: add pytest tests)
4. Build Docker image: `docker build -t ai-service .`
5. Test in docker-compose: `docker-compose up ai-service`

## Next Steps

- [ ] Add comprehensive unit tests
- [ ] Implement streaming responses for real-time chat
- [ ] Add conversation summarization
- [ ] Implement feedback loop (thumbs up/down)
- [ ] Add Prometheus metrics
- [ ] Optimize prompt engineering
- [ ] Add more finance books (target: 20+)
- [ ] Implement caching for LLM responses
- [ ] Add rate limiting per user
- [ ] Support multiple languages (Arabic, French)

## License

Part of FlousWise platform.
