# Configuration Management
#
# PURPOSE:
# - Load environment variables from .env file
# - Define all configuration settings with defaults
# - Use Pydantic Settings for type validation
#
# IMPLEMENTATION STEPS:
# 1. Import: from pydantic_settings import BaseSettings
# 2. Create Settings class inheriting from BaseSettings
# 3. Define all config variables with types (str, int, etc.)
# 4. Add defaults for non-sensitive values
# 5. Set up Config class with env_file = ".env"
# 6. Create singleton instance: settings = Settings()
#
# EXAMPLE STRUCTURE:
# class Settings(BaseSettings):
#     SERVICE_NAME: str = "ai-service"
#     SERVICE_PORT: int = 8000
#     MONGODB_URI: str = "mongodb://..."
#     JWT_SECRET: str  # No default - required from env
#
#     class Config:
#         env_file = ".env"
#         case_sensitive = True
#
# settings = Settings()
