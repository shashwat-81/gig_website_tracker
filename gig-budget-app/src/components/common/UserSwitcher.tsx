import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Menu, 
  MenuItem, 
  IconButton, 
  Avatar, 
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import { Person, ExitToApp, KeyboardArrowDown } from '@mui/icons-material';
import { getAvailableUsers, switchUser, logout, getCurrentUser } from '../../services/authService';
import { clearPredictionCache } from '../../services/aiPredictionService';
import { User } from '../../types/User';

const UserSwitcher: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    // Load available users
    setUsers(getAvailableUsers());
    
    // Get current user
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleSwitchUser = async (userId: number) => {
    try {
      // Clear previous user's prediction cache
      if (currentUser) {
        clearPredictionCache(currentUser.id);
      }
      
      // Switch to new user
      const user = await switchUser(userId);
      setCurrentUser(user);
      
      // Close menu
      handleCloseMenu();
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error switching user:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      handleCloseMenu();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (!currentUser) {
    return null;
  }
  
  // Group users by category
  const usersByCategory: Record<string, User[]> = {};
  users.forEach(user => {
    if (!usersByCategory[user.category]) {
      usersByCategory[user.category] = [];
    }
    usersByCategory[user.category].push(user);
  });
  
  return (
    <Box>
      <Tooltip title="Switch User">
        <IconButton
          onClick={handleOpenMenu}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar src={currentUser.avatar} sx={{ width: 32, height: 32 }}>
            {currentUser.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
            {currentUser.name}
          </Typography>
          <KeyboardArrowDown fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 250,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2" color="text.secondary">
            Current: {currentUser.category}
          </Typography>
        </MenuItem>
        <Divider />
        
        {/* Display users grouped by category */}
        {Object.entries(usersByCategory).map(([category, categoryUsers]) => (
          <React.Fragment key={category}>
            <MenuItem disabled>
              <Typography variant="overline" color="primary">
                {category}
              </Typography>
            </MenuItem>
            {categoryUsers.map(user => (
              <MenuItem 
                key={user.id} 
                onClick={() => handleSwitchUser(user.id)}
                selected={user.id === currentUser.id}
              >
                <ListItemIcon>
                  <Avatar src={user.avatar}>
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={user.name} 
                  secondary={user.email} 
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </MenuItem>
            ))}
            <Divider />
          </React.Fragment>
        ))}
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserSwitcher; 