import {
  useState,
  useEffect,
  Fragment,
  useRef,
  useLayoutEffect,
  MouseEvent,
  useMemo,
} from 'react';
import { MediaCard } from './MediaCard';
import Box from '@mui/material/Box';
import LoadingSpinner from './LoadingSpinner';
import ImageList from '@mui/material/ImageList';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  mediaTrendingUrl,
  mediaPopularUrl,
  mediaUpcomingUrl,
  mediaTopRatedUrl,
} from '../utilities/urlGenerator';
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
  //   updateCurrentCategory,
  selectAllMovies,
  selectMovieStatus,
} from '../features/movies/moviesSlice';
import {
  MediaProps,
  MediaTimeWindowProps,
  MediaTypeProps,
  MediaCategories,
} from '../shared/types';
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

export default function MediaList({
  categoryName,
  mediaName,
  time,
}: {
  categoryName: string;
  mediaName: MediaTypeProps;
  time: MediaTimeWindowProps;
}) {
  const imageRef = useRef<HTMLUListElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  //   let mediaArray: MediaProps[] = useMemo(() => [], []);

  // let mediaArray: MediaProps[] = [];

  const moviesObj = useAppSelector((state) => selectAllMovies(state));
  //   useEffect(() => {
  //     console.log(moviesObj);
  //   }, []);
  //   console.log(moviesObj);
  const movieArray = moviesObj[categoryName as MediaCategories];
  const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  //   if (mediaName === 'movie')
  //     mediaArray = JSON.parse(JSON.stringify(movieArray));

  const [mediaArray, setMediaArray] = useState<MediaProps[]>([]);
  const [mediaReqUrl, setMediaReqUrl] = useState<string>(() => {
    switch (categoryName) {
      case 'trending':
        return mediaTrendingUrl(mediaName, time);
      case 'top rated':
        return mediaTopRatedUrl(mediaName);
      case 'popular':
        return mediaPopularUrl(mediaName);
      case 'upcoming':
        return mediaUpcomingUrl(mediaName);
      default:
        return '';
    }
  });

  useEffect(() => {
    // console.log(mediaReqUrl);
  }, [mediaReqUrl]);
  //   useEffect(() => {
  //     if (mediaName === 'movie' && moviesObj) {
  //       setMediaArray(moviesObj[categoryName as MediaCategories]);
  //     }
  //   }, [categoryName]);

  useEffect(() => {
    setNumOfSlides(movieArray.length);
  }, [movieArray]);

  const posterGap = 32; //px
  const posterWidth = 160; //px
  // Repeated Code: Remember DRY!!!
  const [media, setMedia] = useState<MediaProps[] | null>(null);
  const [slide, setSlide] = useState<number>(1);
  //
  const [widthSlideContainer, setWidthSlideContainer] = useState<number>(0); //
  const [slideMoves, setSlideMoves] = useState<number>(1); //
  const [numOfSlides, setNumOfSlides] = useState<number | null>(null);
  const [posterWidthTotal, setPosterWidthTotal] = useState<number>(
    posterWidth + posterGap
  ); //
  const [slideDirection, setSlideDirection] =
    useState<ArrowClickProps>(undefined); //

  const moveSlides = (
    listElemSlides: HTMLUListElement | null,
    direction: SlideDirectionProps
  ) => {
    console.log(direction);
    console.log(numOfSlides); // main problems****
    console.log(listElemSlides);
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

  const formatCategoryName = () => {
    const arr = categoryName.split(' ');
    arr.forEach((word, index) => {
      arr[index] = word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    return arr.join(' ');
  };

  const handleArrowClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    direction: ArrowClickProps
  ) => {
    const imageListElem = imageRef?.current;
    console.log('I clicked an arrow!');
    // console.log(imageRef);
    // console.log(imageListElem);
    if (imageListElem === null) return;
    console.log('Setting slide moves and direction.....');
    setSlideDirection(direction);
    moveSlides(imageListElem, direction);
  };

  useEffect(() => {
    console.log(imageRef);
  }, []);

  useEffect(() => {
    let imageListElem = imageRef?.current;
    if (imageListElem && slideDirection === 'left') {
      console.log('Sliding left.....');
      console.log(slide);
      if (slide === 1) imageListElem.style.transform = `translateX(0)`;
      else
        imageListElem.style.transform = `translateX(-${
          (slide - 1) * posterWidthTotal
        }px)`;
    }

    if (imageListElem && slideDirection === 'right') {
      console.log('Sliding right....');
      console.log(slide);
      console.log(numOfSlides);
      if (numOfSlides && slide <= numOfSlides)
        imageListElem.style.transform = `translateX(-${
          (slide - 1) * posterWidthTotal
        }px)`;
    }
  }, [slide, slideDirection, posterWidthTotal, numOfSlides]);

  const updateContainerAndSlide = () => {
    let slideContainer = imageContainerRef?.current;
    if (slideContainer) {
      setWidthSlideContainer(slideContainer.clientWidth);
      setSlideMoves(Math.trunc(widthSlideContainer / posterWidthTotal));
    }
  };

  useLayoutEffect(() => {
    updateContainerAndSlide();
    console.log(widthSlideContainer);
    console.log(slideMoves);
  });

  useLayoutEffect(() => {
    window.addEventListener('resize', updateContainerAndSlide);
    return () => {
      window.removeEventListener('resize', updateContainerAndSlide);
    };
  }, []);

  //   useEffect(() => {
  //     window.addEventListener('click', (e: globalThis.MouseEvent) =>
  //       handleArrowClick(e, 'left')
  //     );
  //     return () => {
  //       window.removeEventListener('click', (e: globalThis.MouseEvent) =>
  //         handleArrowClick(e, 'left')
  //       );
  //     };
  //   }, []);
  //========================

  // Use RTK to fetch data and comment out top line.
  useEffect(() => {
    // console.log(moviesObj);
    // console.log(mediaArray);
    // console.log(categoryName);
    // fetch if no local storage
    if (movieArray.length === 0) {
      // This will prevent unnecessary renders
      // console.log(mediaArray);
      const fetchAndUpdate = async function () {
        console.log(mediaReqUrl);
        // dispatch(updateCurrentCategory(mediaReqUrl));

        let results: any = await dispatch(
          fetchTrendingMovies({
            url: mediaReqUrl,
            category: categoryName as MediaCategories,
          })
        ); // ???
        console.log(results);
        // if (typeof results !== 'undefined') {
        //   setMedia(results?.arrayMovies);
        //   setNumOfSlides(results?.arrayMovies?.length);
        // }
      };
      fetchAndUpdate();
    }
  }, [movieArray, categoryName, mediaReqUrl, dispatch]);

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
          {formatCategoryName()}
        </Typography>
        <IconButton
          size="large"
          sx={{
            position: 'absolute',
            left: '.25rem',
            top: '50%',
            transform: 'translate(25%, -50%)',
            zIndex: '100',
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
          {movieArray.map((item: MediaProps, index: number) => (
            //console.log(item)
            <MediaCard key={index} item={item} />
          ))}
        </ImageList>

        <IconButton
          size="large"
          sx={{
            position: 'absolute',
            right: '.25rem',
            top: '50%',
            transform: 'translate(-25%, -50%)',
            zIndex: '100',
            color: 'white',
          }}
          onClick={(e) => handleArrowClick(e, 'right')}
          // onClick={(e) => console.log('I clicked the right button')}
        >
          <ArrowCircleRightIcon sx={{ fontSize: '3rem' }} />
        </IconButton>
      </Box>
    </Fragment>
  );
}
