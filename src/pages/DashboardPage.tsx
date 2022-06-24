import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { SideNavDashboard } from '../components/SideNavDashboard';
import FavoriteMedia from '../components/FavoriteMedia';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

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
            <Toolbar />
            <SideNavDashboard />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box
            sx={{
              // height: '100vh',
              // backgroundColor: '#ED6C02',
              opacity: '.9',
            }}
          >
            <Toolbar />
            <FavoriteMedia />
            <FavoriteMedia />
            <FavoriteMedia />
            <FavoriteMedia />
            <FavoriteMedia />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

// sx={{
//   overflow: 'hidden',
//   gridAutoFlow: 'column',
//   gridTemplateColumns:
//     'repeat(auto-fit, minmax(160px,1fr)) !important',
//   gridAutoColumns: 'minmax(160px, 1fr)',
//   mt: 4,
//   mb: 4,
//   gridTemplateRows: 'minmax(240px, 1fr)',
// }}
