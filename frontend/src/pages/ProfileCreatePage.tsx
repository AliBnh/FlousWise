import { useState } from 'react';
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
  { number: 9, title: 'Financial Goals', component: GoalsForm },
  { number: 10, title: 'Moroccan Info', component: MoroccanInfoForm },
  { number: 11, title: 'Risk Profile', component: RiskProfileForm },
  { number: 12, title: 'Additional Context', component: AdditionalContextForm },
];

export default function ProfileCreatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const CurrentStepComponent = STEPS[currentStep].component;

  const handleNext = (stepData: any) => {
    setProfileData({ ...profileData, ...stepData });
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalStepData: any) => {
    setLoading(true);
    setError('');

    try {
      const completeProfile = { ...profileData, ...finalStepData, isProfileComplete: true };
      await financeService.createProfile(completeProfile as UserProfile);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Financial Profile</h1>
          <p className="mt-2 text-gray-600">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Form Step */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <CurrentStepComponent
            data={profileData}
            onNext={handleNext}
            onPrevious={currentStep > 0 ? handlePrevious : undefined}
            onSubmit={currentStep === STEPS.length - 1 ? handleSubmit : undefined}
            loading={loading}
          />
        </div>

        {/* Step Indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-primary-600 w-8'
                  : index < currentStep
                  ? 'bg-primary-400'
                  : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
