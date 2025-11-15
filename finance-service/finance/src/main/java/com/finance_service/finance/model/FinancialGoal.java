package com.finance_service.finance.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FinancialGoal {
    private String goalName;
    private String goalType;
    private Double targetAmount;
    private LocalDate targetDate;
    private Double currentProgress;
    private String priority;
    private String whyImportant;
    private Boolean isPrimaryGoal;
}
