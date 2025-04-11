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
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import Grid from '../common/StyledGrid';

// Dummy data for income entries
const dummyIncomeData = [
  {
    id: 1,
    source: 'Freelance Web Development',
    amount: 45000,
    date: '2024-04-01',
    category: 'Contract Work',
    description: 'E-commerce website development for ABC Corp'
  },
  {
    id: 2,
    source: 'App Design Project',
    amount: 25000,
    date: '2024-04-05',
    category: 'Contract Work',
    description: 'UI/UX design for travel application'
  },
  {
    id: 3,
    source: 'Content Writing',
    amount: 8000,
    date: '2024-04-12',
    category: 'Freelance',
    description: 'Technical article for XYZ Publication'
  },
  {
    id: 4,
    source: 'Uber Driving',
    amount: 12500,
    date: '2024-04-15',
    category: 'Gig Work',
    description: 'Weekend driving'
  },
  {
    id: 5,
    source: 'YouTube Ad Revenue',
    amount: 3200,
    date: '2024-04-20',
    category: 'Passive Income',
    description: 'Monthly revenue from tech tutorials channel'
  },
  {
    id: 6,
    source: 'Logo Design',
    amount: 7500,
    date: '2024-04-22',
    category: 'Freelance',
    description: 'Brand identity for local restaurant'
  }
];

// Categories for income sources
const incomeCategories = [
  'Contract Work',
  'Freelance',
  'Gig Work',
  'Passive Income',
  'Investment',
  'Other'
];

const IncomeTracker: React.FC = () => {
  const [incomeEntries, setIncomeEntries] = useState(dummyIncomeData);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: ''
  });

  // Calculate total income
  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  
  // Calculate average income
  const averageIncome = incomeEntries.length > 0 
    ? totalIncome / incomeEntries.length 
    : 0;

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewIncome({
      source: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIncome({
      ...newIncome,
      [name]: value
    });
  };

  const handleAddIncome = () => {
    // In a real app, you would validate inputs here
    const newEntry = {
      id: incomeEntries.length + 1,
      source: newIncome.source,
      amount: Number(newIncome.amount),
      date: newIncome.date,
      category: newIncome.category,
      description: newIncome.description
    };
    
    setIncomeEntries([...incomeEntries, newEntry]);
    handleAddDialogClose();
  };

  const handleDeleteIncome = (id: number) => {
    setIncomeEntries(incomeEntries.filter(entry => entry.id !== id));
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Income Tracker
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddDialogOpen}
          color="primary"
        >
          Add Income
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {formatCurrency(totalIncome)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                From {incomeEntries.length} sources this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Average Income
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="text.primary">
                {formatCurrency(averageIncome)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Per income source
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="textSecondary">
                Highest Income
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="text.primary">
                {incomeEntries.length > 0 
                  ? formatCurrency(Math.max(...incomeEntries.map(entry => entry.amount))) 
                  : formatCurrency(0)}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Highest single income source
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Income Table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="income table">
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomeEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell component="th" scope="row">
                  <Typography fontWeight="medium">{entry.source}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={entry.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: entry.category === 'Contract Work' ? 'success.light' :
                              entry.category === 'Freelance' ? 'info.light' :
                              entry.category === 'Gig Work' ? 'warning.light' :
                              entry.category === 'Passive Income' ? 'secondary.light' : 
                              'default',
                      color: 'text.primary'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                    {new Date(entry.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold" color="success.main">
                    {formatCurrency(entry.amount)}
                  </Typography>
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell align="center">
                  <Box>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteIncome(entry.id)}
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

      {/* Add Income Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Income</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="source"
                label="Income Source"
                fullWidth
                value={newIncome.source}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Amount (₹)"
                type="number"
                fullWidth
                value={newIncome.amount}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                fullWidth
                value={newIncome.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="category"
                label="Category"
                select
                fullWidth
                value={newIncome.category}
                onChange={handleInputChange}
              >
                {incomeCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={newIncome.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddIncome} 
            variant="contained" 
            startIcon={<AddIcon />}
            disabled={!newIncome.source || !newIncome.amount || !newIncome.category}
          >
            Add Income
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncomeTracker; 