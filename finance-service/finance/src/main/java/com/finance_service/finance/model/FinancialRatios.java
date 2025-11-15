package com.finance_service.finance.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "financial_ratios")
public class FinancialRatios {
    @Id
    private String id;

    private String userId;

    // Key Ratios
    private Double debtToIncomeRatio;
    private Double savingsRate;
    private Double emergencyFundMonths;
    private Double expenseToIncomeRatio;

    // Status for each ratio
    private String debtToIncomeStatus;
    private String savingsRateStatus;
    private String emergencyFundStatus;
    private String expenseToIncomeStatus;

    private LocalDateTime calculatedAt;
}
