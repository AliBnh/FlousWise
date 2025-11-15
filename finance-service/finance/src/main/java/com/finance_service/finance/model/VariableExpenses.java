package com.finance_service.finance.model;

import lombok.Data;

@Data
public class VariableExpenses {
    // Food & Groceries
    private Double groceryShopping;
    private Double eatingOut;
    private Double coffee;
    private Double foodDelivery;

    // Healthcare
    private Double medications;
    private Double doctorVisits;
    private Double pharmacyItems;
    private Boolean hasRAMEDOrInsurance;

    // Personal Care
    private Double hygieneProducts;
    private Double haircutsSalon;
    private Double otherPersonalCare;

    // Clothing
    private Double clothingSpending;

    // Education
    private Double schoolFees;
    private Double schoolSupplies;
    private Double tutoring;
    private Double onlineCourses;

    // Entertainment
    private Double moviesEvents;
    private Double hobbies;
    private Double sportsGym;
    private Double otherEntertainment;

    // Social Obligations
    private Double gifts;
    private Double charityDonations;
    private Double familyGatherings;

    // Auto-calculated
    private Double totalVariableExpenses;
}
