"""
Chat API Routes

Main chat endpoints for the AI financial advisor.
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional
import uuid

from app.models.chat_models import ChatRequest, ChatResponse, ChatMessage, ConversationHistoryResponse
from app.services.rag_service import RAGService
from app.services.chat_history_service import ChatHistoryService
from app.utils.dependencies import (
    get_rag_service,
    get_chat_history_service,
    get_current_user_id
)
from app.utils.logger import get_logger
from app.utils.exceptions import RAGException, ProfileNotFoundException

logger = get_logger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    authorization: str = Header(...),
    rag_service: RAGService = Depends(get_rag_service),
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
) -> ChatResponse:
    """
    Main chat endpoint - Ask financial questions

    Process flow:
    1. Verify JWT token and extract user_id
    2. Generate or use existing conversationId
    3. Save user message to MongoDB
    4. Execute RAG pipeline (retrieve books + generate response)
    5. Save assistant response to MongoDB
    6. Return response to user

    Request body:
    {
        "question": "How can I save 3000 MAD per month?",
        "conversationId": "optional-conversation-id"
    }

    Response:
    {
        "answer": "Based on your income of 9,000 MAD...",
        "conversationId": "uuid-of-conversation"
    }

    Requires:
        Authorization: Bearer <jwt_token>
    """
    try:
        # Generate conversation ID if not provided
        conversation_id = request.conversationId or str(uuid.uuid4())

        logger.info(
            f"Chat request from user={user_id}, "
            f"conversation={conversation_id[:8]}..., "
            f"question='{request.question[:50]}...'"
        )

        # Save user message to chat history
        await chat_history_service.save_message(
            user_id=user_id,
            conversation_id=conversation_id,
            role="user",
            message=request.question
        )

        # Extract JWT token for profile fetching
        # Authorization header format: "Bearer <token>"
        jwt_token = authorization.split()[1] if authorization else ""

        # Execute RAG pipeline to generate response
        try:
            answer = await rag_service.query(
                user_id=user_id,
                user_question=request.question,
                jwt_token=jwt_token
            )
        except ProfileNotFoundException:
            # Handle case where user profile doesn't exist
            answer = (
                "I notice you haven't set up your financial profile yet. "
                "To provide personalized advice, please complete your profile "
                "with your income, expenses, and financial goals. "
                "Once your profile is set up, I'll be able to give you "
                "specific recommendations based on your situation."
            )
        except RAGException as e:
            logger.error(f"RAG pipeline failed: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to generate response. Please try again."
            )

        # Save assistant response to chat history
        await chat_history_service.save_message(
            user_id=user_id,
            conversation_id=conversation_id,
            role="assistant",
            message=answer
        )

        logger.info(
            f"✅ Chat completed for user={user_id}, "
            f"response_length={len(answer)} chars"
        )

        return ChatResponse(
            answer=answer,
            conversationId=conversation_id
        )

    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again."
        )


@router.get("/history/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
) -> ConversationHistoryResponse:
    """
    Get conversation history

    Returns all messages for a specific conversation.

    Path parameters:
        conversation_id: UUID of the conversation

    Response:
    {
        "conversationId": "uuid",
        "messages": [
            {
                "role": "user",
                "message": "How to save money?",
                "timestamp": "2024-01-15T10:30:00Z"
            },
            {
                "role": "assistant",
                "message": "Here are 5 tips...",
                "timestamp": "2024-01-15T10:30:02Z"
            }
        ]
    }

    Requires:
        Authorization: Bearer <jwt_token>
    """
    try:
        logger.info(
            f"Fetching history for user={user_id}, "
            f"conversation={conversation_id[:8]}..."
        )

        # Get messages from MongoDB
        messages_data = await chat_history_service.get_conversation_history(
            user_id=user_id,
            conversation_id=conversation_id,
            limit=100  # Return last 100 messages
        )

        # Convert to Pydantic models
        messages = [
            ChatMessage(
                role=msg["role"],
                message=msg["message"],
                timestamp=msg["timestamp"]
            )
            for msg in messages_data
        ]

        logger.info(f"✅ Retrieved {len(messages)} messages")

        return ConversationHistoryResponse(
            conversationId=conversation_id,
            messages=messages
        )

    except Exception as e:
        logger.error(f"Failed to fetch conversation history: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve conversation history"
        )


@router.get("/conversations")
async def get_user_conversations(
    user_id: str = Depends(get_current_user_id),
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Get list of user's recent conversations

    Returns a list of conversations with their latest message.

    Response:
    [
        {
            "conversationId": "uuid-1",
            "latestMessage": "How to save money?",
            "timestamp": "2024-01-15T10:30:00Z",
            "role": "user"
        },
        ...
    ]

    Requires:
        Authorization: Bearer <jwt_token>
    """
    try:
        logger.info(f"Fetching conversations for user={user_id}")

        conversations = await chat_history_service.get_user_conversations(
            user_id=user_id,
            limit=20
        )

        logger.info(f"✅ Retrieved {len(conversations)} conversations")

        return conversations

    except Exception as e:
        logger.error(f"Failed to fetch conversations: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve conversations"
        )


@router.delete("/conversation/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
    chat_history_service: ChatHistoryService = Depends(get_chat_history_service)
):
    """
    Delete a conversation

    Deletes all messages in the specified conversation.

    Path parameters:
        conversation_id: UUID of the conversation to delete

    Requires:
        Authorization: Bearer <jwt_token>
    """
    try:
        logger.info(
            f"Deleting conversation for user={user_id}, "
            f"conversation={conversation_id[:8]}..."
        )

        deleted_count = await chat_history_service.delete_conversation(
            user_id=user_id,
            conversation_id=conversation_id
        )

        logger.info(f"✅ Deleted {deleted_count} messages")

        return {
            "success": True,
            "message": f"Deleted {deleted_count} messages",
            "conversationId": conversation_id
        }

    except Exception as e:
        logger.error(f"Failed to delete conversation: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to delete conversation"
        )
