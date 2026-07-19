import { createTheme } from '@mui/material/styles';

export const getTerraTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#9dd3aa' : '#4a7c59',
      light: mode === 'dark' ? '#b9f0c6' : '#78a886',
      dark: mode === 'dark' ? '#386948' : '#2a6038',
      contrastText: mode === 'dark' ? '#16492b' : '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? '#d0c5b8' : '#6b6358',
      light: mode === 'dark' ? '#ece1d3' : '#9c8f83',
      dark: mode === 'dark' ? '#413a31' : '#3d3830',
      contrastText: mode === 'dark' ? '#463f35' : '#ffffff',
    },
    tertiary: {
      main: mode === 'dark' ? '#ffe8c0' : '#c4a66a',
      light: mode === 'dark' ? '#fad998' : '#d4be8a',
      dark: mode === 'dark' ? '#614b18' : '#8a6e30',
      contrastText: mode === 'dark' ? '#6b5320' : '#ffffff',
    },
    error: {
      main: mode === 'dark' ? '#fa746f' : '#b83230',
      dark: mode === 'dark' ? '#871f21' : '#8c1a18',
      contrastText: mode === 'dark' ? '#490006' : '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#0b0f0c' : '#faf6f0',
      paper: mode === 'dark' ? '#151b16' : '#f0ece4',
    },
    surface: {
      main: mode === 'dark' ? '#0b0f0c' : '#faf6f0',
      bright: mode === 'dark' ? '#262e28' : '#ffffff',
      container: mode === 'dark' ? '#151b16' : '#f0ece4',
      containerHigh: mode === 'dark' ? '#1a211c' : '#e8e4dc',
      containerHighest: mode === 'dark' ? '#202822' : '#e0dcd4',
      containerLow: mode === 'dark' ? '#0f1511' : '#f5f1ea',
    },
    text: {
      primary: mode === 'dark' ? '#dfe8de' : '#2e3230',
      secondary: mode === 'dark' ? '#a8b0a8' : '#4a4e4a',
    },
    outline: {
      main: mode === 'dark' ? '#6f7870' : '#74796f',
      variant: mode === 'dark' ? '#424a43' : '#c4c8bc',
    },
    divider: mode === 'dark' ? 'rgba(223, 232, 222, 0.08)' : 'rgba(46, 50, 48, 0.12)',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Nunito Sans', 'Inter', sans-serif",
    h1: { fontFamily: "'Literata', serif", fontWeight: 700 },
    h2: { fontFamily: "'Literata', serif", fontWeight: 700 },
    h3: { fontFamily: "'Literata', serif", fontWeight: 600 },
    h4: { fontFamily: "'Literata', serif", fontWeight: 600 },
    h5: { fontFamily: "'Literata', serif", fontWeight: 600 },
    h6: { fontFamily: "'Literata', serif", fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'dark' ? '#0b0f0c' : '#faf6f0',
          color: mode === 'dark' ? '#dfe8de' : '#2e3230',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 24,
          paddingRight: 24,
          boxShadow: 'none',
          '&:hover': { boxShadow: mode === 'dark' ? '0 4px 12px rgba(157, 211, 170, 0.15)' : 'none' },
        },
        contained: {
          ...(mode === 'dark' && {
            backgroundColor: '#9dd3aa',
            color: '#16492b',
            '&:hover': { backgroundColor: '#b9f0c6' },
          }),
        },
        outlined: {
          ...(mode === 'dark' && {
            borderColor: '#424a43',
            color: '#9dd3aa',
            '&:hover': { borderColor: '#9dd3aa', backgroundColor: 'rgba(157, 211, 170, 0.08)' },
          }),
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1a211c' : '#f0ece4',
          borderRadius: 16,
          backgroundImage: 'none',
          border: mode === 'dark' ? '1px solid rgba(66, 74, 67, 0.5)' : 'none',
          boxShadow: mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(46, 50, 48, 0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#0b0f0c' : '#faf6f0',
          color: mode === 'dark' ? '#dfe8de' : '#2e3230',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(66, 74, 67, 0.5)' : 'rgba(46, 50, 48, 0.1)'}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: mode === 'dark' ? '#151b16' : '#f0ece4',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? '#9dd3aa' : '#4a7c59',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mode === 'dark' ? 'rgba(66, 74, 67, 0.5)' : 'rgba(46, 50, 48, 0.12)',
        },
      },
    },
  },
});
