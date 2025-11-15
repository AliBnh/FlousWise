package com.finance_service.finance.model;

import lombok.Data;
import java.util.List;

@Data
public class Skills {
    // Employment Skills
    private List<String> currentJobSkills;
    private String customSkills;

    private String highestEducation;
    private Integer yearsOfExperience;

    // Monetizable Skills
    private Boolean canDrive;
    private Boolean ownsCar;

    private List<String> languagesSpoken;

    private String otherMonetizableSkills;

    // Time Availability
    private Integer weekdayEveningHours;
    private Integer weekendHours;
    private String willingnessForSideIncome;

    // Constraints
    private String workSchedule;
    private Double commuteTimeHours;
    private String otherTimeConstraints;
}
