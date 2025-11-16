// Profile Types
export interface BasicInformation {
  fullName?: string;
  age?: number;
  gender?: string;
  city?: string;
  email?: string;
  livingStatus?: string;
  housing?: string;
  monthlyPayment?: number;
}

export interface AdditionalIncomeSource {
  sourceName: string;
  monthlyAmount: number;
  frequency: string;
  stability: string;
}

export interface Income {
  employmentStatus?: string;
  occupation?: string;
  monthlyNetSalary?: number;
  salaryPaymentDay?: number;
  incomeStability?: string;
  workHoursPerWeek?: number;
  averageMonthlyIncome?: number;
  additionalSources?: AdditionalIncomeSource[];
  totalMonthlyIncome?: number;
}

export interface DependentPerson {
  relationship: string;
  age?: number;
  monthlySupportAmount: number;
  notes?: string;
}

export interface Child {
  age: number;
  schoolType: string;
  monthlyEducationCosts?: number;
}

export interface Dependents {
  numberOfDependents?: number;
  dependentsList?: DependentPerson[];
  numberOfChildren?: number;
  children?: Child[];
}

export interface Subscription {
  serviceName: string;
  monthlyCost: number;
}

export interface FixedExpenses {
  rent?: number;
  propertyTax?: number;
  homeInsurance?: number;
  electricity?: number;
  water?: number;
  gas?: number;
  internet?: number;
  fixedPhoneLine?: number;
  mobilePhonePlan?: number;
  additionalPhones?: number;
  carLoanPayment?: number;
  carInsurance?: number;
  monthlyFuel?: number;
  publicTransportPass?: number;
  parking?: number;
  maintenanceReserve?: number;
  healthInsurance?: number;
  lifeInsurance?: number;
  otherInsurance?: number;
  subscriptions?: Subscription[];
  otherFixedExpensesAmount?: number;
  totalFixedExpenses?: number;
}

export interface VariableExpenses {
  groceryShopping?: number;
  eatingOut?: number;
  coffee?: number;
  foodDelivery?: number;
  medications?: number;
  doctorVisits?: number;
  pharmacyItems?: number;
  hygieneProducts?: number;
  haircutsSalon?: number;
  otherPersonalCare?: number;
  clothingSpending?: number;
  schoolFees?: number;
  schoolSupplies?: number;
  tutoring?: number;
  onlineCourses?: number;
  moviesEvents?: number;
  hobbies?: number;
  sportsGym?: number;
  otherEntertainment?: number;
  gifts?: number;
  charityDonations?: number;
  familyGatherings?: number;
  totalVariableExpenses?: number;
}

export interface Debt {
  debtType: string;
  creditorName: string;
  totalAmountOwed: number;
  monthlyPayment: number;
  interestRate?: number;
  remainingPayments?: number;
  originalPurpose?: string;
  notes?: string;
}

export interface AssetsAndSavings {
  bankAccountBalance?: number;
  cashAtHome?: number;
  emergencyFund?: number;
  otherLiquidSavings?: number;
  carValue?: number;
  motorcycleValue?: number;
  propertyValue?: number;
  laptopValue?: number;
  phoneValue?: number;
  goldJewelryValue?: number;
  otherValuableItemsValue?: number;
  stocks?: number;
  mutualFunds?: number;
  businessInvestment?: number;
  cryptocurrency?: number;
  otherInvestmentsValue?: number;
  totalAssets?: number;
  netWorth?: number;
}

export interface Skills {
  currentJobSkills?: string[];
  highestEducationLevel?: string;
  yearsOfExperience?: number;
  canDrive?: boolean;
  ownCar?: boolean;
  languagesSpoken?: string[];
  otherMonetizableSkills?: string;
  availableTimePerWeek?: number;
  willingnessForSideIncome?: string;
}

export interface FinancialGoal {
  goalName: string;
  goalType: string;
  targetAmount: number;
  targetDate?: string;
  currentProgress?: number;
  priority: string;
  whyImportant?: string;
}

export interface MoroccanSpecificInfo {
  receivesRAMED?: boolean;
  receivesTayssir?: boolean;
  appliedForINDH?: boolean;
  awareOfHousingSubsidies?: boolean;
  otherGovernmentAssistance?: string;
  regularCharity?: number;
  zakat?: number;
}

export interface RiskProfile {
  riskTolerance?: string;
  financialStressLevel?: string;
  biggestFinancialFear?: string;
  trackExpenses?: boolean;
  hasBudget?: boolean;
  savesRegularly?: boolean;
  savingsPlanAggression?: string;
  debtPayoffPhilosophy?: string;
  investmentInterest?: string;
}

export interface UserProfile {
  id?: string;
  userId?: string;
  basicInformation?: BasicInformation;
  income?: Income;
  dependents?: Dependents;
  fixedExpenses?: FixedExpenses;
  variableExpenses?: VariableExpenses;
  debts?: Debt[];
  assetsAndSavings?: AssetsAndSavings;
  skills?: Skills;
  financialGoals?: FinancialGoal[];
  moroccanSpecificInfo?: MoroccanSpecificInfo;
  riskProfile?: RiskProfile;
  additionalContext?: string;
  createdAt?: string;
  updatedAt?: string;
  isProfileComplete?: boolean;
}

// Dashboard Summary
export interface DashboardSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  netSurplus: number;
  financialHealthScore: number;
}

// Analytics Types
export interface FinancialHealthScore {
  overallScore: number;
  status: string;
  componentScores: {
    incomeStability: number;
    expenseManagement: number;
    debtHealth: number;
    emergencyFund: number;
    savingsRate: number;
  };
  topRecommendations: string[];
  calculatedAt: string;
}

export interface FinancialRatios {
  debtToIncomeRatio: number;
  debtToIncomeStatus: string;
  savingsRate: number;
  savingsRateStatus: string;
  emergencyFundMonths: number;
  emergencyFundStatus: string;
  expenseToIncomeRatio: number;
  expenseToIncomeStatus: string;
  calculatedAt: string;
}

export interface SpendingByCategory {
  categories: Record<string, number>;
  percentages: Record<string, number>;
  topCategories: string[];
  insights: string[];
  calculatedAt: string;
}

export interface NetWorthDataPoint {
  recordedAt: string;
  netWorth: number;
}

export interface AnalyticsResponse {
  financialHealthScore: FinancialHealthScore;
  financialRatios: FinancialRatios;
  spendingByCategory: SpendingByCategory;
  netWorthTrend: NetWorthDataPoint[];
}
