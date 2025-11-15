package com.finance_service.finance.model;

import lombok.Data;

@Data
public class AssetsAndSavings {
    // Current Savings
    private Double bankAccountBalance;
    private Double cashAtHome;
    private Double emergencyFund;
    private Double otherLiquidSavings;

    // Vehicle
    private Boolean ownsCar;
    private Double carValue;
    private Boolean carHasLoan;

    private Boolean ownsMotorcycle;
    private Double motorcycleValue;

    // Property
    private Boolean ownsProperty;
    private String propertyType;
    private Double propertyValue;
    private Boolean propertyHasMortgage;

    // Electronics & Valuables
    private Double laptopValue;
    private Double phoneValue;
    private Double goldJewelryValue;
    private String otherValuableItems;
    private Double otherValuableItemsValue;

    // Investments
    private Double stocks;
    private Double mutualFunds;
    private Double businessInvestment;
    private Double cryptocurrency;
    private String otherInvestments;
    private Double otherInvestmentsValue;

    // Auto-calculated
    private Double totalAssets;
    private Double netWorth;
}
