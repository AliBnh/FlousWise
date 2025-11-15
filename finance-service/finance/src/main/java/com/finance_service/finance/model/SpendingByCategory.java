package com.finance_service.finance.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "spending_analytics")
public class SpendingByCategory {
    @Id
    private String id;

    private String userId;

    // Category amounts (e.g., {"Food": 1200.0, "Housing": 3000.0, ...})
    private Map<String, Double> categories;

    // Category percentages (e.g., {"Food": 15.36, "Housing": 38.40, ...})
    private Map<String, Double> percentages;

    // Top spending categories (e.g., ["Housing", "Food", "Transportation"])
    private List<String> topCategories;

    // Spending insights and recommendations
    private List<String> insights;

    private LocalDateTime calculatedAt;
}
