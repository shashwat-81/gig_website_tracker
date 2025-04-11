// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Income types
export interface Income {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  source: string;
  category: IncomeCategory;
  description?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export type IncomeCategory = 'freelance' | 'contract' | 'partTime' | 'fullTime' | 'other';

// Expense types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  description?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export type ExpenseCategory = 
  | 'housing' 
  | 'transportation' 
  | 'food' 
  | 'utilities' 
  | 'insurance' 
  | 'healthcare' 
  | 'entertainment' 
  | 'personal' 
  | 'debt' 
  | 'savings' 
  | 'business' 
  | 'tax' 
  | 'other';

// Budget types
export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  categories: BudgetCategory[];
  totalPlanned: number;
  totalActual: number;
}

export interface BudgetCategory {
  category: ExpenseCategory;
  plannedAmount: number;
  actualAmount: number;
}

// Savings types
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'emergency' | 'retirement' | 'vacation' | 'education' | 'home' | 'car' | 'other';
}

// Prediction types
export interface IncomePrediction {
  month: number;
  year: number;
  predictedAmount: number;
  confidence: number; // 0-1 scale
}

// Gamification types
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockCriteria: string;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedDate: Date;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  reward: number;
  startDate: Date;
  endDate: Date;
  category: 'savings' | 'expense' | 'income';
}

export interface UserChallenge {
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedDate?: Date;
}

// Tax types
export interface TaxEstimate {
  userId: string;
  year: number;
  quarter: number;
  estimatedIncome: number;
  estimatedDeductions: number;
  estimatedTaxes: number;
}

export interface TaxDeduction {
  id: string;
  userId: string;
  name: string;
  category: 'business' | 'healthcare' | 'education' | 'housing' | 'charity' | 'retirement' | 'other';
  amount: number;
  date: Date;
  description?: string;
  receiptUrl?: string;
}

// Dashboard types
export interface DashboardData {
  incomeStats: {
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
    nextMonthPrediction: number;
  };
  expenseStats: {
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
  };
  savingsStats: {
    currentMonth: number;
    totalSavings: number;
    savingsRate: number; // savings as % of income
  };
  upcomingBills: Expense[];
  recentTransactions: (Income | Expense)[];
  activeChallenges: UserChallenge[];
  budgetProgress: {
    categoryName: string;
    planned: number;
    actual: number;
    percentageUsed: number;
  }[];
} 