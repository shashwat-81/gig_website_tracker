// Define basic types for income and expense data
export interface Income {
  id: string | number;
  amount: number;
  date: string;
  source: string;
  category?: string;
  description?: string;
}

export interface Expense {
  id: string | number;
  amount: number;
  date: string;
  category: string;
  title?: string;
  description?: string;
  paymentMethod?: string;
  recurring?: boolean;
}

// State interfaces for Redux slices
export interface IncomeState {
  incomeList: Income[];
  monthlySummary?: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

export interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  currentUser: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface BudgetState {
  budgets: any[];
  isLoading: boolean;
  error: string | null;
}

export interface SavingsState {
  savingsGoals: any[];
  isLoading: boolean;
  error: string | null;
}

export interface TaxState {
  taxEntries: any[];
  isLoading: boolean;
  error: string | null;
}

export interface PredictionState {
  predictions: any[];
  isLoading: boolean;
  error: string | null;
}

export interface GamificationState {
  badges: any[];
  challenges: any[];
  isLoading: boolean;
  error: string | null;
} 