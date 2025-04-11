import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  isLoading: false,
  error: null
};

export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    // Placeholder reducers will be implemented later
  }
});

export default expenseSlice.reducer; 