import { ThemeOptions, createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#EB372A',
    },
    secondary: {
      main: '#2E2C2D',
    },
  },
};

export const theme = createTheme(themeOptions);

export const adminThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#465071',
    },
    secondary: {
      main: '#FFF',
    },
  },
};

export const adminTheme = createTheme(adminThemeOptions);

