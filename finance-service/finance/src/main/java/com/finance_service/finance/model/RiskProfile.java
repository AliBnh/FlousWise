package com.finance_service.finance.model;

import lombok.Data;

@Data
public class RiskProfile {
    // Financial Personality
    private String riskTolerance;
    private String financialStressLevel;
    private String biggestFinancialFear;

    // Financial Habits
    private String trackExpenses;
    private String hasBudget;
    private String savesRegularly;
    private String biggestMoneyChallenge;

    // Preferences
    private String savingsPlanAggressiveness;
    private String debtPayoffPhilosophy;
    private String investmentInterest;
}
