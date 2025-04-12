import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AttachMoney as IncomeIcon,
  MoneyOff as ExpenseIcon,
  AccountBalance as BudgetIcon,
  Savings as SavingsIcon,
  EmojiEvents as AchievementsIcon,
  Flag as ChallengesIcon,
  Receipt as TaxIcon,
  Settings as SettingsIcon,
  Psychology as AIIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Income Tracker', path: '/income', icon: <IncomeIcon /> },
  { text: 'Expense Tracker', path: '/expenses', icon: <ExpenseIcon /> },
  { text: 'Budget Planner', path: '/budget', icon: <BudgetIcon /> },
  { text: 'Savings Goals', path: '/savings', icon: <SavingsIcon /> },
  { text: 'AI Insights', path: '/ai-insights', icon: <AIIcon /> },
  { text: 'Achievements', path: '/achievements', icon: <AchievementsIcon /> },
  { text: 'Challenges', path: '/challenges', icon: <ChallengesIcon /> },
  { text: 'Tax Manager', path: '/tax', icon: <TaxIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'primary.main', 
      color: 'primary.contrastText' 
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          GigBudget
        </Typography>
        {isMobile && (
          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="close drawer" 
            onClick={handleDrawerToggle}
            sx={{ color: 'primary.contrastText' }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ flexGrow: 1, pt: 0 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                borderLeft: location.pathname === item.path ? 
                  '4px solid' : '4px solid transparent',
                borderColor: 'primary.light',
                bgcolor: location.pathname === item.path ? 
                  'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'primary.contrastText',
                  minWidth: 40,
                  opacity: location.pathname === item.path ? 1 : 0.7,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  fontSize: '0.9rem',
                }}
                sx={{ opacity: location.pathname === item.path ? 1 : 0.7 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          v1.0.0 • Smart Budgeting for Gig Workers
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 