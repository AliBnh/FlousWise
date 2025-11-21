"""
Chat History Service - MongoDB Chat Storage

Stores and retrieves chat messages for conversations.
Each conversation has a conversationId, and each message has a role (user/assistant).
"""

from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.utils.logger import get_logger

logger = get_logger(__name__)


class ChatHistoryService:
    """
    Service for managing chat history in MongoDB

    Features:
    - Save user and assistant messages
    - Retrieve conversation history
    - Organize by conversationId
    """

    def __init__(
        self,
        mongodb_uri: str,
        database: str = "flouswise",
        collection: str = "chat_history"
    ):
        """
        Initialize chat history service

        Args:
            mongodb_uri: MongoDB connection URI
            database: Database name (default: "flouswise")
            collection: Collection name (default: "chat_history")
        """
        self.client = AsyncIOMotorClient(mongodb_uri)
        self.db = self.client[database]
        self.collection = self.db[collection]
        logger.info(f"ChatHistoryService initialized: {database}.{collection}")

    async def save_message(
        self,
        user_id: str,
        conversation_id: str,
        role: str,
        message: str
    ) -> str:
        """
        Save a chat message to MongoDB

        Args:
            user_id: User ID
            conversation_id: Conversation ID (groups related messages)
            role: "user" or "assistant"
            message: Message text

        Returns:
            Inserted document ID
        """
        # Create document
        document = {
            "userId": user_id,
            "conversationId": conversation_id,
            "role": role,
            "message": message,
            "timestamp": datetime.utcnow()
        }

        # Insert into MongoDB
        result = await self.collection.insert_one(document)

        logger.debug(
            f"Saved {role} message for user={user_id}, "
            f"conversation={conversation_id[:8]}..."
        )

        return str(result.inserted_id)

    async def get_conversation_history(
        self,
        user_id: str,
        conversation_id: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Retrieve conversation history

        Args:
            user_id: User ID
            conversation_id: Conversation ID
            limit: Maximum number of messages (default: 50)

        Returns:
            List of message documents (chronological order)

        Example return:
        [
            {
                "userId": "user123",
                "conversationId": "conv-uuid",
                "role": "user",
                "message": "How to save money?",
                "timestamp": datetime(...)
            },
            {
                "role": "assistant",
                "message": "Here are 5 tips...",
                "timestamp": datetime(...)
            }
        ]
        """
        # Query for conversation messages
        query = {
            "userId": user_id,
            "conversationId": conversation_id
        }

        # Get messages sorted by timestamp (oldest first)
        cursor = self.collection.find(query).sort("timestamp", 1).limit(limit)

        # Convert to list
        messages = []
        async for doc in cursor:
            # Remove MongoDB _id for cleaner response
            doc.pop("_id", None)
            messages.append(doc)

        logger.info(
            f"Retrieved {len(messages)} messages for "
            f"conversation={conversation_id[:8]}..."
        )

        return messages

    async def get_user_conversations(
        self,
        user_id: str,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Get list of user's recent conversations

        Args:
            user_id: User ID
            limit: Number of conversations to return

        Returns:
            List of conversations with latest message
        """
        # Aggregate to get latest message per conversation
        pipeline = [
            {"$match": {"userId": user_id}},
            {"$sort": {"timestamp": -1}},
            {
                "$group": {
                    "_id": "$conversationId",
                    "latestMessage": {"$first": "$message"},
                    "latestTimestamp": {"$first": "$timestamp"},
                    "latestRole": {"$first": "$role"}
                }
            },
            {"$sort": {"latestTimestamp": -1}},
            {"$limit": limit}
        ]

        conversations = []
        async for doc in self.collection.aggregate(pipeline):
            conversations.append({
                "conversationId": doc["_id"],
                "latestMessage": doc["latestMessage"],
                "timestamp": doc["latestTimestamp"],
                "role": doc["latestRole"]
            })

        logger.info(f"Retrieved {len(conversations)} conversations for user={user_id}")

        return conversations

    async def delete_conversation(
        self,
        user_id: str,
        conversation_id: str
    ) -> int:
        """
        Delete a conversation (all messages)

        Args:
            user_id: User ID
            conversation_id: Conversation ID

        Returns:
            Number of deleted messages
        """
        result = await self.collection.delete_many({
            "userId": user_id,
            "conversationId": conversation_id
        })

        logger.info(
            f"Deleted {result.deleted_count} messages from "
            f"conversation={conversation_id[:8]}..."
        )

        return result.deleted_count

    async def close(self):
        """Close MongoDB connection"""
        self.client.close()
        logger.info("MongoDB connection closed")


# Test function
if __name__ == "__main__":
    import asyncio

    async def test():
        service = ChatHistoryService("mongodb://localhost:27017")

        # Save messages
        conv_id = "test-conv-123"
        await service.save_message("user1", conv_id, "user", "Hello!")
        await service.save_message("user1", conv_id, "assistant", "Hi there!")

        # Get history
        history = await service.get_conversation_history("user1", conv_id)
        print(f"Found {len(history)} messages")

        await service.close()

    asyncio.run(test())
