package com.finance_service.finance.model;

import lombok.Data;

@Data
public class DependentPerson {
    private String relationship;
    private Integer age;
    private Double monthlySupportAmount;
    private String notes;
}
