import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  LinearProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Paper,
  Divider,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material';
import { Add, Delete, Edit, Savings, CreditCard, Home } from '@mui/icons-material';

// Goal types for Indian gig workers
const GOAL_TYPES = [
  'Emergency Fund',
  'Vehicle Purchase',
  'Home Down Payment',
  'Education',
  'Equipment Upgrade',
  'Wedding',
  'Travel',
  'Tax Payments',
  'Retirement',
  'Family Support',
  'Business Expansion',
  'Debt Repayment'
];

// Time periods
const TIME_PERIODS = [
  { value: 1, label: '1 month' },
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '1 year' },
  { value: 24, label: '2 years' },
  { value: 36, label: '3 years' },
  { value: 60, label: '5 years' }
];

interface SavingsGoal {
  id: number;
  name: string;
  type: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: Date;
  monthlyRequired: number;
}

const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: 1,
      name: 'Emergency Fund',
      type: 'Emergency Fund',
      targetAmount: 60000,
      savedAmount: 25000,
      targetDate: new Date(2023, 11, 31),
      monthlyRequired: 5000
    },
    {
      id: 2,
      name: 'New Laptop',
      type: 'Equipment Upgrade',
      targetAmount: 75000,
      savedAmount: 32000,
      targetDate: new Date(2023, 8, 30),
      monthlyRequired: 10750
    },
    {
      id: 3,
      name: 'Bike Down Payment',
      type: 'Vehicle Purchase',
      targetAmount: 25000,
      savedAmount: 15000,
      targetDate: new Date(2023, 10, 30),
      monthlyRequired: 2500
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState('30000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('21000');
  const [emergencyMonths, setEmergencyMonths] = useState(3);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    name: '',
    type: '',
    targetAmount: '',
    savedAmount: '',
    months: 12
  });

  const handleAddGoal = () => {
    const targetAmount = Number(newGoal.targetAmount);
    const savedAmount = Number(newGoal.savedAmount);
    const months = newGoal.months;
    
    const monthsRemaining = months;
    const amountRemaining = targetAmount - savedAmount;
    const monthlyRequired = Math.ceil(amountRemaining / monthsRemaining);

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);

    const goal: SavingsGoal = {
      id: Date.now(),
      name: newGoal.name,
      type: newGoal.type,
      targetAmount,
      savedAmount,
      targetDate,
      monthlyRequired
    };

    setGoals([...goals, goal]);
    setDialogOpen(false);
    setNewGoal({
      name: '',
      type: '',
      targetAmount: '',
      savedAmount: '',
      months: 12
    });
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const calculateEmergencyFund = () => {
    const monthlyExp = parseFloat(monthlyExpenses) || 0;
    return monthlyExp * emergencyMonths;
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalRequired = goals.reduce((sum, goal) => sum + goal.monthlyRequired, 0);
  const monthlySavingCapacity = (parseFloat(monthlyIncome) || 0) - (parseFloat(monthlyExpenses) || 0);

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Savings Goals
      </Typography>

      {/* Top Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Emergency Fund Card */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, flexGrow: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Savings color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Emergency Fund Calculator
                </Typography>
              </Box>
              <Stack spacing={2}>
                <TextField
                  label="Monthly Expenses (₹)"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  type="number"
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Months of Coverage</InputLabel>
                  <Select
                    value={emergencyMonths}
                    label="Months of Coverage"
                    onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                  >
                    <MenuItem value={1}>1 month</MenuItem>
                    <MenuItem value={3}>3 months</MenuItem>
                    <MenuItem value={6}>6 months</MenuItem>
                    <MenuItem value={12}>12 months</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 1, color: 'white' }}>
                  <Typography variant="body2" gutterBottom>
                    Recommended Emergency Fund:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{calculateEmergencyFund().toLocaleString()}
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 1 }}>
                  Gig workers should aim for a larger emergency fund (3-6 months) due to income volatility.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Savings Capacity Card */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, flexGrow: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CreditCard color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Monthly Savings Capacity
                </Typography>
              </Box>
              <Stack spacing={2}>
                <TextField
                  label="Average Monthly Income (₹)"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  type="number"
                  fullWidth
                />
                <TextField
                  label="Average Monthly Expenses (₹)"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  type="number"
                  fullWidth
                />
                <Box sx={{ bgcolor: 'secondary.light', p: 2, borderRadius: 1, color: 'white' }}>
                  <Typography variant="body2" gutterBottom>
                    Available for Savings:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{monthlySavingCapacity.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: 1, color: 'white' }}>
                  <Typography variant="body2" gutterBottom>
                    Goal Contributions Needed:
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{totalRequired.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Total Progress Card */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, flexGrow: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Home color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Overall Savings Progress
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Total Saved: ₹{totalSaved.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={() => setDialogOpen(true)}
              >
                Add New Goal
              </Button>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Active Goals: {goals.length}
                </Typography>
                <Typography variant="body2">
                  Total Target: ₹{totalTarget.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Savings Goals List */}
      <Box sx={{ mb: 4 }}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Your Savings Goals
            </Typography>
          </Box>
          <Divider />
          {goals.map((goal) => {
            const progress = (goal.savedAmount / goal.targetAmount) * 100;
            const daysRemaining = Math.max(0, Math.floor((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            
            return (
              <Box key={goal.id} sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ width: { xs: '100%', sm: '30%' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {goal.name}
                      </Typography>
                      <Chip 
                        label={goal.type} 
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {daysRemaining} days remaining
                    </Typography>
                  </Box>
                  <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                    <Box sx={{ mb: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ height: 8, borderRadius: 4 }} 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        ₹{goal.savedAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: { xs: '100%', sm: '15%' } }}>
                    <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Monthly:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{goal.monthlyRequired.toLocaleString()}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            );
          })}
          {goals.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No savings goals created yet. Add your first goal to get started!
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Add Goal Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Savings Goal</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Goal Name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Goal Type</InputLabel>
              <Select
                value={newGoal.type}
                label="Goal Type"
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              >
                {GOAL_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Target Amount (₹)"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              type="number"
              fullWidth
            />
            <TextField
              label="Already Saved (₹)"
              value={newGoal.savedAmount}
              onChange={(e) => setNewGoal({ ...newGoal, savedAmount: e.target.value })}
              type="number"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Target Timeline</InputLabel>
              <Select
                value={newGoal.months}
                label="Target Timeline"
                onChange={(e) => setNewGoal({ ...newGoal, months: Number(e.target.value) })}
              >
                {TIME_PERIODS.map((period) => (
                  <MenuItem key={period.value} value={period.value}>{period.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddGoal}
            disabled={!newGoal.name || !newGoal.type || !newGoal.targetAmount}
          >
            Add Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsGoals; 