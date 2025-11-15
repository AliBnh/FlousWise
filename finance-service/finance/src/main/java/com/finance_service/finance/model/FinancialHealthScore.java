package com.finance_service.finance.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "financial_health_scores")
public class FinancialHealthScore {
    @Id
    private String id;

    private String userId;

    // Overall Score
    private Integer overallScore;
    private String status;

    // Component Scores
    private Integer incomeStabilityScore;
    private Integer expenseManagementScore;
    private Integer debtHealthScore;
    private Integer emergencyFundScore;
    private Integer savingsRateScore;

    // Recommendations
    private List<String> topRecommendations;

    private LocalDateTime calculatedAt;
}
