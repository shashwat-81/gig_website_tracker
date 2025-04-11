import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingDown as TrendingDownIcon,
  CalendarMonth as CalendarIcon,
  LocalOffer as TagIcon,
  ShoppingCart as ShoppingIcon,
  DirectionsCar as TransportIcon,
  Restaurant as FoodIcon,
  Home as HomeIcon,
  Devices as TechIcon,
  HealthAndSafety as HealthIcon,
  School as EducationIcon,
  Bolt as UtilitiesIcon
} from '@mui/icons-material';
import Grid from '../common/StyledGrid';
import CheckboxField from '../common/CheckboxField';

// Dummy expense data
const dummyExpenseData = [
  {
    id: 1,
    title: 'Grocery Shopping',
    amount: 3500,
    date: '2024-04-02',
    category: 'Food',
    paymentMethod: 'Credit Card',
    recurring: false
  },
  {
    id: 2,
    title: 'Uber Rides',
    amount: 1200,
    date: '2024-04-05',
    category: 'Transportation',
    paymentMethod: 'UPI',
    recurring: false
  },
  {
    id: 3,
    title: 'Mobile Phone Bill',
    amount: 999,
    date: '2024-04-07',
    category: 'Utilities',
    paymentMethod: 'Auto Debit',
    recurring: true
  },
  {
    id: 4,
    title: 'Coworking Space Membership',
    amount: 5000,
    date: '2024-04-01',
    category: 'Work',
    paymentMethod: 'Debit Card',
    recurring: true
  },
  {
    id: 5,
    title: 'New Laptop Accessories',
    amount: 4500,
    date: '2024-04-10',
    category: 'Technology',
    paymentMethod: 'Credit Card',
    recurring: false
  },
  {
    id: 6,
    title: 'Health Insurance',
    amount: 2500,
    date: '2024-04-15',
    category: 'Health',
    paymentMethod: 'Auto Debit',
    recurring: true
  },
  {
    id: 7,
    title: 'Online Course Subscription',
    amount: 1499,
    date: '2024-04-05',
    category: 'Education',
    paymentMethod: 'Credit Card',
    recurring: true
  },
  {
    id: 8,
    title: 'Restaurant Dinner',
    amount: 2800,
    date: '2024-04-14',
    category: 'Food',
    paymentMethod: 'UPI',
    recurring: false
  }
];

// Expense categories with icons
const expenseCategories = [
  { name: 'Food', icon: <FoodIcon /> },
  { name: 'Transportation', icon: <TransportIcon /> },
  { name: 'Utilities', icon: <UtilitiesIcon /> },
  { name: 'Housing', icon: <HomeIcon /> },
  { name: 'Technology', icon: <TechIcon /> },
  { name: 'Health', icon: <HealthIcon /> },
  { name: 'Education', icon: <EducationIcon /> },
  { name: 'Shopping', icon: <ShoppingIcon /> },
  { name: 'Work', icon: <TechIcon /> },
  { name: 'Other', icon: <TagIcon /> }
];

// Payment methods
const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Net Banking',
  'Auto Debit',
  'Other'
];

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState(dummyExpenseData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    paymentMethod: '',
    recurring: false
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Filter expenses by selected category
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === selectedCategory);
  
  // Calculate spending by category
  const spendingByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Find top spending category
  const topCategory = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  // Handle dialog open/close
  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewExpense({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      paymentMethod: '',
      recurring: false
    });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle adding new expense
  const handleAddExpense = () => {
    const newEntry = {
      id: expenses.length + 1,
      title: newExpense.title,
      amount: Number(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category,
      paymentMethod: newExpense.paymentMethod,
      recurring: newExpense.recurring
    };
    
    setExpenses([...expenses, newEntry]);
    handleAddDialogClose();
  };

  // Handle delete expense
  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get icon for a category
  const getCategoryIcon = (categoryName: string) => {
    const category = expenseCategories.find(cat => cat.name === categoryName);
    return category ? category.icon : <TagIcon />;
  };

  // Calculate percentage for each category
  const categoryPercentage = (categoryAmount: number) => {
    return totalExpenses > 0 ? Math.round((categoryAmount / totalExpenses) * 100) : 0;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Expense Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddDialogOpen}
          color="error"
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4} component="div">
          <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {formatCurrency(totalExpenses)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                From {expenses.length} expenses this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Top Category
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getCategoryIcon(topCategory[0])}
                <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ ml: 1 }}>
                  {topCategory[0]}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {formatCurrency(topCategory[1] as number)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {categoryPercentage(topCategory[1] as number)}% of total expenses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Recurring Expenses
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="text.primary">
                {formatCurrency(expenses.filter(e => e.recurring).reduce((sum, e) => sum + e.amount, 0))}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {expenses.filter(e => e.recurring).length} recurring payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Category
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label="All" 
            icon={<TagIcon />}
            onClick={() => setSelectedCategory('all')}
            color={selectedCategory === 'all' ? 'primary' : 'default'}
            variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
          />
          {Object.keys(spendingByCategory).map((category) => (
            <Chip 
              key={category}
              label={`${category} (${formatCurrency(spendingByCategory[category])})`}
              icon={getCategoryIcon(category)}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* Category Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Spending by Category
          </Typography>
          <Box sx={{ mt: 2 }}>
            {Object.entries(spendingByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getCategoryIcon(category)}
                      <Typography sx={{ ml: 1 }}>{category}</Typography>
                    </Box>
                    <Typography fontWeight="bold">{formatCurrency(amount)}</Typography>
                  </Box>
                  <Box sx={{ position: 'relative', height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        height: '100%', 
                        width: `${categoryPercentage(amount)}%`,
                        bgcolor: 'error.main',
                        borderRadius: 1
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {categoryPercentage(amount)}% of total
                  </Typography>
                </Box>
              ))}
          </Box>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Typography variant="h6" gutterBottom>
        {selectedCategory === 'all' ? 'All Expenses' : `${selectedCategory} Expenses`} ({filteredExpenses.length})
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="expenses table">
          <TableHead sx={{ bgcolor: 'error.light' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontWeight="medium">{expense.title}</Typography>
                    {expense.recurring && (
                      <Chip 
                        label="Recurring" 
                        size="small" 
                        color="info" 
                        sx={{ ml: 1 }} 
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getCategoryIcon(expense.category)}
                    <Typography sx={{ ml: 1 }}>{expense.category}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    {new Date(expense.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold" color="error.main">
                    {formatCurrency(expense.amount)}
                  </Typography>
                </TableCell>
                <TableCell>{expense.paymentMethod}</TableCell>
                <TableCell align="center">
                  <Box>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Expense Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Expense Title"
                fullWidth
                value={newExpense.title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Amount (₹)"
                type="number"
                fullWidth
                value={newExpense.amount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                fullWidth
                value={newExpense.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                select
                fullWidth
                value={newExpense.category}
                onChange={handleInputChange}
              >
                {expenseCategories.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="paymentMethod"
                label="Payment Method"
                select
                fullWidth
                value={newExpense.paymentMethod}
                onChange={handleInputChange}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Recurring Expense?</Typography>
                <CheckboxField
                  name="recurring"
                  onChange={handleInputChange}
                  checked={newExpense.recurring}
                  sx={{ ml: 2 }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddExpense} 
            variant="contained" 
            color="error"
            startIcon={<AddIcon />}
            disabled={!newExpense.title || !newExpense.amount || !newExpense.category || !newExpense.paymentMethod}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseTracker; 