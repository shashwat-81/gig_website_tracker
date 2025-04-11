import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Container } from '@mui/material';
import SmartSavings from './SmartSavings';
import SavingsGoals from './SavingsGoals';
import { EmojiEvents, Savings as SavingsIcon } from '@mui/icons-material';

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
      id={`savings-tabpanel-${index}`}
      aria-labelledby={`savings-tab-${index}`}
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
    id: `savings-tab-${index}`,
    'aria-controls': `savings-tabpanel-${index}`,
  };
};

const Savings: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Savings & Challenges
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gamified savings tools designed for gig workers
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="savings management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="Smart Savings" 
            icon={<EmojiEvents />} 
            iconPosition="start"
            {...a11yProps(0)} 
          />
          <Tab 
            label="Savings Goals" 
            icon={<SavingsIcon />} 
            iconPosition="start"
            {...a11yProps(1)} 
          />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <SmartSavings />
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        <SavingsGoals />
      </TabPanel>
    </Container>
  );
};

export default Savings; 