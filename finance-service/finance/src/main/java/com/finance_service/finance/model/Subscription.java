package com.finance_service.finance.model;

import lombok.Data;

@Data
public class Subscription {
    private String serviceName;
    private Double monthlyCost;
}
