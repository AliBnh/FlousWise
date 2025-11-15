package com.finance_service.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NetWorthDataPoint {
    private LocalDateTime date;
    private Double netWorth;
}
