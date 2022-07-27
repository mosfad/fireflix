import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  MouseEvent,
} from 'react';
import {
  ActorProps,
  ArrowClickProps,
  // SlideDirectionProps,
} from '../shared/types';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { ImageList } from '@mui/material';
import { CastCard } from './CastCard';
import { checkPrime } from 'crypto';

export const CastCarousel = ({ cast }: { cast: ActorProps[] }) => {
  const imageRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const posterWidth = 148;
  const gapBtwPosters = 32;
  const paddingLeftRight = 64; // subtract from container width!!!

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [slide, setSlide] = useState<number>(1);
  const [slideMoves, setSlideMoves] = useState<number>(1);
  const [numOfSlides, setNumOfSlides] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] =
    useState<ArrowClickProps>(undefined);
  const [posterWidthTotal, setPosterWidthTotal] = useState<number>(
    posterWidth + gapBtwPosters
  );

  const moveSlides = (
    listElem: HTMLUListElement | null,
    direction: ArrowClickProps
  ) => {
    if (!listElem || !direction || !numOfSlides) return;
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
    const imageList = imageRef?.current;
    if (!imageList) return;
    setSlideDirection(direction);
    moveSlides(imageList, direction);
  };

  const updateContainerAndSlide = () => {
    let imageContainer = containerRef?.current;
    if (imageContainer) {
      console.log(imageContainer);
      setContainerWidth(imageContainer.clientWidth);
      // console.log(
      //   `container width: ${imageContainer.clientWidth}  poster width: ${posterWidthTotal}`
      // );
      // console.log(imageContainer);
      setSlideMoves(
        Math.trunc((containerWidth - paddingLeftRight) / posterWidthTotal)
      );
    }
  };

  useLayoutEffect(() => {
    updateContainerAndSlide();
    console.log(containerWidth);
    console.log(slideMoves);
  });

  useLayoutEffect(() => {
    window.addEventListener('resize', updateContainerAndSlide);
    return () => {
      window.removeEventListener('resize', updateContainerAndSlide);
    };
  }, []);

  // update number of slides when cast array isn't empty
  useEffect(() => {
    if (cast.length > 0) {
      setNumOfSlides(cast.length);
    }
  }, [cast.length]);

  useEffect(() => {
    let imageElemList = imageRef?.current;
    if (imageElemList && slideDirection === 'left') {
      if (slide === 1) imageElemList.style.transform = `translateX(0)`;
      else
        imageElemList.style.transform = `translateX(-${
          (slide - 1) * posterWidthTotal
        }px)`;
    }

    if (imageElemList && slideDirection === 'right') {
      if (numOfSlides && slide <= numOfSlides)
        imageElemList.style.transform = `translateX(-${
          (slide - 1) * posterWidthTotal
        }px)`;
    }
  }, [slide, slideDirection, posterWidthTotal, numOfSlides]);
  // const carouselContainer =
  return (
    <>
      <Box
        className="media-menu__container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          position: 'relative',
          padding: '0 2rem ', //
          maxWidth: '1280px', // Very important; child should be 100% of this!!!
          boxSizing: 'border-box', // Very important; forces width + padding + border of carousel container within column width set in <MediaDetailsPage/>
          minHeight: '16rem', // affects height of container & its children.
          marginBottom: '4rem',
          marginTop: '0.5rem', //
          backgroundColor: '#303030',
          borderRadius: '1rem',
        }}
        ref={containerRef}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
            minHeight: '100%',

            left: '0',
            zIndex: '110',
            backgroundColor: '#3a3a3c',
            paddingLeft: '.25rem',
            paddingRight: '.25rem',
            borderTopLeftRadius: '1rem 1rem',
            borderBottomLeftRadius: '1rem 1rem',
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              // position: 'absolute',
              // top: '50%',
              // left: '0',
              // zIndex: '100',
              // transform: 'translate(0, -50%)',
              // opacity: '.8',
            }}
            onClick={(e) => handleArrowClick(e, 'left')}
          >
            <ArrowCircleLeftIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>

        <ImageList
          component="ul"
          className="media-card__menu media-card__menu--cast"
          sx={{
            gridAutoFlow: 'column',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(148px, 1fr)) !important',
            gridTemplateRows: 'minmax(200px, 1fr)',
            gridAutoColumns: 'minmax(148px, 1fr)',
            mt: 2,
            mb: 2,
            overflowY: 'visible', //Removes `overflow-y: 'auto'` from MUI
            // flexBasis: '978px',
            // maxWidth: '1100px', // Reducing maxWidth from actual image width...
            maxWidth: '100%', // Very important; 100% of parent width(i.e container)
            // causes more the full image to render, an uexpected outcome...
            // investigate why this happens!!!
            // minWidth: '960px',

            marginBottom: '2rem',
            marginLeft: '3rem', //why????
          }}
          gap={32}
          rowHeight={4} //?
          ref={imageRef}
        >
          {cast
            .filter((actor: ActorProps) => actor.profilePath !== null)
            .map((actor: ActorProps, index: number) => (
              <CastCard key={index} cast={actor} />
            ))}
        </ImageList>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            position: 'absolute',
            right: '0',
            backgroundColor: '#3a3a3c',
            minHeight: '100%',
            zIndex: '110',
            paddingLeft: '.25rem',
            paddingRight: '.25rem',
            borderTopRightRadius: '1rem 1rem',
            borderBottomRightRadius: '1rem 1rem',
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              // position: 'absolute',
              // top: '50%',
              // right: '0',
              // zIndex: '100'
              // transform: 'translate(0, -50%)',
              // opacity: '.8',
            }}
            onClick={(e) => handleArrowClick(e, 'right')}
          >
            <ArrowCircleRightIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

// type ActorProps = {
//     id: number;
//     name: string;
//     profilePath: string;
//     character: string;
//   };
