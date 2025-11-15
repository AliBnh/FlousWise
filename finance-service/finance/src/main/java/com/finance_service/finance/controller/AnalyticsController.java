package com.finance_service.finance.controller;

import com.finance_service.finance.dto.AnalyticsResponse;
import com.finance_service.finance.dto.FinancialHealthScoreResponse;
import com.finance_service.finance.dto.FinancialRatiosResponse;
import com.finance_service.finance.dto.NetWorthDataPoint;
import com.finance_service.finance.dto.SpendingByCategoryResponse;
import com.finance_service.finance.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Analytics", description = "Financial analytics and insights")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get complete analytics",
               description = "Returns all financial analytics including health score, ratios, spending analysis, and net worth trend")
    public ResponseEntity<AnalyticsResponse> getAnalytics(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        AnalyticsResponse response = analyticsService.getCompleteAnalytics(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health-score")
    @Operation(summary = "Get financial health score",
               description = "Returns the calculated financial health score with component breakdowns and recommendations")
    public ResponseEntity<FinancialHealthScoreResponse> getHealthScore(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        FinancialHealthScoreResponse response = analyticsService.getHealthScore(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ratios")
    @Operation(summary = "Get financial ratios",
               description = "Returns key financial ratios including debt-to-income, savings rate, and emergency fund months")
    public ResponseEntity<FinancialRatiosResponse> getRatios(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        FinancialRatiosResponse response = analyticsService.getRatios(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/spending")
    @Operation(summary = "Get spending analysis",
               description = "Returns spending breakdown by category with percentages and insights")
    public ResponseEntity<SpendingByCategoryResponse> getSpendingAnalysis(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        SpendingByCategoryResponse response = analyticsService.getSpendingAnalysis(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/net-worth")
    @Operation(summary = "Get net worth trend",
               description = "Returns net worth history for the specified number of months")
    public ResponseEntity<List<NetWorthDataPoint>> getNetWorthTrend(
            Authentication authentication,
            @RequestParam(defaultValue = "6") int months) {
        String userId = (String) authentication.getPrincipal();
        List<NetWorthDataPoint> response = analyticsService.getNetWorthTrend(userId, months);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recalculate")
    @Operation(summary = "Recalculate analytics manually",
               description = "Triggers manual recalculation of all analytics (useful for debugging or force refresh)")
    public ResponseEntity<AnalyticsResponse> recalculateAnalytics(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();

        // Trigger recalculation
        analyticsService.calculateAndSaveAllAnalytics(userId);

        // Return the updated analytics
        AnalyticsResponse response = analyticsService.getCompleteAnalytics(userId);
        return ResponseEntity.ok(response);
    }
}
