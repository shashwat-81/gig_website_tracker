import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IncomePrediction } from '../../types';

interface PredictionState {
  incomePredictions: IncomePrediction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PredictionState = {
  incomePredictions: [],
  isLoading: false,
  error: null
};

export const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    fetchPredictionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPredictionsSuccess: (state, action: PayloadAction<IncomePrediction[]>) => {
      state.isLoading = false;
      state.incomePredictions = action.payload;
      state.error = null;
    },
    fetchPredictionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    generatePredictionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    generatePredictionSuccess: (state, action: PayloadAction<IncomePrediction>) => {
      state.isLoading = false;
      
      // Remove any existing prediction for the same month/year
      const existingIndex = state.incomePredictions.findIndex(
        p => p.month === action.payload.month && p.year === action.payload.year
      );
      
      if (existingIndex !== -1) {
        state.incomePredictions[existingIndex] = action.payload;
      } else {
        state.incomePredictions.push(action.payload);
      }
      
      // Sort predictions by date
      state.incomePredictions.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
    },
    generatePredictionFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearPredictions: (state) => {
      state.incomePredictions = [];
    }
  }
});

export const {
  fetchPredictionsStart,
  fetchPredictionsSuccess,
  fetchPredictionsFailure,
  generatePredictionStart,
  generatePredictionSuccess,
  generatePredictionFailure,
  clearPredictions
} = predictionSlice.actions;

export default predictionSlice.reducer; 