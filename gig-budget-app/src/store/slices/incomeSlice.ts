import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Income } from '../../types';

interface IncomeState {
  incomeList: Income[];
  monthlySummary: Record<string, number>; // Format: 'YYYY-MM': totalAmount
  isLoading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  incomeList: [],
  monthlySummary: {},
  isLoading: false,
  error: null
};

export const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    fetchIncomeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchIncomeSuccess: (state, action: PayloadAction<Income[]>) => {
      state.isLoading = false;
      state.incomeList = action.payload;
      state.error = null;
      
      // Calculate monthly summary
      state.monthlySummary = action.payload.reduce((summary, income) => {
        const date = new Date(income.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!summary[yearMonth]) {
          summary[yearMonth] = 0;
        }
        summary[yearMonth] += income.amount;
        
        return summary;
      }, {} as Record<string, number>);
    },
    fetchIncomeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addIncomeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addIncomeSuccess: (state, action: PayloadAction<Income>) => {
      state.isLoading = false;
      state.incomeList.push(action.payload);
      
      // Update monthly summary
      const date = new Date(action.payload.date);
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!state.monthlySummary[yearMonth]) {
        state.monthlySummary[yearMonth] = 0;
      }
      state.monthlySummary[yearMonth] += action.payload.amount;
    },
    addIncomeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateIncomeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateIncomeSuccess: (state, action: PayloadAction<Income>) => {
      state.isLoading = false;
      
      // First, remove the old income from monthly summary
      const oldIncome = state.incomeList.find(income => income.id === action.payload.id);
      if (oldIncome) {
        const oldDate = new Date(oldIncome.date);
        const oldYearMonth = `${oldDate.getFullYear()}-${oldDate.getMonth() + 1}`;
        if (state.monthlySummary[oldYearMonth]) {
          state.monthlySummary[oldYearMonth] -= oldIncome.amount;
        }
      }
      
      // Update the income list
      state.incomeList = state.incomeList.map(income => 
        income.id === action.payload.id ? action.payload : income
      );
      
      // Update the monthly summary with the new income
      const newDate = new Date(action.payload.date);
      const newYearMonth = `${newDate.getFullYear()}-${newDate.getMonth() + 1}`;
      
      if (!state.monthlySummary[newYearMonth]) {
        state.monthlySummary[newYearMonth] = 0;
      }
      state.monthlySummary[newYearMonth] += action.payload.amount;
    },
    updateIncomeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteIncomeStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteIncomeSuccess: (state, action: PayloadAction<string>) => { // income id
      state.isLoading = false;
      
      // Remove income from monthly summary
      const incomeToDelete = state.incomeList.find(income => income.id === action.payload);
      if (incomeToDelete) {
        const date = new Date(incomeToDelete.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (state.monthlySummary[yearMonth]) {
          state.monthlySummary[yearMonth] -= incomeToDelete.amount;
        }
      }
      
      // Remove income from list
      state.incomeList = state.incomeList.filter(income => income.id !== action.payload);
    },
    deleteIncomeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchIncomeStart,
  fetchIncomeSuccess,
  fetchIncomeFailure,
  addIncomeStart,
  addIncomeSuccess,
  addIncomeFailure,
  updateIncomeStart,
  updateIncomeSuccess,
  updateIncomeFailure,
  deleteIncomeStart,
  deleteIncomeSuccess,
  deleteIncomeFailure
} = incomeSlice.actions;

export default incomeSlice.reducer; 