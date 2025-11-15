package com.finance_service.finance.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class HealthCheckController {

    private final MongoTemplate mongoTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "finance-service");
        health.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(health);
    }

    @GetMapping("/health/ready")
    public ResponseEntity<Map<String, String>> readiness() {
        Map<String, String> readiness = new HashMap<>();

        try {
            // Check MongoDB connection
            mongoTemplate.getDb().getName();
            readiness.put("mongodb", "UP");
        } catch (Exception e) {
            readiness.put("mongodb", "DOWN");
            readiness.put("status", "DOWN");
            return ResponseEntity.status(503).body(readiness);
        }

        try {
            // Check Kafka connection (basic check)
            kafkaTemplate.getDefaultTopic();
            readiness.put("kafka", "UP");
        } catch (Exception e) {
            readiness.put("kafka", "DOWN");
        }

        readiness.put("status", "UP");
        readiness.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(readiness);
    }
}
