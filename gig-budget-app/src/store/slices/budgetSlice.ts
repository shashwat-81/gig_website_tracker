import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  budgets: [],
  isLoading: false,
  error: null
};

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    // Placeholder reducers will be implemented later
  }
});

export default budgetSlice.reducer; 