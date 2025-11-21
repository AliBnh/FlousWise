# Custom Exceptions
#
# PURPOSE:
# - Define custom exception classes for AI service
# - Better error handling and messaging
#
# IMPLEMENTATION STEPS:
# 1. Create custom exception classes inheriting from Exception
# 2. Common exceptions:
#    - ProfileNotFoundException
#    - LLMServiceException
#    - EmbeddingServiceException
#    - InvalidTokenException
# 3. Each exception can have custom __init__ with message
#
# EXAMPLE:
# class ProfileNotFoundException(Exception):
#     def __init__(self, user_id: str):
#         self.message = f"Profile not found for user: {user_id}"
#         super().__init__(self.message)
#
# class LLMServiceException(Exception):
#     def __init__(self, message: str):
#         self.message = f"LLM service error: {message}"
#         super().__init__(self.message)
