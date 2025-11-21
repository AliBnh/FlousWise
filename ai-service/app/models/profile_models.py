"""
User Profile Models - Type Hints

These models provide type hints for user profile data from Finance Service.
They're optional - you can use Dict[str, Any] instead if preferred.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class Income(BaseModel):
    """Monthly income breakdown"""
    salary: float = Field(default=0, ge=0)
    freelance: float = Field(default=0, ge=0)
    other: float = Field(default=0, ge=0)


class FixedExpenses(BaseModel):
    """Fixed monthly expenses"""
    rent: float = Field(default=0, ge=0)
    utilities: float = Field(default=0, ge=0)
    insurance: float = Field(default=0, ge=0)
    subscriptions: float = Field(default=0, ge=0)
    loan_payments: float = Field(default=0, ge=0)
    other: float = Field(default=0, ge=0)


class VariableExpenses(BaseModel):
    """Variable monthly expenses"""
    food: float = Field(default=0, ge=0)
    transportation: float = Field(default=0, ge=0)
    entertainment: float = Field(default=0, ge=0)
    shopping: float = Field(default=0, ge=0)
    healthcare: float = Field(default=0, ge=0)
    other: float = Field(default=0, ge=0)


class Debt(BaseModel):
    """Individual debt"""
    id: Optional[str] = None
    name: str
    type: str  # "loan", "credit_card", "personal"
    originalAmount: float = Field(ge=0)
    remainingAmount: float = Field(ge=0)
    interestRate: float = Field(ge=0, le=100)
    monthlyPayment: float = Field(ge=0)
    dueDate: Optional[datetime] = None


class FinancialGoal(BaseModel):
    """Financial goal"""
    id: Optional[str] = None
    name: str
    targetAmount: float = Field(ge=0)
    currentAmount: float = Field(default=0, ge=0)
    deadline: Optional[datetime] = None
    priority: str = Field(default="medium")  # "low", "medium", "high"


class UserProfile(BaseModel):
    """
    Complete user financial profile

    This matches the structure from Finance Service.
    """
    userId: str
    monthlyIncome: Income
    fixedExpenses: FixedExpenses
    variableExpenses: VariableExpenses
    debts: List[Debt] = Field(default_factory=list)
    financialGoals: List[FinancialGoal] = Field(default_factory=list)
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    def get_total_income(self) -> float:
        """Calculate total monthly income"""
        return (
            self.monthlyIncome.salary +
            self.monthlyIncome.freelance +
            self.monthlyIncome.other
        )

    def get_total_expenses(self) -> float:
        """Calculate total monthly expenses"""
        fixed = sum([
            self.fixedExpenses.rent,
            self.fixedExpenses.utilities,
            self.fixedExpenses.insurance,
            self.fixedExpenses.subscriptions,
            self.fixedExpenses.loan_payments,
            self.fixedExpenses.other
        ])

        variable = sum([
            self.variableExpenses.food,
            self.variableExpenses.transportation,
            self.variableExpenses.entertainment,
            self.variableExpenses.shopping,
            self.variableExpenses.healthcare,
            self.variableExpenses.other
        ])

        return fixed + variable

    def get_savings_rate(self) -> float:
        """Calculate savings rate as percentage"""
        income = self.get_total_income()
        if income == 0:
            return 0
        expenses = self.get_total_expenses()
        return ((income - expenses) / income) * 100

    def get_total_debt(self) -> float:
        """Calculate total remaining debt"""
        return sum(debt.remainingAmount for debt in self.debts)
