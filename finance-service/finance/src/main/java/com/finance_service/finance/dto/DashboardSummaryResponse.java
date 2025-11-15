package com.finance_service.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private Double monthlyIncome;
    private Double monthlyExpenses;
    private Double netSurplusOrDeficit;
    private Integer financialHealthScore;
}
