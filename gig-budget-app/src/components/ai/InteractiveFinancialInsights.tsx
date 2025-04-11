import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Slider,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SimpleFinanceBot from './SimpleFinanceBot';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialData {
  income: number;
  expenses: number;
  savings: number;
  date: string;
}

interface FutureProjection {
  date: string;
  income: number;
  predictedIncome: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
  seasonalImpact: number;
}

interface SeasonalPattern {
  month: number;
  impact: number;
  description: string;
}

const SEASONAL_PATTERNS: SeasonalPattern[] = [
  { month: 0, impact: 1.2, description: 'New Year peak' },
  { month: 1, impact: 0.9, description: 'Post-holiday decline' },
  { month: 2, impact: 1.0, description: 'Spring recovery' },
  { month: 3, impact: 1.1, description: 'Spring peak' },
  { month: 4, impact: 1.05, description: 'Steady growth' },
  { month: 5, impact: 1.15, description: 'Summer increase' },
  { month: 6, impact: 1.2, description: 'Summer peak' },
  { month: 7, impact: 1.1, description: 'Late summer' },
  { month: 8, impact: 1.0, description: 'Fall transition' },
  { month: 9, impact: 1.1, description: 'Pre-holiday increase' },
  { month: 10, impact: 1.15, description: 'Holiday season' },
  { month: 11, impact: 1.25, description: 'December peak' }
];

const InteractiveFinancialInsights: React.FC = () => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [incomeGrowth, setIncomeGrowth] = useState<number>(5);
  const [expenseGrowth, setExpenseGrowth] = useState<number>(3);
  const [timeframe, setTimeframe] = useState<string>('monthly');
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [futureProjections, setFutureProjections] = useState<FutureProjection[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);
  const [seasonalityEnabled, setSeasonalityEnabled] = useState<boolean>(true);

  const calculateConfidenceIntervals = (baseValue: number, monthsAhead: number) => {
    const volatility = 0.05; // 5% base volatility
    const timeScaling = 1 + (monthsAhead * 0.02); // Increasing uncertainty over time
    const standardDeviation = baseValue * volatility * timeScaling;
    
    const zScore = 1.96; // 95% confidence interval
    const margin = standardDeviation * zScore;
    
    return {
      upper: baseValue + margin,
      lower: baseValue - margin,
      confidence: Math.max(60, 100 - (monthsAhead * 2)) // Confidence decreases over time
    };
  };

  const applySeasonalAdjustment = (baseValue: number, date: Date) => {
    if (!seasonalityEnabled) return baseValue;
    
    const month = date.getMonth();
    const pattern = SEASONAL_PATTERNS[month];
    return baseValue * pattern.impact;
  };

  const generateAIInsights = (data: FinancialData[], projections: FutureProjection[]) => {
    if (data.length === 0) return '';
    
    const latest = data[data.length - 1];
    const savingsRate = ((latest.income - latest.expenses) / latest.income) * 100;
    
    let insight = '';
    if (savingsRate > 20) {
      insight = 'Excellent savings rate! Consider investing in long-term assets.';
    } else if (savingsRate > 10) {
      insight = 'Good savings rate. Look for ways to optimize expenses.';
    } else {
      insight = 'Consider reviewing your expenses to improve savings.';
    }

    // Add seasonal insights
    if (seasonalityEnabled && projections.length > 0) {
      const nextMonth = new Date().getMonth();
      const seasonalPattern = SEASONAL_PATTERNS[nextMonth];
      insight += `\n\nSeasonal Analysis: ${seasonalPattern.description}. `;
      if (seasonalPattern.impact > 1.1) {
        insight += 'This is typically a strong income period.';
      } else if (seasonalPattern.impact < 0.95) {
        insight += 'This is typically a slower income period.';
      }
    }

    // Add confidence insights
    const avgConfidence = projections.reduce((sum, p) => sum + p.confidence, 0) / projections.length;
    insight += `\n\nPrediction Confidence: ${avgConfidence.toFixed(1)}%`;
    
    return insight;
  };

  const calculateFutureProjections = (currentData: FinancialData, months: number = 12) => {
    const projections: FutureProjection[] = [];
    let baseIncome = currentData.income;
    const startDate = new Date();

    for (let i = 1; i <= months; i++) {
      const projectionDate = new Date(startDate);
      projectionDate.setMonth(startDate.getMonth() + i);
      
      // Calculate base projected income with growth
      const baseProjectedIncome = baseIncome * (1 + (incomeGrowth / 100));
      
      // Apply seasonal adjustment
      const seasonallyAdjustedIncome = applySeasonalAdjustment(baseProjectedIncome, projectionDate);
      
      // Calculate confidence intervals
      const { upper, lower, confidence } = calculateConfidenceIntervals(seasonallyAdjustedIncome, i);
      
      projections.push({
        date: projectionDate.toLocaleDateString(),
        income: baseIncome, // Historical income
        predictedIncome: seasonallyAdjustedIncome,
        upperBound: upper,
        lowerBound: lower,
        confidence,
        seasonalImpact: SEASONAL_PATTERNS[projectionDate.getMonth()].impact
      });

      baseIncome = baseProjectedIncome; // Update base for next iteration
    }

    return projections;
  };

  const handleSubmit = () => {
    const newData: FinancialData = {
      income,
      expenses,
      savings: income - expenses,
      date: new Date().toLocaleDateString()
    };

    const projections = calculateFutureProjections(newData);
    setFinancialData(prev => [...prev, newData]);
    setFutureProjections(projections);
    setInsights(generateAIInsights([...financialData, newData], projections));
  };

  const chartData = {
    labels: [
      ...financialData.map(data => data.date),
      ...futureProjections.map(proj => proj.date)
    ],
    datasets: [
      {
        label: 'Actual Income',
        data: [
          ...financialData.map(data => data.income),
          ...futureProjections.map(proj => proj.income)
        ],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      },
      {
        label: 'Predicted Income',
        data: [
          ...Array(financialData.length).fill(null),
          ...futureProjections.map(proj => proj.predictedIncome)
        ],
        borderColor: 'rgb(54, 162, 235)',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      },
      {
        label: 'Upper Bound',
        data: [
          ...Array(financialData.length).fill(null),
          ...futureProjections.map(proj => proj.upperBound)
        ],
        borderColor: 'rgba(54, 162, 235, 0.2)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.1,
        fill: 1
      },
      {
        label: 'Lower Bound',
        data: [
          ...Array(financialData.length).fill(null),
          ...futureProjections.map(proj => proj.lowerBound)
        ],
        borderColor: 'rgba(54, 162, 235, 0.2)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'AI-Powered Income Predictions'
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const projection = futureProjections[dataIndex - financialData.length];
            if (projection) {
              return [
                `${context.dataset.label}: ${context.formattedValue}`,
                `Confidence: ${projection.confidence.toFixed(1)}%`,
                `Seasonal Impact: ${(projection.seasonalImpact * 100 - 100).toFixed(1)}%`
              ];
            }
            return `${context.dataset.label}: ${context.formattedValue}`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enter Financial Data
              </Typography>
              <TextField
                fullWidth
                label="Monthly Income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Monthly Expenses"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                margin="normal"
              />
              <Typography gutterBottom sx={{ mt: 2 }}>
                Expected Income Growth Rate (%)
              </Typography>
              <Slider
                value={incomeGrowth}
                onChange={(_, value) => setIncomeGrowth(value as number)}
                min={0}
                max={20}
                step={0.5}
                valueLabelDisplay="auto"
              />
              <Typography gutterBottom sx={{ mt: 2 }}>
                Confidence Level (%)
              </Typography>
              <Slider
                value={confidenceLevel}
                onChange={(_, value) => setConfidenceLevel(value as number)}
                min={80}
                max={99}
                step={1}
                valueLabelDisplay="auto"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={timeframe}
                  label="Timeframe"
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip
                  label="Seasonal Analysis"
                  color={seasonalityEnabled ? "primary" : "default"}
                  onClick={() => setSeasonalityEnabled(!seasonalityEnabled)}
                />
              </Stack>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 2 }}
                fullWidth
              >
                Generate AI Predictions
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Financial Insights
              </Typography>
              {insights && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
                  <Typography style={{ whiteSpace: 'pre-line' }}>{insights}</Typography>
                </Paper>
              )}
              <Alert severity="info" sx={{ mb: 2 }}>
                Shaded area shows prediction confidence interval
              </Alert>
              <Box sx={{ height: 400 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <SimpleFinanceBot />
    </Box>
  );
};

export default InteractiveFinancialInsights; 