# Context Service (Moroccan Economic Data)
#
# PURPOSE:
# - Load Moroccan economic context from JSON file
# - Provide formatted context for LLM prompts
# - Contains: salaries, government programs, job opportunities
#
# IMPLEMENTATION STEPS:
# 1. Import json, pathlib.Path
# 2. Create ContextService class
# 3. In __init__(context_file_path="./data/moroccan_context.json"):
#    - Load JSON file into self.context dict
#    - Handle file not found gracefully (return empty dict)
# 4. Create get_context() -> Dict:
#    - Return full context dictionary
# 5. Create get_formatted_context() -> str:
#    - Format context as readable text for LLM
#    - Include: minimum wage, average salaries by city
#    - Include: RAMED, Tayssir, INDH program descriptions
#    - Include: freelance opportunities, tutoring rates
#    - Return formatted string
#
# MOROCCAN CONTEXT DATA STRUCTURE:
# {
#   "salaries": {
#     "minimum_wage": 3045,
#     "average_salary": 5000,
#     "cities": {"Casablanca": 6500, "Rabat": 7000, ...}
#   },
#   "government_programs": {
#     "RAMED": {"name": "Free Healthcare", "eligibility": "..."},
#     "Tayssir": {"name": "Education Support", "amount": "..."}
#   },
#   "opportunities": {
#     "freelance_platforms": ["Ureed.com", "Freelance.ma"],
#     "tutoring_rate": {"min": 100, "max": 200, "unit": "MAD/hour"}
#   }
# }
#
# FORMATTED OUTPUT EXAMPLE:
# """
# MOROCCAN ECONOMIC CONTEXT:
#
# Salaries:
# - Minimum wage: 3,045 MAD/month
# - Average salary: 5,000 MAD/month
# - Casablanca average: 6,500 MAD/month
#
# Government Programs:
# - RAMED: Free Healthcare (Eligibility: Income < 5,600 MAD/month)
# - Tayssir: Education Support (60-140 MAD/month per child)
#
# Income Opportunities:
# - Freelance platforms: Ureed.com, Freelance.ma
# - Tutoring: 100-200 MAD/hour
# """
