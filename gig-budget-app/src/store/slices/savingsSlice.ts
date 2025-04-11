import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savingsGoals: [],
  isLoading: false,
  error: null
};

export const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    // Placeholder reducers will be implemented later
  }
});

export default savingsSlice.reducer; 