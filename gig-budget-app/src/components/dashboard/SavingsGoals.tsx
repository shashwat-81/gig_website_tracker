import React from 'react';
import { Box, Typography, CircularProgress, Paper, Stack, Chip } from '@mui/material';

const SavingsGoals: React.FC = () => {
  const savingsGoals = [
    { 
      name: 'Emergency Fund', 
      current: 35000, 
      target: 100000, 
      percentage: 35,
      color: '#2e7d32' // green
    },
    { 
      name: 'New Laptop', 
      current: 45000, 
      target: 60000, 
      percentage: 75,
      color: '#1976d2' // blue
    },
    { 
      name: 'Vacation', 
      current: 15000, 
      target: 50000, 
      percentage: 30,
      color: '#ed6c02' // orange
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Savings Goals
      </Typography>
      
      <Stack spacing={2}>
        {savingsGoals.map((goal) => (
          <Paper key={goal.name} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
              <CircularProgress
                variant="determinate"
                value={goal.percentage}
                size={60}
                thickness={5}
                sx={{ color: goal.color }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${Math.round(goal.percentage)}%`}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">{goal.name}</Typography>
                <Chip 
                  size="small" 
                  label={`${goal.percentage}%`} 
                  sx={{ backgroundColor: goal.color, color: 'white' }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                ₹{goal.current.toLocaleString()} of ₹{goal.target.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default SavingsGoals; 