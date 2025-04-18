import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0', // Deeper blue for science theme
      light: '#5e92f3',
      dark: '#003c8f',
    },
    secondary: {
      main: '#26a69a', // Teal for science accent
      light: '#64d8cb',
      dark: '#00766c',
    },
    background: {
      default: '#f5f7fa', // Slightly blue-tinted background
    },
    science: {
      astronomy: '#303f9f', // Deep indigo
      chemistry: '#d32f2f', // Red
      physics: '#0288d1', // Blue
      biology: '#388e3c', // Green
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Slightly more rounded edges
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(to right, #1565c0, #1976d2)',
          '&:hover': {
            backgroundImage: 'linear-gradient(to right, #003c8f, #1565c0)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to right, #1565c0, #0288d1)',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: '#26a69a',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;