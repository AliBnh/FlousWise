package com.finance_service.finance.service;

import com.finance_service.finance.dto.*;
import com.finance_service.finance.exception.AnalyticsNotFoundException;
import com.finance_service.finance.exception.ProfileNotFoundException;
import com.finance_service.finance.model.*;
import com.finance_service.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final UserProfileRepository userProfileRepository;
    private final FinancialHealthScoreRepository healthScoreRepository;
    private final FinancialRatiosRepository ratiosRepository;
    private final SpendingByCategoryRepository spendingRepository;
    private final NetWorthHistoryRepository netWorthRepository;

    // ========================================
    // PUBLIC API: Calculate and Save (Called by ProfileService on create/update)
    // ========================================

    /**
     * Calculates and saves ALL analytics for a user.
     * Called when profile is created or updated.
     */
    @Transactional
    public void calculateAndSaveAllAnalytics(String userId) {
        log.info("Calculating and saving all analytics for user: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        calculateAndSaveHealthScore(profile);
        calculateAndSaveRatios(profile);
        calculateAndSaveSpending(profile);
        saveNetWorthSnapshot(profile);

        log.info("Successfully saved all analytics for user: {}", userId);
    }

    // ========================================
    // PUBLIC API: Read Only (Called by AnalyticsController on GET requests)
    // ========================================

    /**
     * Gets complete analytics (read from DB, no calculation).
     */
    public AnalyticsResponse getCompleteAnalytics(String userId) {
        log.info("Fetching complete analytics for user: {}", userId);

        AnalyticsResponse response = new AnalyticsResponse();
        response.setFinancialHealthScore(getHealthScore(userId));
        response.setFinancialRatios(getRatios(userId));
        response.setSpendingByCategory(getSpendingAnalysis(userId));
        response.setNetWorthTrend(getNetWorthTrend(userId, 6));

        return response;
    }

    /**
     * Gets health score (read from DB, no calculation).
     */
    public FinancialHealthScoreResponse getHealthScore(String userId) {
        log.info("Fetching health score for user: {}", userId);

        FinancialHealthScore saved = healthScoreRepository.findByUserId(userId)
                .orElseThrow(() -> new AnalyticsNotFoundException(
                        "Health score not found for user: " + userId + ". Profile may not be complete."));

        return mapToHealthScoreResponse(saved);
    }

    /**
     * Gets financial ratios (read from DB, no calculation).
     */
    public FinancialRatiosResponse getRatios(String userId) {
        log.info("Fetching financial ratios for user: {}", userId);

        FinancialRatios saved = ratiosRepository.findByUserId(userId)
                .orElseThrow(() -> new AnalyticsNotFoundException(
                        "Financial ratios not found for user: " + userId + ". Profile may not be complete."));

        return mapToRatiosResponse(saved);
    }

    /**
     * Gets spending analysis (read from DB, no calculation).
     */
    public SpendingByCategoryResponse getSpendingAnalysis(String userId) {
        log.info("Fetching spending analysis for user: {}", userId);

        SpendingByCategory saved = spendingRepository.findByUserId(userId)
                .orElseThrow(() -> new AnalyticsNotFoundException(
                        "Spending analysis not found for user: " + userId + ". Profile may not be complete."));

        return mapToSpendingResponse(saved);
    }

    /**
     * Gets net worth trend (read from DB).
     */
    public List<NetWorthDataPoint> getNetWorthTrend(String userId, int months) {
        log.info("Fetching net worth trend for user: {} for {} months", userId, months);

        LocalDateTime startDate = LocalDateTime.now().minusMonths(months);
        List<NetWorthHistory> history = netWorthRepository.findByUserIdAndRecordedAtAfter(userId, startDate);

        return history.stream()
                .map(h -> new NetWorthDataPoint(h.getRecordedAt(), h.getNetWorth()))
                .toList();
    }

    // ========================================
    // INTERNAL: Calculate and Save Individual Analytics
    // ========================================

    private void calculateAndSaveHealthScore(UserProfile profile) {
        log.info("Calculating and saving health score for user: {}", profile.getUserId());

        // Calculate component scores (0-100)
        int incomeStability = calculateIncomeStabilityScore(profile.getIncome());
        int expenseManagement = calculateExpenseManagementScore(profile);
        int debtHealth = calculateDebtHealthScore(profile);
        int emergencyFund = calculateEmergencyFundScore(profile);
        int savingsRate = calculateSavingsRateScore(profile);

        // Calculate overall score (weighted average)
        int overallScore = (int) (
                incomeStability * 0.20 +
                expenseManagement * 0.20 +
                debtHealth * 0.20 +
                emergencyFund * 0.25 +
                savingsRate * 0.15
        );

        String status = determineStatus(overallScore);
        List<String> recommendations = generateRecommendations(profile, overallScore);

        // Find existing or create new (overwrite pattern)
        FinancialHealthScore healthScore = healthScoreRepository.findByUserId(profile.getUserId())
                .orElse(new FinancialHealthScore());

        healthScore.setUserId(profile.getUserId());
        healthScore.setOverallScore(overallScore);
        healthScore.setStatus(status);
        healthScore.setIncomeStabilityScore(incomeStability);
        healthScore.setExpenseManagementScore(expenseManagement);
        healthScore.setDebtHealthScore(debtHealth);
        healthScore.setEmergencyFundScore(emergencyFund);
        healthScore.setSavingsRateScore(savingsRate);
        healthScore.setTopRecommendations(recommendations);
        healthScore.setCalculatedAt(LocalDateTime.now());

        healthScoreRepository.save(healthScore); // Overwrites if exists
        log.info("Saved health score for user: {} - Score: {}", profile.getUserId(), overallScore);
    }

    private void calculateAndSaveRatios(UserProfile profile) {
        log.info("Calculating and saving financial ratios for user: {}", profile.getUserId());

        Double totalIncome = calculateMonthlyIncome(profile);
        Double totalExpenses = calculateMonthlyExpenses(profile);
        Double totalDebt = calculateTotalDebt(profile);
        Double emergencyFund = profile.getAssetsAndSavings() != null ?
                (profile.getAssetsAndSavings().getEmergencyFund() != null ? profile.getAssetsAndSavings().getEmergencyFund() : 0.0) : 0.0;

        // Calculate ratios
        Double annualIncome = totalIncome * 12;
        Double debtToIncome = annualIncome > 0 ? (totalDebt / annualIncome) * 100 : 0.0;
        Double savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0.0;
        Double emergencyFundMonths = totalExpenses > 0 ? emergencyFund / totalExpenses : 0.0;
        Double expenseToIncome = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0.0;

        // Determine statuses
        String debtStatus = debtToIncome < 200 ? "Good" : debtToIncome < 300 ? "Warning" : "Critical";
        String savingsStatus = savingsRate >= 15 ? "Good" : savingsRate >= 10 ? "Warning" : "Critical";
        String emergencyStatus = emergencyFundMonths >= 3 ? "Good" : emergencyFundMonths >= 1 ? "Warning" : "Critical";
        String expenseStatus = expenseToIncome <= 80 ? "Good" : expenseToIncome <= 90 ? "Warning" : "Critical";

        // Find existing or create new (overwrite pattern)
        FinancialRatios ratios = ratiosRepository.findByUserId(profile.getUserId())
                .orElse(new FinancialRatios());

        ratios.setUserId(profile.getUserId());
        ratios.setDebtToIncomeRatio(debtToIncome);
        ratios.setDebtToIncomeStatus(debtStatus);
        ratios.setSavingsRate(savingsRate);
        ratios.setSavingsRateStatus(savingsStatus);
        ratios.setEmergencyFundMonths(emergencyFundMonths);
        ratios.setEmergencyFundStatus(emergencyStatus);
        ratios.setExpenseToIncomeRatio(expenseToIncome);
        ratios.setExpenseToIncomeStatus(expenseStatus);
        ratios.setCalculatedAt(LocalDateTime.now());

        ratiosRepository.save(ratios); // Overwrites if exists
        log.info("Saved financial ratios for user: {}", profile.getUserId());
    }

    private void calculateAndSaveSpending(UserProfile profile) {
        log.info("Calculating and saving spending analysis for user: {}", profile.getUserId());

        Map<String, Double> categories = new HashMap<>();

        // Calculate spending by category
        Double debtPayments = calculateDebtPayments(profile);
        Double food = calculateFoodExpenses(profile);
        Double transportation = calculateTransportation(profile);
        Double housing = calculateHousing(profile);
        Double utilities = calculateUtilities(profile);
        Double healthcare = calculateHealthcare(profile);
        Double entertainment = calculateEntertainment(profile);
        Double education = calculateEducation(profile);

        categories.put("Debt Payments", debtPayments);
        categories.put("Food", food);
        categories.put("Transportation", transportation);
        categories.put("Housing", housing);
        categories.put("Utilities", utilities);
        categories.put("Healthcare", healthcare);
        categories.put("Entertainment", entertainment);
        categories.put("Education", education);

        Double total = categories.values().stream().mapToDouble(Double::doubleValue).sum();

        // Calculate percentages
        Map<String, Double> percentages = new HashMap<>();
        for (Map.Entry<String, Double> entry : categories.entrySet()) {
            Double percentage = total > 0 ? (entry.getValue() / total) * 100 : 0.0;
            percentages.put(entry.getKey(), percentage);
        }

        // Get top 3 categories
        List<String> topCategories = categories.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .toList();

        // Generate insights
        List<String> insights = new ArrayList<>();
        if (total > 0) {
            if (debtPayments > total * 0.30) {
                insights.add("Debt payments consuming " + String.format("%.0f", (debtPayments/total)*100) + "% of expenses - priority to eliminate");
            }
            if (food > total * 0.25) {
                insights.add("Food expenses are high - consider meal planning to reduce costs");
            }
        }

        // Find existing or create new (overwrite pattern)
        SpendingByCategory spending = spendingRepository.findByUserId(profile.getUserId())
                .orElse(new SpendingByCategory());

        spending.setUserId(profile.getUserId());
        spending.setCategories(categories);
        spending.setPercentages(percentages);
        spending.setTopCategories(topCategories);
        spending.setInsights(insights);
        spending.setCalculatedAt(LocalDateTime.now());

        spendingRepository.save(spending); // Overwrites if exists
        log.info("Saved spending analysis for user: {}", profile.getUserId());
    }

    private void saveNetWorthSnapshot(UserProfile profile) {
        log.info("Saving net worth snapshot for user: {}", profile.getUserId());

        Double netWorth = profile.getAssetsAndSavings() != null ?
                (profile.getAssetsAndSavings().getNetWorth() != null ? profile.getAssetsAndSavings().getNetWorth() : 0.0) : 0.0;

        NetWorthHistory history = new NetWorthHistory();
        history.setUserId(profile.getUserId());
        history.setNetWorth(netWorth);
        history.setRecordedAt(LocalDateTime.now());

        netWorthRepository.save(history); // Always append, never overwrite
        log.info("Saved net worth snapshot for user: {} - Net Worth: {}", profile.getUserId(), netWorth);
    }

    // ========================================
    // INTERNAL: Mapping from DB Models to DTOs
    // ========================================

    private FinancialHealthScoreResponse mapToHealthScoreResponse(FinancialHealthScore saved) {
        FinancialHealthScoreResponse response = new FinancialHealthScoreResponse();
        response.setOverallScore(saved.getOverallScore());
        response.setStatus(saved.getStatus());

        Map<String, Integer> componentScores = new HashMap<>();
        componentScores.put("incomeStability", saved.getIncomeStabilityScore());
        componentScores.put("expenseManagement", saved.getExpenseManagementScore());
        componentScores.put("debtHealth", saved.getDebtHealthScore());
        componentScores.put("emergencyFund", saved.getEmergencyFundScore());
        componentScores.put("savingsRate", saved.getSavingsRateScore());
        response.setComponentScores(componentScores);

        response.setTopRecommendations(saved.getTopRecommendations());
        response.setCalculatedAt(saved.getCalculatedAt());

        return response;
    }

    private FinancialRatiosResponse mapToRatiosResponse(FinancialRatios saved) {
        FinancialRatiosResponse response = new FinancialRatiosResponse();
        response.setDebtToIncomeRatio(saved.getDebtToIncomeRatio());
        response.setDebtToIncomeStatus(saved.getDebtToIncomeStatus());
        response.setSavingsRate(saved.getSavingsRate());
        response.setSavingsRateStatus(saved.getSavingsRateStatus());
        response.setEmergencyFundMonths(saved.getEmergencyFundMonths());
        response.setEmergencyFundStatus(saved.getEmergencyFundStatus());
        response.setExpenseToIncomeRatio(saved.getExpenseToIncomeRatio());
        response.setExpenseToIncomeStatus(saved.getExpenseToIncomeStatus());
        response.setCalculatedAt(saved.getCalculatedAt());

        return response;
    }

    private SpendingByCategoryResponse mapToSpendingResponse(SpendingByCategory saved) {
        SpendingByCategoryResponse response = new SpendingByCategoryResponse();
        response.setCategories(saved.getCategories());
        response.setPercentages(saved.getPercentages());
        response.setTopCategories(saved.getTopCategories());
        response.setInsights(saved.getInsights());
        response.setCalculatedAt(saved.getCalculatedAt());

        return response;
    }

    // ========================================
    // INTERNAL: Calculation Helper Methods
    // ========================================

    private int calculateIncomeStabilityScore(Income income) {
        if (income == null) return 0;
        String stability = income.getIncomeStability();
        if (stability == null) return 50;

        return switch (stability) {
            case "Very stable" -> 100;
            case "Mostly stable" -> 80;
            case "Variable" -> 60;
            case "Highly variable" -> 40;
            default -> 50;
        };
    }

    private int calculateExpenseManagementScore(UserProfile profile) {
        Double income = calculateMonthlyIncome(profile);
        Double expenses = calculateMonthlyExpenses(profile);

        if (income == 0) return 0;

        Double ratio = expenses / income;
        if (ratio <= 0.70) return 100;
        if (ratio <= 0.80) return 80;
        if (ratio <= 0.90) return 60;
        if (ratio <= 1.00) return 40;
        return 20;
    }

    private int calculateDebtHealthScore(UserProfile profile) {
        Double totalDebt = calculateTotalDebt(profile);
        Double annualIncome = calculateMonthlyIncome(profile) * 12;

        if (annualIncome == 0) return totalDebt > 0 ? 0 : 100;

        Double debtToIncomeRatio = (totalDebt / annualIncome) * 100;

        if (debtToIncomeRatio == 0) return 100;
        if (debtToIncomeRatio < 100) return 90;
        if (debtToIncomeRatio < 200) return 70;
        if (debtToIncomeRatio < 300) return 50;
        if (debtToIncomeRatio < 400) return 30;
        return 10;
    }

    private int calculateEmergencyFundScore(UserProfile profile) {
        Double monthlyExpenses = calculateMonthlyExpenses(profile);
        Double emergencyFund = profile.getAssetsAndSavings() != null ?
                (profile.getAssetsAndSavings().getEmergencyFund() != null ? profile.getAssetsAndSavings().getEmergencyFund() : 0.0) : 0.0;

        if (monthlyExpenses == 0) return emergencyFund > 0 ? 100 : 0;

        Double monthsCovered = emergencyFund / monthlyExpenses;

        if (monthsCovered >= 6) return 100;
        if (monthsCovered >= 3) return 75;
        if (monthsCovered >= 1) return 50;
        if (monthsCovered > 0) return 25;
        return 0;
    }

    private int calculateSavingsRateScore(UserProfile profile) {
        Double income = calculateMonthlyIncome(profile);
        Double expenses = calculateMonthlyExpenses(profile);

        if (income == 0) return 0;

        Double savingsRate = ((income - expenses) / income) * 100;

        if (savingsRate >= 20) return 100;
        if (savingsRate >= 15) return 80;
        if (savingsRate >= 10) return 60;
        if (savingsRate >= 5) return 40;
        if (savingsRate > 0) return 20;
        return 0;
    }

    private String determineStatus(int overallScore) {
        if (overallScore >= 80) return "Excellent";
        if (overallScore >= 60) return "Good";
        if (overallScore >= 40) return "Fair";
        return "Poor";
    }

    private List<String> generateRecommendations(UserProfile profile, int overallScore) {
        List<String> recommendations = new ArrayList<>();

        Double income = calculateMonthlyIncome(profile);
        Double expenses = calculateMonthlyExpenses(profile);
        Double emergencyFund = profile.getAssetsAndSavings() != null ?
                (profile.getAssetsAndSavings().getEmergencyFund() != null ? profile.getAssetsAndSavings().getEmergencyFund() : 0.0) : 0.0;

        if (income > 0) {
            Double expenseRatio = expenses / income;
            if (expenseRatio > 0.90) {
                recommendations.add("Your expenses are very high relative to income. Focus on reducing non-essential spending.");
            }

            Double monthsCovered = expenses > 0 ? emergencyFund / expenses : 0;
            if (monthsCovered < 3) {
                recommendations.add("Build your emergency fund to cover at least 3-6 months of expenses.");
            }

            Double savingsRate = ((income - expenses) / income) * 100;
            if (savingsRate < 10) {
                recommendations.add("Aim to save at least 10-20% of your monthly income.");
            }
        }

        Double totalDebt = calculateTotalDebt(profile);
        if (totalDebt > income * 12 * 2) {
            recommendations.add("Your debt level is high. Consider a debt reduction strategy like the debt snowball or avalanche method.");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("You're doing well! Continue maintaining good financial habits.");
        }

        return recommendations;
    }

    private Double calculateMonthlyIncome(UserProfile profile) {
        if (profile.getIncome() == null) return 0.0;
        return profile.getIncome().getTotalMonthlyIncome() != null ?
                profile.getIncome().getTotalMonthlyIncome() : 0.0;
    }

    private Double calculateMonthlyExpenses(UserProfile profile) {
        Double fixed = 0.0;
        Double variable = 0.0;

        if (profile.getFixedExpenses() != null && profile.getFixedExpenses().getTotalFixedExpenses() != null) {
            fixed = profile.getFixedExpenses().getTotalFixedExpenses();
        }

        if (profile.getVariableExpenses() != null && profile.getVariableExpenses().getTotalVariableExpenses() != null) {
            variable = profile.getVariableExpenses().getTotalVariableExpenses();
        }

        return fixed + variable;
    }

    private Double calculateTotalDebt(UserProfile profile) {
        if (profile.getDebts() == null) return 0.0;

        return profile.getDebts().stream()
                .mapToDouble(debt -> debt.getTotalAmountOwed() != null ? debt.getTotalAmountOwed() : 0.0)
                .sum();
    }

    private Double calculateDebtPayments(UserProfile profile) {
        if (profile.getDebts() == null) return 0.0;

        return profile.getDebts().stream()
                .mapToDouble(debt -> debt.getMonthlyPayment() != null ? debt.getMonthlyPayment() : 0.0)
                .sum();
    }

    private Double calculateFoodExpenses(UserProfile profile) {
        if (profile.getVariableExpenses() == null) return 0.0;

        Double grocery = profile.getVariableExpenses().getGroceryShopping() != null ?
                profile.getVariableExpenses().getGroceryShopping() : 0.0;
        Double eatingOut = profile.getVariableExpenses().getEatingOut() != null ?
                profile.getVariableExpenses().getEatingOut() : 0.0;

        return grocery + eatingOut;
    }

    private Double calculateTransportation(UserProfile profile) {
        if (profile.getFixedExpenses() == null) return 0.0;

        Double fuel = profile.getFixedExpenses().getMonthlyFuel() != null ?
                profile.getFixedExpenses().getMonthlyFuel() : 0.0;
        Double transport = profile.getFixedExpenses().getPublicTransportPass() != null ?
                profile.getFixedExpenses().getPublicTransportPass() : 0.0;
        Double parking = profile.getFixedExpenses().getParking() != null ?
                profile.getFixedExpenses().getParking() : 0.0;

        return fuel + transport + parking;
    }

    private Double calculateHousing(UserProfile profile) {
        if (profile.getFixedExpenses() == null) return 0.0;

        Double rent = profile.getFixedExpenses().getRent() != null ?
                profile.getFixedExpenses().getRent() : 0.0;
        Double propertyTax = profile.getFixedExpenses().getPropertyTax() != null ?
                profile.getFixedExpenses().getPropertyTax() : 0.0;
        Double insurance = profile.getFixedExpenses().getHomeInsurance() != null ?
                profile.getFixedExpenses().getHomeInsurance() : 0.0;

        return rent + propertyTax + insurance;
    }

    private Double calculateUtilities(UserProfile profile) {
        if (profile.getFixedExpenses() == null) return 0.0;

        Double electricity = profile.getFixedExpenses().getElectricity() != null ?
                profile.getFixedExpenses().getElectricity() : 0.0;
        Double water = profile.getFixedExpenses().getWater() != null ?
                profile.getFixedExpenses().getWater() : 0.0;
        Double gas = profile.getFixedExpenses().getGas() != null ?
                profile.getFixedExpenses().getGas() : 0.0;
        Double internet = profile.getFixedExpenses().getInternet() != null ?
                profile.getFixedExpenses().getInternet() : 0.0;

        return electricity + water + gas + internet;
    }

    private Double calculateHealthcare(UserProfile profile) {
        if (profile.getVariableExpenses() == null) return 0.0;

        return profile.getVariableExpenses().getHealthCare() != null ?
                profile.getVariableExpenses().getHealthCare() : 0.0;
    }

    private Double calculateEntertainment(UserProfile profile) {
        if (profile.getVariableExpenses() == null) return 0.0;

        return profile.getVariableExpenses().getEntertainment() != null ?
                profile.getVariableExpenses().getEntertainment() : 0.0;
    }

    private Double calculateEducation(UserProfile profile) {
        if (profile.getVariableExpenses() == null) return 0.0;

        return profile.getVariableExpenses().getEducation() != null ?
                profile.getVariableExpenses().getEducation() : 0.0;
    }
}
