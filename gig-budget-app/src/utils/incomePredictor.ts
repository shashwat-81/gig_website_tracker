import { Income, IncomePrediction } from '../types';

/**
 * Simple moving average calculator
 * @param data Array of income values
 * @param windowSize Size of the moving average window
 * @returns Array of moving averages
 */
const calculateMovingAverage = (data: number[], windowSize: number): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i <= data.length - windowSize; i++) {
    const sum = data.slice(i, i + windowSize).reduce((acc, val) => acc + val, 0);
    result.push(sum / windowSize);
  }
  
  return result;
};

/**
 * Calculate exponential weighted moving average
 * @param data Array of income values
 * @param alpha Smoothing factor (0 < alpha < 1)
 * @returns Array of EWMA values
 */
const calculateEWMA = (data: number[], alpha: number): number[] => {
  const result: number[] = [data[0]];
  
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  }
  
  return result;
};

/**
 * Calculate seasonal factors using ratio-to-moving-average method
 * @param data Array of income values
 * @param period Seasonality period (e.g., 12 for monthly data with yearly seasonality)
 * @returns Object with seasonal indices
 */
const calculateSeasonalFactors = (data: number[], period: number): Record<number, number> => {
  const movingAvg = calculateMovingAverage(data, period);
  const factors: Record<number, number[]> = {};
  
  // Calculate ratio to moving average
  for (let i = 0; i < movingAvg.length; i++) {
    const monthIdx = (i + Math.floor(period / 2)) % period;
    if (!factors[monthIdx]) {
      factors[monthIdx] = [];
    }
    factors[monthIdx].push(data[i + Math.floor(period / 2)] / movingAvg[i]);
  }
  
  // Calculate average seasonal factor for each period
  const seasonalFactors: Record<number, number> = {};
  let totalFactor = 0;
  
  for (let i = 0; i < period; i++) {
    if (factors[i] && factors[i].length > 0) {
      const avgFactor = factors[i].reduce((sum, val) => sum + val, 0) / factors[i].length;
      seasonalFactors[i] = avgFactor;
      totalFactor += avgFactor;
    } else {
      seasonalFactors[i] = 1;
      totalFactor += 1;
    }
  }
  
  // Normalize factors so they sum to the period length
  const normalizer = period / totalFactor;
  for (let i = 0; i < period; i++) {
    seasonalFactors[i] *= normalizer;
  }
  
  return seasonalFactors;
};

/**
 * Linear regression to identify trend
 * @param data Array of income values
 * @returns Object with slope and intercept
 */
const calculateLinearTrend = (data: number[]): { slope: number; intercept: number } => {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = data.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate slope
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (data[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  return { slope, intercept };
};

/**
 * Predict future income based on historical data
 * @param incomeData Array of historical income data
 * @param numPredictions Number of future periods to predict
 * @returns Array of income predictions
 */
export const predictFutureIncome = (
  incomeData: Income[],
  numPredictions: number = 3
): IncomePrediction[] => {
  if (incomeData.length < 6) {
    throw new Error('Not enough data for prediction. Need at least 6 months of income data.');
  }
  
  // Group income by month
  const monthlyIncomeMap: Record<string, number> = {};
  
  incomeData.forEach(income => {
    const date = new Date(income.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyIncomeMap[yearMonth]) {
      monthlyIncomeMap[yearMonth] = 0;
    }
    
    monthlyIncomeMap[yearMonth] += income.amount;
  });
  
  // Sort by date and extract values
  const sortedMonths = Object.keys(monthlyIncomeMap).sort();
  const monthlyIncomeValues = sortedMonths.map(month => monthlyIncomeMap[month]);
  
  // Calculate trend
  const trend = calculateLinearTrend(monthlyIncomeValues);
  
  // Calculate seasonal factors (assuming yearly seasonality)
  let seasonalFactors: Record<number, number> = {};
  if (monthlyIncomeValues.length >= 12) {
    seasonalFactors = calculateSeasonalFactors(monthlyIncomeValues, 12);
  } else {
    // Not enough data for seasonal factors, use neutral factors
    for (let i = 0; i < 12; i++) {
      seasonalFactors[i] = 1;
    }
  }
  
  // Generate predictions
  const predictions: IncomePrediction[] = [];
  
  for (let i = 1; i <= numPredictions; i++) {
    const lastDateParts = sortedMonths[sortedMonths.length - 1].split('-');
    const lastYear = parseInt(lastDateParts[0]);
    const lastMonth = parseInt(lastDateParts[1]);
    
    const predictionMonth = ((lastMonth - 1 + i) % 12) + 1;
    const predictionYear = lastYear + Math.floor((lastMonth - 1 + i) / 12);
    
    // Calculate base prediction using trend
    const baseValue = trend.intercept + trend.slope * (monthlyIncomeValues.length + i - 1);
    
    // Apply seasonal factor
    const seasonalFactor = seasonalFactors[(predictionMonth - 1) % 12] || 1;
    const predictedAmount = baseValue * seasonalFactor;
    
    // Calculate confidence based on data quality
    // More data and recent data = higher confidence
    const dataLengthFactor = Math.min(monthlyIncomeValues.length / 24, 0.5); // Max 0.5 for data length
    const recencyFactor = 0.3; // Fixed recency factor
    const variabilityFactor = 0.2; // Could be calculated based on variance
    const confidence = Math.min(dataLengthFactor + recencyFactor + variabilityFactor, 0.95);
    
    predictions.push({
      month: predictionMonth,
      year: predictionYear,
      predictedAmount: Math.max(0, Math.round(predictedAmount * 100) / 100),
      confidence
    });
  }
  
  return predictions;
};

/**
 * Identify income patterns and trends
 * @param incomeData Array of historical income data
 * @returns Object with analysis results
 */
export const analyzeIncomePatterns = (incomeData: Income[]): {
  trend: 'increasing' | 'decreasing' | 'stable';
  volatility: 'high' | 'medium' | 'low';
  seasonality: boolean;
  peakMonths: number[];
  lowMonths: number[];
} => {
  if (incomeData.length < 3) {
    throw new Error('Not enough data for analysis. Need at least 3 months of income data.');
  }
  
  // Group income by month
  const monthlyIncomeMap: Record<string, number> = {};
  
  incomeData.forEach(income => {
    const date = new Date(income.date);
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyIncomeMap[yearMonth]) {
      monthlyIncomeMap[yearMonth] = 0;
    }
    
    monthlyIncomeMap[yearMonth] += income.amount;
  });
  
  // Sort by date and extract values
  const sortedMonths = Object.keys(monthlyIncomeMap).sort();
  const monthlyIncomeValues = sortedMonths.map(month => monthlyIncomeMap[month]);
  
  // Analyze trend
  const trend = calculateLinearTrend(monthlyIncomeValues);
  let trendDirection: 'increasing' | 'decreasing' | 'stable';
  
  if (trend.slope > 0.05 * (monthlyIncomeValues.reduce((a, b) => a + b, 0) / monthlyIncomeValues.length)) {
    trendDirection = 'increasing';
  } else if (trend.slope < -0.05 * (monthlyIncomeValues.reduce((a, b) => a + b, 0) / monthlyIncomeValues.length)) {
    trendDirection = 'decreasing';
  } else {
    trendDirection = 'stable';
  }
  
  // Calculate volatility
  const mean = monthlyIncomeValues.reduce((a, b) => a + b, 0) / monthlyIncomeValues.length;
  const variance = monthlyIncomeValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / monthlyIncomeValues.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  let volatility: 'high' | 'medium' | 'low';
  if (coefficientOfVariation > 0.3) {
    volatility = 'high';
  } else if (coefficientOfVariation > 0.15) {
    volatility = 'medium';
  } else {
    volatility = 'low';
  }
  
  // Check for seasonality
  let seasonality = false;
  let peakMonths: number[] = [];
  let lowMonths: number[] = [];
  
  if (monthlyIncomeValues.length >= 12) {
    const seasonalFactors = calculateSeasonalFactors(monthlyIncomeValues, 12);
    
    // If some months have significantly higher/lower factors, we have seasonality
    const factorValues = Object.values(seasonalFactors);
    const factorMean = factorValues.reduce((a, b) => a + b, 0) / factorValues.length;
    const factorStdDev = Math.sqrt(
      factorValues.reduce((a, b) => a + Math.pow(b - factorMean, 2), 0) / factorValues.length
    );
    
    seasonality = factorStdDev / factorMean > 0.1;
    
    // Identify peak and low months
    Object.entries(seasonalFactors).forEach(([month, factor]) => {
      const monthNum = parseInt(month);
      if (factor > factorMean + 0.15) {
        peakMonths.push(monthNum + 1);
      } else if (factor < factorMean - 0.15) {
        lowMonths.push(monthNum + 1);
      }
    });
  }
  
  return {
    trend: trendDirection,
    volatility,
    seasonality,
    peakMonths,
    lowMonths
  };
};

/**
 * Generate financial advice based on income analysis and predictions
 * @param incomeData Historical income data
 * @param predictions Income predictions
 * @returns Financial advice message
 */
export const generateFinancialAdvice = (
  incomeData: Income[],
  predictions: IncomePrediction[]
): string => {
  try {
    const analysis = analyzeIncomePatterns(incomeData);
    
    // Calculate average monthly income
    const monthlyIncomeMap: Record<string, number> = {};
    incomeData.forEach(income => {
      const date = new Date(income.date);
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyIncomeMap[yearMonth]) {
        monthlyIncomeMap[yearMonth] = 0;
      }
      
      monthlyIncomeMap[yearMonth] += income.amount;
    });
    
    const monthlyValues = Object.values(monthlyIncomeMap);
    const avgMonthlyIncome = monthlyValues.reduce((a, b) => a + b, 0) / monthlyValues.length;
    
    // Start building advice
    let advice = '';
    
    // Trend-based advice
    if (analysis.trend === 'increasing') {
      advice += `Your income is trending upward. Consider allocating the additional income to savings or debt reduction. `;
    } else if (analysis.trend === 'decreasing') {
      advice += `Your income appears to be decreasing. Consider reviewing your income sources and looking for additional opportunities. `;
    } else {
      advice += `Your income has been relatively stable. This is a good time to focus on optimizing your budget and savings rate. `;
    }
    
    // Volatility-based advice
    if (analysis.volatility === 'high') {
      advice += `Your income shows high variability. We recommend building an emergency fund of at least ${Math.round(avgMonthlyIncome * 6)} to cover 6 months of expenses. `;
    } else if (analysis.volatility === 'medium') {
      advice += `Your income has moderate variability. We recommend maintaining an emergency fund of at least ${Math.round(avgMonthlyIncome * 4)} to cover 4 months of expenses. `;
    } else {
      advice += `Your income is relatively consistent. We still recommend keeping an emergency fund of at least ${Math.round(avgMonthlyIncome * 3)} to cover 3 months of expenses. `;
    }
    
    // Seasonality-based advice
    if (analysis.seasonality && analysis.lowMonths.length > 0) {
      const lowMonthsText = analysis.lowMonths
        .map(m => new Date(0, m - 1).toLocaleString('default', { month: 'long' }))
        .join(', ');
      
      advice += `We've identified seasonality in your income with typically lower earnings in ${lowMonthsText}. Consider setting aside extra savings during high-income months to prepare for these periods. `;
    }
    
    // Prediction-based advice
    if (predictions.length > 0) {
      const latestMonthIncome = monthlyValues[monthlyValues.length - 1];
      const averagePredicted = predictions.reduce((sum, pred) => sum + pred.predictedAmount, 0) / predictions.length;
      
      if (averagePredicted > latestMonthIncome * 1.1) {
        advice += `Based on our predictions, your income is likely to increase by approximately ${Math.round((averagePredicted / latestMonthIncome - 1) * 100)}% in the coming months. This is a good opportunity to increase your savings rate. `;
      } else if (averagePredicted < latestMonthIncome * 0.9) {
        advice += `Our predictions suggest your income may decrease by approximately ${Math.round((1 - averagePredicted / latestMonthIncome) * 100)}% in the coming months. Consider preparing by reducing discretionary spending now. `;
      }
    }
    
    return advice;
  } catch (error) {
    return "We need more income data to provide personalized financial advice. Continue tracking your income to receive tailored recommendations.";
  }
}; 