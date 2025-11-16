import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeService } from '../services/financeService';
import type { DashboardSummary } from '../types/finance';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardPage() {
  const navigate = useNavigate();
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
            <button
              onClick={() => navigate('/profile/create')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
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
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <span className="text-2xl">✏️</span>
                  <span className="font-medium text-gray-700">Update Profile</span>
                </button>
                <button
                  onClick={() => navigate('/analytics')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <span className="text-2xl">📈</span>
                  <span className="font-medium text-gray-700">View Analytics</span>
                </button>
                <button
                  onClick={() => navigate('/profile/create')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <span className="text-2xl">🎯</span>
                  <span className="font-medium text-gray-700">Set Goals</span>
                </button>
              </div>
            </div>

            {/* Financial Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Income vs Expenses Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Income vs Expenses</h2>
                <Bar
                  data={{
                    labels: ['Monthly Overview'],
                    datasets: [
                      {
                        label: 'Income',
                        data: [summary.monthlyIncome],
                        backgroundColor: 'rgba(34, 197, 94, 0.7)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2,
                      },
                      {
                        label: 'Expenses',
                        data: [summary.monthlyExpenses],
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return value + ' MAD';
                          },
                        },
                      },
                    },
                  }}
                />
              </div>

              {/* Financial Health Breakdown */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Health Score</h2>
                <div className="flex items-center justify-center h-64">
                  <Doughnut
                    data={{
                      labels: ['Health Score', 'Room for Improvement'],
                      datasets: [
                        {
                          data: [summary.financialHealthScore, 100 - summary.financialHealthScore],
                          backgroundColor: [
                            summary.financialHealthScore >= 80
                              ? 'rgba(34, 197, 94, 0.8)'
                              : summary.financialHealthScore >= 60
                              ? 'rgba(234, 179, 8, 0.8)'
                              : 'rgba(239, 68, 68, 0.8)',
                            'rgba(229, 231, 235, 0.5)',
                          ],
                          borderColor: [
                            summary.financialHealthScore >= 80
                              ? 'rgba(34, 197, 94, 1)'
                              : summary.financialHealthScore >= 60
                              ? 'rgba(234, 179, 8, 1)'
                              : 'rgba(239, 68, 68, 1)',
                            'rgba(229, 231, 235, 1)',
                          ],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.label + ': ' + context.parsed + '/100';
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="text-center mt-4">
                  <p className="text-2xl font-bold text-gray-900">{summary.financialHealthScore}/100</p>
                  <p className="text-sm text-gray-600">
                    {summary.financialHealthScore >= 80
                      ? 'Excellent financial health!'
                      : summary.financialHealthScore >= 60
                      ? 'Good, but room for improvement'
                      : 'Needs attention'}
                  </p>
                </div>
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
