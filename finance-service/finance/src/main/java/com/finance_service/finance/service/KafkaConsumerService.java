package com.finance_service.finance.service;

import com.finance_service.finance.model.UserProfile;
import com.finance_service.finance.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final UserProfileRepository userProfileRepository;

    @KafkaListener(topics = "user.registered", groupId = "finance-service-group")
    public void handleUserRegistered(Map<String, Object> event) {
        try {
            String userId = (String) event.get("userId");
            log.info("Received user.registered event for userId: {}", userId);

            // Create empty profile shell for new user
            if (!userProfileRepository.existsByUserId(userId)) {
                UserProfile profile = new UserProfile();
                profile.setUserId(userId);
                profile.setCreatedAt(LocalDateTime.now());
                profile.setUpdatedAt(LocalDateTime.now());
                profile.setIsProfileComplete(false);

                userProfileRepository.save(profile);
                log.info("Created empty profile for user: {}", userId);
            }
        } catch (Exception e) {
            log.error("Error processing user.registered event", e);
        }
    }

    @KafkaListener(topics = "user.deleted", groupId = "finance-service-group")
    public void handleUserDeleted(Map<String, Object> event) {
        try {
            String userId = (String) event.get("userId");
            log.info("Received user.deleted event for userId: {}", userId);

            // Delete user profile
            userProfileRepository.deleteByUserId(userId);
            log.info("Deleted profile for user: {}", userId);
        } catch (Exception e) {
            log.error("Error processing user.deleted event", e);
        }
    }
}
