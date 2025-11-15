package com.finance_service.finance.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "net_worth_history")
public class NetWorthHistory {
    @Id
    private String id;

    private String userId;
    private Double netWorth;
    private LocalDateTime recordedAt;
}
