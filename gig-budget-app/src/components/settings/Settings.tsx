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
  Chip,
  IconButton,
  Badge
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
  SyncAlt,
  DarkMode,
  LightMode,
  Storage,
  HelpOutline,
  PhotoCamera,
  Edit,
  CheckCircle,
  Save
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  // Profile information
  const [name, setName] = useState('Raj Kumar');
  const [email, setEmail] = useState('raj.kumar@example.com');
  const [occupation, setOccupation] = useState('Freelance Developer');
  const [phone, setPhone] = useState('+91 9876543210');
  const [bio, setBio] = useState('Experienced freelance developer specializing in web and mobile applications. Based in Bangalore.');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Currency and locale settings
  const [currency, setCurrency] = React.useState('₹');
  const [locale, setLocale] = React.useState('en-IN');
  const [dateFormat, setDateFormat] = React.useState('DD/MM/YYYY');
  
  // Notification settings
  const [notifyLowBalance, setNotifyLowBalance] = React.useState(true);
  const [notifyBillsDue, setNotifyBillsDue] = React.useState(true);
  const [notifySavingsGoals, setNotifySavingsGoals] = React.useState(true);
  const [notifyTaxDates, setNotifyTaxDates] = React.useState(true);
  
  // Privacy and security
  const [requirePin, setRequirePin] = React.useState(false);
  const [backupFrequency, setBackupFrequency] = React.useState('weekly');
  
  // Display settings
  const [chartStyle, setChartStyle] = React.useState('bars');
  
  // Advanced preferences
  const [lowBalanceThreshold, setLowBalanceThreshold] = React.useState('5000');
  const [dataRetentionPeriod, setDataRetentionPeriod] = React.useState('12');

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage, database or API
    alert('Settings saved successfully!');
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result.toString());
        }
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    // In a real app, save profile data to backend
    alert('Profile updated successfully!');
  };

  return (
    <Card sx={{ height: '100%', overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          App Settings
        </Typography>
        
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Profile Section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Profile
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <label htmlFor="profile-picture-upload">
                          <input
                            accept="image/*"
                            id="profile-picture-upload"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleProfilePictureChange}
                          />
                          <IconButton 
                            component="span" 
                            sx={{ 
                              bgcolor: 'primary.main', 
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' } 
                            }}
                            size="small"
                          >
                            <PhotoCamera fontSize="small" />
                          </IconButton>
                        </label>
                      }
                    >
                      <Avatar 
                        src={profilePicture || undefined} 
                        alt={name}
                        sx={{ width: 80, height: 80 }}
                      >
                        {!profilePicture && name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        {!editingProfile ? (
                          <Typography variant="h6">{name}</Typography>
                        ) : (
                          <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Name"
                          />
                        )}
                        <Chip 
                          label="Verified" 
                          size="small" 
                          color="success" 
                          icon={<CheckCircle fontSize="small" />} 
                        />
                      </Box>
                      {!editingProfile ? (
                        <>
                          <Typography variant="body2" color="text.secondary">{email}</Typography>
                          <Typography variant="body2" color="text.secondary">{phone}</Typography>
                          <Typography variant="body2">{occupation}</Typography>
                        </>
                      ) : (
                        <Stack spacing={2} sx={{ mt: 1 }}>
                          <TextField
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Email"
                            type="email"
                          />
                          <TextField
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Phone"
                          />
                          <TextField
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Occupation"
                          />
                        </Stack>
                      )}
                    </Box>
                  </Box>
                  <Button
                    startIcon={editingProfile ? <Save /> : <Edit />}
                    variant="outlined"
                    size="small"
                    onClick={editingProfile ? handleSaveProfile : () => setEditingProfile(true)}
                  >
                    {editingProfile ? 'Save' : 'Edit'}
                  </Button>
                </Box>
                
                {!editingProfile ? (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {bio}
                  </Typography>
                ) : (
                  <TextField
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                  />
                )}

                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Account Status
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Free Plan" color="primary" />
                    <Chip label="2 months active" variant="outlined" />
                    <Chip label="Storage: 15%" size="small" />
                  </Box>
                </Box>
              </Stack>
            </Card>
          </Box>
          
          <Divider />
          
          {/* Theme Settings */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Appearance
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={darkMode} 
                      onChange={toggleDarkMode}
                      color="primary" 
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {darkMode ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
                      <Typography>{darkMode ? 'Dark Mode' : 'Light Mode'}</Typography>
                    </Box>
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  {darkMode 
                    ? 'Dark mode reduces eye strain in low-light environments and saves battery on OLED screens.' 
                    : 'Light mode provides better readability in well-lit environments.'}
                </Typography>
              </Stack>
            </Card>
          </Box>
          
          <Divider />
          
          {/* Notification Settings */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Notifications
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications fontSize="small" />
                      <Typography>Tax Due Reminders</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications fontSize="small" />
                      <Typography>Budget Alerts</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={<Switch color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications fontSize="small" />
                      <Typography>Savings Goal Milestones</Typography>
                    </Box>
                  }
                />
              </Stack>
            </Card>
          </Box>
          
          <Divider />
          
          {/* Language & Region Settings */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Language & Region
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value="en-IN"
                    label="Language"
                    startAdornment={<Language fontSize="small" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="en-IN">English (India)</MenuItem>
                    <MenuItem value="hi-IN">Hindi</MenuItem>
                    <MenuItem value="ta-IN">Tamil</MenuItem>
                    <MenuItem value="te-IN">Telugu</MenuItem>
                    <MenuItem value="kn-IN">Kannada</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Currency Format</InputLabel>
                  <Select
                    value="INR"
                    label="Currency Format"
                  >
                    <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                    <MenuItem value="EUR">Euro (€)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Card>
          </Box>
          
          <Divider />
          
          {/* Data Management */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Data & Privacy
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Storage fontSize="small" />
                    <Typography>Clear Local Data</Typography>
                  </Box>
                  <Button size="small" variant="outlined" color="warning">
                    Clear
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security fontSize="small" />
                    <Typography>Export All Data</Typography>
                  </Box>
                  <Button size="small" variant="outlined">
                    Export
                  </Button>
                </Box>
                <Alert severity="info" icon={<HelpOutline />} sx={{ mt: 1 }}>
                  <Typography variant="caption">
                    Your data is stored locally on your device. Clearing data will reset all your budget settings and history.
                  </Typography>
                </Alert>
              </Stack>
            </Card>
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Smart Budgeting App for Gig Workers v1.0.0
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Settings; 