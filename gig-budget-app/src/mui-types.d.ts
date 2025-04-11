import { GridTypeMap } from '@mui/material/Grid';
import { ElementType } from 'react';

// Directly patch the MUI types for Grid component
declare module '@mui/material' {
  interface GridProps {
    component?: React.ElementType;
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
    sx?: any;
  }
  
  // Ensure base props are properly defined
  interface GridBaseProps {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
  }
}

// This is the most direct approach to fixing the Grid component types
declare module '@mui/material/Grid' {
  interface GridProps {
    component?: React.ElementType;
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
    sx?: any;
    children?: React.ReactNode;
    key?: any;
  }
  
  // Override the TypeMap to ensure component prop is optional
  interface GridTypeMap {
    props: {
      item?: boolean;
      container?: boolean;
      xs?: number | boolean;
      sm?: number | boolean; 
      md?: number | boolean;
      lg?: number | boolean;
      xl?: number | boolean;
      spacing?: number;
      component?: React.ElementType;
    };
    defaultComponent: 'div';
  }
}

// Fix the TextField component for checkbox support
declare module '@mui/material/TextField' {
  interface TextFieldProps {
    checked?: boolean;
  }
}

// This ensures the system props are properly recognized
declare module '@mui/system' {
  interface BoxOwnProps {
    component?: React.ElementType;
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
  }
}

// Fix for Material UI component props
declare module '@mui/material/styles/overrides' {
  interface ComponentNameToClassKey {
    MuiGrid: any;
  }
} 