import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import ImageList from '@mui/material/ImageList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mediaTrendingUrl } from '../utilities/urlGenerator';
import axios from 'axios';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import useFetch from '../hooks/useFetch';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchTrendingMovies,
  selectAllMovies,
  selectMovieStatus,
} from '../features/movies/moviesSlice';
import { MovieProps } from '../shared/types';

// utility function to handle type issues
// with `Error`
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error); //stringify error.
}
// type MovieProps = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: string;
//   original_language: string;
//   release_date: string;
//   vote_average: number;
//   vote_count: number;
// } | null;

type MovieDataProps = MovieProps[] | null;

export default function MovieList() {
  const dispatch = useAppDispatch();
  const movieArray = useAppSelector((state) => selectAllMovies(state));
  const movieStatus = useAppSelector((state) => selectMovieStatus(state));

  const [trendingUrl, setTrendingUrl] = useState<string>(() =>
    mediaTrendingUrl('movie', 'day')
  );

  // Use RTK to fetch data and comment out top line.
  useEffect(() => {
    console.log(movieArray);
    // fetch if no local storage
    if (movieArray.length === 0) {
      // console.log(movieArray);
      const fetchAndUpdate = async function () {
        console.log(trendingUrl);
        let results = await dispatch(fetchTrendingMovies(trendingUrl));
        console.log(results);
      };
      fetchAndUpdate();
    }
  }, [movieArray, trendingUrl, dispatch]);

  return movieStatus === 'pending' ? (
    <div>
      <h1
        style={{
          color: 'white',
          height: '100vh',
          backgroundColor: 'black',
          width: '100vw',
        }}
      >
        Loading....
      </h1>
    </div>
  ) : (
    <ImageList
      gap={20}
      cols={6}
      sx={{ padding: 4, marginTop: '4rem', height: '80%' }}
    >
      {movieArray.map((item: MovieProps, index) => (
        //console.log(item)
        <MovieCard key={index} item={item} />
      ))}
    </ImageList>
  );
}

// // utility function to handle type issues
// // with `Error`
// function getErrorMessage(error: unknown) {
//   if (error instanceof Error) return error.message;
//   return String(error); //stringify error.
// }
// type MovieProps = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: string;
//   original_language: string;
//   release_date: string;
//   vote_average: number;
//   vote_count: number;
// } | null;

// type MovieDataProps = {
//   movieResults: { results: MovieProps[] };
// } | null;

// export default function MovieList() {
//   const [url, setUrl] = useState(movieTrendingUrl);
//   //const [movieRes, setMovieRes] = useState<MovieProps>(null);
//   const [movies, setMovies] = useState<MovieDataProps>(null);
//   const [hasLocalStore, setHasLocalStore] = useLocalStorage<boolean>(
//     'hasLocalStore',
//     false
//   );

//   const { data, error, loading } = useFetch(movieTrendingUrl(), hasLocalStore); //pass an option here to prevent fetching???
//   // Use RTK to fetch data and comment out top line.👆

//   const [moviesLocalStore, setMoviesLocalStore] = useLocalStorage<{}>(
//     'movieResults',
//     {}
//   );
//   // console.log(moviesLocalStore);
//   // console.log('Inside MovieList Component');

//   // try separate useEffect for fetch & local storage*******!!!!!!!!!!!!!!!!
//   useEffect(() => {
//     // get movies from local storage
//     if (moviesLocalStore !== null) {
//       setMovies(moviesLocalStore);
//     }
//   }, [moviesLocalStore]);

//   useEffect(() => {
//     // fetch & update local storage
//     const fetchAndUpdate = function () {
//       if (data && !hasLocalStore) {
//         setMoviesLocalStore({ movieResults: data?.results });
//         setHasLocalStore(true);
//       }
//     };
//     fetchAndUpdate();
//   }, []);

//   // useEffect(() => {
//   //   const updateLocalStorage = async function () {
//   //     if (data && !hasLocalStore) return;

//   //     if (data) {
//   //       // find a way to update movies even when ph
//   //       setHasLocalStore(true);
//   //       setMoviesLocalStore({ movieResults: data?.results });
//   //       //setMovieRes(moviesLocalStore);
//   //     }
//   //   };
//   //   updateLocalStorage();
//   // }, []); //[data, setHasLocalStore, setMoviesLocalStore]
//   return !movies ? (
//     <div>Loading....</div>
//   ) : (
//     <ImageList
//       gap={20}
//       cols={6}
//       sx={{ padding: 4, width: '80%', height: '80%' }}
//     >
//       {movies?.movieResults?.results?.map((item: MovieProps) => (
//         //console.log(item)
//         <MovieCard key={item?.id} item={item} />
//       ))}
//     </ImageList>
//   );
// }

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
    cols: 2,
  },
];
