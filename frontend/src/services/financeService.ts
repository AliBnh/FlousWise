import { financeApi } from './api';
import type {
  UserProfile,
  DashboardSummary,
  AnalyticsResponse,
  FinancialHealthScore,
  FinancialRatios,
  SpendingByCategory,
  NetWorthDataPoint,
} from '../types/finance';

export const financeService = {
  // Profile endpoints
  async createProfile(profileData: UserProfile): Promise<UserProfile> {
    const response = await financeApi.post('/profile', profileData);
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await financeApi.get('/profile');
    return response.data;
  },

  async updateProfile(profileData: UserProfile): Promise<UserProfile> {
    const response = await financeApi.put('/profile', profileData);
    return response.data;
  },

  async deleteProfile(): Promise<void> {
    await financeApi.delete('/profile');
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await financeApi.get('/profile/dashboard');
    return response.data;
  },

  // Analytics endpoints
  async getCompleteAnalytics(): Promise<AnalyticsResponse> {
    const response = await financeApi.get('/analytics');
    return response.data;
  },

  async getHealthScore(): Promise<FinancialHealthScore> {
    const response = await financeApi.get('/analytics/health-score');
    return response.data;
  },

  async getFinancialRatios(): Promise<FinancialRatios> {
    const response = await financeApi.get('/analytics/ratios');
    return response.data;
  },

  async getSpendingAnalysis(): Promise<SpendingByCategory> {
    const response = await financeApi.get('/analytics/spending');
    return response.data;
  },

  async getNetWorthTrend(months: number = 6): Promise<NetWorthDataPoint[]> {
    const response = await financeApi.get(`/analytics/net-worth?months=${months}`);
    return response.data;
  },

  async recalculateAnalytics(): Promise<AnalyticsResponse> {
    const response = await financeApi.post('/analytics/recalculate');
    return response.data;
  },
};
