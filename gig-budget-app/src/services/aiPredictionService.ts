import axios from 'axios';
import { User } from '../types/User';

// Base URL for ML backend
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Cache predictions by user to avoid unnecessary API calls
const predictionCache: Record<number, any> = {};

/**
 * Fetch test data for a specific user category
 * In a real app, this would be user-specific data from the database
 */
const getCategoryData = async (category: string): Promise<any> => {
  try {
    // In a real app, this would fetch the user's actual financial data
    // For demo, we'll use our test data from the first user of each category
    const response = await axios.get(`${API_BASE_URL}/test-data?category=${encodeURIComponent(category)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category data:', error);
    
    // Fallback: Return mock data if API is not available
    return mockCategoryData[category] || mockCategoryData['Food Delivery'];
  }
};

/**
 * Get income forecast for the specified user
 */
export const getIncomeForecast = async (user: User): Promise<any> => {
  try {
    // Check cache first
    if (predictionCache[user.id]?.incomeForecast) {
      return predictionCache[user.id].incomeForecast;
    }
    
    // Fetch appropriate data for this user's category
    const userData = await getCategoryData(user.category);
    
    // Make API call to the ML backend
    const response = await axios.post(`${API_BASE_URL}/forecast-income`, userData);
    
    // Cache the result
    if (!predictionCache[user.id]) {
      predictionCache[user.id] = {};
    }
    predictionCache[user.id].incomeForecast = response.data;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching income forecast:', error);
    throw error;
  }
};

/**
 * Get expense analysis for the specified user
 */
export const getExpenseAnalysis = async (user: User): Promise<any> => {
  try {
    // Check cache first
    if (predictionCache[user.id]?.expenseAnalysis) {
      return predictionCache[user.id].expenseAnalysis;
    }
    
    // Fetch appropriate data for this user's category
    const userData = await getCategoryData(user.category);
    
    // Make API call to the ML backend
    const response = await axios.post(`${API_BASE_URL}/analyze-expenses`, userData);
    
    // Cache the result
    if (!predictionCache[user.id]) {
      predictionCache[user.id] = {};
    }
    predictionCache[user.id].expenseAnalysis = response.data;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching expense analysis:', error);
    throw error;
  }
};

/**
 * Get savings plan for the specified user
 */
export const getSavingsPlan = async (user: User): Promise<any> => {
  try {
    // Check cache first
    if (predictionCache[user.id]?.savingsPlan) {
      return predictionCache[user.id].savingsPlan;
    }
    
    // Fetch appropriate data for this user's category
    const userData = await getCategoryData(user.category);
    
    // Make API call to the ML backend
    const response = await axios.post(`${API_BASE_URL}/savings-plan`, userData);
    
    // Cache the result
    if (!predictionCache[user.id]) {
      predictionCache[user.id] = {};
    }
    predictionCache[user.id].savingsPlan = response.data;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching savings plan:', error);
    throw error;
  }
};

/**
 * Get tax suggestions for the specified user
 */
export const getTaxSuggestions = async (user: User): Promise<any> => {
  try {
    // Check cache first
    if (predictionCache[user.id]?.taxSuggestions) {
      return predictionCache[user.id].taxSuggestions;
    }
    
    // Fetch appropriate data for this user's category
    const userData = await getCategoryData(user.category);
    
    // Make API call to the ML backend
    const response = await axios.post(`${API_BASE_URL}/tax-suggestions`, userData);
    
    // Cache the result
    if (!predictionCache[user.id]) {
      predictionCache[user.id] = {};
    }
    predictionCache[user.id].taxSuggestions = response.data;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching tax suggestions:', error);
    throw error;
  }
};

/**
 * Get low income preparation strategies for the specified user
 */
export const getLowIncomePreparation = async (user: User): Promise<any> => {
  try {
    // Check cache first
    if (predictionCache[user.id]?.lowIncomePreparation) {
      return predictionCache[user.id].lowIncomePreparation;
    }
    
    // Fetch appropriate data for this user's category
    const userData = await getCategoryData(user.category);
    
    // Make API call to the ML backend
    const response = await axios.post(`${API_BASE_URL}/low-income-preparation`, userData);
    
    // Cache the result
    if (!predictionCache[user.id]) {
      predictionCache[user.id] = {};
    }
    predictionCache[user.id].lowIncomePreparation = response.data;
    
    return response.data;
  } catch (error) {
    console.error('Error fetching low income preparation:', error);
    throw error;
  }
};

/**
 * Clear prediction cache for a user (useful when switching users)
 */
export const clearPredictionCache = (userId?: number) => {
  if (userId !== undefined) {
    delete predictionCache[userId];
  } else {
    // Clear all cache
    Object.keys(predictionCache).forEach(key => {
      delete predictionCache[Number(key)];
    });
  }
};

// Fallback mock data in case the API is not available
const mockCategoryData: Record<string, any> = {
  'Food Delivery': {
    incomeData: [
      { date: '2024-01-15', amount: 1200, source: 'Swiggy Delivery' },
      { date: '2024-02-15', amount: 1300, source: 'Swiggy Delivery' },
      { date: '2024-03-15', amount: 1500, source: 'Zomato Delivery' },
    ],
    expenseData: [
      { date: '2024-01-20', amount: 400, category: 'Housing' },
      { date: '2024-02-20', amount: 400, category: 'Housing' },
      { date: '2024-01-25', amount: 100, category: 'Fuel' },
      { date: '2024-02-25', amount: 120, category: 'Fuel' },
    ]
  },
  'Cab Driver': {
    incomeData: [
      { date: '2024-01-15', amount: 1800, source: 'Ola Rides' },
      { date: '2024-02-15', amount: 1900, source: 'Uber Trips' },
      { date: '2024-03-15', amount: 2100, source: 'Ola Rides' },
    ],
    expenseData: [
      { date: '2024-01-20', amount: 500, category: 'Housing' },
      { date: '2024-02-20', amount: 500, category: 'Housing' },
      { date: '2024-01-25', amount: 200, category: 'Fuel' },
      { date: '2024-02-25', amount: 220, category: 'Fuel' },
      { date: '2024-01-10', amount: 150, category: 'Vehicle Maintenance' },
    ]
  },
  'House Cleaner': {
    incomeData: [
      { date: '2024-01-15', amount: 1100, source: 'Urban Company Cleaning' },
      { date: '2024-02-15', amount: 1200, source: 'Home Cleaning Service' },
      { date: '2024-03-15', amount: 1300, source: 'Household Maintenance' },
    ],
    expenseData: [
      { date: '2024-01-20', amount: 350, category: 'Housing' },
      { date: '2024-02-20', amount: 350, category: 'Housing' },
      { date: '2024-01-25', amount: 150, category: 'Transportation' },
      { date: '2024-02-25', amount: 170, category: 'Transportation' },
      { date: '2024-01-10', amount: 80, category: 'Cleaning Supplies' },
    ]
  }
}; 