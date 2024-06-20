import { ThemeOptions, createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#d9743e',
    },
    secondary: {
      main: '#f9ebe1',
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

