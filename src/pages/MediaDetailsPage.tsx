import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SideNavDashboard } from '../components/SideNavDashboard';
import FavoriteMedia from '../components/FavoriteMedia';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { MediaDetails } from '../components/MediaDetails';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { mediaUrl } from '../utilities/urlGenerator';
import {
  fetchTrendingMovies,
  fetchMovieDetails,
  selectMovieChosenId,
  selectAllMovies,
  selectMovieStatus,
  selectMovieDetails,
} from '../features/movies/moviesSlice';
import { Fragment, useEffect } from 'react';
import { flexbox } from '@mui/system';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const MediaDetailsPage = () => {
  const mediaId = useAppSelector((state) => selectMovieChosenId(state));
  const dispatch = useAppDispatch();
  const mediaDetails = useAppSelector((state) =>
    selectMovieDetails(state, mediaId as number)
  );

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (mediaId && mediaDetails === undefined) {
        const results = await dispatch(
          fetchMovieDetails(mediaUrl('movie', mediaId))
        ).unwrap();
        // console.log(results);
      }
    };
    console.log(mediaDetails); // How do I get movie details directly from the store????
    fetchMediaDetails();
  }, [mediaId]);

  return (
    <Fragment>
      {!mediaDetails ? (
        <LoadingSpinner />
      ) : (
        <div>
          <Grid container direction="row">
            <Grid item sx={{ flex: 'auto' }}>
              <Box
                sx={{
                  // height: '100vh',
                  position: 'relative',
                  backgroundColor: 'gray',
                  opacity: '.95',
                }}
              >
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/" // not working!!!
                  startIcon={<ArrowBackIosIcon sx={{ fontSize: '2rem' }} />}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    left: '6rem',
                    top: '3rem',
                    transform: 'translate(-50%, 50%)',
                    zIndex: '200',
                    padding: '1rem 2rem',
                    // backgroundColor: '#000000a1',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: '#161617ed',
                    },
                  }}
                  disableRipple
                >
                  <Typography sx={{ opacity: '1', letterSpacing: '1px' }}>
                    Back
                  </Typography>
                </Button>
              </Box>
            </Grid>
            <Grid item sx={{ /*flexBasis: '1280px'*/ maxWidth: '1280px' }}>
              <MediaDetails media={mediaDetails} />
            </Grid>
            <Grid item sx={{ flex: 'auto' }}>
              <Box
                sx={{
                  // height: '100vh',
                  backgroundColor: 'gray',
                  opacity: '.95',
                }}
              ></Box>
            </Grid>
          </Grid>
        </div>
      )}
    </Fragment>
  );
};

// return (
//   <div>
//     <Grid container direction="row">
//       <Grid item>
//         <Box
//           sx={{
//             display: 'flex',
//             color: 'red',
//             backgroundColor: 'black',
//             opacity: '.95',
//             marginTop: '4rem',
//           }}
//         >
//           <Box/>
//           <MediaDetails media={mediaDetails} />
//           <Box/>
//         </Box>
//       </Grid>
//       <Grid item>
//         <Box
//           sx={{
//             // height: '100vh',
//             backgroundColor: 'gray',
//             opacity: '.95',
//           }}
//         ></Box>
//       </Grid>
//     </Grid>
//   </div>
// );

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

// export const MediaDetailsPage = () => {
//   return (
//     <div>
//       <Grid container direction="row" justifyContent="center">
//         <Grid item xs={2}>
//           <Box
//             sx={{
//               height: '100vh',
//               backgroundColor: 'white',
//               opacity: '.95',
//             }}
//           >
//             <Toolbar />
//             <SideNavDashboard />
//           </Box>
//         </Grid>
//         <Grid item xs={10}>
//           <Box
//             sx={{
//               // height: '100vh',
//               // backgroundColor: '#ED6C02',
//               opacity: '.9',
//             }}
//           >
//             <Toolbar />
//             <MediaDetails item={{ title: 'speed', poster: '/ddhdhddhhdd' }} />
//           </Box>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };
