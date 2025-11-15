package com.finance_service.finance.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BasicInformation {
    private String fullName;
    private Integer age;
    private String gender;
    private String city;
    private String email;

    // Living Situation
    private String livingStatus;
    private String housingType;
    private Double monthlyRentOrMortgage;
    private LocalDate contractEndDate;
}
