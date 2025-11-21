# Chat History Service
#
# PURPOSE:
# - Save chat messages to MongoDB
# - Retrieve conversation history
# - Track conversations by conversationId
#
# IMPLEMENTATION STEPS:
# 1. Import motor.motor_asyncio.AsyncIOMotorClient
# 2. Import datetime, logging
# 3. Create ChatHistoryService class
# 4. In __init__(mongodb_uri, database, collection):
#    - Create async MongoDB client
#    - Get database and collection references
#    - Store as instance variables
# 5. Create async save_message(user_id, conversation_id, role, message):
#    - role is either "user" or "assistant"
#    - Create document:
#      {
#        "userId": user_id,
#        "conversationId": conversation_id,
#        "role": role,
#        "message": message,
#        "timestamp": datetime.utcnow()
#      }
#    - Insert into MongoDB: await self.collection.insert_one(document)
#    - Log success
# 6. Create async get_conversation_history(user_id, conversation_id, limit=50) -> List[Dict]:
#    - Query: {"userId": user_id, "conversationId": conversation_id}
#    - Sort by timestamp ascending (oldest first)
#    - Limit results
#    - Return list of message documents
#
# KEY NOTES:
# - Each message is stored separately (user and assistant messages)
# - conversationId groups messages into conversations
# - Users can have multiple conversations
# - Timestamps allow for chronological ordering
#
# MONGODB DOCUMENT STRUCTURE:
# {
#   "_id": ObjectId("..."),
#   "userId": "user123",
#   "conversationId": "conv-uuid-1234",
#   "role": "user",
#   "message": "How can I save money?",
#   "timestamp": ISODate("2024-01-15T10:30:00Z")
# }
