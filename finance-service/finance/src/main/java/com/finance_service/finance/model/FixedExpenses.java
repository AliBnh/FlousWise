package com.finance_service.finance.model;

import lombok.Data;
import java.util.List;

@Data
public class FixedExpenses {
    // Housing
    private Double rent;
    private Double propertyTax;
    private Double homeInsurance;

    // Utilities
    private Double electricity;
    private Double water;
    private Double gas;
    private Double internet;
    private Double fixedPhoneLine;

    // Communication
    private Double mobilePhonePlan;
    private Double additionalPhones;

    // Transportation
    private Double carLoanPayment;
    private Double carInsurance;
    private Double monthlyFuel;
    private Double publicTransportPass;
    private Double parking;
    private Double maintenanceReserve;

    // Insurance
    private Double healthInsurance;
    private Double lifeInsurance;
    private Double otherInsurance;

    // Subscriptions
    private List<Subscription> subscriptions;

    // Other
    private String otherFixedExpenses;
    private Double otherFixedExpensesAmount;

    // Auto-calculated
    private Double totalFixedExpenses;
}
