import { createTheme } from '@mui/material/styles';
// import { green, purple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#434343',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#ED6C02',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#9c9c9c',
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '&:focus, &:focus-within': {
            backgroundColor: '#767474',
          },
          '&:hover': {
            backgroundColor: '#5E5C5C',
          },
        },
        // input: {
        //   color: '#FFFFFF',
        //   '&:focus': {
        //     backgroundColor: '#767474',
        //   },
        // },
      },
    },
  },
});

// #0073FF blue
// #434343 black
// #ed6c02 orange
// #9c9c9c gray
