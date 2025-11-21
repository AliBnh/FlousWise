"""
Pydantic Models for Chat API

This module defines the data models (schemas) for chat-related requests and responses.

Why Pydantic?
1. Automatic data validation (type checking, required fields)
2. Automatic API documentation (OpenAPI/Swagger)
3. Serialization/deserialization (JSON ↔ Python objects)
4. IDE autocomplete support
5. Clear error messages for invalid data

Pydantic ensures that:
- Requests have the correct structure before processing
- Responses have the correct structure before sending
- API documentation is automatically generated from models
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============================================================================
# CHAT REQUEST/RESPONSE MODELS
# ============================================================================

class ChatRequest(BaseModel):
    """
    Request model for POST /api/chat endpoint

    This defines what data the user must send when asking a question.

    Attributes:
        question: The user's financial question (required)
                 Example: "How can I save 3000 MAD per month?"

        conversationId: Optional conversation ID (optional)
                       - If provided: Continue existing conversation
                       - If None: Start new conversation (generate UUID)
                       Example: "550e8400-e29b-41d4-a716-446655440000"
    """

    question: str = Field(
        ...,  # ... means required (no default)
        min_length=1,  # Question cannot be empty
        max_length=2000,  # Prevent abuse with very long questions
        description="User's financial question",
        example="How can I save 3000 MAD per month?"
    )
    """
    The financial question from the user

    Validation:
    - Required (cannot be None)
    - Must be at least 1 character
    - Maximum 2000 characters (reasonable question length)
    """

    conversationId: Optional[str] = Field(
        default=None,  # Optional, defaults to None
        description="Conversation ID to continue existing chat",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    """
    Optional conversation ID

    - None: Start new conversation
    - UUID string: Continue existing conversation
    - Backend generates UUID if not provided
    """

    class Config:
        """Pydantic model configuration"""
        json_schema_extra = {
            "example": {
                "question": "How can I save 3000 MAD per month?",
                "conversationId": "550e8400-e29b-41d4-a716-446655440000"
            }
        }
        """
        Example shown in API documentation (Swagger UI)
        Helps developers understand the expected format
        """


class ChatResponse(BaseModel):
    """
    Response model for POST /api/chat endpoint

    This defines what the API returns after processing a question.

    Attributes:
        answer: AI-generated financial advice (personalized)
        conversationId: Conversation ID (for continuing chat)
    """

    answer: str = Field(
        ...,  # Required
        description="AI-generated financial advice",
        example="Based on your 9,000 MAD salary and 8,200 MAD expenses..."
    )
    """
    The AI's personalized financial advice

    Contents:
    - Personalized to user's financial situation
    - Based on user profile + book knowledge + Moroccan context
    - Typically 300-500 words
    - Markdown formatted (for rich text display)
    """

    conversationId: str = Field(
        ...,  # Required
        description="Conversation ID for this exchange",
        example="550e8400-e29b-41d4-a716-446655440000"
    )
    """
    Conversation ID for this chat session

    Frontend should:
    1. Store this ID
    2. Include it in next request to continue conversation
    3. Display conversation history using this ID
    """

    class Config:
        """Pydantic model configuration"""
        json_schema_extra = {
            "example": {
                "answer": "Based on your 9,000 MAD salary and current expenses of 8,200 MAD, here's how to save 3,000 MAD per month:\n\n## Strategy 1: Expense Optimization (+600 MAD)\n...",
                "conversationId": "550e8400-e29b-41d4-a716-446655440000"
            }
        }


# ============================================================================
# CHAT HISTORY MODELS
# ============================================================================

class ChatMessage(BaseModel):
    """
    Single chat message (user or assistant)

    Used for displaying conversation history

    Attributes:
        role: Who sent the message ("user" or "assistant")
        message: The message content
        timestamp: When the message was sent
    """

    role: str = Field(
        ...,
        description="Message sender role",
        pattern="^(user|assistant)$",  # Only "user" or "assistant" allowed
        example="user"
    )
    """
    Message sender role

    Values:
    - "user": Message from the user
    - "assistant": Message from the AI

    Validation: Must be exactly "user" or "assistant"
    """

    message: str = Field(
        ...,
        description="Message content",
        example="How can I save money?"
    )
    """
    The actual message text

    - For user: Their question
    - For assistant: AI's response
    """

    timestamp: datetime = Field(
        ...,
        description="When the message was sent (ISO 8601 format)",
        example="2024-01-15T10:30:45.123Z"
    )
    """
    Message timestamp

    Format: ISO 8601 (e.g., "2024-01-15T10:30:45.123Z")
    - Allows sorting by time
    - Used for displaying conversation chronologically
    """

    class Config:
        """Pydantic model configuration"""
        json_schema_extra = {
            "example": {
                "role": "user",
                "message": "How can I save 3000 MAD per month?",
                "timestamp": "2024-01-15T10:30:45.123Z"
            }
        }


class ConversationHistoryResponse(BaseModel):
    """
    Response model for GET /api/chat/history/{conversationId}

    Returns all messages in a conversation

    Attributes:
        messages: List of all messages in chronological order
    """

    messages: List[ChatMessage] = Field(
        ...,
        description="List of messages in the conversation (chronological order)"
    )
    """
    All messages in this conversation

    Ordering:
    - Sorted by timestamp (oldest first)
    - User and assistant messages interleaved
    - Full conversation history

    Example:
    [
        {role: "user", message: "How to save?", timestamp: "10:30:00"},
        {role: "assistant", message: "Here's how...", timestamp: "10:30:02"},
        {role: "user", message: "What about debt?", timestamp: "10:31:00"},
        {role: "assistant", message: "For debt...", timestamp: "10:31:03"}
    ]
    """

    class Config:
        """Pydantic model configuration"""
        json_schema_extra = {
            "example": {
                "messages": [
                    {
                        "role": "user",
                        "message": "How can I save 3000 MAD per month?",
                        "timestamp": "2024-01-15T10:30:00.000Z"
                    },
                    {
                        "role": "assistant",
                        "message": "Based on your profile, here's a plan...",
                        "timestamp": "2024-01-15T10:30:02.500Z"
                    }
                ]
            }
        }


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
HOW TO USE THESE MODELS:

1. IN API ROUTES (FastAPI automatically validates):

   @router.post("/api/chat", response_model=ChatResponse)
   async def chat(request: ChatRequest):
       # FastAPI automatically:
       # - Parses JSON body
       # - Validates against ChatRequest model
       # - Converts to ChatRequest object
       # - Returns 422 error if validation fails

       question = request.question  # Access validated data
       conv_id = request.conversationId

       # ... process request ...

       return ChatResponse(
           answer="Your answer here",
           conversationId=conv_id or "new-uuid"
       )
       # FastAPI automatically converts to JSON

2. VALIDATION EXAMPLES:

   VALID REQUEST:
   {
       "question": "How can I save money?",
       "conversationId": "550e8400-e29b-41d4-a716-446655440000"
   }
   ✅ Passes validation

   INVALID REQUEST:
   {
       "question": "",  # Empty string
       "conversationId": "550e8400-e29b-41d4-a716-446655440000"
   }
   ❌ Fails validation: question must be at least 1 character

   INVALID REQUEST:
   {
       # Missing question field
       "conversationId": "550e8400-e29b-41d4-a716-446655440000"
   }
   ❌ Fails validation: question is required

3. IN TESTS:

   def test_chat_request_validation():
       # Valid request
       request = ChatRequest(question="How to save?")
       assert request.question == "How to save?"

       # Invalid request
       with pytest.raises(ValidationError):
           ChatRequest(question="")  # Too short

4. API DOCUMENTATION:

   FastAPI automatically generates:
   - OpenAPI/Swagger UI at http://localhost:8000/docs
   - Shows all models with examples
   - Interactive API testing

   Example in Swagger:
   POST /api/chat
   Request Body (application/json):
   {
     "question": "string (required, 1-2000 chars)",
     "conversationId": "string (optional, UUID)"
   }
"""


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    """
    Test model validation
    Run: python -m app.models.chat_models
    """
    from pydantic import ValidationError

    print("=== Testing Pydantic Models ===\n")

    # Test 1: Valid ChatRequest
    try:
        request = ChatRequest(
            question="How can I save 3000 MAD per month?",
            conversationId="test-123"
        )
        print(f"✅ Valid ChatRequest: {request}")
        print(f"   Question: {request.question}")
        print(f"   Conversation ID: {request.conversationId}\n")
    except ValidationError as e:
        print(f"❌ Validation error: {e}\n")

    # Test 2: ChatRequest without conversationId (optional)
    try:
        request = ChatRequest(question="How to budget?")
        print(f"✅ ChatRequest without conversationId: {request}")
        print(f"   Conversation ID (default): {request.conversationId}\n")
    except ValidationError as e:
        print(f"❌ Validation error: {e}\n")

    # Test 3: Invalid ChatRequest (empty question)
    try:
        request = ChatRequest(question="")
        print(f"✅ This shouldn't print")
    except ValidationError as e:
        print(f"✅ Correctly rejected empty question")
        print(f"   Error: {e}\n")

    # Test 4: Valid ChatResponse
    try:
        response = ChatResponse(
            answer="Here's my advice...",
            conversationId="test-123"
        )
        print(f"✅ Valid ChatResponse: {response.model_dump_json(indent=2)}\n")
    except ValidationError as e:
        print(f"❌ Validation error: {e}\n")

    # Test 5: ChatMessage
    try:
        message = ChatMessage(
            role="user",
            message="How to save?",
            timestamp=datetime.now()
        )
        print(f"✅ Valid ChatMessage: {message.model_dump_json(indent=2)}\n")
    except ValidationError as e:
        print(f"❌ Validation error: {e}\n")

    # Test 6: Invalid ChatMessage (wrong role)
    try:
        message = ChatMessage(
            role="admin",  # Invalid, must be "user" or "assistant"
            message="Test",
            timestamp=datetime.now()
        )
        print(f"✅ This shouldn't print")
    except ValidationError as e:
        print(f"✅ Correctly rejected invalid role")
        print(f"   Error: {e}\n")

    print("✅ All model tests completed!")
