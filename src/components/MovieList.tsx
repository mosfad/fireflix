import {
  useState,
  useEffect,
  Fragment,
  useRef,
  useLayoutEffect,
  MouseEvent,
} from 'react';
import { MovieCard } from './MovieCard';
import Box from '@mui/material/Box';
import LoadingSpinner from './LoadingSpinner';
import ImageList from '@mui/material/ImageList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mediaTrendingUrl } from '../utilities/urlGenerator';
import axios from 'axios';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import useFetch from '../hooks/useFetch';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchTrendingMovies,
  selectAllMovies,
  selectMovieStatus,
} from '../features/movies/moviesSlice';
import { MediaProps } from '../shared/types';
import './Media.css';

// utility function to handle type issues
// with `Error`
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error); //stringify error.
}
// type MediaProps = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: string;
//   original_language: string;
//   release_date: string;
//   vote_average: number;
//   vote_count: number;
// } | null;

type MovieDataProps = MediaProps[] | null;
type SlideDirectionProps = 'left' | 'right' | 'up' | 'down' | undefined;
type ArrowClickProps = 'left' | 'right' | undefined;

export default function MovieList() {
  const imageRef = useRef<HTMLUListElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const movieArray = useAppSelector((state) => selectAllMovies(state));
  const movieStatus = useAppSelector((state) => selectMovieStatus(state));

  const [trendingUrl, setTrendingUrl] = useState<string>(() =>
    mediaTrendingUrl('movie', 'day')
  );

  // Repeated Code: Remember DRY!!!
  const [media, setMedia] = useState<MediaProps[] | null>(null);
  const [slide, setSlide] = useState<number>(1);
  //
  const [widthSlideContainer, setWidthSlideContainer] = useState<number>(0);
  const [slideMoves, setSlideMoves] = useState<number>(1);
  const [numOfSlides, setNumOfSlides] = useState<number | null>(null);
  const [posterWidth, setPosterWidth] = useState<number>(180);
  const [slideDirection, setSlideDirection] =
    useState<ArrowClickProps>(undefined);

  const moveSlides = (
    listElemSlides: HTMLUListElement | null,
    direction: SlideDirectionProps
  ) => {
    if (!listElemSlides || !direction || !numOfSlides) return;
    if (direction === 'left') {
      if (slide > slideMoves) {
        setSlide((prevSlide) => prevSlide - slideMoves);
      } else {
        setSlide(1);
      }
    }
    if (direction === 'right') {
      if (numOfSlides - slide + 1 > slideMoves) {
        setSlide((prevSlide) => prevSlide + slideMoves);
      }
    }
  };

  const handleArrowClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    direction: ArrowClickProps
  ) => {
    const imageListElem = imageRef?.current;
    if (imageListElem === null) return;
    setSlideDirection(direction);
    moveSlides(imageListElem, direction);
  };

  useEffect(() => {
    let imageListElem = imageRef?.current;
    if (imageListElem && slideDirection === 'left') {
      if (slide === 1) imageListElem.style.transform = `translateX(0)`;
      else
        imageListElem.style.transform = `translateX(-${
          (slide - 1) * posterWidth
        }px)`;
    }

    if (imageListElem && slideDirection === 'right') {
      if (numOfSlides && slide <= numOfSlides)
        imageListElem.style.transform = `translateX(-${
          (slide - 1) * posterWidth
        }px)`;
    }
  }, [slide, slideDirection, posterWidth, numOfSlides]);

  const updateContainerAndSlide = () => {
    let slideContainer = imageContainerRef?.current;
    if (slideContainer) {
      setWidthSlideContainer(slideContainer.clientWidth);
      setSlideMoves(Math.trunc(widthSlideContainer / posterWidth));
    }
  };

  useLayoutEffect(() => {
    updateContainerAndSlide();
  });

  useLayoutEffect(() => {
    window.addEventListener('resize', updateContainerAndSlide);
    return () => {
      window.removeEventListener('resize', updateContainerAndSlide);
    };
  }, []);
  //========================

  // Use RTK to fetch data and comment out top line.
  useEffect(() => {
    console.log(movieArray);
    // fetch if no local storage
    if (movieArray.length === 0) {
      // console.log(movieArray);
      const fetchAndUpdate = async function () {
        console.log(trendingUrl);
        let results: any = await dispatch(fetchTrendingMovies(trendingUrl)); // ???
        console.log(results);
        if (typeof results !== 'undefined') {
          setMedia(results);
          setNumOfSlides(results.length);
        }
      };
      fetchAndUpdate();
    }
  }, [movieArray, trendingUrl, dispatch]);

  return movieStatus === 'pending' ? (
    <div>
      <LoadingSpinner />
    </div>
  ) : (
    <Fragment>
      <Box
        className="fav-menu"
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          position: 'relative',
          padding: '0 2rem ',
          minHeight: '26rem',
          marginBottom: '4rem',
          marginTop: '6rem', //
        }}
        ref={imageContainerRef}
      >
        <Typography
          align="left"
          variant="subtitle1"
          component="h3"
          sx={{
            color: 'white',
            //padding: '2rem 2rem 2rem 0rem',
            //marginBottom: '2rem',
            fontFamily: 'Merriweather Sans, sans-serif',
            fontWeight: '700',
            fontSize: '2rem',
            letterSpacing: '3px',
            position: 'absolute',
            top: '0',
          }}
        >
          Trending Movies
        </Typography>
        <IconButton
          size="large"
          sx={{
            position: 'absolute',
            left: '.25rem',
            top: '50%',
            transform: 'translate(25%, -50%)',
            zIndex: '3000',
            color: 'white',
          }}
          onClick={(e) => handleArrowClick(e, 'left')}
        >
          <ArrowCircleLeftIcon /*fontSize="large"*/ sx={{ fontSize: '3rem' }} />
        </IconButton>

        <ImageList
          className="fav-menu media-card__menu"
          component="ul"
          sx={{
            gridAutoFlow: 'column',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(160px,1fr)) !important',
            gridAutoColumns: 'minmax(160px, 1fr)',
            gridTemplateRows: 'minmax(240px, 1fr)',
            mt: 2,
            mb: 2,
            overflowY: 'visible', // ⚠️Add this CSS rule to remove  `overflow-y: 'auto'` from MUI.
          }}
          gap={32}
          rowHeight={4}
          //   cols={6}
          //   sx={{ padding: 4, marginTop: '4rem', height: '80%' }}
          ref={imageRef}
        >
          {movieArray.map((item: MediaProps, index) => (
            //console.log(item)
            <MovieCard key={index} item={item} />
          ))}
        </ImageList>

        <IconButton
          size="large"
          sx={{
            position: 'absolute',
            right: '.25rem',
            top: '50%',
            transform: 'translate(-25%, -50%)',
            zIndex: '3000',
            color: 'white',
          }}
          onClick={(e) => handleArrowClick(e, 'right')}
        >
          <ArrowCircleRightIcon sx={{ fontSize: '3rem' }} />
        </IconButton>
      </Box>
    </Fragment>
  );
}

// // utility function to handle type issues
// // with `Error`
// function getErrorMessage(error: unknown) {
//   if (error instanceof Error) return error.message;
//   return String(error); //stringify error.
// }
// type MediaProps = {
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
//   movieResults: { results: MediaProps[] };
// } | null;

// export default function MovieList() {
//   const [url, setUrl] = useState(movieTrendingUrl);
//   //const [movieRes, setMovieRes] = useState<MediaProps>(null);
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
//       {movies?.movieResults?.results?.map((item: MediaProps) => (
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

// type MovieDataProps = MediaProps[] | null;

// export default function MovieList() {
//   const dispatch = useAppDispatch();
//   const movieArray = useAppSelector((state) => selectAllMovies(state));
//   const movieStatus = useAppSelector((state) => selectMovieStatus(state));

//   const [trendingUrl, setTrendingUrl] = useState<string>(() =>
//     mediaTrendingUrl('movie', 'day')
//   );

//   // Use RTK to fetch data and comment out top line.
//   useEffect(() => {
//     console.log(movieArray);
//     // fetch if no local storage
//     if (movieArray.length === 0) {
//       // console.log(movieArray);
//       const fetchAndUpdate = async function () {
//         console.log(trendingUrl);
//         let results = await dispatch(fetchTrendingMovies(trendingUrl));
//         console.log(results);
//       };
//       fetchAndUpdate();
//     }
//   }, [movieArray, trendingUrl, dispatch]);

//   return movieStatus === 'pending' ? (
//     <div>
//       <h1
//         style={{
//           color: 'white',
//           height: '100vh',
//           backgroundColor: 'black',
//           width: '100vw',
//         }}
//       >
//         Loading....
//       </h1>
//     </div>
//   ) : (
//     <ImageList
//       gap={20}
//       cols={6}
//       sx={{ padding: 4, marginTop: '4rem', height: '80%' }}
//     >
//       {movieArray.map((item: MediaProps, index) => (
//         //console.log(item)
//         <MovieCard key={index} item={item} />
//       ))}
//     </ImageList>
//   );
// }
