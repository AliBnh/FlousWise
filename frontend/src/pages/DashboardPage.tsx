import { useEffect, useState } from 'react';
import { financeService } from '../services/financeService';
import type { DashboardSummary } from '../types/finance';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await financeService.getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      // If profile doesn't exist, show welcome message
      if (err.response?.status === 404) {
        setError('Welcome! Please complete your financial profile to see your dashboard.');
      } else {
        setError('Failed to load dashboard. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your financial health and progress</p>
        </div>

        {error ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create Your Profile
            </button>
          </div>
        ) : summary ? (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Monthly Income</h3>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{summary.monthlyIncome.toFixed(0)} MAD</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Monthly Expenses</h3>
                  <span className="text-2xl">💸</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{summary.monthlyExpenses.toFixed(0)} MAD</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Net Surplus/Deficit</h3>
                  <span className="text-2xl">{summary.netSurplus >= 0 ? '✅' : '⚠️'}</span>
                </div>
                <p className={`text-3xl font-bold ${summary.netSurplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.netSurplus >= 0 ? '+' : ''}{summary.netSurplus.toFixed(0)} MAD
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Financial Health</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{summary.financialHealthScore}/100</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      summary.financialHealthScore >= 80
                        ? 'bg-green-500'
                        : summary.financialHealthScore >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${summary.financialHealthScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <span className="text-2xl">✏️</span>
                  <span className="font-medium text-gray-700">Update Profile</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <span className="text-2xl">📈</span>
                  <span className="font-medium text-gray-700">View Analytics</span>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <span className="text-2xl">🎯</span>
                  <span className="font-medium text-gray-700">Set Goals</span>
                </button>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">AI Chat Coming Soon!</h3>
              <p className="text-primary-700">
                Ask our AI financial advisor personalized questions about your finances, powered by knowledge from bestselling finance books and Moroccan economic context.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
