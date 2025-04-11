import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Fab
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
  Close as CloseIcon,
  Menu as MenuIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import HamburgerMenu from './HamburgerMenu';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { text: 'Income Tracker', path: '/income', icon: <IncomeIcon /> },
  { text: 'Expense Tracker', path: '/expenses', icon: <ExpenseIcon /> },
  { text: 'Budget Planner', path: '/budget', icon: <BudgetIcon /> },
  { text: 'Savings Goals', path: '/savings', icon: <SavingsIcon /> },
  { text: 'Achievements', path: '/achievements', icon: <AchievementsIcon /> },
  { text: 'Challenges', path: '/challenges', icon: <ChallengesIcon /> },
  { text: 'Tax Manager', path: '/tax', icon: <TaxIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.user.currentUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    handleProfileMenuClose();
    // To be implemented with logout action
    navigate('/login');
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
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
      
      {/* User profile section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Avatar 
          alt={user?.name || 'User'} 
          src="/static/images/avatar/1.jpg" 
          sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}
        >
          {!user && <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {user?.name || 'Guest User'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {user?.email || 'Sign in to access all features'}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ flexGrow: 1, pt: 0 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Mobile-only app bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: 1,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <HamburgerMenu
              open={mobileOpen}
              onClick={handleDrawerToggle}
              color="inherit"
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GigBudget
            </Typography>
            {user && (
              <IconButton color="inherit" onClick={handleProfileMenuOpen} size="small">
                <Avatar
                  alt={user.name}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      )}
      
      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/settings')}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      
      {/* Navigation sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
        aria-label="main navigation"
      >
        {/* Mobile drawer (hidden by default) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              zIndex: theme.zIndex.drawer + 2 
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Mobile-only FAB for menu */}
      {isMobile && !mobileOpen && (
        <Fab 
          color="primary" 
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
            zIndex: theme.zIndex.drawer - 1,
            display: { sm: 'none' }
          }}
        >
          <MenuIcon />
        </Fab>
      )}
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          mt: { xs: isMobile ? 8 : 0, sm: 0 }
        }}
      >
        {!isMobile && <Toolbar />}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;