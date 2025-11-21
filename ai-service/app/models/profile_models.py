# User Profile Models
#
# PURPOSE:
# - Define type hints for user profile data from Finance Service
# - Optional: can use Dict directly or create Pydantic models for type safety
#
# IMPLEMENTATION STEPS:
# 1. Import BaseModel from pydantic
# 2. Import Optional, List from typing
# 3. Create models matching Finance Service structure:
#    - Income, FixedExpenses, VariableExpenses
#    - Debt, FinancialGoal
#    - UserProfile (top-level)
# 4. These models are optional - can use Dict[str, Any] instead
#
# NOTE:
# - Finance Service already validates profile data
# - These models are mainly for type hints in AI service
# - Can implement incrementally or skip if using Dict
