package com.finance_service.finance.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishProfileCreatedEvent(String userId) {
        Map<String, Object> event = new HashMap<>();
        event.put("userId", userId);
        event.put("eventType", "PROFILE_CREATED");
        event.put("timestamp", LocalDateTime.now().toString());

        sendEvent("user.profile.created", userId, event);
    }

    public void publishProfileUpdatedEvent(String userId, String sectionName) {
        Map<String, Object> event = new HashMap<>();
        event.put("userId", userId);
        event.put("sectionName", sectionName);
        event.put("eventType", "PROFILE_UPDATED");
        event.put("timestamp", LocalDateTime.now().toString());

        sendEvent("profile.updated", userId, event);
    }

    public void publishProfileDeletedEvent(String userId) {
        Map<String, Object> event = new HashMap<>();
        event.put("userId", userId);
        event.put("eventType", "PROFILE_DELETED");
        event.put("timestamp", LocalDateTime.now().toString());

        sendEvent("profile.deleted", userId, event);
    }

    private void sendEvent(String topic, String key, Object payload) {
        try {
            kafkaTemplate.send(topic, key, payload);
            log.info("Published event to topic: {} with key: {}", topic, key);
        } catch (Exception e) {
            log.error("Failed to publish event to topic: {} with key: {}", topic, key, e);
        }
    }
}
