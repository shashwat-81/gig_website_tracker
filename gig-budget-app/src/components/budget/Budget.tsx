import React from 'react';
import { Box, Typography, Tabs, Tab, Container } from '@mui/material';
import BudgetPlanner from './BudgetPlanner';
import TaxManager from './TaxManager';
import { Calculate, EventNote } from '@mui/icons-material';

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
      id={`budget-tabpanel-${index}`}
      aria-labelledby={`budget-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `budget-tab-${index}`,
    'aria-controls': `budget-tabpanel-${index}`,
  };
};

const Budget: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Budget & Tax Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive tools to manage your finances effectively
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="budget management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="Budget Planner" 
            icon={<EventNote />} 
            iconPosition="start"
            {...a11yProps(0)} 
          />
          <Tab 
            label="Tax Manager" 
            icon={<Calculate />} 
            iconPosition="start"
            {...a11yProps(1)} 
          />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <BudgetPlanner />
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        <TaxManager />
      </TabPanel>
    </Container>
  );
};

export default Budget; 