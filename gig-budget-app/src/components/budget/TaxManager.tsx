import React, { useState } from 'react';
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
  InputLabel,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Calculate,
  CalendarToday,
  ReceiptLong,
  FileUpload,
  CloudUpload,
  Info,
  Add,
  Edit,
  Delete,
  QuestionMark,
  BarChart,
  LocalOffer
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

// Sample tax slabs for India FY 2025-26 (illustrative)
const taxSlabs = [
  { min: 0, max: 300000, rate: 0, description: 'No tax up to ₹3,00,000' },
  { min: 300001, max: 600000, rate: 5, description: '5% on income between ₹3,00,001 and ₹6,00,000' },
  { min: 600001, max: 900000, rate: 10, description: '10% on income between ₹6,00,001 and ₹9,00,000' },
  { min: 900001, max: 1200000, rate: 15, description: '15% on income between ₹9,00,001 and ₹12,00,000' },
  { min: 1200001, max: 1500000, rate: 20, description: '20% on income between ₹12,00,001 and ₹15,00,000' },
  { min: 1500001, max: Infinity, rate: 30, description: '30% on income above ₹15,00,000' }
];

// Quarterly due dates for advance tax in India
const taxDueDates = [
  { quarter: 'Q1', dueDate: '15 Jun 2025', percentage: '15%' },
  { quarter: 'Q2', dueDate: '15 Sep 2025', percentage: '45%' },
  { quarter: 'Q3', dueDate: '15 Dec 2025', percentage: '75%' },
  { quarter: 'Q4', dueDate: '15 Mar 2026', percentage: '100%' }
];

interface TaxManagerProps {}

const TaxManager: React.FC<TaxManagerProps> = () => {
  const [estimatedAnnualIncome, setEstimatedAnnualIncome] = useState<number>(600000);
  const [estimatedDeductions, setEstimatedDeductions] = useState<number>(150000);
  const [taxRegime, setTaxRegime] = useState<'old' | 'new'>('old');
  const [recordedExpenses, setRecordedExpenses] = useState<any[]>([
    { id: 1, date: '2025-04-10', category: 'Vehicle Expenses', amount: 12000, description: 'Fuel and maintenance', proofAvailable: true },
    { id: 2, date: '2025-05-15', category: 'Mobile & Internet', amount: 2500, description: 'Monthly bill', proofAvailable: true },
    { id: 3, date: '2025-06-02', category: 'Equipment Depreciation', amount: 15000, description: 'Laptop depreciation', proofAvailable: false }
  ]);
  const [activeTab, setActiveTab] = useState<'calculator' | 'deductions' | 'reminders'>('calculator');
  const [showTaxSlabs, setShowTaxSlabs] = useState(false);

  // Calculate taxable income
  const taxableIncome = Math.max(0, estimatedAnnualIncome - estimatedDeductions);
  
  // Calculate tax based on slabs (simplified)
  const calculateTax = (income: number): number => {
    let tax = 0;
    
    for (const slab of taxSlabs) {
      if (income > slab.min) {
        const slabAmount = Math.min(income, slab.max) - slab.min;
        tax += slabAmount * (slab.rate / 100);
      }
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
  const totalEligibleExpenses = recordedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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
                      <MenuItem value="old">Old Regime (with deductions)</MenuItem>
                      <MenuItem value="new">New Regime (lower rates, no deductions)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
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
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell>Income Range</TableCell>
                        <TableCell align="right">Tax Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taxSlabs.map((slab, index) => (
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
                    </TableBody>
                  </Table>
                </TableContainer>
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
                  {recordedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell align="right">₹{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {expense.proofAvailable ? (
                          <Chip size="small" label="Available" color="success" />
                        ) : (
                          <Chip size="small" label="Missing" color="error" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
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