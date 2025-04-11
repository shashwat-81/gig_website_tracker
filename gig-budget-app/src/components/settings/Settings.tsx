import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Avatar,
  Chip
} from '@mui/material';
import {
  Notifications,
  CurrencyRupee,
  Security,
  Backup,
  Visibility,
  Language,
  ColorLens,
  Person,
  DataUsage,
  SyncAlt
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const Settings: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  
  // Currency and locale settings
  const [currency, setCurrency] = useState('₹');
  const [locale, setLocale] = useState('en-IN');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  
  // Notification settings
  const [notifyLowBalance, setNotifyLowBalance] = useState(true);
  const [notifyBillsDue, setNotifyBillsDue] = useState(true);
  const [notifySavingsGoals, setNotifySavingsGoals] = useState(true);
  const [notifyTaxDates, setNotifyTaxDates] = useState(true);
  
  // Privacy and security
  const [requirePin, setRequirePin] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  
  // Display settings
  const [chartStyle, setChartStyle] = useState('bars');
  
  // Advanced preferences
  const [lowBalanceThreshold, setLowBalanceThreshold] = useState('5000');
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('12');
  
  // Profile information
  const [name, setName] = useState('Raj Kumar');
  const [email, setEmail] = useState('raj.kumar@example.com');
  const [occupation, setOccupation] = useState('Freelance Developer');

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage, database or API
    alert('Settings saved successfully!');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Stack spacing={3}>
        {/* Profile Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Profile Information
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: { md: '200px' } }}>
                <Avatar
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem'
                  }}
                >
                  {name.charAt(0)}
                </Avatar>
              </Box>
              <Stack spacing={2} sx={{ flex: 1 }}>
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  type="email"
                />
                <TextField
                  label="Occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" color="primary">
                  Update Profile
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Main Settings Section */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Currency and Locale Settings */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CurrencyRupee color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Currency & Regional Settings
                </Typography>
              </Box>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Currency Symbol</InputLabel>
                  <Select
                    value={currency}
                    label="Currency Symbol"
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value="₹">₹ (Indian Rupee)</MenuItem>
                    <MenuItem value="$">$ (US Dollar)</MenuItem>
                    <MenuItem value="€">€ (Euro)</MenuItem>
                    <MenuItem value="£">£ (British Pound)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Language & Locale</InputLabel>
                  <Select
                    value={locale}
                    label="Language & Locale"
                    onChange={(e) => setLocale(e.target.value)}
                  >
                    <MenuItem value="en-IN">English (India)</MenuItem>
                    <MenuItem value="hi-IN">Hindi</MenuItem>
                    <MenuItem value="en-US">English (US)</MenuItem>
                    <MenuItem value="en-GB">English (UK)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={dateFormat}
                    label="Date Format"
                    onChange={(e) => setDateFormat(e.target.value)}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</MenuItem>
                  </Select>
                </FormControl>

                <Alert severity="info">
                  These settings will affect how financial data is displayed throughout the app.
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Notifications color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Notification Preferences
                </Typography>
              </Box>
              <List disablePadding>
                <ListItem divider>
                  <ListItemText 
                    primary="Low Balance Alerts" 
                    secondary="Get notified when your balance drops below a threshold"
                  />
                  <Switch 
                    checked={notifyLowBalance}
                    onChange={(e) => setNotifyLowBalance(e.target.checked)}
                    color="primary"
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Bill Payment Reminders" 
                    secondary="Get notified when bills are due"
                  />
                  <Switch 
                    checked={notifyBillsDue}
                    onChange={(e) => setNotifyBillsDue(e.target.checked)}
                    color="primary"
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Savings Goal Updates" 
                    secondary="Get notified about progress towards your savings goals"
                  />
                  <Switch 
                    checked={notifySavingsGoals}
                    onChange={(e) => setNotifySavingsGoals(e.target.checked)}
                    color="primary"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Tax Date Reminders" 
                    secondary="Get notified about upcoming GST filing and tax payment dates"
                  />
                  <Switch 
                    checked={notifyTaxDates}
                    onChange={(e) => setNotifyTaxDates(e.target.checked)}
                    color="primary"
                  />
                </ListItem>
              </List>
              {notifyLowBalance && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Low Balance Threshold (₹)"
                    type="number"
                    value={lowBalanceThreshold}
                    onChange={(e) => setLowBalanceThreshold(e.target.value)}
                    fullWidth
                    helperText="You'll be notified when your account balance falls below this amount"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Privacy and Security */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Security color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Privacy & Security
                </Typography>
              </Box>
              <List disablePadding>
                <ListItem divider>
                  <ListItemText 
                    primary="PIN Protection" 
                    secondary="Require a PIN to access the app"
                  />
                  <Switch 
                    checked={requirePin}
                    onChange={(e) => setRequirePin(e.target.checked)}
                    color="primary"
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText 
                    primary="Data Backup" 
                    secondary="Configure automatic data backup frequency"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={backupFrequency}
                      size="small"
                      onChange={(e) => setBackupFrequency(e.target.value)}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="never">Never</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Data Retention" 
                    secondary="How long to keep financial records"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={dataRetentionPeriod}
                      size="small"
                      onChange={(e) => setDataRetentionPeriod(e.target.value)}
                    >
                      <MenuItem value="3">3 months</MenuItem>
                      <MenuItem value="6">6 months</MenuItem>
                      <MenuItem value="12">12 months</MenuItem>
                      <MenuItem value="forever">Forever</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
              <Box sx={{ mt: 2 }}>
                <Alert severity="warning">
                  We recommend keeping financial records for at least a full financial year for tax purposes.
                </Alert>
              </Box>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Visibility color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Display Settings
                </Typography>
              </Box>
              <List disablePadding>
                <ListItem divider>
                  <ListItemText 
                    primary="Theme Mode" 
                    secondary="Choose light or dark theme"
                  />
                  <Switch
                    checked={themeMode === 'dark'}
                    onChange={toggleTheme}
                    color="primary"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Chart Style" 
                    secondary="Preferred style for financial charts"
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={chartStyle}
                      size="small"
                      onChange={(e) => setChartStyle(e.target.value)}
                    >
                      <MenuItem value="lines">Line Charts</MenuItem>
                      <MenuItem value="bars">Bar Charts</MenuItem>
                      <MenuItem value="pie">Pie Charts</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Stack>

        {/* Gig Worker Specific Settings */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SyncAlt color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Gig Worker Specific Settings
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Income Volatility</InputLabel>
                  <Select
                    defaultValue="medium"
                    label="Income Volatility"
                  >
                    <MenuItem value="low">Low (Predictable income)</MenuItem>
                    <MenuItem value="medium">Medium (Some variability)</MenuItem>
                    <MenuItem value="high">High (Very unpredictable)</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  This helps us adjust budget recommendations and emergency fund calculations
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>GST Registration Status</InputLabel>
                  <Select
                    defaultValue="notRequired"
                    label="GST Registration Status"
                  >
                    <MenuItem value="registered">Registered</MenuItem>
                    <MenuItem value="notRequired">Not Required (Under threshold)</MenuItem>
                    <MenuItem value="pending">Planning to Register</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Determines tax calculations and reminders
                </Typography>
              </Box>
            </Stack>
            <Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Work Categories
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Freelance Development" onDelete={() => {}} color="primary" />
                <Chip label="Content Writing" onDelete={() => {}} color="primary" />
                <Chip label="Graphic Design" onDelete={() => {}} color="primary" />
                <Chip label="Add new category..." onClick={() => {}} variant="outlined" />
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                These categories will appear in income tracking for better organization
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSaveSettings}
          >
            Save All Settings
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Settings; 