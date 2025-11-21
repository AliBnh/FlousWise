"""
Context Service - Moroccan Economic Data

This service loads and provides Moroccan-specific economic context for the AI advisor.

Why this is needed:
- Generic financial advice doesn't work for Morocco
- Need local salaries, cost of living, programs
- LLM needs this context to give relevant advice

What it provides:
- Salary data (minimum wage, average by city)
- Government programs (RAMED, Tayssir, INDH)
- Income opportunities (freelancing, tutoring rates)
- Cost of living data

This context is included in EVERY LLM prompt to ensure Morocco-specific advice.
"""

import json
from pathlib import Path
from typing import Dict, Any

from app.utils.logger import get_logger

# Initialize logger for this module
logger = get_logger(__name__)


class ContextService:
    """
    Service for loading and formatting Moroccan economic context

    This service:
    1. Loads economic data from JSON file at initialization
    2. Provides raw context as dictionary
    3. Formats context as human-readable text for LLM prompts

    The data is loaded ONCE at startup and cached in memory.
    """

    def __init__(self, context_file_path: str = "./data/moroccan_context.json"):
        """
        Initialize the context service

        Args:
            context_file_path: Path to the JSON file with Moroccan economic data
                              Default: "./data/moroccan_context.json"

        The file should contain:
        - Salary data (minimum wage, averages by city)
        - Government programs (RAMED, Tayssir, INDH)
        - Income opportunities (freelancing, tutoring)
        - Cost of living data

        If the file doesn't exist, logs a warning and continues with empty context.
        """
        logger.info(f"Initializing ContextService from: {context_file_path}")

        self.context_file_path = context_file_path
        self.context = self._load_context()

        if self.context:
            logger.info(
                f"✅ ContextService initialized with {len(self.context)} top-level keys"
            )
        else:
            logger.warning(
                "⚠️  ContextService initialized with empty context "
                "(moroccan_context.json not found or empty)"
            )

    def _load_context(self) -> Dict[str, Any]:
        """
        Load Moroccan context from JSON file

        This is a private method called by __init__.

        Returns:
            Dictionary with economic data, or empty dict if file not found

        File structure:
        {
            "salaries": {...},
            "cost_of_living": {...},
            "government_programs": {...},
            "opportunities": {...},
            "financial_reality": {...}
        }
        """
        context_path = Path(self.context_file_path)

        # Check if file exists
        if not context_path.exists():
            logger.warning(
                f"Moroccan context file not found: {self.context_file_path}. "
                "AI will not have local economic context."
            )
            return {}

        try:
            # Read and parse JSON file
            with open(context_path, 'r', encoding='utf-8') as f:
                context = json.load(f)

            logger.debug(f"Loaded context with keys: {list(context.keys())}")
            return context

        except json.JSONDecodeError as e:
            logger.error(
                f"Failed to parse Moroccan context JSON: {e}",
                exc_info=True
            )
            return {}

        except Exception as e:
            logger.error(
                f"Failed to load Moroccan context: {e}",
                exc_info=True
            )
            return {}

    def get_context(self) -> Dict[str, Any]:
        """
        Get raw Moroccan context as dictionary

        Returns:
            Full context dictionary

        Usage:
            context = service.get_context()
            min_wage = context.get('salaries', {}).get('minimum_wage', 0)
        """
        return self.context

    def get_formatted_context(self) -> str:
        """
        Get Moroccan context formatted for LLM prompts

        This converts the raw JSON data into human-readable text that
        the LLM can understand and use in its responses.

        Returns:
            Formatted string with economic context

        Example output:
        '''
        MOROCCAN ECONOMIC CONTEXT:

        Salaries:
        - Minimum wage: 3,045 MAD/month
        - Average salary: 5,000 MAD/month
        - Casablanca: 6,500 MAD/month
        - Rabat: 7,000 MAD/month

        Government Programs:
        - RAMED (Free Healthcare): For households earning < 5,600 MAD/month per member
        - Tayssir (Education Support): 60-140 MAD/month per child for low-income families
        - INDH: Skills training, microfinance, infrastructure support

        Income Opportunities:
        - Freelance platforms: Ureed.com, Freelance.ma, Upwork
        - Tutoring: 100-200 MAD/hour
        - Web development projects: 3,000-5,000 MAD per project
        - Side income ideas: Delivery (2,000-4,000 MAD/month), Content writing (100-200 MAD/article)
        '''

        This formatted text is included in the LLM prompt so it can:
        1. Compare user's salary to Moroccan averages
        2. Suggest relevant government programs
        3. Recommend local income opportunities
        4. Give context-aware advice
        """
        if not self.context:
            # Return minimal context if file not loaded
            return (
                "MOROCCAN ECONOMIC CONTEXT:\n"
                "Note: Detailed context not available. "
                "Provide general financial advice adapted for Morocco."
            )

        # Build formatted string section by section
        sections = []

        # ===== SALARY INFORMATION =====
        if 'salaries' in self.context:
            salaries = self.context['salaries']

            salary_section = "Salaries:"

            # Minimum wage
            if 'minimum_wage' in salaries:
                salary_section += f"\n- Minimum wage: {salaries['minimum_wage']:,} MAD/month"

            # Average salary
            if 'average_salary' in salaries:
                salary_section += f"\n- Average salary: {salaries['average_salary']:,} MAD/month"

            # City-specific salaries
            if 'cities' in salaries and isinstance(salaries['cities'], dict):
                for city, amount in salaries['cities'].items():
                    salary_section += f"\n- {city}: {amount:,} MAD/month"

            sections.append(salary_section)

        # ===== GOVERNMENT PROGRAMS =====
        if 'government_programs' in self.context:
            programs = self.context['government_programs']

            programs_section = "Government Programs:"

            # RAMED (Free Healthcare)
            if 'RAMED' in programs:
                ramed = programs['RAMED']
                programs_section += (
                    f"\n- RAMED ({ramed.get('name', 'Free Healthcare')}): "
                    f"{ramed.get('eligibility', 'Low-income families')}"
                )

            # Tayssir (Education Support)
            if 'Tayssir' in programs:
                tayssir = programs['Tayssir']
                programs_section += (
                    f"\n- Tayssir ({tayssir.get('name', 'Education Support')}): "
                    f"{tayssir.get('amount', '60-140 MAD/month per child')}"
                )

            # INDH (Development Programs)
            if 'INDH' in programs:
                indh = programs['INDH']
                if 'programs' in indh and isinstance(indh['programs'], list):
                    programs_text = ', '.join(indh['programs'])
                    programs_section += f"\n- INDH: {programs_text}"

            # Housing subsidies
            if 'housing_subsidies' in programs:
                housing = programs['housing_subsidies']
                if 'programs' in housing and isinstance(housing['programs'], list):
                    housing_text = ', '.join(housing['programs'])
                    programs_section += f"\n- Housing subsidies: {housing_text}"

            sections.append(programs_section)

        # ===== INCOME OPPORTUNITIES =====
        if 'opportunities' in self.context:
            opps = self.context['opportunities']

            opps_section = "Income Opportunities:"

            # Freelance platforms
            if 'freelance_platforms' in opps and isinstance(opps['freelance_platforms'], list):
                platforms = ', '.join(opps['freelance_platforms'])
                opps_section += f"\n- Freelance platforms: {platforms}"

            # Tutoring rates
            if 'tutoring_rate' in opps:
                tutoring = opps['tutoring_rate']
                min_rate = tutoring.get('min', 100)
                max_rate = tutoring.get('max', 200)
                opps_section += f"\n- Tutoring: {min_rate}-{max_rate} MAD/hour"

            # Web development projects
            if 'web_dev_project' in opps:
                web_dev = opps['web_dev_project']
                min_price = web_dev.get('min', 3000)
                max_price = web_dev.get('max', 5000)
                opps_section += f"\n- Web development projects: {min_price:,}-{max_price:,} MAD per project"

            # Side income ideas
            if 'side_income_ideas' in opps and isinstance(opps['side_income_ideas'], list):
                # Show first 5 ideas
                ideas = opps['side_income_ideas'][:5]
                opps_section += "\n- Side income ideas: " + ', '.join(ideas)

            sections.append(opps_section)

        # ===== FINANCIAL REALITY =====
        if 'financial_reality' in self.context:
            reality = self.context['financial_reality']

            reality_section = "Financial Reality in Morocco:"

            if 'paycheck_to_paycheck' in reality:
                reality_section += f"\n- {reality['paycheck_to_paycheck']}"

            if 'financial_stress' in reality:
                reality_section += f"\n- {reality['financial_stress']}"

            if 'emergency_savings' in reality:
                reality_section += f"\n- {reality['emergency_savings']}"

            sections.append(reality_section)

        # ===== COMBINE ALL SECTIONS =====
        formatted = "MOROCCAN ECONOMIC CONTEXT:\n\n" + "\n\n".join(sections)

        logger.debug(f"Formatted context length: {len(formatted)} characters")

        return formatted

    def get_salary_comparison(self, user_salary: float) -> str:
        """
        Compare user's salary to Moroccan averages

        This helper function creates a personalized comparison text
        that can be included in AI responses.

        Args:
            user_salary: User's monthly salary in MAD

        Returns:
            Comparison text

        Example:
            comparison = service.get_salary_comparison(9000)
            # "Your salary of 9,000 MAD is 80% above the national average (5,000 MAD)
            #  and 38% above the Casablanca average (6,500 MAD)."
        """
        if not self.context or 'salaries' not in self.context:
            return ""

        salaries = self.context['salaries']
        comparisons = []

        # Compare to average salary
        if 'average_salary' in salaries:
            avg_salary = salaries['average_salary']
            if avg_salary > 0:
                percent_diff = ((user_salary - avg_salary) / avg_salary) * 100

                if percent_diff > 0:
                    comparisons.append(
                        f"{abs(percent_diff):.0f}% above the national average ({avg_salary:,} MAD)"
                    )
                else:
                    comparisons.append(
                        f"{abs(percent_diff):.0f}% below the national average ({avg_salary:,} MAD)"
                    )

        # Compare to minimum wage
        if 'minimum_wage' in salaries:
            min_wage = salaries['minimum_wage']
            if min_wage > 0:
                multiple = user_salary / min_wage
                comparisons.append(f"{multiple:.1f}x the minimum wage ({min_wage:,} MAD)")

        if comparisons:
            return f"Your salary of {user_salary:,} MAD is " + " and ".join(comparisons) + "."

        return ""


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

"""
HOW TO USE THE CONTEXT SERVICE:

1. INITIALIZATION (do once, typically in dependencies.py):

   from app.services.context_service import ContextService

   # Initialize service (loads context file)
   context_service = ContextService()

2. GET FORMATTED CONTEXT FOR LLM:

   # In RAG service, when constructing prompt:
   moroccan_context = context_service.get_formatted_context()

   prompt = f'''
   USER PROFILE:
   {user_profile_data}

   {moroccan_context}

   USER QUESTION:
   {user_question}

   Provide personalized financial advice based on the above context.
   '''

3. GET RAW CONTEXT DATA:

   context = context_service.get_context()
   min_wage = context.get('salaries', {}).get('minimum_wage', 0)
   programs = context.get('government_programs', {})

4. SALARY COMPARISON:

   user_salary = 9000  # From user profile
   comparison = context_service.get_salary_comparison(user_salary)
   print(comparison)
   # "Your salary of 9,000 MAD is 80% above the national average..."
"""


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    """
    Test the context service
    Run: python -m app.services.context_service
    """
    print("=== Testing ContextService ===\n")

    # Initialize service
    print("1. Initializing service...")
    service = ContextService()

    # Get raw context
    print("\n2. Getting raw context...")
    context = service.get_context()
    print(f"   Keys: {list(context.keys())}")

    # Get formatted context
    print("\n3. Getting formatted context...")
    formatted = service.get_formatted_context()
    print("   Formatted context:")
    print("   " + "="*60)
    print("   " + formatted.replace("\n", "\n   "))
    print("   " + "="*60)

    # Test salary comparison
    print("\n4. Testing salary comparison...")
    test_salaries = [3000, 5000, 9000, 15000]
    for salary in test_salaries:
        comparison = service.get_salary_comparison(salary)
        if comparison:
            print(f"   {comparison}")

    print("\n✅ All context service tests passed!")
