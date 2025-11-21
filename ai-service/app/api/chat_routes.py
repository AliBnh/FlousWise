# Chat API Routes
#
# PURPOSE:
# - Handle POST /api/chat requests (main chat endpoint)
# - Handle GET /api/chat/history/{conversationId} (conversation history)
# - Verify JWT tokens, extract user_id
# - Call RAG service to generate responses
# - Save messages to MongoDB
#
# IMPLEMENTATION STEPS:
# 1. Import APIRouter, Depends, HTTPException, Header
# 2. Import Pydantic models from ../models/chat_models.py
# 3. Create router: router = APIRouter(prefix="/api/chat", tags=["Chat"])
# 4. Define ChatRequest model: question, conversationId (optional)
# 5. Define ChatResponse model: answer, conversationId
# 6. Create POST /api/chat endpoint:
#    - Get Authorization header
#    - Extract JWT token (remove "Bearer " prefix)
#    - Call verify_jwt() to get user_id
#    - Generate/use conversationId (uuid4 if not provided)
#    - Save user message to MongoDB (chat_history_service)
#    - Call rag_service.query(user_id, question, jwt_token)
#    - Save assistant response to MongoDB
#    - Return ChatResponse
# 7. Create GET /history/{conversationId} endpoint:
#    - Verify JWT, extract user_id
#    - Call chat_history_service.get_conversation_history()
#    - Return messages list
# 8. Use Depends() for dependency injection of services
#
# DEPENDENCIES NEEDED:
# - get_rag_service() - returns initialized RAGService
# - get_chat_history_service() - returns ChatHistoryService
# - verify_jwt(token: str) -> str - validates JWT, returns user_id
