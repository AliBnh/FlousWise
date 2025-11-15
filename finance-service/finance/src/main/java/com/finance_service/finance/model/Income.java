package com.finance_service.finance.model;

import lombok.Data;
import java.util.List;

@Data
public class Income {
    // Primary Income
    private String employmentStatus;
    private String occupation;
    private Double monthlyNetSalary;
    private Integer salaryPaymentDay;
    private String incomeStability;
    private Integer workHoursPerWeek;

    // Self-employed fields
    private String businessType;
    private Double averageMonthlyIncome;
    private String incomeVariability;
    private Double businessExpenses;

    // Additional Income Sources
    private List<AdditionalIncomeSource> additionalSources;

    // Auto-calculated
    private Double totalMonthlyIncome;
}
