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
  ShowChart,
  Category
} from '@mui/icons-material';
import { RootState } from '../../store';
import { Income, Expense } from '../../store/types';
import * as aiPredictionService from '../../services/aiPredictionService';
import { getCurrentUser } from '../../services/authService';
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
  
  // Get the current user for category-specific insights
  const currentUser = getCurrentUser();
  
  // Get data from Redux store
  const incomeData = useSelector((state: RootState) => state.income?.incomeList || []);
  const expenseData = useSelector((state: RootState) => state.expense?.expenses || []);
  
  // Fetch AI insights on component mount
  useEffect(() => {
    if (currentUser) {
      fetchAllInsights();
    } else {
      setLoading(false);
      setError('Please log in to view AI insights.');
    }
  }, [currentUser]);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Fetch all AI insights
  const fetchAllInsights = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch all insights in parallel using the user's category
      const [
        incomeForecastRes,
        expenseAnalysisRes,
        savingsPlanRes,
        taxSuggestionsRes,
        lowIncomePlanRes
      ] = await Promise.all([
        aiPredictionService.getIncomeForecast(currentUser),
        aiPredictionService.getExpenseAnalysis(currentUser),
        aiPredictionService.getSavingsPlan(currentUser),
        aiPredictionService.getTaxSuggestions(currentUser),
        aiPredictionService.getLowIncomePreparation(currentUser)
      ]);
      
      // Update state with responses
      setIncomeForecast(incomeForecastRes.forecast);
      setExpenseAnalysis(expenseAnalysisRes.analysis);
      setSavingsPlan(savingsPlanRes.plan);
      setTaxSuggestions(taxSuggestionsRes);
      setLowIncomePlan(lowIncomePlanRes);
      
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
  
  // Render insights dashboard
  return (
    <Box>
      {/* Header with category info */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            AI Financial Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personalized financial analysis powered by machine learning
          </Typography>
        </Box>
        {currentUser && (
          <Chip
            icon={<Category />}
            label={`Category: ${currentUser.category}`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
      
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Navigation tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="insight tabs">
              <Tab label="Income Forecast" />
              <Tab label="Expense Analysis" />
              <Tab label="Savings Plan" />
              <Tab label="Tax Optimization" />
              <Tab label="Seasonal Planning" />
            </Tabs>
          </Box>
          
          {/* Tab panels for insights */}
          {/* Income Forecast */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Monthly Income Forecast for {currentUser?.category}
                    </Typography>
                    {incomeForecast?.monthly && (
                      <Box sx={{ height: 300 }}>
                        <Line data={getIncomeChartData()} options={{ maintainAspectRatio: false }} />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Add more income forecast insights */}
            </Grid>
          </TabPanel>
          
          {/* Expense Analysis */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Expense Breakdown by Category
                    </Typography>
                    {expenseAnalysis?.by_category && Object.keys(expenseAnalysis.by_category).length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <Pie data={getExpenseChartData()} options={{ maintainAspectRatio: false }} />
                      </Box>
                    ) : (
                      <Typography>No expense data available for analysis</Typography>
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
                    {expenseAnalysis?.recommendations && expenseAnalysis.recommendations.length > 0 ? (
                      <List>
                        {expenseAnalysis.recommendations.map((recommendation: any, index: number) => (
                          <ListItem key={index} divider={index < expenseAnalysis.recommendations.length - 1}>
                            <ListItemIcon>
                              <TrendingDown color="error" />
                            </ListItemIcon>
                            <ListItemText
                              primary={recommendation.recommendation}
                              secondary={recommendation.details}
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography>No recommendations available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Savings Plan */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Savings Status
                    </Typography>
                    {savingsPlan ? (
                      <>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                              <Typography variant="overline" color="text.secondary">Current Savings</Typography>
                              <Typography variant="h5" color="primary" fontWeight="bold">
                                ₹{savingsPlan.current_savings.toLocaleString()}
                              </Typography>
                              <Typography variant="body2">
                                ({savingsPlan.current_savings_percent}% of income)
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                              <Typography variant="overline" color="text.secondary">Target Savings</Typography>
                              <Typography variant="h5" color="success.main" fontWeight="bold">
                                ₹{savingsPlan.target_amount.toLocaleString()}
                              </Typography>
                              <Typography variant="body2">
                                ({savingsPlan.target_percent}% of income)
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        <Alert severity={savingsPlan.savings_gap > 0 ? "warning" : "success"} sx={{ mt: 2 }}>
                          <AlertTitle>
                            {savingsPlan.savings_gap > 0 
                              ? "Savings Gap: ₹" + savingsPlan.savings_gap.toLocaleString() 
                              : "You're meeting your savings target!"}
                          </AlertTitle>
                          {savingsPlan.savings_gap > 0 
                            ? "Implement the recommended strategies to close this gap." 
                            : "Keep up the good work with your savings habits."}
                        </Alert>
                        
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                            Emergency Fund Goal: ₹{savingsPlan.emergency_fund_target.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Estimated time to achieve: {savingsPlan.months_to_emergency_fund} months
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Typography>No savings plan data available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Savings Strategies
                    </Typography>
                    {savingsPlan?.strategies && savingsPlan.strategies.length > 0 ? (
                      <List>
                        {savingsPlan.strategies.map((strategy: any, index: number) => (
                          <ListItem key={index} divider={index < savingsPlan.strategies.length - 1}>
                            <ListItemIcon>
                              <Savings color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={strategy.name}
                              secondary={
                                <>
                                  {strategy.description}
                                  <Box sx={{ mt: 1 }}>
                                    <Chip 
                                      size="small" 
                                      label={`Impact: ${strategy.potential_impact}`} 
                                      color="primary" 
                                      variant="outlined"
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip 
                                      size="small" 
                                      label={`Difficulty: ${strategy.difficulty}`} 
                                      color={strategy.difficulty === 'Easy' ? 'success' : (strategy.difficulty === 'Medium' ? 'warning' : 'error')}
                                      variant="outlined"
                                    />
                                  </Box>
                                </>
                              }
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography>No savings strategies available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Tax Optimization */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tax Analysis
                    </Typography>
                    {taxSuggestions?.tax_analysis ? (
                      <>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Annual Income Estimate
                          </Typography>
                          <Typography variant="h5" color="text.primary" fontWeight="bold">
                            ₹{taxSuggestions.tax_analysis.annual_income_estimate.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {taxSuggestions.tax_analysis.tax_bracket}
                          </Typography>
                        </Box>
                        
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <AlertTitle>Estimated Tax Liability</AlertTitle>
                          ₹{taxSuggestions.tax_analysis.estimated_tax_liability.toLocaleString()}
                        </Alert>
                      </>
                    ) : (
                      <Typography>No tax analysis available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tax Optimization Suggestions
                    </Typography>
                    {taxSuggestions?.tax_suggestions && taxSuggestions.tax_suggestions.length > 0 ? (
                      <List>
                        {taxSuggestions.tax_suggestions.map((suggestion: any, index: number) => (
                          <ListItem key={index} divider={index < taxSuggestions.tax_suggestions.length - 1}>
                            <ListItemIcon>
                              <Calculate color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={suggestion.title}
                              secondary={
                                <>
                                  {suggestion.description}
                                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                    Potential savings: ₹{suggestion.potential_savings.toLocaleString()}
                                  </Typography>
                                </>
                              }
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography>No tax suggestions available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Seasonal Planning */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Seasonal Income Analysis
                    </Typography>
                    {lowIncomePlan?.income_analysis ? (
                      <>
                        <Box sx={{ mb: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="overline" color="text.secondary">Avg. Monthly Income</Typography>
                                <Typography variant="h5" color="primary" fontWeight="bold">
                                  ₹{lowIncomePlan.income_analysis.average_monthly_income.toLocaleString()}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="overline" color="text.secondary">Avg. Monthly Expenses</Typography>
                                <Typography variant="h5" color="error.main" fontWeight="bold">
                                  ₹{lowIncomePlan.income_analysis.average_monthly_expenses.toLocaleString()}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        
                        <Alert severity="warning" sx={{ mb: 3 }}>
                          <AlertTitle>Low Income Months Identified</AlertTitle>
                          {lowIncomePlan.income_analysis.low_income_months.length > 0 
                            ? "Your income tends to be lower during: " + lowIncomePlan.income_analysis.low_income_months.join(", ")
                            : "No consistent low-income periods identified yet. Keep tracking your income."
                          }
                        </Alert>
                        
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                          Recommended Emergency Fund
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          ₹{lowIncomePlan.income_analysis.emergency_fund_target.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Target 3 months of expenses to weather low-income periods
                        </Typography>
                      </>
                    ) : (
                      <Typography>No seasonal income analysis available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Seasonal Planning Strategies
                    </Typography>
                    {lowIncomePlan?.strategies && lowIncomePlan.strategies.length > 0 ? (
                      <List>
                        {lowIncomePlan.strategies.map((strategy: any, index: number) => (
                          <ListItem key={index} divider={index < lowIncomePlan.strategies.length - 1}>
                            <ListItemIcon>
                              <CalendarMonth color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={strategy.title}
                              secondary={
                                <>
                                  {strategy.description}
                                  <Box sx={{ mt: 1 }}>
                                    <Chip 
                                      size="small" 
                                      label={`Impact: ${strategy.impact}`} 
                                      color={strategy.impact === 'High' ? 'success' : (strategy.impact === 'Medium' ? 'primary' : 'default')}
                                      variant="outlined"
                                      sx={{ mr: 1 }}
                                    />
                                    <Chip 
                                      size="small" 
                                      label={`Timeline: ${strategy.timeline}`} 
                                      color="primary"
                                      variant="outlined"
                                    />
                                  </Box>
                                </>
                              }
                              primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography>No seasonal planning strategies available</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Tab content for other tabs... */}
        </>
      )}
      
      {/* Refresh button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchAllInsights}
          disabled={loading || !currentUser}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Refreshing...' : 'Refresh Insights'}
        </Button>
      </Box>
    </Box>
  );
};

export default AIInsightsDashboard; 