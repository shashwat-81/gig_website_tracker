import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  alpha
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Circle as UnreadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { logout } from '../../services/authService';

// Custom time formatting function
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <SuccessIcon sx={{ color: 'success.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'primary.main',
        color: theme.palette.mode === 'dark' ? 'text.primary' : 'primary.contrastText',
      }}
      elevation={theme.palette.mode === 'dark' ? 0 : 4}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit"
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.light'
            }}>
              <PersonIcon />
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: theme.shadows[3]
              }
            }}
          >
            <MenuItem onClick={() => navigate('/settings')}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          <Popover
            open={Boolean(notificationAnchor)}
            anchorEl={notificationAnchor}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: theme.shadows[3]
              }
            }}
          >
            <Box sx={{ width: 360, maxHeight: 480 }}>
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : alpha(theme.palette.primary.main, 0.03)
              }}>
                <Typography variant="h6">Notifications</Typography>
                <Button 
                  size="small" 
                  onClick={markAllAsRead}
                  sx={{
                    color: theme.palette.mode === 'dark' ? 'primary.main' : 'inherit'
                  }}
                >
                  Mark all as read
                </Button>
              </Box>
              <Divider />
              <List sx={{ 
                p: 0, 
                maxHeight: 400, 
                overflow: 'auto',
                bgcolor: 'background.paper'
              }}>
                {notifications.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No notifications"
                      sx={{ color: 'text.secondary' }}
                    />
                  </ListItem>
                ) : (
                  notifications.map((notification) => (
                    <ListItem
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      sx={{
                        bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.03),
                        '&:hover': { 
                          bgcolor: theme.palette.mode === 'dark' 
                            ? alpha(theme.palette.primary.main, 0.15) 
                            : alpha(theme.palette.primary.main, 0.05)
                        },
                        cursor: 'pointer'
                      }}
                    >
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {!notification.read && (
                              <UnreadIcon sx={{ 
                                fontSize: 8, 
                                color: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.dark'
                              }} />
                            )}
                            <Typography variant="subtitle2">
                              {notification.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(notification.timestamp)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 