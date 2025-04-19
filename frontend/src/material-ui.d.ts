// Type definitions for Material UI v7
import '@mui/material/styles';
import { GridTypeMap } from '@mui/material/Grid';

declare module '@mui/material/styles' {
  interface Theme {
    // Add any custom theme properties here
  }
  interface ThemeOptions {
    // Add any custom theme options here
  }
}

declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
    container?: boolean;
  }
}
