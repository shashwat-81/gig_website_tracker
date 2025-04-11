import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  LinearProgress,
} from '@mui/material';
import { Add, Delete, Category as CategoryIcon } from '@mui/icons-material';

// Budget categories relevant for Indian gig workers
const BUDGET_CATEGORIES = [
  'Housing & Rent',
  'Groceries',
  'Transportation',
  'Utilities',
  'Mobile & Internet',
  'Healthcare',
  'Insurance',
  'Savings',
  'Entertainment',
  'Education',
  'Clothing',
  'Equipment',
  'Taxes',
  'Debt Repayment',
  'Gifts & Donations',
  'Other'
];

interface BudgetItem {
  id: number;
  category: string;
  planned: number;
  actual: number;
}

const BudgetPlanner: React.FC = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 1, category: 'Housing & Rent', planned: 8000, actual: 8000 },
    { id: 2, category: 'Groceries', planned: 5000, actual: 4800 },
    { id: 3, category: 'Transportation', planned: 5000, actual: 5200 },
    { id: 4, category: 'Utilities', planned: 1500, actual: 1400 },
    { id: 5, category: 'Mobile & Internet', planned: 800, actual: 800 },
    { id: 6, category: 'Savings', planned: 3000, actual: 2500 },
    { id: 7, category: 'Healthcare', planned: 1000, actual: 800 },
    { id: 8, category: 'Equipment', planned: 1200, actual: 1500 },
    { id: 9, category: 'Food (Outside)', planned: 2200, actual: 2500 }
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleAddBudgetItem = () => {
    if (newCategory && newAmount) {
      const newId = budgetItems.length > 0
        ? Math.max(...budgetItems.map(item => item.id)) + 1
        : 1;
      
      const newItem = {
        id: newId,
        category: newCategory,
        planned: Number(newAmount),
        actual: 0
      };
      
      setBudgetItems([...budgetItems, newItem]);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const handleDeleteItem = (id: number) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  // Calculate budget summary
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const variableBudget = budgetItems.filter(item => item.planned !== item.actual).reduce((sum, item) => sum + item.planned, 0);
  const fixedBudget = totalBudget - variableBudget;

  // Calculate category totals
  const categoryTotals = BUDGET_CATEGORIES.map(category => {
    const total = budgetItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.planned, 0);
    
    return {
      category,
      total,
      percentage: totalBudget > 0 ? (total / totalBudget) * 100 : 0
    };
  }).filter(cat => cat.total > 0);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Budget Planner
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Plan and track your monthly expenses
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {/* Budget Summary Card */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, flexGrow: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Budget Summary
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <CategoryIcon color="primary" />
                    <Typography variant="body1">Total Budget</Typography>
                  </Stack>
                  <Typography variant="h4" color="primary.main">₹{totalBudget.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <CategoryIcon color="success" />
                    <Typography variant="body1">Fixed Expenses</Typography>
                  </Stack>
                  <Typography variant="h5" color="success.main">₹{fixedBudget.toLocaleString()}</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(fixedBudget / totalBudget) * 100} 
                    color="success"
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <CategoryIcon color="secondary" />
                    <Typography variant="body1">Variable Expenses</Typography>
                  </Stack>
                  <Typography variant="h5" color="secondary.main">₹{variableBudget.toLocaleString()}</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(variableBudget / totalBudget) * 100} 
                    color="secondary"
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Category Breakdown */}
        <Box sx={{ width: { xs: '100%', md: '65%' }, flexGrow: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Budget Breakdown by Category
              </Typography>
              <Stack spacing={2} sx={{ mt: 3 }}>
                {categoryTotals.map(cat => (
                  <Box key={cat.category}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {cat.category}
                      </Typography>
                      <Typography variant="body2">
                        ₹{cat.total.toLocaleString()} ({Math.round(cat.percentage)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={cat.percentage}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 
                            cat.category === 'Housing & Rent' ? 'primary.main' :
                            cat.category === 'Groceries' ? 'secondary.main' :
                            cat.category === 'Transportation' ? 'info.main' :
                            cat.category === 'Utilities' ? 'success.main' :
                            cat.category === 'Mobile & Internet' ? 'warning.main' :
                            cat.category === 'Healthcare' ? 'error.main' :
                            cat.category === 'Savings' ? 'primary.dark' :
                            'grey.500'
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setNewCategory('')}
                >
                  Add Budget Item
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tips for gig workers */}
        <Box sx={{ width: '100%' }}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Budget Tips for Gig Workers
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="body1" gutterBottom>
                    • Create a buffer fund for months with lower income
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    • Prioritize fixed expenses when planning your budget
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    • Allocate at least 20% of your income to savings
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%' } }}>
                  <Typography variant="body1" gutterBottom>
                    • Track your expenses daily to avoid overspending
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    • Plan for quarterly tax payments
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    • Consider income insurance for periods of low work
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Budget Items List */}
      <Box>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Budget Items
            </Typography>
            {budgetItems.length > 0 ? (
              <Stack spacing={2}>
                {budgetItems.map(item => (
                  <Box key={item.id} sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{item.actual.toLocaleString()} of ₹{item.planned.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                          ₹{item.planned.toLocaleString()}
                        </Typography>
                        <IconButton color="error" onClick={() => handleDeleteItem(item.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography color="text.secondary">
                  No budget items added yet. Click "Add Budget Item" to get started.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default BudgetPlanner; 