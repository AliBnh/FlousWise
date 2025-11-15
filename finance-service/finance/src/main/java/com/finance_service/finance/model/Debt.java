package com.finance_service.finance.model;

import lombok.Data;

@Data
public class Debt {
    private String debtType;
    private String creditorName;
    private Double totalAmountOwed;
    private Double monthlyPayment;
    private Double interestRate;
    private Integer remainingPayments;
    private String originalPurpose;
    private String notes;
}
