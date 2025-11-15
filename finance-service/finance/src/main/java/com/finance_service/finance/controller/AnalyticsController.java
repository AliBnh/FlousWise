package com.finance_service.finance.controller;

import com.finance_service.finance.dto.AnalyticsResponse;
import com.finance_service.finance.dto.FinancialHealthScoreResponse;
import com.finance_service.finance.dto.FinancialRatiosResponse;
import com.finance_service.finance.dto.NetWorthDataPoint;
import com.finance_service.finance.dto.SpendingByCategoryResponse;
import com.finance_service.finance.exception.ProfileNotFoundException;
import com.finance_service.finance.model.UserProfile;
import com.finance_service.finance.repository.UserProfileRepository;
import com.finance_service.finance.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserProfileRepository userProfileRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@PathVariable String userId) {
        AnalyticsResponse response = analyticsService.getCompleteAnalytics(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/health-score")
    public ResponseEntity<FinancialHealthScoreResponse> getHealthScore(@PathVariable String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        FinancialHealthScoreResponse response = analyticsService.calculateHealthScore(profile);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/ratios")
    public ResponseEntity<FinancialRatiosResponse> getRatios(@PathVariable String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        FinancialRatiosResponse response = analyticsService.calculateRatios(profile);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/spending")
    public ResponseEntity<SpendingByCategoryResponse> getSpendingAnalysis(@PathVariable String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        SpendingByCategoryResponse response = analyticsService.analyzeSpending(profile);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/net-worth")
    public ResponseEntity<List<NetWorthDataPoint>> getNetWorthTrend(
            @PathVariable String userId,
            @RequestParam(defaultValue = "6") int months) {
        List<NetWorthDataPoint> response = analyticsService.getNetWorthTrend(userId, months);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/recalculate")
    public ResponseEntity<AnalyticsResponse> recalculateAnalytics(@PathVariable String userId) {
        AnalyticsResponse response = analyticsService.getCompleteAnalytics(userId);
        return ResponseEntity.ok(response);
    }
}
