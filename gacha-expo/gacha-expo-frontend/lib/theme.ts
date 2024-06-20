import { ThemeOptions, createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#2a93D5',
    },
    secondary: {
      main: '#FFF',
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

