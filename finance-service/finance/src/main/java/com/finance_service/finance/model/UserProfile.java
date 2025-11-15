package com.finance_service.finance.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "user_profiles")
public class UserProfile {
    @Id
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;

    // Section 1: Basic Information
    private BasicInformation basicInformation;

    // Section 2: Income
    private Income income;

    // Section 3: Dependents
    private Dependents dependents;

    // Section 4: Fixed Expenses
    private FixedExpenses fixedExpenses;

    // Section 5: Variable Expenses
    private VariableExpenses variableExpenses;

    // Section 6: Debts
    private List<Debt> debts;

    // Section 7: Assets & Savings
    private AssetsAndSavings assetsAndSavings;

    // Section 8: Skills
    private Skills skills;

    // Section 9: Goals
    private List<FinancialGoal> financialGoals;

    // Section 10: Moroccan Specific
    private MoroccanSpecificInfo moroccanSpecificInfo;

    // Section 11: Risk Profile
    private RiskProfile riskProfile;

    // Section 12: Additional Context
    private String additionalContext;

    // System fields
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;
    private Boolean isProfileComplete;
}
