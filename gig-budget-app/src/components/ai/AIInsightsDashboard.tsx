import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Savings,
  Calculate,
  CalendarMonth,
  CheckCircle,
  Warning,
  Info,
  BarChart,
  PieChart,
  ShowChart
} from '@mui/icons-material';
import { RootState } from '../../store';
import { Income, Expense } from '../../store/types';
import * as aiPredictionService from '../../services/aiPredictionService';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Custom TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insights-tabpanel-${index}`}
      aria-labelledby={`insights-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Component to handle recommendation severity
const RecommendationAlert = ({ type, title, description }: { type: string, title: string, description: string }) => {
  let severity: 'error' | 'warning' | 'info' | 'success' = 'info';
  let icon = <Info />;
  
  switch (type) {
    case 'urgent':
      severity = 'error';
      icon = <Warning />;
      break;
    case 'important':
      severity = 'warning';
      icon = <Warning />;
      break;
    case 'consideration':
      severity = 'info';
      icon = <Info />;
      break;
    case 'success':
      severity = 'success';
      icon = <CheckCircle />;
      break;
    default:
      severity = 'info';
  }
  
  return (
    <Alert severity={severity} icon={icon} sx={{ mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {description}
    </Alert>
  );
};

const AIInsightsDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // AI insights state
  const [incomeForecast, setIncomeForecast] = useState<any>(null);
  const [expenseAnalysis, setExpenseAnalysis] = useState<any>(null);
  const [savingsPlan, setSavingsPlan] = useState<any>(null);
  const [taxSuggestions, setTaxSuggestions] = useState<any>(null);
  const [lowIncomePlan, setLowIncomePlan] = useState<any>(null);
  
  // Get data from Redux store
  const incomeData = useSelector((state: RootState) => state.income?.incomeList || []);
  const expenseData = useSelector((state: RootState) => state.expense?.expenses || []);
  
  // Fetch AI insights on component mount
  useEffect(() => {
    // Only fetch if we have some data
    if (incomeData.length > 0 && expenseData.length > 0) {
      fetchAllInsights();
    } else {
      setLoading(false);
      setError('Not enough data to generate insights. Please add more income and expense entries.');
    }
  }, [incomeData.length, expenseData.length]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Fetch all AI insights
  const fetchAllInsights = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all insights in parallel
      const [
        incomeForecastRes,
        expenseAnalysisRes,
        savingsPlanRes,
        taxSuggestionsRes,
        lowIncomePlanRes
      ] = await Promise.all([
        aiPredictionService.predictIncome(incomeData),
        aiPredictionService.analyzeExpenses(expenseData),
        aiPredictionService.getSavingsPlan(incomeData, expenseData),
        aiPredictionService.getTaxSuggestions(incomeData),
        aiPredictionService.getLowIncomePlan(incomeData, expenseData)
      ]);
      
      // Update state with responses
      setIncomeForecast(incomeForecastRes.forecast);
      setExpenseAnalysis(expenseAnalysisRes.analysis);
      setSavingsPlan(savingsPlanRes.savings_plan);
      setTaxSuggestions(taxSuggestionsRes.tax_analysis);
      setLowIncomePlan(lowIncomePlanRes.low_income_preparation);
      
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError('Failed to fetch AI insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Income Forecast Chart Data
  const getIncomeChartData = () => {
    if (!incomeForecast || !incomeForecast.monthly) return {
      labels: [],
      datasets: [
        {
          label: 'Predicted Income',
          data: [],
          fill: false,
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          borderColor: 'rgba(46, 125, 50, 1)',
          tension: 0.1
        }
      ]
    };
    
    const months = incomeForecast.monthly.map((m: any) => m.month);
    const amounts = incomeForecast.monthly.map((m: any) => m.predicted_amount);
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Predicted Income',
          data: amounts,
          fill: false,
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          borderColor: 'rgba(46, 125, 50, 1)',
          tension: 0.1
        }
      ]
    };
  };
  
  // Expense By Category Chart Data
  const getExpenseChartData = () => {
    if (!expenseAnalysis || !expenseAnalysis.by_category) return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 1
        }
      ]
    };
    
    const categories = Object.keys(expenseAnalysis.by_category);
    const amounts = categories.map(cat => expenseAnalysis.by_category[cat].total);
    
    // Generate colors for each category
    const backgroundColors = categories.map((_, i) => {
      const hue = (i * 30) % 360;
      return `hsla(${hue}, 60%, 60%, 0.8)`;
    });
    
    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }
      ]
    };
  };
  
  // If loading, show loader
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6">Analyzing your financial data...</Typography>
        <Typography variant="body2" color="textSecondary">
          Our AI is generating personalized insights based on your income and expense patterns.
        </Typography>
      </Box>
    );
  }
  
  // If error, show error message
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Unable to Generate Insights</AlertTitle>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          To get AI-powered insights, please make sure you have:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
            <ListItemText primary="Added several income entries covering multiple months" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
            <ListItemText primary="Recorded your expenses with proper categories" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
            <ListItemText primary="Included date information with your financial entries" />
          </ListItem>
        </List>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI Financial Insights
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={fetchAllInsights}
          startIcon={<BarChart />}
        >
          Refresh Insights
        </Button>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="financial insights tabs"
        >
          <Tab label="Income Forecast" icon={<TrendingUp />} iconPosition="start" />
          <Tab label="Expense Analysis" icon={<TrendingDown />} iconPosition="start" />
          <Tab label="Savings Plan" icon={<Savings />} iconPosition="start" />
          <Tab label="Tax Optimization" icon={<Calculate />} iconPosition="start" />
          <Tab label="Low Income Planning" icon={<CalendarMonth />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Income Forecast Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  3-Month Income Forecast
                </Typography>
                {incomeForecast && incomeForecast.monthly && (
                  <Box sx={{ height: 300, mt: 2 }}>
                    <Line 
                      data={getIncomeChartData()} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }} 
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Predicted Monthly Income
                </Typography>
                {incomeForecast && incomeForecast.monthly && incomeForecast.monthly.map((month: any, index: number) => (
                  <Box key={month.month} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">{month.month}</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatCurrency(month.predicted_amount)}
                      </Typography>
                    </Box>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                  This forecast is based on your historical earning patterns and may vary based on actual gig work availability.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Income Prediction
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  The AI has analyzed your work patterns and predicted the following income over the next few months.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {incomeForecast && incomeForecast.daily && incomeForecast.daily.slice(0, 20).map((day: any, index: number) => (
                    <Chip 
                      key={index}
                      label={`${day.date}: ${formatCurrency(day.amount)}`}
                      color={day.amount > 5000 ? 'primary' : 'default'}
                      variant={day.amount > 10000 ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                  {incomeForecast && incomeForecast.daily && incomeForecast.daily.length > 20 && (
                    <Chip label={`+ ${incomeForecast.daily.length - 20} more days`} variant="outlined" size="small" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Expense Analysis Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Spending by Category
                </Typography>
                {expenseAnalysis && (
                  <Box sx={{ height: 300, mt: 2 }}>
                    <Pie 
                      data={getExpenseChartData()} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }} 
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expense Reduction Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Based on your spending patterns, our AI recommends the following adjustments:
                </Typography>
                {expenseAnalysis && expenseAnalysis.recommendations && expenseAnalysis.recommendations.map((rec: any, index: number) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {rec.category}
                      </Typography>
                      <Chip 
                        label={`Save ${formatCurrency(rec.potential_savings)}`} 
                        color="success"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2">{rec.recommendation}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {rec.details}
                    </Typography>
                  </Paper>
                ))}
                {(!expenseAnalysis?.recommendations || expenseAnalysis.recommendations.length === 0) && (
                  <Alert severity="info">
                    No specific recommendations available at this time. Continue tracking your expenses for more insights.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Breakdown
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {expenseAnalysis && expenseAnalysis.by_category && Object.entries(expenseAnalysis.by_category).map(([category, metrics]: [string, any], index: number) => (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography>{category}</Typography>
                        <Typography fontWeight="bold">{formatCurrency(metrics.total)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box 
                            sx={{ 
                              height: 8, 
                              bgcolor: 'grey.200', 
                              borderRadius: 1,
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box 
                              sx={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${Math.min(100, index / Object.keys(expenseAnalysis.by_category).length * 100)}%`,
                                bgcolor: `hsla(${index * 30 % 360}, 60%, 60%, 0.8)`,
                                borderRadius: 1
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {metrics.count} transactions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg: {formatCurrency(metrics.average)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Savings Plan Tab */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Savings Overview
                </Typography>
                {savingsPlan && (
                  <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Monthly Income</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {formatCurrency(savingsPlan.monthly_income)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Monthly Expenses</Typography>
                        <Typography variant="h5" fontWeight="bold" color="error">
                          {formatCurrency(savingsPlan.monthly_expenses)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Potential Monthly Savings</Typography>
                        <Typography variant="h5" fontWeight="bold" color="success">
                          {formatCurrency(savingsPlan.monthly_savings_target)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Savings Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress 
                          variant="determinate" 
                          value={savingsPlan.current_savings_rate} 
                          size={60} 
                          thickness={4}
                          sx={{ color: 'primary.main' }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div" color="text.secondary">
                            {savingsPlan.current_savings_rate}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">Current Savings Rate</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Target: {savingsPlan.recommended_savings_rate}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Emergency Fund
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Recommended: {formatCurrency(savingsPlan.emergency_fund.recommended_amount)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time to achieve: {savingsPlan.emergency_fund.months_to_achieve === "N/A" 
                          ? "Not possible with current savings rate" 
                          : `${savingsPlan.emergency_fund.months_to_achieve} months`}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                {savingsPlan && savingsPlan.recommendations && savingsPlan.recommendations.map((rec: any, index: number) => (
                  <RecommendationAlert 
                    key={index}
                    type={rec.type}
                    title={rec.title}
                    description={rec.description}
                  />
                ))}
                {(!savingsPlan?.recommendations || savingsPlan.recommendations.length === 0) && (
                  <Alert severity="info">
                    No specific recommendations available at this time. Continue tracking your income and expenses for more insights.
                  </Alert>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Income Volatility
                  </Typography>
                  <Typography variant="body2">
                    Your income volatility is {savingsPlan?.income_volatility}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {savingsPlan?.income_volatility < 15 
                      ? "Your income is relatively stable. Standard emergency fund guidelines should be sufficient."
                      : savingsPlan?.income_volatility < 30 
                        ? "Your income shows moderate variability. Consider building a slightly larger emergency fund."
                        : "Your income is highly variable. Focus on building a substantial emergency fund to weather income gaps."}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Tax Optimization Tab */}
      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Overview
                </Typography>
                {taxSuggestions && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Projected Annual Income</Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {formatCurrency(taxSuggestions.projected_annual_income)}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Estimated Tax</Typography>
                      <Typography variant="h5" fontWeight="bold" color="error">
                        {formatCurrency(taxSuggestions.estimated_tax)}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Effective Tax Rate</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {taxSuggestions.effective_tax_rate}%
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax-Saving Suggestions
                </Typography>
                {taxSuggestions && taxSuggestions.suggestions && taxSuggestions.suggestions.map((suggestion: any, index: number) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {suggestion.title}
                      </Typography>
                      {suggestion.potential_saving && typeof suggestion.potential_saving === 'number' && (
                        <Chip 
                          label={`Save up to ${formatCurrency(suggestion.potential_saving)}`} 
                          color="success"
                          size="small"
                        />
                      )}
                      {suggestion.potential_saving && typeof suggestion.potential_saving === 'string' && (
                        <Chip 
                          label={suggestion.potential_saving} 
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>
                    <Typography variant="body2">{suggestion.description}</Typography>
                  </Paper>
                ))}
                {(!taxSuggestions?.suggestions || taxSuggestions.suggestions.length === 0) && (
                  <Alert severity="info">
                    No tax suggestions available at this time. Continue tracking your income for more insights.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Important Notes
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Tax Disclaimer</AlertTitle>
                  These suggestions are for informational purposes only and not tax advice. Consult a qualified tax professional for specific guidance.
                </Alert>
                <Typography variant="body2" paragraph>
                  As a gig worker or freelancer in India, here are some important tax considerations:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="File ITR based on your income level" 
                      secondary="Depending on your annual income, select the appropriate ITR form (usually ITR-3 or ITR-4 for freelancers)." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Pay advance tax if applicable" 
                      secondary="If your annual tax liability exceeds ₹10,000, you may need to pay advance tax in quarterly instalments." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Keep proper books of accounts" 
                      secondary="Maintain records of all income and business expenses for at least 6 years." 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Low Income Planning Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Low Income Period Analysis
                </Typography>
                {lowIncomePlan && (
                  <>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Average Monthly Income</Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {formatCurrency(lowIncomePlan.average_monthly_income)}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Low Income Threshold</Typography>
                      <Typography variant="h5" fontWeight="bold" color="error">
                        {formatCurrency(lowIncomePlan.low_income_threshold)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        (70% of your average monthly income)
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Identified Low Income Months
                    </Typography>
                    {lowIncomePlan.identified_low_months && lowIncomePlan.identified_low_months.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {lowIncomePlan.identified_low_months.map((month: string, index: number) => (
                          <Chip 
                            key={index}
                            label={month}
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No low income months identified from your historical data.
                      </Typography>
                    )}
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Essential Expenses
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Monthly Essential Expenses</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {formatCurrency(lowIncomePlan.essential_monthly_expenses)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Recommended Monthly Buffer</Typography>
                      <Typography variant="h5" fontWeight="bold" color="success">
                        {formatCurrency(lowIncomePlan.recommended_monthly_buffer)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        (120% of your essential expenses)
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Planning Strategies
                </Typography>
                {lowIncomePlan && lowIncomePlan.strategies && lowIncomePlan.strategies.map((strategy: any, index: number) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 30, 
                          height: 30, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {strategy.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {strategy.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Action Items:
                    </Typography>
                    <List dense>
                      {strategy.action_items && strategy.action_items.map((item: string, itemIndex: number) => (
                        <ListItem key={itemIndex}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircle fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
                {(!lowIncomePlan?.strategies || lowIncomePlan.strategies.length === 0) && (
                  <Alert severity="info">
                    No specific strategies available at this time. Continue tracking your income for more insights.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AIInsightsDashboard; 