import { useEffect, useState } from 'react';
import { financeService } from '../services/financeService';
import type { AnalyticsResponse } from '../types/finance';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Pie, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await financeService.getCompleteAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No analytics available. Please complete your financial profile first.');
      } else {
        setError('Failed to load analytics. Please try again.');
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
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Analytics Yet</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights into your financial health</p>
        </div>

        {analytics && (
          <div className="space-y-6">
            {/* Health Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Health Score</h2>
              <div className="flex items-center space-x-6 mb-6">
                <div className="text-6xl font-bold text-primary-600">
                  {analytics.financialHealthScore.overallScore}
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                <div>
                  <div className={`text-xl font-semibold mb-2 ${
                    analytics.financialHealthScore.status === 'Excellent' ? 'text-green-600' :
                    analytics.financialHealthScore.status === 'Good' ? 'text-blue-600' :
                    analytics.financialHealthScore.status === 'Fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {analytics.financialHealthScore.status}
                  </div>
                  <div className="w-64 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        analytics.financialHealthScore.overallScore >= 80 ? 'bg-green-500' :
                        analytics.financialHealthScore.overallScore >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${analytics.financialHealthScore.overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {Object.entries(analytics.financialHealthScore.componentScores).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                  </div>
                ))}
              </div>

              {/* Radar Chart for Component Scores */}
              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-center">Financial Health Components</h3>
                <div className="max-w-md mx-auto">
                  <Radar
                    data={{
                      labels: Object.keys(analytics.financialHealthScore.componentScores).map(key =>
                        key.replace(/([A-Z])/g, ' $1').trim()
                      ),
                      datasets: [
                        {
                          label: 'Your Score',
                          data: Object.values(analytics.financialHealthScore.componentScores),
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          borderColor: 'rgba(99, 102, 241, 1)',
                          borderWidth: 2,
                          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                          pointBorderColor: '#fff',
                          pointHoverBackgroundColor: '#fff',
                          pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        r: {
                          angleLines: {
                            display: true,
                          },
                          suggestedMin: 0,
                          suggestedMax: 100,
                          ticks: {
                            stepSize: 20,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Top Recommendations:</h3>
                <ul className="space-y-2">
                  {analytics.financialHealthScore.topRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Financial Ratios */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Financial Ratios</h2>

              {/* Bar Chart for Ratios */}
              <div className="mb-6 bg-gray-50 rounded-lg p-6">
                <Bar
                  data={{
                    labels: ['Debt-to-Income', 'Savings Rate', 'Emergency Fund', 'Expense-to-Income'],
                    datasets: [
                      {
                        label: 'Your Ratios (%)',
                        data: [
                          analytics.financialRatios.debtToIncomeRatio,
                          analytics.financialRatios.savingsRate,
                          (analytics.financialRatios.emergencyFundMonths / 6) * 100, // Convert to percentage (target 6 months)
                          analytics.financialRatios.expenseToIncomeRatio,
                        ],
                        backgroundColor: [
                          analytics.financialRatios.debtToIncomeStatus === 'Good' ? 'rgba(34, 197, 94, 0.7)' :
                          analytics.financialRatios.debtToIncomeStatus === 'Warning' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(239, 68, 68, 0.7)',

                          analytics.financialRatios.savingsRateStatus === 'Good' ? 'rgba(34, 197, 94, 0.7)' :
                          analytics.financialRatios.savingsRateStatus === 'Warning' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(239, 68, 68, 0.7)',

                          analytics.financialRatios.emergencyFundStatus === 'Good' ? 'rgba(34, 197, 94, 0.7)' :
                          analytics.financialRatios.emergencyFundStatus === 'Warning' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(239, 68, 68, 0.7)',

                          analytics.financialRatios.expenseToIncomeStatus === 'Good' ? 'rgba(34, 197, 94, 0.7)' :
                          analytics.financialRatios.expenseToIncomeStatus === 'Warning' ? 'rgba(234, 179, 8, 0.7)' : 'rgba(239, 68, 68, 0.7)',
                        ],
                        borderColor: [
                          analytics.financialRatios.debtToIncomeStatus === 'Good' ? 'rgba(34, 197, 94, 1)' :
                          analytics.financialRatios.debtToIncomeStatus === 'Warning' ? 'rgba(234, 179, 8, 1)' : 'rgba(239, 68, 68, 1)',

                          analytics.financialRatios.savingsRateStatus === 'Good' ? 'rgba(34, 197, 94, 1)' :
                          analytics.financialRatios.savingsRateStatus === 'Warning' ? 'rgba(234, 179, 8, 1)' : 'rgba(239, 68, 68, 1)',

                          analytics.financialRatios.emergencyFundStatus === 'Good' ? 'rgba(34, 197, 94, 1)' :
                          analytics.financialRatios.emergencyFundStatus === 'Warning' ? 'rgba(234, 179, 8, 1)' : 'rgba(239, 68, 68, 1)',

                          analytics.financialRatios.expenseToIncomeStatus === 'Good' ? 'rgba(34, 197, 94, 1)' :
                          analytics.financialRatios.expenseToIncomeStatus === 'Warning' ? 'rgba(234, 179, 8, 1)' : 'rgba(239, 68, 68, 1)',
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
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%';
                          },
                        },
                      },
                    },
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Debt-to-Income Ratio</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      analytics.financialRatios.debtToIncomeStatus === 'Good' ? 'bg-green-100 text-green-800' :
                      analytics.financialRatios.debtToIncomeStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analytics.financialRatios.debtToIncomeStatus}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.financialRatios.debtToIncomeRatio.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Target: &lt;200%</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Savings Rate</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      analytics.financialRatios.savingsRateStatus === 'Good' ? 'bg-green-100 text-green-800' :
                      analytics.financialRatios.savingsRateStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analytics.financialRatios.savingsRateStatus}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.financialRatios.savingsRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Target: 15-20%</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Emergency Fund</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      analytics.financialRatios.emergencyFundStatus === 'Good' ? 'bg-green-100 text-green-800' :
                      analytics.financialRatios.emergencyFundStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analytics.financialRatios.emergencyFundStatus}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.financialRatios.emergencyFundMonths.toFixed(1)} months</div>
                  <div className="text-sm text-gray-500">Target: 3-6 months</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Expense-to-Income Ratio</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      analytics.financialRatios.expenseToIncomeStatus === 'Good' ? 'bg-green-100 text-green-800' :
                      analytics.financialRatios.expenseToIncomeStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analytics.financialRatios.expenseToIncomeStatus}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{analytics.financialRatios.expenseToIncomeRatio.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Target: 70-80%</div>
                </div>
              </div>
            </div>

            {/* Spending Analysis */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Spending by Category</h2>

              {/* Pie Chart for Spending */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">Spending Distribution</h3>
                  <Pie
                    data={{
                      labels: Object.keys(analytics.spendingByCategory.categories),
                      datasets: [
                        {
                          data: Object.values(analytics.spendingByCategory.categories),
                          backgroundColor: [
                            'rgba(239, 68, 68, 0.7)',
                            'rgba(234, 179, 8, 0.7)',
                            'rgba(34, 197, 94, 0.7)',
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(168, 85, 247, 0.7)',
                            'rgba(236, 72, 153, 0.7)',
                            'rgba(249, 115, 22, 0.7)',
                            'rgba(14, 165, 233, 0.7)',
                          ],
                          borderColor: [
                            'rgba(239, 68, 68, 1)',
                            'rgba(234, 179, 8, 1)',
                            'rgba(34, 197, 94, 1)',
                            'rgba(59, 130, 246, 1)',
                            'rgba(168, 85, 247, 1)',
                            'rgba(236, 72, 153, 1)',
                            'rgba(249, 115, 22, 1)',
                            'rgba(14, 165, 233, 1)',
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
                              const label = context.label || '';
                              const value = context.parsed || 0;
                              const percentage = analytics.spendingByCategory.percentages[label];
                              return `${label}: ${value.toFixed(0)} MAD (${percentage.toFixed(1)}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div className="space-y-4">
                  {Object.entries(analytics.spendingByCategory.categories)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => {
                      const percentage = analytics.spendingByCategory.percentages[category];
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{category}</span>
                            <span className="text-sm text-gray-600">{amount.toFixed(0)} MAD ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {analytics.spendingByCategory.insights.length > 0 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Insights:</h3>
                  <ul className="space-y-1">
                    {analytics.spendingByCategory.insights.map((insight, index) => (
                      <li key={index} className="text-yellow-800 text-sm">{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
