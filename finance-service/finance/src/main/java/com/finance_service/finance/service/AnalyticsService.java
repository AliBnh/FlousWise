package com.finance_service.finance.service;

import com.finance_service.finance.dto.*;
import com.finance_service.finance.exception.ProfileNotFoundException;
import com.finance_service.finance.model.*;
import com.finance_service.finance.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    public AnalyticsResponse getCompleteAnalytics(String userId) {
        log.info("Fetching complete analytics for user: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        AnalyticsResponse response = new AnalyticsResponse();
        response.setFinancialHealthScore(calculateHealthScore(profile));
        response.setFinancialRatios(calculateRatios(profile));
        response.setSpendingByCategory(analyzeSpending(profile));
        response.setNetWorthTrend(getNetWorthTrend(userId, 6));

        return response;
    }

    public FinancialHealthScoreResponse calculateHealthScore(UserProfile profile) {
        log.info("Calculating financial health score for user: {}", profile.getUserId());

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

        // Generate recommendations
        List<String> recommendations = generateRecommendations(profile, overallScore);

        // Save to database
        FinancialHealthScore healthScore = new FinancialHealthScore();
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
        healthScoreRepository.save(healthScore);

        // Map to response
        FinancialHealthScoreResponse response = new FinancialHealthScoreResponse();
        response.setOverallScore(overallScore);
        response.setStatus(status);

        Map<String, Integer> componentScores = new HashMap<>();
        componentScores.put("incomeStability", incomeStability);
        componentScores.put("expenseManagement", expenseManagement);
        componentScores.put("debtHealth", debtHealth);
        componentScores.put("emergencyFund", emergencyFund);
        componentScores.put("savingsRate", savingsRate);
        response.setComponentScores(componentScores);

        response.setTopRecommendations(recommendations);
        response.setCalculatedAt(LocalDateTime.now());

        return response;
    }

    public FinancialRatiosResponse calculateRatios(UserProfile profile) {
        log.info("Calculating financial ratios for user: {}", profile.getUserId());

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

        // Save to database
        FinancialRatios ratios = new FinancialRatios();
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
        ratiosRepository.save(ratios);

        // Map to response
        FinancialRatiosResponse response = new FinancialRatiosResponse();
        response.setDebtToIncomeRatio(debtToIncome);
        response.setDebtToIncomeStatus(debtStatus);
        response.setSavingsRate(savingsRate);
        response.setSavingsRateStatus(savingsStatus);
        response.setEmergencyFundMonths(emergencyFundMonths);
        response.setEmergencyFundStatus(emergencyStatus);
        response.setExpenseToIncomeRatio(expenseToIncome);
        response.setExpenseToIncomeStatus(expenseStatus);
        response.setCalculatedAt(LocalDateTime.now());

        return response;
    }

    public SpendingByCategoryResponse analyzeSpending(UserProfile profile) {
        log.info("Analyzing spending for user: {}", profile.getUserId());

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
        if (debtPayments > total * 0.30) {
            insights.add("Debt payments consuming " + String.format("%.0f", (debtPayments/total)*100) + "% of expenses - priority to eliminate");
        }
        if (food > total * 0.25) {
            insights.add("Food expenses are high - consider meal planning to reduce costs");
        }

        SpendingByCategoryResponse response = new SpendingByCategoryResponse();
        response.setCategories(categories);
        response.setPercentages(percentages);
        response.setTopCategories(topCategories);
        response.setInsights(insights);

        return response;
    }

    public List<NetWorthDataPoint> getNetWorthTrend(String userId, int months) {
        log.info("Fetching net worth trend for user: {} for {} months", userId, months);

        LocalDateTime startDate = LocalDateTime.now().minusMonths(months);
        List<NetWorthHistory> history = netWorthRepository.findByUserIdAndRecordedAtAfter(userId, startDate);

        return history.stream()
                .map(h -> new NetWorthDataPoint(h.getRecordedAt(), h.getNetWorth()))
                .toList();
    }

    // Helper methods
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
        if (totalDebt == 0) return 100;

        Double ratio = totalDebt / annualIncome;
        if (ratio <= 1.0) return 100;
        if (ratio <= 2.0) return 70;
        if (ratio <= 3.0) return 40;
        return 20;
    }

    private int calculateEmergencyFundScore(UserProfile profile) {
        AssetsAndSavings assets = profile.getAssetsAndSavings();
        if (assets == null || assets.getEmergencyFund() == null) return 0;

        Double emergencyFund = assets.getEmergencyFund();
        Double monthlyExpenses = calculateMonthlyExpenses(profile);

        if (monthlyExpenses == 0) return emergencyFund > 0 ? 100 : 0;

        Double months = emergencyFund / monthlyExpenses;
        if (months >= 6) return 100;
        if (months >= 3) return 80;
        if (months >= 1) return 50;
        return 20;
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
        return 20;
    }

    private String determineStatus(int score) {
        if (score >= 81) return "Excellent";
        if (score >= 61) return "Good";
        if (score >= 41) return "Needs Improvement";
        return "Critical";
    }

    private List<String> generateRecommendations(UserProfile profile, int score) {
        List<String> recommendations = new ArrayList<>();

        Double monthlyExpenses = calculateMonthlyExpenses(profile);
        AssetsAndSavings assets = profile.getAssetsAndSavings();
        Double emergencyFund = assets != null && assets.getEmergencyFund() != null ? assets.getEmergencyFund() : 0.0;

        if (emergencyFund < monthlyExpenses * 3) {
            recommendations.add("Build emergency fund to 3-6 months of expenses");
        }

        Double totalDebt = calculateTotalDebt(profile);
        if (totalDebt > 0) {
            recommendations.add("Focus on paying off high-interest debt");
        }

        Double income = calculateMonthlyIncome(profile);
        if ((income - monthlyExpenses) / income < 0.15) {
            recommendations.add("Reduce expenses by 10-15%");
        }

        return recommendations.size() > 3 ? recommendations.subList(0, 3) : recommendations;
    }

    private Double calculateMonthlyIncome(UserProfile profile) {
        Income income = profile.getIncome();
        if (income == null) return 0.0;
        return income.getTotalMonthlyIncome() != null ? income.getTotalMonthlyIncome() : 0.0;
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
        VariableExpenses ve = profile.getVariableExpenses();
        if (ve == null) return 0.0;

        Double total = 0.0;
        total += ve.getGroceryShopping() != null ? ve.getGroceryShopping() : 0.0;
        total += ve.getEatingOut() != null ? ve.getEatingOut() : 0.0;
        total += ve.getCoffee() != null ? ve.getCoffee() : 0.0;
        total += ve.getFoodDelivery() != null ? ve.getFoodDelivery() : 0.0;

        return total;
    }

    private Double calculateTransportation(UserProfile profile) {
        FixedExpenses fe = profile.getFixedExpenses();
        if (fe == null) return 0.0;

        Double total = 0.0;
        total += fe.getCarLoanPayment() != null ? fe.getCarLoanPayment() : 0.0;
        total += fe.getCarInsurance() != null ? fe.getCarInsurance() : 0.0;
        total += fe.getMonthlyFuel() != null ? fe.getMonthlyFuel() : 0.0;
        total += fe.getPublicTransportPass() != null ? fe.getPublicTransportPass() : 0.0;

        return total;
    }

    private Double calculateHousing(UserProfile profile) {
        FixedExpenses fe = profile.getFixedExpenses();
        if (fe == null) return 0.0;

        Double total = 0.0;
        total += fe.getRent() != null ? fe.getRent() : 0.0;
        total += fe.getPropertyTax() != null ? fe.getPropertyTax() : 0.0;
        total += fe.getHomeInsurance() != null ? fe.getHomeInsurance() : 0.0;

        return total;
    }

    private Double calculateUtilities(UserProfile profile) {
        FixedExpenses fe = profile.getFixedExpenses();
        if (fe == null) return 0.0;

        Double total = 0.0;
        total += fe.getElectricity() != null ? fe.getElectricity() : 0.0;
        total += fe.getWater() != null ? fe.getWater() : 0.0;
        total += fe.getGas() != null ? fe.getGas() : 0.0;
        total += fe.getInternet() != null ? fe.getInternet() : 0.0;

        return total;
    }

    private Double calculateHealthcare(UserProfile profile) {
        VariableExpenses ve = profile.getVariableExpenses();
        if (ve == null) return 0.0;

        Double total = 0.0;
        total += ve.getMedications() != null ? ve.getMedications() : 0.0;
        total += ve.getDoctorVisits() != null ? ve.getDoctorVisits() : 0.0;
        total += ve.getPharmacyItems() != null ? ve.getPharmacyItems() : 0.0;

        return total;
    }

    private Double calculateEntertainment(UserProfile profile) {
        VariableExpenses ve = profile.getVariableExpenses();
        if (ve == null) return 0.0;

        Double total = 0.0;
        total += ve.getMoviesEvents() != null ? ve.getMoviesEvents() : 0.0;
        total += ve.getHobbies() != null ? ve.getHobbies() : 0.0;
        total += ve.getSportsGym() != null ? ve.getSportsGym() : 0.0;
        total += ve.getOtherEntertainment() != null ? ve.getOtherEntertainment() : 0.0;

        return total;
    }

    private Double calculateEducation(UserProfile profile) {
        VariableExpenses ve = profile.getVariableExpenses();
        if (ve == null) return 0.0;

        Double total = 0.0;
        total += ve.getSchoolFees() != null ? ve.getSchoolFees() : 0.0;
        total += ve.getSchoolSupplies() != null ? ve.getSchoolSupplies() : 0.0;
        total += ve.getTutoring() != null ? ve.getTutoring() : 0.0;
        total += ve.getOnlineCourses() != null ? ve.getOnlineCourses() : 0.0;

        return total;
    }
}
