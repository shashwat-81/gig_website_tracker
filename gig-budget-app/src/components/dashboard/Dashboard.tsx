import React from 'react';
import { Box, Typography, Grid, Button, Stack, Container } from '@mui/material';
import IncomeForecast from './IncomeForecast';
import SmartSavings from '../savings/SmartSavings';
import TaxManager from '../budget/TaxManager';
import BudgetProgress from './BudgetProgress';
import SimpleFinanceBot from '../ai/SimpleFinanceBot';
import ExportReport from '../reports/ExportReport';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Smart Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          AI-powered financial insights for gig workers
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Income Predictions & Forecasting
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Machine learning forecasts based on your historical income patterns
          </Typography>
          <IncomeForecast />
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Smart Budget Management
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            AI-powered budget insights and recommendations
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ width: { xs: '100%', lg: 'calc(50% - 1.5rem)' }, flexGrow: 1 }}>
              <BudgetProgress />
            </Box>
            <Box sx={{ width: { xs: '100%', lg: 'calc(50% - 1.5rem)' }, flexGrow: 1 }}>
              <TaxManager />
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Smart Savings & Challenges
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Gamified savings goals and challenges tailored for gig workers
          </Typography>
          <SmartSavings />
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Financial Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Export your financial data for accounting and analysis
          </Typography>
          <ExportReport />
        </Box>
      </Box>

      {/* Finance Bot positioned in the bottom right corner */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <SimpleFinanceBot />
      </Box>
    </Container>
  );
};

export default Dashboard; 