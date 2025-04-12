import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Avatar, 
  Alert, 
  CircularProgress,
  Container,
  Divider,
  Chip
} from '@mui/material';
import { 
  LockOutlined, 
  AccountCircle, 
  LocalTaxi,
  DirectionsBike,
  CleaningServices
} from '@mui/icons-material';
import { login, getAvailableUsers } from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get demo accounts for quick login
  const demoUsers = getAvailableUsers();
  
  // Get category icon based on user type
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Cab Driver':
        return <LocalTaxi />;
      case 'Food Delivery':
        return <DirectionsBike />;
      case 'House Cleaner':
        return <CleaningServices />;
      default:
        return <AccountCircle />;
    }
  };
  
  // Get category color based on user type
  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' => {
    switch(category) {
      case 'Cab Driver':
        return 'secondary';
      case 'Food Delivery':
        return 'primary';
      case 'House Cleaner':
        return 'success';
      default:
        return 'info';
    }
  };
  
  // Helper function to login as a demo user
  const handleDemoLogin = async (email: string) => {
    try {
      setLoading(true);
      await login({ email, password: 'password' });
      navigate('/');
    } catch (err) {
      setError('Failed to login with demo account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2
      }}
    >
      <Container maxWidth="sm" sx={{ margin: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              borderRadius: 2
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlined fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              GigBudget
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Smart budgeting for gig economy workers
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
            
            <Divider sx={{ my: 3, width: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                DEMO ACCOUNTS
              </Typography>
            </Divider>
            
            <Typography variant="subtitle2" gutterBottom sx={{ alignSelf: 'flex-start' }}>
              Select a worker category to try the app:
            </Typography>
            
            <Grid container spacing={2}>
              {demoUsers.filter((user, index) => 
                // Get one user from each category
                demoUsers.findIndex(u => u.category === user.category) === index
              ).map((user) => (
                <Grid item xs={12} sm={4} key={user.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2, pb: '16px !important', textAlign: 'center' }}>
                      <Box sx={{ position: 'relative', mb: 1 }}>
                        <Avatar 
                          src={user.avatar} 
                          alt={user.name} 
                          sx={{ 
                            width: 64, 
                            height: 64, 
                            mx: 'auto',
                            mb: 1,
                            border: 2,
                            borderColor: theme => theme.palette[getCategoryColor(user.category)].main
                          }} 
                        />
                        <Chip
                          icon={getCategoryIcon(user.category)}
                          label={user.category}
                          color={getCategoryColor(user.category)}
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            mt: 0.5
                          }}
                        />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" paragraph>
                        {user.email}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleDemoLogin(user.email)}
                        color={getCategoryColor(user.category)}
                        startIcon={getCategoryIcon(user.category)}
                        sx={{ mt: 1 }}
                      >
                        Login as {user.category}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
              This is a demo application. All data is fictional and for demonstration purposes only.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 