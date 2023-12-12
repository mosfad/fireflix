import { LoginForm } from '../components/LoginForm';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import image from '../images/appBackground.jpg';
import SnackbarCustom from '../components/SnackbarCustom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { userInfo } from 'os';

export const LoginPage = () => {
  const auth = useAuth();
  //let user = auth?.user;

  return (
    <Box
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', height: '100vh' }}
      >
        <Box
          sx={{
            height: '30vh',
            backgroundColor: 'black',
            marginBottom: '2rem',
          }}
        />
        <LoginForm
        // user={auth?.user}
        // authenticate={auth?.isAuthenticating}
        // signin={auth?.signinUser}
        />
        {/* <LoginForm /> */}
      </Grid>
    </Box>
  );
};
