import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Chip,
  Divider,
  Alert,
  AlertTitle,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  Calculate,
  CalendarToday,
  ReceiptLong,
  CloudUpload,
  Info,
  Add,
  Edit,
  Delete,
  LocalOffer,
  ExpandMore,
  Payment,
  NotificationsActive,
  AddCircleOutline,
  HelpOutline
} from '@mui/icons-material';

// Sample data for tax deductions specific to Indian gig workers
const availableDeductions = [
  { 
    id: 1, 
    category: 'Professional Expenses', 
    name: 'Vehicle Expenses', 
    description: 'Fuel, maintenance, and repairs for vehicles used for work', 
    maxLimit: 'Actual expenses', 
    eligibility: 'Full-time delivery professionals',
    complexityLevel: 'Medium'
  },
  { 
    id: 2, 
    category: 'Professional Expenses', 
    name: 'Mobile & Internet', 
    description: 'Phone and internet charges used for business', 
    maxLimit: 'Proportionate to business use', 
    eligibility: 'All gig workers',
    complexityLevel: 'Low'
  },
  { 
    id: 3, 
    category: 'Professional Expenses', 
    name: 'Equipment Depreciation', 
    description: 'Depreciation on equipment used for work', 
    maxLimit: 'As per IT Act rates', 
    eligibility: 'All gig workers',
    complexityLevel: 'High'
  },
  { 
    id: 4, 
    category: 'Investments', 
    name: 'Section 80C', 
    description: 'Life insurance, PPF, ELSS mutual funds, etc.', 
    maxLimit: '₹1,50,000', 
    eligibility: 'All taxpayers',
    complexityLevel: 'Low'
  },
  { 
    id: 5, 
    category: 'Investments', 
    name: 'Health Insurance (80D)', 
    description: 'Premium paid for health insurance', 
    maxLimit: '₹25,000 (₹50,000 for senior citizens)', 
    eligibility: 'All taxpayers',
    complexityLevel: 'Low'
  },
  { 
    id: 6, 
    category: 'Other', 
    name: 'NPS Contribution (80CCD)', 
    description: 'Contribution to National Pension Scheme', 
    maxLimit: 'Additional ₹50,000', 
    eligibility: 'All taxpayers',
    complexityLevel: 'Medium'
  }
];

// Sample tax slabs for India FY 2025-26 (New Tax Regime)
const taxSlabs = [
  { min: 0, max: 400000, rate: 0, description: 'No tax up to ₹4,00,000' },
  { min: 400001, max: 800000, rate: 5, description: '5% on income between ₹4,00,001 and ₹8,00,000' },
  { min: 800001, max: 1200000, rate: 10, description: '10% on income between ₹8,00,001 and ₹12,00,000' },
  { min: 1200001, max: 1600000, rate: 15, description: '15% on income between ₹12,00,001 and ₹16,00,000' },
  { min: 1600001, max: 2000000, rate: 20, description: '20% on income between ₹16,00,001 and ₹20,00,000' },
  { min: 2000001, max: 2400000, rate: 25, description: '25% on income between ₹20,00,001 and ₹24,00,000' },
  { min: 2400001, max: Infinity, rate: 30, description: '30% on income above ₹24,00,000' }
];

// Old tax regime slabs for comparison
const oldTaxSlabs = [
  { min: 0, max: 250000, rate: 0, description: 'No tax up to ₹2,50,000' },
  { min: 250001, max: 500000, rate: 5, description: '5% on income between ₹2,50,001 and ₹5,00,000' },
  { min: 500001, max: 1000000, rate: 20, description: '20% on income between ₹5,00,001 and ₹10,00,000' },
  { min: 1000001, max: Infinity, rate: 30, description: '30% on income above ₹10,00,000' }
];

// Quarterly due dates for advance tax in India
const taxDueDates = [
  { quarter: 'Q1', dueDate: '15 Jun 2025', percentage: '15%' },
  { quarter: 'Q2', dueDate: '15 Sep 2025', percentage: '45%' },
  { quarter: 'Q3', dueDate: '15 Dec 2025', percentage: '75%' },
  { quarter: 'Q4', dueDate: '15 Mar 2026', percentage: '100%' }
];

// Define the ExpenseRecord interface
interface ExpenseRecord {
  id: number;
  description: string;
  amount: number;
  date: string;
  isDeductible: boolean;
}

interface TaxManagerProps {}

const TaxManager: React.FC<TaxManagerProps> = () => {
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState<number>(332700);
  const [estimatedDeductions, setEstimatedDeductions] = useState<number>(80000);
  const [taxRegime, setTaxRegime] = useState<'old' | 'new'>('new');
  const [activeTab, setActiveTab] = useState<'calculator' | 'deductions' | 'reminders'>('calculator');
  const [showTaxSlabs, setShowTaxSlabs] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<string | number>('');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculate taxable income based on the selected tax regime
  const taxableIncome = taxRegime === 'new' 
    ? Math.max(0, estimatedAnnualIncome - 50000) // Only standard deduction in new regime
    : Math.max(0, estimatedAnnualIncome - estimatedDeductions);
  
  // Calculate tax based on slabs (simplified)
  const calculateTax = (income: number): number => {
    let tax = 0;
    
    // Use appropriate tax slabs based on regime
    const applicableSlabs = taxRegime === 'new' ? taxSlabs : oldTaxSlabs;
    
    for (const slab of applicableSlabs) {
      if (income > slab.min) {
        const slabAmount = Math.min(income, slab.max) - slab.min;
        tax += slabAmount * (slab.rate / 100);
      }
    }
    
    // Apply tax rebate as per Union Budget 2025-26
    if (taxRegime === 'new' && income <= 1200000) {
      // New regime: Tax rebate for those with income up to Rs 12 lakh
      tax = 0;
    } else if (taxRegime === 'old' && income <= 500000) {
      // Old regime: Tax rebate for those with income up to Rs 5 lakh
      tax = 0;
    }
    
    // Add 4% cess (simplified)
    tax *= 1.04;
    
    return Math.round(tax);
  };
  
  const totalTax = calculateTax(taxableIncome);
  const effectiveTaxRate = (totalTax / estimatedAnnualIncome) * 100;
  
  // Calculate quarterly tax obligations
  const quarterlyTax = taxDueDates.map(quarter => {
    const percentageValue = parseInt(quarter.percentage.replace('%', ''));
    const amountDue = Math.ceil((totalTax * percentageValue) / 100);
    const amountPerQuarter = quarter.quarter === 'Q1' 
      ? amountDue 
      : amountDue - Math.ceil((totalTax * parseInt(taxDueDates[taxDueDates.findIndex(q => q.quarter === quarter.quarter) - 1].percentage.replace('%', ''))) / 100);
    
    return {
      ...quarter,
      amountDue,
      amountPerQuarter
    };
  });
  
  // Calculate total eligible deductions from recorded expenses
  const totalEligibleExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = () => {
    const amountNum = parseFloat(newExpenseAmount as string);
    if (newExpenseDesc && !isNaN(amountNum) && amountNum > 0) {
      const newExpense: ExpenseRecord = {
        id: Date.now(),
        description: newExpenseDesc,
        amount: amountNum,
        date: newExpenseDate,
        isDeductible: false
      };
      setExpenses([...expenses, newExpense]);
      setNewExpenseDesc('');
      setNewExpenseAmount('');
      setNewExpenseDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Tax Planning Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Smart tax planning specifically designed for gig workers in India
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Button 
            variant={activeTab === 'calculator' ? 'contained' : 'outlined'}
            startIcon={<Calculate />}
            onClick={() => setActiveTab('calculator')}
          >
            Tax Calculator
          </Button>
          <Button 
            variant={activeTab === 'deductions' ? 'contained' : 'outlined'}
            startIcon={<ReceiptLong />}
            onClick={() => setActiveTab('deductions')}
          >
            Deductions
          </Button>
          <Button 
            variant={activeTab === 'reminders' ? 'contained' : 'outlined'}
            startIcon={<CalendarToday />}
            onClick={() => setActiveTab('reminders')}
          >
            Due Dates
          </Button>
        </Stack>
        
        {activeTab === 'calculator' && (
          <>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Estimated Annual Income
                  </Typography>
                  <TextField 
                    fullWidth
                    type="number"
                    value={estimatedAnnualIncome}
                    onChange={(e) => setEstimatedAnnualIncome(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Estimated Deductions
                  </Typography>
                  <TextField 
                    fullWidth
                    type="number"
                    value={estimatedDeductions}
                    onChange={(e) => setEstimatedDeductions(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    helperText={`Includes Section 80C, professional expenses, and other eligible deductions`}
                  />
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Tax Regime
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={taxRegime}
                      onChange={(e) => setTaxRegime(e.target.value as 'old' | 'new')}
                    >
                      <MenuItem value="new">New Tax Regime (Union Budget 2025-26)</MenuItem>
                      <MenuItem value="old">Old Tax Regime (with higher deductions)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                {taxRegime === 'new' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>New Tax Regime Benefits</AlertTitle>
                    The Union Budget 2025-26 has increased the tax exemption limit to ₹4 lakh, with a complete tax rebate for income up to ₹12 lakh. 
                    With your current income of ₹{estimatedAnnualIncome.toLocaleString()}, this may lead to significant tax savings.
                  </Alert>
                )}
                
                {taxRegime === 'old' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Old Tax Regime Information</AlertTitle>
                    Under the old tax regime, there's tax exemption up to ₹2.5 lakh with a complete rebate for income up to ₹5 lakh.
                    This regime allows you to claim more deductions but has higher tax rates compared to the new regime.
                  </Alert>
                )}
              </Stack>
            </Box>
            
            <Stack spacing={3} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tax Calculation Summary
                </Typography>
                <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="primary.dark">Gross Annual Income:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">₹{estimatedAnnualIncome.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="primary.dark">Total Deductions:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">₹{estimatedDeductions.toLocaleString()}</Typography>
                    </Box>
                    <Divider sx={{ borderColor: 'primary.main', opacity: 0.3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="primary.dark">Taxable Income:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">₹{taxableIncome.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="primary.dark">Total Tax:</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.dark">₹{totalTax.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="primary.dark">Effective Tax Rate:</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.dark">{effectiveTaxRate.toFixed(2)}%</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
              
              <Button 
                variant="text" 
                color="info" 
                startIcon={<Info />}
                onClick={() => setShowTaxSlabs(!showTaxSlabs)}
              >
                {showTaxSlabs ? 'Hide Tax Slabs' : 'Show Tax Slabs'}
              </Button>
              
              {showTaxSlabs && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
                    {taxRegime === 'new' ? 'New Tax Regime FY 2025-26' : 'Old Tax Regime FY 2025-26'} Tax Slabs
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                          <TableCell>Income Range</TableCell>
                          <TableCell align="right">Tax Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {taxRegime === 'new' ? taxSlabs.map((slab, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {slab.min.toLocaleString()} - {slab.max !== Infinity ? slab.max.toLocaleString() : 'Above'}
                            </TableCell>
                            <TableCell align="right">{slab.rate}%</TableCell>
                          </TableRow>
                        )) : oldTaxSlabs.map((slab, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {slab.min.toLocaleString()} - {slab.max !== Infinity ? slab.max.toLocaleString() : 'Above'}
                            </TableCell>
                            <TableCell align="right">{slab.rate}%</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography variant="caption" color="text.secondary">
                              Plus 4% Health and Education Cess on total tax
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                              {taxRegime === 'new' 
                                ? 'Complete tax rebate for income up to ₹12 lakh'
                                : 'Complete tax rebate for income up to ₹5 lakh'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <AlertTitle>ML-Powered Tax Optimization</AlertTitle>
                Based on your income pattern, you could save approximately ₹{Math.round(totalTax * 0.18).toLocaleString()} by:
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Claiming all professional expenses (potential savings: ₹{Math.round(totalTax * 0.1).toLocaleString()})</li>
                  <li>Investing in tax-saving instruments (potential savings: ₹{Math.round(totalTax * 0.08).toLocaleString()})</li>
                </ul>
              </Alert>
            </Stack>
          </>
        )}
        
        {activeTab === 'deductions' && (
          <>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Maximize Your Deductions</AlertTitle>
              You've recorded ₹{totalEligibleExpenses.toLocaleString()} in expenses, but could potentially claim up to ₹{Math.round(estimatedAnnualIncome * 0.3).toLocaleString()} based on your profession.
            </Alert>
            
            <Typography variant="subtitle2" gutterBottom>
              Your Recorded Expenses
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Proof</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell align="right">₹{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {/* Placeholder for proof upload */}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete Expense">
                          <IconButton size="small" color="error" onClick={() => handleDeleteExpense(expense.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Button startIcon={<Add />}>Add Expense</Button>
              <Button startIcon={<CloudUpload />} variant="outlined">Upload Receipts</Button>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Eligible Deductions for Gig Workers
            </Typography>
            
            <Stack spacing={2}>
              {availableDeductions.map((deduction) => (
                <Card key={deduction.id} variant="outlined">
                  <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2">{deduction.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{deduction.category}</Typography>
                      </Box>
                      <Chip 
                        size="small" 
                        label={deduction.complexityLevel} 
                        color={
                          deduction.complexityLevel === 'Low' ? 'success' : 
                          deduction.complexityLevel === 'Medium' ? 'warning' : 
                          'error'
                        }
                      />
                    </Stack>
                    <Typography variant="body2" gutterBottom>{deduction.description}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Limit:</strong> {deduction.maxLimit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Eligibility:</strong> {deduction.eligibility}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}
        
        {activeTab === 'reminders' && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Advance Tax Payment Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Based on your estimated income of ₹{estimatedAnnualIncome.toLocaleString()} and tax of ₹{totalTax.toLocaleString()}
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>Quarter</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="right">Cumulative %</TableCell>
                    <TableCell align="right">Cumulative Amount</TableCell>
                    <TableCell align="right">Amount for Quarter</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quarterlyTax.map((quarter) => (
                    <TableRow key={quarter.quarter}>
                      <TableCell>{quarter.quarter}</TableCell>
                      <TableCell>{quarter.dueDate}</TableCell>
                      <TableCell align="right">{quarter.percentage}</TableCell>
                      <TableCell align="right">₹{quarter.amountDue.toLocaleString()}</TableCell>
                      <TableCell align="right">₹{quarter.amountPerQuarter.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="subtitle2" gutterBottom>
              Smart Tax Calendar
            </Typography>
            
            <Stack spacing={2}>
              {quarterlyTax.map((quarter, index) => (
                <Card key={quarter.quarter} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {quarter.quarter} Advance Tax
                        </Typography>
                        <Typography variant="body2" color="error">
                          Due: {quarter.dueDate}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`₹${quarter.amountPerQuarter.toLocaleString()}`} 
                        color="primary"
                      />
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">
                          Savings Progress
                        </Typography>
                        <Typography variant="caption">
                          {index === 0 ? '45%' : index === 1 ? '20%' : index === 2 ? '5%' : '0%'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={index === 0 ? 45 : index === 1 ? 20 : index === 2 ? 5 : 0} 
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                    
                    {index === 0 && (
                      <Alert severity="success" sx={{ mt: 2 }} icon={<LocalOffer />}>
                        <Typography variant="body2">
                          Suggested monthly savings: ₹{Math.ceil(quarter.amountPerQuarter / 3).toLocaleString()} for the next 3 months
                        </Typography>
                      </Alert>
                    )}
                    
                    {index === 1 && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Based on your spending pattern, you may need to reduce discretionary expenses by 12% to meet this tax obligation
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxManager; 