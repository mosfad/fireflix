import {
  useState,
  useEffect,
  Fragment,
  useRef,
  useLayoutEffect,
  MouseEvent,
} from "react";
// import { MovieCard } from './MovieCard';
import ImageList from "@mui/material/ImageList";
// import { useLocalStorage } from '../hooks/useLocalStorage';
import { mediaTrendingUrl } from "../utilities/urlGenerator";
import axios from "axios";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import useFetch from "../hooks/useFetch";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectLoginStatus, selectAuthUser } from "../features/auth/authSlice";
import { selectFavorites } from "../features/favorites/favoritesSlice";
//import { getUserDB, getUserFav } from "../services/databaseServices";
import { fetchFavorites } from "../features/favorites/favoritesSlice";
import LoadingSpinner from "./LoadingSpinner";
import { FavoriteCard } from "./FavoriteCard";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import "./Media.css";
import { current } from "@reduxjs/toolkit";
import { AnyNsRecord } from "dns";
import { MediaProps } from "../shared/types";

// utility function to handle type issues
// with `Error`
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error); //stringify error.
}
type MoviePropsArray =
  | {
      id: number;
      title: string;
      posterPath: string;
      mediaType: "movies" | "tv";
      // id: number;
      //   media_type: string;
      //   original_language: string;
      //   release_date: string;
      //   vote_average: number;
      //   vote_count: number;
    }[]
  | null;

type SlideDirectionProps = "left" | "right" | "up" | "down" | undefined;
type ArrowClickProps = "left" | "right" | undefined;
type ImageListPositionProps = number | null;

export default function FavoriteMedia() {
  const imageRef = useRef<HTMLUListElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const isLoggedin = useAppSelector((state) => selectLoginStatus(state));
  const user = useAppSelector((state) => selectAuthUser(state));
  const favorites = useAppSelector((state) => selectFavorites(state));
  //   const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  const userId = user?.uid; // TODO: REUSABLE.....
  //  const [url, setUrl] = useState(movieTrendingUrl);
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
    if (direction === "left") {
      if (slide > slideMoves) {
        setSlide((prevSlide) => prevSlide - slideMoves);
      } else {
        setSlide(1);
      }
    }
    if (direction === "right") {
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
    if (imageListElem && slideDirection === "left") {
      if (slide === 1) imageListElem.style.transform = `translateX(0)`;
      else
        imageListElem.style.transform = `translateX(-${
          (slide - 1) * posterWidth
        }px)`;
    }

    if (imageListElem && slideDirection === "right") {
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
    window.addEventListener("resize", updateContainerAndSlide);
    return () => {
      window.removeEventListener("resize", updateContainerAndSlide);
    };
  }, []);

  // Use RTK to fetch data and comment out top line.
  //TO DO: REVIEW THIS CODE! THINK ABOUT PREVENTING UNNECESSARY
  // NETWORK REQUESTS.
  let favoritesLength = favorites.length;
  // let mediaLength = media === null ? 0 : media.length;

  /*useEffect(() => {
    if (favoritesLength > 0) {
      setMedia(favorites);
    }
    //console.log(userId);
    //console.log(favorites);
  }, []);*/

  useEffect(() => {
    const fetchFavoritesMedia = async () => {
      if (userId) {
        await dispatch(fetchFavorites(userId));
      }
    };

    if (favoritesLength > 0) {
      setNumOfSlides(favoritesLength);
    } else {
      fetchFavoritesMedia();
    }
  }, [userId, favoritesLength]);

  /*
  useEffect(() => {
    // To do: Change to getFavorites dispatch....
    const fetchFavoritesMedia = async () => {
      if (userId && mediaLength === 0) {
        let response = await dispatch(fetchFavorites(userId));
        console.log(response);
        if (typeof response !== "undefined") {
          //setMedia(response as any);
          setMedia(response.payload as MediaProps[]);
          console.log(favorites); // removve this to see what happens!!!!!
          console.log(media);
          //setNumOfSlides(response.length);
        }
      }
    };
    // Prevent unnecessary requests to DB.
    if (favoritesLength === 0) {
      fetchFavoritesMedia();
    }
  }, [userId]);*/

  return favoritesLength === 0 ? (
    <div>
      <LoadingSpinner />
    </div>
  ) : (
    <Fragment>
      <Box
        className="fav-menu"
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          position: "relative",
          padding: "0 2rem ",
          minHeight: "28rem",
          marginBottom: "0.5rem", //was 4rem
          marginTop: "0.5rem", //
        }}
        ref={imageContainerRef}
      >
        <Typography
          align="left"
          variant="subtitle1"
          component="h3"
          sx={{
            color: "white",
            //padding: '2rem 2rem 2rem 0rem',
            //marginBottom: '2rem',
            fontFamily: "Merriweather Sans, sans-serif",
            fontWeight: "700",
            fontSize: "1.5rem",
            letterSpacing: "3px",
            position: "absolute",
            top: "2rem", // was 0
          }}
        >
          Favorite Movies
        </Typography>
        <IconButton
          size="large"
          sx={{
            position: "absolute",
            left: "-1.75rem",
            top: "50%",
            transform: "translate(25%, -50%)",
            zIndex: "3000",
            color: "white",
          }}
          onClick={(e) => handleArrowClick(e, "left")}
        >
          <ArrowCircleLeftIcon /*fontSize="large"*/ sx={{ fontSize: "3rem" }} />
        </IconButton>

        <ImageList
          className="fav-menu media-card__menu"
          component="ul"
          sx={{
            gridAutoFlow: "column",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px,160px)) !important",
            gridAutoColumns: "minmax(160px, 160px)",
            gridTemplateRows: "minmax(240px, 240px)",
            mt: 2,
            mb: 2,
            overflowY: "visible", // ⚠️Add this CSS rule to remove  `overflow-y: 'auto'` from MUI.
          }}
          gap={32}
          rowHeight={4}
          //   cols={6}
          //   sx={{ padding: 4, marginTop: '4rem', height: '80%' }}
          ref={imageRef}
        >
          {favorites.map((item, index) => (
            //
            <FavoriteCard key={`media-${index}`} item={item} />
          ))}
        </ImageList>

        <IconButton
          size="large"
          sx={{
            position: "absolute",
            right: "-1.75rem",
            top: "50%",
            transform: "translate(-25%, -50%)",
            zIndex: "3000",
            color: "white",
          }}
          onClick={(e) => handleArrowClick(e, "right")}
        >
          <ArrowCircleRightIcon sx={{ fontSize: "3rem" }} />
        </IconButton>
      </Box>
    </Fragment>
  );
}

/*
<ImageList
          className="fav-menu media-card__menu"
          component="ul"
          sx={{
            gridAutoFlow: "column",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px,1fr)) !important",
            gridAutoColumns: "minmax(160px, 1fr)",
            gridTemplateRows: "minmax(240px, 1fr)",
            mt: 2,
            mb: 2,
            overflowY: "visible", // ⚠️Add this CSS rule to remove  `overflow-y: 'auto'` from MUI.
          }}
          gap={32}
          rowHeight={4}
          //   cols={6}
          //   sx={{ padding: 4, marginTop: '4rem', height: '80%' }}
          ref={imageRef}
        >
        */
