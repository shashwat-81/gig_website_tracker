import React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps, SxProps, Theme } from '@mui/material';

// Define a type that includes all the props we need
export interface GridProps extends Omit<MuiGridProps, 'component'> {
  item?: boolean;
  container?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  spacing?: number;
  sx?: SxProps<Theme>;
  component?: React.ElementType;
  children?: React.ReactNode;
}

// Create a custom Grid component that wraps MUI's Grid
export const Grid: React.FC<GridProps> = ({ 
  children, 
  item, 
  container, 
  xs, 
  sm, 
  md, 
  lg, 
  xl, 
  spacing,
  sx,
  ...props 
}) => {
  return (
    <MuiGrid 
      component="div"
      item={item}
      container={container}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      spacing={spacing}
      sx={sx}
      {...props}
    >
      {children}
    </MuiGrid>
  );
};

export default Grid; 