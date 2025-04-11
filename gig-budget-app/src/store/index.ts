import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import userReducer from './slices/userSlice';
import incomeReducer from './slices/incomeSlice';
import expenseReducer from './slices/expenseSlice';
import budgetReducer from './slices/budgetSlice';
import savingsReducer from './slices/savingsSlice';
import predictionReducer from './slices/predictionSlice';
import gamificationReducer from './slices/gamificationSlice';
import taxReducer from './slices/taxSlice';
// Import state types
import {
  UserState,
  IncomeState,
  ExpenseState,
  BudgetState,
  SavingsState,
  PredictionState,
  GamificationState,
  TaxState
} from './types';

export const store = configureStore({
  reducer: {
    user: userReducer,
    income: incomeReducer,
    expense: expenseReducer,
    budget: budgetReducer,
    savings: savingsReducer,
    prediction: predictionReducer,
    gamification: gamificationReducer,
    tax: taxReducer
  },
});

// Define RootState with explicit types for each slice
export interface RootState {
  user: UserState;
  income: IncomeState;
  expense: ExpenseState;
  budget: BudgetState;
  savings: SavingsState;
  prediction: PredictionState;
  gamification: GamificationState;
  tax: TaxState;
}

export type AppDispatch = typeof store.dispatch;

// Custom hooks for better typing
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 