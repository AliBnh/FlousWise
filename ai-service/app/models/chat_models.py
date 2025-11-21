# Pydantic Models for Chat API
#
# PURPOSE:
# - Define request/response schemas for chat endpoints
# - Automatic validation and documentation
#
# IMPLEMENTATION STEPS:
# 1. Import BaseModel from pydantic
# 2. Import Optional from typing
# 3. Create ChatRequest model:
#    - question: str (required)
#    - conversationId: Optional[str] = None
# 4. Create ChatResponse model:
#    - answer: str
#    - conversationId: str
# 5. Create ChatMessage model (for history):
#    - role: str ("user" or "assistant")
#    - message: str
#    - timestamp: datetime
# 6. Create ConversationHistoryResponse model:
#    - messages: List[ChatMessage]
#
# EXAMPLE:
# from pydantic import BaseModel
# from typing import Optional
# from datetime import datetime
#
# class ChatRequest(BaseModel):
#     question: str
#     conversationId: Optional[str] = None
#
# class ChatResponse(BaseModel):
#     answer: str
#     conversationId: str
