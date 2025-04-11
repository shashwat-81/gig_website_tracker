import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  taxEstimates: [],
  taxDeductions: [],
  isLoading: false,
  error: null
};

export const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    // Placeholder reducers will be implemented later
  }
});

export default taxSlice.reducer; 