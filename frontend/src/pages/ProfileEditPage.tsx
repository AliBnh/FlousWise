import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeService } from '../services/financeService';
import type { UserProfile } from '../types/finance';

import BasicInformationForm from '../components/profile/BasicInformationForm';
import IncomeForm from '../components/profile/IncomeForm';
import DependentsForm from '../components/profile/DependentsForm';
import FixedExpensesForm from '../components/profile/FixedExpensesForm';
import VariableExpensesForm from '../components/profile/VariableExpensesForm';
import DebtsForm from '../components/profile/DebtsForm';
import AssetsForm from '../components/profile/AssetsForm';
import SkillsForm from '../components/profile/SkillsForm';
import GoalsForm from '../components/profile/GoalsForm';
import MoroccanInfoForm from '../components/profile/MoroccanInfoForm';
import RiskProfileForm from '../components/profile/RiskProfileForm';
import AdditionalContextForm from '../components/profile/AdditionalContextForm';

const STEPS = [
  { number: 1, title: 'Basic Information', component: BasicInformationForm },
  { number: 2, title: 'Income', component: IncomeForm },
  { number: 3, title: 'Dependents', component: DependentsForm },
  { number: 4, title: 'Fixed Expenses', component: FixedExpensesForm },
  { number: 5, title: 'Variable Expenses', component: VariableExpensesForm },
  { number: 6, title: 'Debts', component: DebtsForm },
  { number: 7, title: 'Assets & Savings', component: AssetsForm },
  { number: 8, title: 'Skills', component: SkillsForm },
  { number: 9, title: 'Goals', component: GoalsForm },
  { number: 10, title: 'Moroccan Info', component: MoroccanInfoForm },
  { number: 11, title: 'Risk Profile', component: RiskProfileForm },
  { number: 12, title: 'Additional Context', component: AdditionalContextForm },
];

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await financeService.getProfile();
      setFormData(profile);
    } catch (err: any) {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    setError('');

    try {
      const finalData = { ...formData, ...data };
      await financeService.updateProfile(finalData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const CurrentFormComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Your Profile</h1>
          <p className="text-gray-600">Update your financial information</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round((currentStep / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-600 to-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <CurrentFormComponent
            data={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {STEPS.map((step) => (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`w-8 h-8 rounded-full font-medium text-sm transition-all ${
                step.number === currentStep
                  ? 'bg-primary-600 text-white scale-110'
                  : step.number < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={step.title}
            >
              {step.number < currentStep ? '✓' : step.number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
