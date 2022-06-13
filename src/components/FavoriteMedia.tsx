import { useState, useEffect, Fragment, useRef } from 'react';
// import { MovieCard } from './MovieCard';
import ImageList from '@mui/material/ImageList';
// import { useLocalStorage } from '../hooks/useLocalStorage';
import { movieTrendingUrl } from '../utilities/urlGenerator';
import axios from 'axios';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import useFetch from '../hooks/useFetch';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectLoginStatus, selectAuthUser } from '../features/auth/authSlice';
import { getUserDB, getUserFav } from '../services/databaseServices';
import LoadingSpinner from './LoadingSpinner';
import { FavoriteCard } from './FavoriteCard';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';

// utility function to handle type issues
// with `Error`
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error); //stringify error.
}
type MoviePropsArray =
  | {
      title: string;
      poster: string;
      // id: number;
      //   media_type: string;
      //   original_language: string;
      //   release_date: string;
      //   vote_average: number;
      //   vote_count: number;
    }[]
  | null;

type SlideDirectionProps = 'left' | 'right' | 'up' | 'down' | undefined;

export default function FavoriteMedia() {
  const imageRef = useRef(null);
  const dispatch = useAppDispatch();
  const isLoggedin = useAppSelector((state) => selectLoginStatus(state));
  const user = useAppSelector((state) => selectAuthUser(state));
  //   const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  const userId = user?.uid;
  //  const [url, setUrl] = useState(movieTrendingUrl);
  const [media, setMedia] = useState<MoviePropsArray | null>(null);
  const [moveRight, setMoveRight] = useState<boolean>(false);
  const [moveLeft, setMoveLeft] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] =
    useState<SlideDirectionProps>(undefined);

  const handleRightMove = () => {
    setMoveRight(true);
    setSlideDirection('left');
  };
  const handleLeftMove = () => {
    setMoveLeft(true);
    setSlideDirection('right');
  };

  // Use RTK to fetch data and comment out top line.
  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId) {
        let response: any = await getUserFav(userId);
        console.log(response);
        if (typeof response !== 'undefined') setMedia(response);
      }
    };
    fetchFavorites();
  }, [userId]);

  return media === null ? (
    <div>
      <LoadingSpinner />
    </div>
  ) : (
    //   <ArrowCircleLeftIcon sx={{ zIndex: '10' }} />
    <Fragment>
      <Toolbar />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'auto',
          position: 'relative',
        }}
      >
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
          onClick={handleRightMove}
        >
          <ArrowCircleLeftIcon /*fontSize="large"*/ sx={{ fontSize: '3rem' }} />
        </IconButton>
        <Slide
          direction={slideDirection}
          in={moveRight}
          container={imageRef.current}
        >
          <ImageList
            sx={{
              overflow: 'hidden',
              gridAutoFlow: 'column',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(160px,1fr)) !important',
              gridAutoColumns: 'minmax(160px, 1fr)',
              mt: 4,
              mb: 4,
              gridTemplateRows: 'minmax(240px, 1fr)',
            }}
            gap={20}
            rowHeight={4}
            //   cols={6}
            //   sx={{ padding: 4, marginTop: '4rem', height: '80%' }}
            ref={imageRef}
          >
            {media.map((item, index) => (
              //
              <FavoriteCard key={index} item={item} />
            ))}
          </ImageList>
        </Slide>

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
          onClick={handleLeftMove}
        >
          <ArrowCircleRightIcon
            /*fontSize="large"*/ sx={{ fontSize: '3rem' }}
          />
        </IconButton>
      </Box>
    </Fragment>

    //   <ArrowCircleRightIcon sx={{ zIndex: '10' }} />
  );
}

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