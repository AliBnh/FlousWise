package com.finance_service.finance.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FinancialRatiosResponse {
    private Double debtToIncomeRatio;
    private String debtToIncomeStatus;

    private Double savingsRate;
    private String savingsRateStatus;

    private Double emergencyFundMonths;
    private String emergencyFundStatus;

    private Double expenseToIncomeRatio;
    private String expenseToIncomeStatus;

    private LocalDateTime calculatedAt;
}
