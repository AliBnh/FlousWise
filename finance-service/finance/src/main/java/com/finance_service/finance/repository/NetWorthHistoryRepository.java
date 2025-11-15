package com.finance_service.finance.repository;

import com.finance_service.finance.model.NetWorthHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NetWorthHistoryRepository extends MongoRepository<NetWorthHistory, String> {
    List<NetWorthHistory> findByUserIdOrderByRecordedAtDesc(String userId);
    List<NetWorthHistory> findByUserIdAndRecordedAtAfter(String userId, LocalDateTime after);
}
