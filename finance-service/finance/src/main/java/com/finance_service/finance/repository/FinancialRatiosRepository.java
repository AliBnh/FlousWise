package com.finance_service.finance.repository;

import com.finance_service.finance.model.FinancialRatios;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialRatiosRepository extends MongoRepository<FinancialRatios, String> {
    Optional<FinancialRatios> findByUserId(String userId);
    List<FinancialRatios> findByUserIdOrderByCalculatedAtDesc(String userId);
}
