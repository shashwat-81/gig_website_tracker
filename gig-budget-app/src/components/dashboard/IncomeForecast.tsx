import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Stack, Button, LinearProgress } from '@mui/material';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, ShowChart, CalendarMonth } from '@mui/icons-material';

// Function to generate random income data
const generateRandomIncomeData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const baseIncome = 25000; // Base income amount
  const volatility = 0.2; // 20% volatility

  let currentActual = baseIncome;
  let currentPredicted = baseIncome;

  return months.map((month, index) => {
    // Random walk for actual income (only for past months)
    const actualChange = baseIncome * volatility * (Math.random() - 0.5);
    currentActual = Math.max(15000, currentActual + actualChange);

    // Random walk for predicted income with some correlation to actual
    const predictedChange = baseIncome * volatility * (Math.random() - 0.5);
    currentPredicted = Math.max(15000, currentPredicted + predictedChange);

    // Confidence decreases as we look further into the future
    const confidence = Math.max(70, 90 - index * 2);

    return {
      name: month,
      actual: index < 6 ? Math.round(currentActual) : null, // Only show actual for past 6 months
      predicted: Math.round(currentPredicted),
      confidence
    };
  });
};

// Simulated seasonal insights for gig work in India
const seasonalInsights = [
  { 
    season: 'Festival Season (Oct-Nov)', 
    insight: 'Income typically increases by 20-30% during festival season', 
    recommendation: 'Save extra earnings for upcoming lean months'
  },
  { 
    season: 'Summer (Apr-Jun)', 
    insight: 'Delivery and transport gigs see higher demand due to heat', 
    recommendation: 'Consider diversifying income sources during this period'
  },
  { 
    season: 'Monsoon (Jul-Sep)', 
    insight: 'Outdoor gig work can decline by 15-25%', 
    recommendation: 'Build an emergency fund before monsoon season starts'
  }
];

const IncomeForecast: React.FC = () => {
  const [viewMode, setViewMode] = useState<'chart' | 'insights'>('chart');
  const [forecastData, setForecastData] = useState(generateRandomIncomeData());
  
  // Generate new random data when component mounts
  useEffect(() => {
    setForecastData(generateRandomIncomeData());
  }, []);
  
  // Calculate average monthly income based on actual data
  const actualIncomes = forecastData.filter(month => month.actual !== null).map(month => month.actual);
  const averageMonthlyIncome = actualIncomes.reduce((sum: number, income) => sum + (income ?? 0), 0) / actualIncomes.length;
  
  // Identify upcoming months with predicted income below average
  const belowAverageMonths = forecastData
    .filter(month => month.actual === null && (month.predicted || 0) < averageMonthlyIncome)
    .map(month => month.name);
  
  // Estimate buffer fund needed (3 months of average expenses)
  const recommendedBuffer = Math.round(averageMonthlyIncome * 3);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Income Forecast & Predictions
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              variant={viewMode === 'chart' ? 'contained' : 'outlined'} 
              onClick={() => setViewMode('chart')}
              startIcon={<ShowChart />}
            >
              Chart
            </Button>
            <Button 
              size="small" 
              variant={viewMode === 'insights' ? 'contained' : 'outlined'} 
              onClick={() => setViewMode('insights')}
              startIcon={<TrendingUp />}
            >
              Insights
            </Button>
          </Stack>
        </Box>
        
        {viewMode === 'chart' ? (
          <>
            <Box sx={{ height: 300, mb: 3 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[15000, 35000]} />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Income']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    name="Actual Income" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#82ca9d" 
                    name="Predicted Income" 
                    strokeWidth={2}
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Prediction Confidence Levels
            </Typography>
            <Stack spacing={1}>
              {forecastData.filter(item => item.actual === null).map((item) => (
                <Box key={item.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{item.name}: ₹{item.predicted?.toLocaleString()}</Typography>
                    <Typography variant="body2">{item.confidence}% confidence</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.confidence} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 
                          item.confidence > 85 ? 'success.main' :
                          item.confidence > 70 ? 'warning.main' : 
                          'error.main'
                      }
                    }} 
                  />
                </Box>
              ))}
            </Stack>
          </>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Seasonal Income Patterns
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Based on historical data and region-specific trends in India's gig economy
              </Typography>
              
              <Stack spacing={2}>
                {seasonalInsights.map((item, index) => (
                  <Card key={index} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <CalendarMonth color="primary" />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.season}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" gutterBottom>
                      {item.insight}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      Recommendation: {item.recommendation}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Box>
            
            <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="success.dark" gutterBottom>
                Income Opportunity Alert:
              </Typography>
              <Typography variant="body2" color="success.dark">
                Based on your skills and location (Bangalore), demand for delivery services is projected to increase by 35% next month. Consider increasing availability during evenings (6-9 PM) to potentially earn ₹8,000-12,000 extra.
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeForecast; 