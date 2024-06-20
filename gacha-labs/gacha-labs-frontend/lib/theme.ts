import { ThemeOptions, createTheme } from '@mui/material/styles';

declare module "@mui/material/styles" {
  interface PaletteOptions {
    oripa?: PaletteOptions["primary"];
    progressFull?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/LinearProgress" {
  interface LinearProgressPropsColorOverrides {
    oripa?: true;
    progressFull?: true;
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#008000',
    },
    secondary: {
      main: '#667380',
    },
    progressFull: {
      main: '#94d27a',
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
      main: '#667380',
    },
  },
};

export const adminTheme = createTheme(adminThemeOptions);

