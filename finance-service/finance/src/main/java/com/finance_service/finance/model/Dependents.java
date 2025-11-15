package com.finance_service.finance.model;

import lombok.Data;
import java.util.List;

@Data
public class Dependents {
    private Integer numberOfDependents;
    private List<DependentPerson> dependentPersons;
    private List<Child> children;

    // Other obligations
    private Boolean sendMoneyToFamily;
    private String moneyRecipient;
    private Double amountSent;
    private String frequency;
    private String otherObligations;
}
