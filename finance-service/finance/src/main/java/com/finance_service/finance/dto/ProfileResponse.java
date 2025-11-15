package com.finance_service.finance.dto;

import com.finance_service.finance.model.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProfileResponse {
    private String id;
    private String userId;

    private BasicInformation basicInformation;
    private Income income;
    private Dependents dependents;
    private FixedExpenses fixedExpenses;
    private VariableExpenses variableExpenses;
    private List<Debt> debts;
    private AssetsAndSavings assetsAndSavings;
    private Skills skills;
    private List<FinancialGoal> financialGoals;
    private MoroccanSpecificInfo moroccanSpecificInfo;
    private RiskProfile riskProfile;
    private String additionalContext;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isProfileComplete;
}
