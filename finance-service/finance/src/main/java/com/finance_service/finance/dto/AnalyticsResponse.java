package com.finance_service.finance.dto;

import lombok.Data;

import java.util.List;

@Data
public class AnalyticsResponse {
    private FinancialHealthScoreResponse financialHealthScore;
    private FinancialRatiosResponse financialRatios;
    private SpendingByCategoryResponse spendingByCategory;
    private List<NetWorthDataPoint> netWorthTrend;
}
