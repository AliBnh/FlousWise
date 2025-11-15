package com.finance_service.finance.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class FinancialHealthScoreResponse {
    private Integer overallScore;
    private String status;
    private Map<String, Integer> componentScores;
    private List<String> topRecommendations;
    private LocalDateTime calculatedAt;
}
