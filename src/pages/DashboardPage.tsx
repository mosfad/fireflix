import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SideNavDashboard } from '../components/SideNavDashboard';
import FavoriteMedia from '../components/FavoriteMedia';

export const DashboardPage = () => {
  return (
    <div>
      <Grid container direction="row" justifyContent="center">
        <Grid item xs={2}>
          <Box
            sx={{
              height: '100vh',
              backgroundColor: 'white',
              opacity: '.95',
            }}
          >
            <SideNavDashboard />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              height: '100vh',
              // backgroundColor: '#ED6C02',
              opacity: '.9',
            }}
          >
            <FavoriteMedia />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};
