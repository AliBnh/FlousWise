package com.finance_service.finance.service;

import com.finance_service.finance.dto.DashboardSummaryResponse;
import com.finance_service.finance.dto.FinancialHealthScoreResponse;
import com.finance_service.finance.dto.ProfileResponse;
import com.finance_service.finance.exception.ProfileAlreadyExistsException;
import com.finance_service.finance.exception.ProfileNotFoundException;
import com.finance_service.finance.model.*;
import com.finance_service.finance.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final KafkaProducerService kafkaProducerService;
    private final AnalyticsService analyticsService;

    @Transactional
    public ProfileResponse createProfile(String userId, UserProfile profileData) {
        log.info("Creating profile for user: {}", userId);

        if (userProfileRepository.existsByUserId(userId)) {
            throw new ProfileAlreadyExistsException("Profile already exists for user: " + userId);
        }

        profileData.setUserId(userId);
        profileData.setCreatedAt(LocalDateTime.now());
        profileData.setUpdatedAt(LocalDateTime.now());

        // Set isProfileComplete to false if not provided
        if (profileData.getIsProfileComplete() == null) {
            profileData.setIsProfileComplete(false);
        }

        // Calculate totals
        calculateAndCacheTotals(profileData);

        UserProfile savedProfile = userProfileRepository.save(profileData);

        // Calculate and save all analytics
        analyticsService.calculateAndSaveAllAnalytics(userId);

        // Publish event
        kafkaProducerService.publishProfileCreatedEvent(userId);

        return mapToProfileResponse(savedProfile);
    }

    public ProfileResponse getProfile(String userId) {
        log.info("Fetching profile for user: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        return mapToProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(String userId, UserProfile profileData) {
        log.info("Updating profile for user: {}", userId);

        UserProfile existingProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        // Update fields
        existingProfile.setBasicInformation(profileData.getBasicInformation());
        existingProfile.setIncome(profileData.getIncome());
        existingProfile.setDependents(profileData.getDependents());
        existingProfile.setFixedExpenses(profileData.getFixedExpenses());
        existingProfile.setVariableExpenses(profileData.getVariableExpenses());
        existingProfile.setDebts(profileData.getDebts());
        existingProfile.setAssetsAndSavings(profileData.getAssetsAndSavings());
        existingProfile.setSkills(profileData.getSkills());
        existingProfile.setFinancialGoals(profileData.getFinancialGoals());
        existingProfile.setMoroccanSpecificInfo(profileData.getMoroccanSpecificInfo());
        existingProfile.setRiskProfile(profileData.getRiskProfile());
        existingProfile.setAdditionalContext(profileData.getAdditionalContext());
        existingProfile.setUpdatedAt(LocalDateTime.now());

        // Recalculate totals
        calculateAndCacheTotals(existingProfile);

        UserProfile updatedProfile = userProfileRepository.save(existingProfile);

        // Recalculate and save all analytics
        analyticsService.calculateAndSaveAllAnalytics(userId);

        // Publish event
        kafkaProducerService.publishProfileUpdatedEvent(userId, "full_profile");

        return mapToProfileResponse(updatedProfile);
    }

    @Transactional
    public void deleteProfile(String userId) {
        log.info("Deleting profile for user: {}", userId);

        if (!userProfileRepository.existsByUserId(userId)) {
            throw new ProfileNotFoundException("Profile not found for user: " + userId);
        }

        userProfileRepository.deleteByUserId(userId);

        // Publish event
        kafkaProducerService.publishProfileDeletedEvent(userId);
    }

    public DashboardSummaryResponse getDashboardSummary(String userId) {
        log.info("Fetching dashboard summary for user: {}", userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        Double monthlyIncome = calculateTotalIncome(profile.getIncome());
        Double monthlyExpenses = calculateTotalExpenses(profile);
        Double netSurplus = monthlyIncome - monthlyExpenses;

        // Get health score from saved analytics (read-only, no calculation)
        FinancialHealthScoreResponse healthScoreResponse = analyticsService.getHealthScore(userId);
        Integer overallScore = healthScoreResponse.getOverallScore();

        return new DashboardSummaryResponse(monthlyIncome, monthlyExpenses, netSurplus, overallScore);
    }

    // Helper methods
    private void calculateAndCacheTotals(UserProfile profile) {
        if (profile.getIncome() != null) {
            Double totalIncome = calculateTotalIncome(profile.getIncome());
            profile.getIncome().setTotalMonthlyIncome(totalIncome);
        }

        if (profile.getFixedExpenses() != null) {
            Double totalFixed = calculateTotalFixedExpenses(profile.getFixedExpenses());
            profile.getFixedExpenses().setTotalFixedExpenses(totalFixed);
        }

        if (profile.getVariableExpenses() != null) {
            Double totalVariable = calculateTotalVariableExpenses(profile.getVariableExpenses());
            profile.getVariableExpenses().setTotalVariableExpenses(totalVariable);
        }

        if (profile.getAssetsAndSavings() != null && profile.getDebts() != null) {
            Double totalAssets = calculateTotalAssets(profile.getAssetsAndSavings());
            Double totalDebts = calculateTotalDebt(profile.getDebts());
            Double netWorth = totalAssets - totalDebts;

            profile.getAssetsAndSavings().setTotalAssets(totalAssets);
            profile.getAssetsAndSavings().setNetWorth(netWorth);
        }
    }

    private Double calculateTotalIncome(Income income) {
        if (income == null) return 0.0;

        Double total = income.getMonthlyNetSalary() != null ? income.getMonthlyNetSalary() : 0.0;
        total += income.getAverageMonthlyIncome() != null ? income.getAverageMonthlyIncome() : 0.0;

        if (income.getAdditionalSources() != null) {
            for (AdditionalIncomeSource source : income.getAdditionalSources()) {
                total += source.getMonthlyAmount() != null ? source.getMonthlyAmount() : 0.0;
            }
        }

        return total;
    }

    private Double calculateTotalFixedExpenses(FixedExpenses expenses) {
        if (expenses == null) return 0.0;

        Double total = 0.0;
        total += expenses.getRent() != null ? expenses.getRent() : 0.0;
        total += expenses.getPropertyTax() != null ? expenses.getPropertyTax() : 0.0;
        total += expenses.getHomeInsurance() != null ? expenses.getHomeInsurance() : 0.0;
        total += expenses.getElectricity() != null ? expenses.getElectricity() : 0.0;
        total += expenses.getWater() != null ? expenses.getWater() : 0.0;
        total += expenses.getGas() != null ? expenses.getGas() : 0.0;
        total += expenses.getInternet() != null ? expenses.getInternet() : 0.0;
        total += expenses.getFixedPhoneLine() != null ? expenses.getFixedPhoneLine() : 0.0;
        total += expenses.getMobilePhonePlan() != null ? expenses.getMobilePhonePlan() : 0.0;
        total += expenses.getAdditionalPhones() != null ? expenses.getAdditionalPhones() : 0.0;
        total += expenses.getCarLoanPayment() != null ? expenses.getCarLoanPayment() : 0.0;
        total += expenses.getCarInsurance() != null ? expenses.getCarInsurance() : 0.0;
        total += expenses.getMonthlyFuel() != null ? expenses.getMonthlyFuel() : 0.0;
        total += expenses.getPublicTransportPass() != null ? expenses.getPublicTransportPass() : 0.0;
        total += expenses.getParking() != null ? expenses.getParking() : 0.0;
        total += expenses.getMaintenanceReserve() != null ? expenses.getMaintenanceReserve() : 0.0;
        total += expenses.getHealthInsurance() != null ? expenses.getHealthInsurance() : 0.0;
        total += expenses.getLifeInsurance() != null ? expenses.getLifeInsurance() : 0.0;
        total += expenses.getOtherInsurance() != null ? expenses.getOtherInsurance() : 0.0;

        if (expenses.getSubscriptions() != null) {
            for (Subscription sub : expenses.getSubscriptions()) {
                total += sub.getMonthlyCost() != null ? sub.getMonthlyCost() : 0.0;
            }
        }

        total += expenses.getOtherFixedExpensesAmount() != null ? expenses.getOtherFixedExpensesAmount() : 0.0;

        return total;
    }

    private Double calculateTotalVariableExpenses(VariableExpenses expenses) {
        if (expenses == null) return 0.0;

        Double total = 0.0;
        total += expenses.getGroceryShopping() != null ? expenses.getGroceryShopping() : 0.0;
        total += expenses.getEatingOut() != null ? expenses.getEatingOut() : 0.0;
        total += expenses.getCoffee() != null ? expenses.getCoffee() : 0.0;
        total += expenses.getFoodDelivery() != null ? expenses.getFoodDelivery() : 0.0;
        total += expenses.getMedications() != null ? expenses.getMedications() : 0.0;
        total += expenses.getDoctorVisits() != null ? expenses.getDoctorVisits() : 0.0;
        total += expenses.getPharmacyItems() != null ? expenses.getPharmacyItems() : 0.0;
        total += expenses.getHygieneProducts() != null ? expenses.getHygieneProducts() : 0.0;
        total += expenses.getHaircutsSalon() != null ? expenses.getHaircutsSalon() : 0.0;
        total += expenses.getOtherPersonalCare() != null ? expenses.getOtherPersonalCare() : 0.0;
        total += expenses.getClothingSpending() != null ? expenses.getClothingSpending() : 0.0;
        total += expenses.getSchoolFees() != null ? expenses.getSchoolFees() : 0.0;
        total += expenses.getSchoolSupplies() != null ? expenses.getSchoolSupplies() : 0.0;
        total += expenses.getTutoring() != null ? expenses.getTutoring() : 0.0;
        total += expenses.getOnlineCourses() != null ? expenses.getOnlineCourses() : 0.0;
        total += expenses.getMoviesEvents() != null ? expenses.getMoviesEvents() : 0.0;
        total += expenses.getHobbies() != null ? expenses.getHobbies() : 0.0;
        total += expenses.getSportsGym() != null ? expenses.getSportsGym() : 0.0;
        total += expenses.getOtherEntertainment() != null ? expenses.getOtherEntertainment() : 0.0;
        total += expenses.getGifts() != null ? expenses.getGifts() : 0.0;
        total += expenses.getCharityDonations() != null ? expenses.getCharityDonations() : 0.0;
        total += expenses.getFamilyGatherings() != null ? expenses.getFamilyGatherings() : 0.0;

        return total;
    }

    private Double calculateTotalExpenses(UserProfile profile) {
        Double fixed = calculateTotalFixedExpenses(profile.getFixedExpenses());
        Double variable = calculateTotalVariableExpenses(profile.getVariableExpenses());
        return fixed + variable;
    }

    private Double calculateTotalDebt(List<Debt> debts) {
        if (debts == null) return 0.0;
        return debts.stream()
                .mapToDouble(debt -> debt.getTotalAmountOwed() != null ? debt.getTotalAmountOwed() : 0.0)
                .sum();
    }

    private Double calculateTotalAssets(AssetsAndSavings assets) {
        if (assets == null) return 0.0;

        Double total = 0.0;
        total += assets.getBankAccountBalance() != null ? assets.getBankAccountBalance() : 0.0;
        total += assets.getCashAtHome() != null ? assets.getCashAtHome() : 0.0;
        total += assets.getEmergencyFund() != null ? assets.getEmergencyFund() : 0.0;
        total += assets.getOtherLiquidSavings() != null ? assets.getOtherLiquidSavings() : 0.0;
        total += assets.getCarValue() != null ? assets.getCarValue() : 0.0;
        total += assets.getMotorcycleValue() != null ? assets.getMotorcycleValue() : 0.0;
        total += assets.getPropertyValue() != null ? assets.getPropertyValue() : 0.0;
        total += assets.getLaptopValue() != null ? assets.getLaptopValue() : 0.0;
        total += assets.getPhoneValue() != null ? assets.getPhoneValue() : 0.0;
        total += assets.getGoldJewelryValue() != null ? assets.getGoldJewelryValue() : 0.0;
        total += assets.getOtherValuableItemsValue() != null ? assets.getOtherValuableItemsValue() : 0.0;
        total += assets.getStocks() != null ? assets.getStocks() : 0.0;
        total += assets.getMutualFunds() != null ? assets.getMutualFunds() : 0.0;
        total += assets.getBusinessInvestment() != null ? assets.getBusinessInvestment() : 0.0;
        total += assets.getCryptocurrency() != null ? assets.getCryptocurrency() : 0.0;
        total += assets.getOtherInvestmentsValue() != null ? assets.getOtherInvestmentsValue() : 0.0;

        return total;
    }

    private ProfileResponse mapToProfileResponse(UserProfile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setBasicInformation(profile.getBasicInformation());
        response.setIncome(profile.getIncome());
        response.setDependents(profile.getDependents());
        response.setFixedExpenses(profile.getFixedExpenses());
        response.setVariableExpenses(profile.getVariableExpenses());
        response.setDebts(profile.getDebts());
        response.setAssetsAndSavings(profile.getAssetsAndSavings());
        response.setSkills(profile.getSkills());
        response.setFinancialGoals(profile.getFinancialGoals());
        response.setMoroccanSpecificInfo(profile.getMoroccanSpecificInfo());
        response.setRiskProfile(profile.getRiskProfile());
        response.setAdditionalContext(profile.getAdditionalContext());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        response.setIsProfileComplete(profile.getIsProfileComplete());
        return response;
    }
}
