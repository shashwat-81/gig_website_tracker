import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  AlertTitle,
  Tab,
  Tabs,
  Divider,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, CalendarMonth, Delete, Edit, FileDownload, Receipt, Save } from '@mui/icons-material';

interface TaxableIncome {
  id: number;
  source: string;
  amount: number;
  period: string;
  taxDeducted: number;
}

interface TaxDocument {
  id: number;
  name: string;
  type: string;
  date: Date;
  uploadDate: Date;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tax-tabpanel-${index}`}
      aria-labelledby={`tax-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const TaxManager: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [incomes, setIncomes] = useState<TaxableIncome[]>([
    { id: 1, source: 'Freelance Development', amount: 250000, period: 'Q1 2023', taxDeducted: 5000 },
    { id: 2, source: 'Content Writing', amount: 120000, period: 'Q1 2023', taxDeducted: 2400 },
    { id: 3, source: 'UI/UX Projects', amount: 180000, period: 'Q1 2023', taxDeducted: 3600 },
    { id: 4, source: 'App Development', amount: 300000, period: 'Q2 2023', taxDeducted: 6000 }
  ]);

  const [documents, setDocuments] = useState<TaxDocument[]>([
    { id: 1, name: 'Form 16A - Client XYZ', type: 'TDS Certificate', date: new Date(2023, 3, 15), uploadDate: new Date(2023, 4, 10) },
    { id: 2, name: 'GST Invoice - April 2023', type: 'GST Document', date: new Date(2023, 4, 30), uploadDate: new Date(2023, 5, 5) },
    { id: 3, name: 'Investment Proof - LIC', type: 'Tax Saving', date: new Date(2023, 2, 15), uploadDate: new Date(2023, 2, 20) }
  ]);

  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    period: '',
    taxDeducted: ''
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddIncome = () => {
    const amount = Number(newIncome.amount);
    const taxDeducted = Number(newIncome.taxDeducted);
    
    if (newIncome.source && amount && newIncome.period) {
      setIncomes([
        ...incomes,
        {
          id: Date.now(),
          source: newIncome.source,
          amount,
          period: newIncome.period,
          taxDeducted: taxDeducted || 0
        }
      ]);
      
      setNewIncome({
        source: '',
        amount: '',
        period: '',
        taxDeducted: ''
      });
      
      setDialogOpen(false);
    }
  };

  const handleDeleteIncome = (id: number) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalTaxDeducted = incomes.reduce((sum, income) => sum + income.taxDeducted, 0);
  
  // Simple tax calculation for demonstration purposes (not actual Indian tax rates)
  const estimatedTaxLiability = Math.max(0, totalIncome * 0.2 - totalTaxDeducted);
  
  // GST calculation (assuming 18% GST)
  const gstRate = 0.18;
  const estimatedGST = totalIncome * gstRate;

  const calculateTaxSavings = () => {
    // For example purposes - assuming 10% tax savings through deductions
    return totalIncome * 0.1;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Tax Manager
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Dashboard" />
        <Tab label="Income Tracking" />
        <Tab label="Documents" />
        <Tab label="Tax Planning" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Tax Summary Cards */}
          <Box sx={{ width: { xs: '100%', md: '46%', lg: '22%' } }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Total Taxable Income
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                  ₹{totalIncome.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Financial Year 2023-24
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '46%', lg: '22%' } }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  TDS Deducted
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                  ₹{totalTaxDeducted.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Total for this FY
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '46%', lg: '22%' } }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Est. Tax Liability
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                  ₹{estimatedTaxLiability.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Remaining to pay
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '46%', lg: '22%' } }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Est. GST Payable
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                  ₹{estimatedGST.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Next filing: July 20, 2023
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Upcoming Tax Dates */}
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Important Tax Dates
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>July 15, 2023</TableCell>
                        <TableCell>Advance Tax (Q1) Payment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>July 20, 2023</TableCell>
                        <TableCell>GST Filing for June 2023</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sept 15, 2023</TableCell>
                        <TableCell>Advance Tax (Q2) Payment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dec 15, 2023</TableCell>
                        <TableCell>Advance Tax (Q3) Payment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Mar 15, 2024</TableCell>
                        <TableCell>Advance Tax (Q4) Payment</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>July 31, 2024</TableCell>
                        <TableCell>Income Tax Return Filing Deadline</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Tax Saving Opportunities */}
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Saving Opportunities
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Potential tax savings: ₹{calculateTaxSavings().toLocaleString()}</AlertTitle>
                  Based on your income profile, you could save through these deductions.
                </Alert>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Investment Type</TableCell>
                        <TableCell>Limit</TableCell>
                        <TableCell>Section</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>EPF/PPF</TableCell>
                        <TableCell>₹1,50,000</TableCell>
                        <TableCell>80C</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medical Insurance</TableCell>
                        <TableCell>₹25,000</TableCell>
                        <TableCell>80D</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>NPS Contribution</TableCell>
                        <TableCell>₹50,000</TableCell>
                        <TableCell>80CCD(1B)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Home Loan Interest</TableCell>
                        <TableCell>₹2,00,000</TableCell>
                        <TableCell>24(b)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Income Sources & Tax Deductions</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Add Income Source
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Income Source</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
                <TableCell>Period</TableCell>
                <TableCell align="right">TDS Deducted (₹)</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{income.source}</TableCell>
                  <TableCell align="right">{income.amount.toLocaleString()}</TableCell>
                  <TableCell>{income.period}</TableCell>
                  <TableCell align="right">{income.taxDeducted.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDeleteIncome(income.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            <AlertTitle>TDS in Gig Economy</AlertTitle>
            If your client deducts TDS (Tax Deducted at Source), make sure to obtain Form 16A to claim this deduction when filing your income tax return.
          </Alert>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Tax Documents & Receipts</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
          >
            Upload Document
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Document Date</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.date.toLocaleDateString()}</TableCell>
                  <TableCell>{document.uploadDate.toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <FileDownload fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            <AlertTitle>Document Organization</AlertTitle>
            Keep all tax-related documents organized by tax year. Maintain digital copies for at least 7 years as per Income Tax regulations.
          </Alert>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Deduction Planning
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Maximize your tax savings through strategic deductions and investments.
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Investment Type</InputLabel>
                    <Select label="Investment Type">
                      <MenuItem value="80c">Section 80C Investments</MenuItem>
                      <MenuItem value="80d">Section 80D Health Insurance</MenuItem>
                      <MenuItem value="80g">Section 80G Donations</MenuItem>
                      <MenuItem value="nps">National Pension System</MenuItem>
                      <MenuItem value="hra">House Rent Allowance</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Amount (₹)" type="number" fullWidth />
                  <Button variant="contained">Calculate Tax Savings</Button>
                </Stack>
                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Potential Tax Savings
                  </Typography>
                  <Typography variant="h5">
                    ₹{calculateTaxSavings().toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Regime Comparison
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Compare old vs. new tax regimes to identify which is more beneficial for you.
                </Typography>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Old Tax Regime (with deductions)
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    ₹{Math.round(totalIncome * 0.15).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    New Tax Regime (without deductions)
                  </Typography>
                  <Typography variant="h6" color="primary.main">
                    ₹{Math.round(totalIncome * 0.17).toLocaleString()}
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Based on your current profile, the old tax regime appears more beneficial.
                </Alert>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Card sx={{ bgcolor: 'primary.dark', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Tips for Gig Workers in India
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" paragraph>
                      • Register under GST if annual turnover exceeds ₹20 lakhs
                      • Keep separate bank accounts for business and personal expenses
                      • Save 30% of your income for tax payments
                      • Claim home office deductions if applicable
                      • Maintain detailed records of all business-related expenses
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" paragraph>
                      • File quarterly advance tax to avoid interest penalties
                      • Take advantage of presumptive taxation scheme under 44ADA
                      • Keep invoices and receipts for all professional expenses
                      • Consider forming a One Person Company for better tax benefits
                      • Invest in tax-saving instruments under Section 80C
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </TabPanel>

      {/* Add Income Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Income Source</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Income Source"
              value={newIncome.source}
              onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
              fullWidth
            />
            <TextField
              label="Amount (₹)"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
              type="number"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Period</InputLabel>
              <Select
                value={newIncome.period}
                label="Period"
                onChange={(e) => setNewIncome({...newIncome, period: e.target.value})}
              >
                <MenuItem value="Q1 2023">Q1 2023 (Apr-Jun)</MenuItem>
                <MenuItem value="Q2 2023">Q2 2023 (Jul-Sep)</MenuItem>
                <MenuItem value="Q3 2023">Q3 2023 (Oct-Dec)</MenuItem>
                <MenuItem value="Q4 2023">Q4 2023 (Jan-Mar)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="TDS Deducted (₹)"
              value={newIncome.taxDeducted}
              onChange={(e) => setNewIncome({...newIncome, taxDeducted: e.target.value})}
              type="number"
              fullWidth
              helperText="If no TDS was deducted, enter 0"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddIncome} 
            variant="contained"
            disabled={!newIncome.source || !newIncome.amount || !newIncome.period}
          >
            Add Income
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaxManager;
