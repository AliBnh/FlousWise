package com.finance_service.finance.model;

import lombok.Data;

@Data
public class MoroccanSpecificInfo {
    // Government Programs
    private Boolean receivesRAMED;
    private Boolean childrenReceiveTayssir;
    private Boolean appliedForINDH;
    private Boolean awareOfHousingSubsidies;
    private String otherGovernmentAssistance;

    // Social/Religious Obligations
    private Double regularCharity;
    private Double zakat;
    private String otherReligiousObligations;

    // Seasonal Considerations
    private Boolean adjustForRamadan;
    private Boolean planForEid;
    private String otherSeasonalExpenses;
}
