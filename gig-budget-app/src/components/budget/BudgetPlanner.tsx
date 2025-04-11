import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Divider,
  Chip,
  Stack,
  LinearProgress,
  InputLabel,
  FormControl,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Delete, Edit, Save, AttachMoney, AccountBalance, TrendingUp } from '@mui/icons-material';

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
    { id: 1, category: 'Housing & Rent', planned: 10000, actual: 10000 },
    { id: 2, category: 'Groceries', planned: 6000, actual: 5500 },
    { id: 3, category: 'Transportation', planned: 3000, actual: 3200 },
    { id: 4, category: 'Utilities', planned: 2500, actual: 2300 },
    { id: 5, category: 'Mobile & Internet', planned: 1200, actual: 1200 },
    { id: 6, category: 'Savings', planned: 5000, actual: 4000 }
  ]);

  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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
      setDialogOpen(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const handleStartEdit = (id: number, amount: number) => {
    setEditingId(id);
    setEditAmount(amount.toString());
  };

  const handleSaveEdit = (id: number) => {
    const updatedItems = budgetItems.map(item => {
      if (item.id === id) {
        return { ...item, actual: Number(editAmount) };
      }
      return item;
    });
    
    setBudgetItems(updatedItems);
    setEditingId(null);
    setEditAmount('');
  };

  // Calculate budget stats
  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const remainingBudget = totalPlanned - totalActual;
  
  // Available categories that aren't already in the budget
  const categories = budgetItems.map(item => item.category);
  const availableCategories = BUDGET_CATEGORIES.filter(cat => !categories.includes(cat));

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
                    <AttachMoney color="primary" />
                    <Typography variant="body1">Total Budget</Typography>
                  </Stack>
                  <Typography variant="h4" color="primary.main">₹{totalBudget.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AccountBalance color="success" />
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
                    <TrendingUp color="secondary" />
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
                  onClick={() => setDialogOpen(true)}
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
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.category}
                          </Typography>
                          <Chip 
                            label={item.planned !== item.actual ? 'Variable' : 'Fixed'} 
                            color={item.planned !== item.actual ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </Stack>
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

      {/* Add Budget Item Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Budget Item</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newCategory}
                label="Category"
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Planned Amount (₹)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              type="number"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddBudgetItem}
            disabled={!newCategory || !newAmount}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetPlanner; 