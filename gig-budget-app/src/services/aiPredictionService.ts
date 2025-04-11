import axios from 'axios';

// API base URL - update this to match your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Income prediction service for forecasting future income
 */
export const predictIncome = async (incomeData: any[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forecast-income`, {
      incomeData
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting income:', error);
    throw error;
  }
};

/**
 * Expense analysis service to provide recommendations for cutting expenses
 */
export const analyzeExpenses = async (expenseData: any[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-expenses`, {
      expenseData
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing expenses:', error);
    throw error;
  }
};

/**
 * Savings recommendation service based on income and expense patterns
 */
export const getSavingsPlan = async (incomeData: any[], expenseData: any[], userProfile?: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/savings-plan`, {
      incomeData,
      expenseData,
      userProfile
    });
    return response.data;
  } catch (error) {
    console.error('Error getting savings plan:', error);
    throw error;
  }
};

/**
 * Tax suggestion service to provide tax savings tips
 */
export const getTaxSuggestions = async (incomeData: any[], userProfile?: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tax-suggestions`, {
      incomeData,
      userProfile
    });
    return response.data;
  } catch (error) {
    console.error('Error getting tax suggestions:', error);
    throw error;
  }
};

/**
 * Low income period preparation plan
 */
export const getLowIncomePlan = async (incomeData: any[], expenseData: any[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/low-income-preparation`, {
      incomeData,
      expenseData
    });
    return response.data;
  } catch (error) {
    console.error('Error getting low income preparation plan:', error);
    throw error;
  }
};

export default {
  predictIncome,
  analyzeExpenses,
  getSavingsPlan,
  getTaxSuggestions,
  getLowIncomePlan
}; 