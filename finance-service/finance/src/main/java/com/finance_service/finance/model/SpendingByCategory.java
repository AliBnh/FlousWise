package com.finance_service.finance.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "spending_analytics")
public class SpendingByCategory {
    @Id
    private String id;

    private String userId;

    // Category breakdowns
    private Double debtPayments;
    private Double food;
    private Double transportation;
    private Double housing;
    private Double utilities;
    private Double healthcare;
    private Double entertainment;
    private Double education;
    private Double other;

    // Percentages
    private Double debtPaymentsPercentage;
    private Double foodPercentage;
    private Double transportationPercentage;
    private Double housingPercentage;
    private Double utilitiesPercentage;
    private Double healthcarePercentage;
    private Double entertainmentPercentage;
    private Double educationPercentage;
    private Double otherPercentage;

    private Double totalExpenses;
    private LocalDateTime calculatedAt;
}
