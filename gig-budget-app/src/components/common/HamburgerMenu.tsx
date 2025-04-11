import React from 'react';
import { IconButton, IconButtonProps, Box } from '@mui/material';

interface HamburgerMenuProps extends Omit<IconButtonProps, 'onClick'> {
  open: boolean;
  onClick: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  open, 
  onClick, 
  color = 'inherit',
  size = 'medium',
  ...props 
}) => {
  return (
    <IconButton
      aria-label={open ? 'close menu' : 'open menu'}
      onClick={onClick}
      color={color}
      size={size}
      edge="start"
      sx={{ 
        mr: 2,
        ...props.sx
      }}
      {...props}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Three bars of the hamburger */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: 'currentColor',
            transition: 'all 0.3s ease',
            transform: open ? 'rotate(45deg)' : 'translateY(-6px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: 'currentColor',
            transition: 'opacity 0.2s ease',
            opacity: open ? 0 : 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: 'currentColor',
            transition: 'all 0.3s ease',
            transform: open ? 'rotate(-45deg)' : 'translateY(6px)',
          }}
        />
      </Box>
    </IconButton>
  );
};

export default HamburgerMenu; 