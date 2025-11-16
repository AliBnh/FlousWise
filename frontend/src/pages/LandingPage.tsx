import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Take Control of Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Financial Future
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-4 max-w-3xl mx-auto font-medium">
              Your Personal AI Financial Advisor - Built for Moroccans
            </p>
            <p className="text-lg md:text-xl text-indigo-200 mb-12 max-w-2xl mx-auto">
              Get intelligent insights, personalized advice, and comprehensive tracking—completely FREE, no bank connection required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:from-pink-600 hover:to-purple-700 shadow-2xl hover:shadow-pink-500/50 transform hover:-translate-y-1"
                >
                  <span className="mr-2">📊</span>
                  Go to Dashboard
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-green-500/50 transform hover:-translate-y-1"
                  >
                    <span className="mr-2">🚀</span>
                    Get Started Free
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="mr-2">👋</span>
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">No Bank Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">50%+</div>
              <div className="text-gray-700 font-medium text-lg">Moroccans live paycheck-to-paycheck</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-3">80%+</div>
              <div className="text-gray-700 font-medium text-lg">Cite money as #1 anxiety source</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">30%</div>
              <div className="text-gray-700 font-medium text-lg">Have emergency savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">FlousWise?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful financial tools designed specifically for the Moroccan experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-bl-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moroccan-Specific Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-bold mb-4">
              🇲🇦 MADE FOR MOROCCO
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Built Specifically for Morocco
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand Moroccan salaries, expenses, and government programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl mr-4">
                  🏛️
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Government Programs</h3>
              </div>
              <ul className="space-y-3">
                {['RAMED eligibility checking', 'Tayssir support information', 'INDH program guidance', 'Housing subsidy assistance'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl mr-4">
                  📍
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Local Context</h3>
              </div>
              <ul className="space-y-3">
                {['Moroccan salary benchmarks', 'Cost of living by city', 'Local income opportunities', 'Cultural financial practices'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-10">
            Join thousands of Moroccans building financial security and peace of mind
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-purple-600 bg-white rounded-2xl shadow-2xl hover:shadow-white/30 transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="mr-3">🎯</span>
              Start Your Free Journey Now
              <span className="ml-3">→</span>
            </Link>
          )}
          <p className="mt-8 text-purple-100 text-sm">
            No credit card required • No hidden fees • Cancel anytime (it's free!)
          </p>
        </div>
      </div>

      {/* Add animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Advice',
    description: 'Get personalized financial guidance powered by proven knowledge from bestselling finance books and tailored to your unique situation.',
  },
  {
    icon: '📊',
    title: 'Complete Analytics',
    description: 'Financial health score, spending analysis, debt management, savings goals, and actionable recommendations—all in one place.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Manual data entry means full control over your information. Your data is encrypted, secure, and never sold to third parties.',
  },
  {
    icon: '🎯',
    title: 'Goal Tracking',
    description: 'Set and track financial goals like emergency fund, debt payoff, home purchase, or vacation savings with progress monitoring.',
  },
  {
    icon: '💡',
    title: 'Smart Insights',
    description: 'Understand where your money goes, discover opportunities to save, and find ways to earn more with intelligent recommendations.',
  },
  {
    icon: '🇲🇦',
    title: 'Moroccan-First',
    description: 'Designed specifically for Moroccan salaries, living costs, government programs, and cultural financial practices.',
  },
];
