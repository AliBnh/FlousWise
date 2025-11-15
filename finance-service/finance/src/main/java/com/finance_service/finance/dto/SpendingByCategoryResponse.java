package com.finance_service.finance.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SpendingByCategoryResponse {
    private Map<String, Double> categories;
    private Map<String, Double> percentages;
    private List<String> topCategories;
    private List<String> insights;
}
