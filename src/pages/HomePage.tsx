import MovieList from '../components/MovieList';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mediaTrendingUrl } from '../utilities/urlGenerator';
import Grid from '@mui/material/Grid';

import LoadingSpinner from '../components/LoadingSpinner';
import Box from '@mui/material/Box';
import axios from 'axios';
import MediaList from '../components/MediaList';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchTrendingMovies,
  //   updateCurrentCategory,
  selectAllMovies,
  selectMovieStatus,
} from '../features/movies/moviesSlice';

export const HomePage = () => {
  const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  const movies = useAppSelector((state) => selectAllMovies(state));
  console.log(movies);
  let hasTrending = movies.trending.length > 0 ? true : false;
  let hasPopular = movies.popular.length > 0 ? true : false;
  let hasUpcoming = movies.upcoming.length > 0 ? true : false;
  console.log(hasTrending);
  console.log(hasPopular);
  console.log(hasUpcoming);
  return !hasTrending || !hasPopular || !hasUpcoming ? (
    <div className="loading-spinner__home">
      <LoadingSpinner />
    </div>
  ) : (
    <div>
      <Box sx={{ marginTop: '5rem' }}>
        <Grid container direction="row" justifyContent="center">
          <MediaList categoryName="trending" mediaName="movie" time="day" />
        </Grid>
        <Grid container direction="row" justifyContent="center">
          <MediaList categoryName="popular" mediaName="movie" time="day" />
        </Grid>
        <Grid container direction="row" justifyContent="center">
          <MediaList categoryName="upcoming" mediaName="movie" time="day" />
        </Grid>
      </Box>
    </div>
  );
};

// // utility function to handle type issues
// // with `Error`
// function getErrorMessage(error: unknown) {
//   if (error instanceof Error) return error.message;
//   return String(error); //stringify error.
// }

// export const HomePage = () => {
//   const [url, setUrl] = useState(movieTrendingUrl);
//   const [movies, setMovies] = useLocalStorage<{}>('movieResults', {});

//   //useState<{}>(initialState: {} | (() => {})): [{}, React.Dispatch<React.SetStateAction<{}>>]

//   const [hasLocalStore, setHasLocalStore] = useLocalStorage<boolean>(
//     'hasLocalStore',
//     false
//   );
//   let posterPath =
//     'https://www.themoviedb.org/t/p/w220_and_h330_face/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg';
//   useEffect(() => {
//     const fetchMovie = async function () {
//       if (typeof window.localStorage === 'undefined' || hasLocalStore === true)
//         return;
//       try {
//         const res = await axios.get(url);
//         if (res.status === 200) {
//           setMovies({ movieResults: res.data.results, status: 'ok' });
//           setHasLocalStore(true);
//           // console.log(movies);
//           // console.log(hasLocalStore);
//           // now store data in local storage
//         }
//       } catch (err) {
//         console.log(getErrorMessage(err));
//         console.error('There was a network issue', getErrorMessage(err));
//       }
//     };
//     fetchMovie();
//     // fetchMovie();
//   }, [setHasLocalStore, setMovies, url, hasLocalStore]);
//   return (
//     <div>
//       <MovieList />
//       <div>Movies</div>
//     </div>
//   );
// };
