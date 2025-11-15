package com.finance_service.finance.model;

import lombok.Data;

@Data
public class AdditionalIncomeSource {
    private String sourceName;
    private Double monthlyAmount;
    private String frequency;
    private String stability;
}
