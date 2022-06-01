import { SignupForm } from '../components/SignupForm';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import image from '../images/appBackground.jpg';

export const SignupPage = () => {
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
        <SignupForm />
      </Grid>
    </Box>
  );
};

/* background-image: url('./images/appBackground.jpg'); */
