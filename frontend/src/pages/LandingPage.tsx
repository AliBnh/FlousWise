import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Personal <span className="text-primary-600">AI Financial Advisor</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Built for Moroccans. Powered by AI. 100% FREE.
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Take control of your finances with intelligent insights, personalized advice, and comprehensive tracking—no bank connection required.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">50%+</div>
              <div className="text-gray-600">Moroccans live paycheck-to-paycheck</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">80%+</div>
              <div className="text-gray-600">Cite money as #1 anxiety source</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">30%</div>
              <div className="text-gray-600">Have emergency savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why FlousWise?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Moroccan-Specific Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Built Specifically for Morocco
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Government Programs</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ RAMED eligibility checking</li>
                <li>✓ Tayssir support information</li>
                <li>✓ INDH program guidance</li>
                <li>✓ Housing subsidy assistance</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Context</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Moroccan salary benchmarks</li>
                <li>✓ Cost of living by city</li>
                <li>✓ Local income opportunities</li>
                <li>✓ Cultural financial practices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of Moroccans building financial security
        </p>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            Start Your Free Journey
          </Link>
        )}
      </div>
    </div>
  );
}

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Advice',
    description: 'Get personalized financial guidance powered by proven knowledge from bestselling finance books.',
  },
  {
    icon: '📊',
    title: 'Complete Analytics',
    description: 'Financial health score, spending analysis, debt management, and actionable recommendations.',
  },
  {
    icon: '🔒',
    title: 'No Bank Connection',
    description: 'Manual data entry means full control. Your data is encrypted and secure.',
  },
  {
    icon: '🎯',
    title: 'Goal Tracking',
    description: 'Set and track financial goals like emergency fund, debt payoff, or home purchase.',
  },
  {
    icon: '💡',
    title: 'Smart Insights',
    description: 'Understand where your money goes and discover opportunities to save and earn more.',
  },
  {
    icon: '🇲🇦',
    title: 'Moroccan-First',
    description: 'Built specifically for Moroccan salaries, expenses, and government programs.',
  },
];
