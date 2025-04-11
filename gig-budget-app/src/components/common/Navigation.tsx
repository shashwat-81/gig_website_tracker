import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Dashboard, AttachMoney, Savings, Assessment, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface NavigationProps {
  children?: React.ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gig Budget App
          </Typography>
          <Button color="inherit" component={Link} to="/" startIcon={<Dashboard />}>
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/budget" startIcon={<AttachMoney />}>
            Budget
          </Button>
          <Button color="inherit" component={Link} to="/savings" startIcon={<Savings />}>
            Savings
          </Button>
          <Button color="inherit" component={Link} to="/reports" startIcon={<Assessment />}>
            Reports
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </>
  );
};

export default Navigation; 