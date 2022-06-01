import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export const DashboardPage = () => {
  return (
    <div>
      <Grid container direction="row" justifyContent="center">
        <Grid item xs={2}>
          <Box
            sx={{
              height: '100vh',
              backgroundColor: 'white',
              opacity: '.75',
            }}
          ></Box>
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              height: '100vh',
              backgroundColor: '#ED6C02',
              opacity: '.9',
            }}
          ></Box>
        </Grid>
      </Grid>
    </div>
  );
};
