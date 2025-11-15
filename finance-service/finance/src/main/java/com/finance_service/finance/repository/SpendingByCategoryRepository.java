package com.finance_service.finance.repository;

import com.finance_service.finance.model.SpendingByCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpendingByCategoryRepository extends MongoRepository<SpendingByCategory, String> {
    Optional<SpendingByCategory> findByUserId(String userId);
    List<SpendingByCategory> findByUserIdOrderByCalculatedAtDesc(String userId);
}
