import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  logoutUser,
  selectAuthUser,
  selectLoginStatus,
} from "../features/auth/authSlice";
import { updateMovieSelected } from "../features/movies/moviesSlice";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  prependImagePath,
  mediaDetailsPageUrl,
} from "../utilities/urlGenerator";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Typography from "@mui/material/Typography";

import { MediaProps } from "../shared/types";
import "./Media.css";
import { MediaDialog } from "./MediaDialog";
import { useNavigate } from "react-router-dom";
// type ItemProps = {
//   img: string;
//   title: string;
//   author: string;
// };

// type MovieProps = {
//   item: ItemProps;
// };
// type ItemProps = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: string;
//   original_language: string;
//   release_date: string;
//   vote_average: number;
//   vote_count: number;
// };

// type MovieProps = {
//   item: ItemProps;
// };

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

// type ItemProps = {
//   item: MovieProps;
// };

// export const MovieCard = ({ item }: ItemProps) => {

export const MediaCard = ({ item }: { item: MediaProps }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => selectAuthUser(state));
  const [open, setOpen] = useState(false);
  const [actionBtn, setActionBtn] = useState("none");

  //   const handleIconClick = () => {
  //     setOpen(true);
  //   };

  const handleFavIconClick = () => {
    // todo: Add media to favorites if `user` is logged in.
    setOpen(true);
    setActionBtn("favorite");
  };

  const handleMoreIconClick = () => {
    // todo: Display media details if `user` is logged in.
    // console.log(user);
    if (user) {
      // update current movie selected
      dispatch(updateMovieSelected(item.id));
      navigate(mediaDetailsPageUrl(item.title, item.id), { replace: true });
    }

    setOpen(true);
    setActionBtn("more");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ImageListItem className="media-card__item" sx={{ position: "relative" }}>
      <img
        src={`${prependImagePath}${item?.posterPath}?w=248&fit=crop&auto=format`}
        srcSet={`${prependImagePath}${item?.posterPath}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item?.title}
        loading="lazy"
        style={{ borderRadius: "1rem" }}
        className="media-item__image" //
      />
      <IconButton
        className="media-card__btn--expand"
        sx={{
          color: "white",
          opacity: ".85",
          position: "relative",
          top: "-2rem",
          // bottom: '1rem',
        }}
        onClick={handleMoreIconClick}
      >
        <ExpandMoreIcon sx={{ fontSize: "2.2rem" }} />
      </IconButton>
      <IconButton
        className="media-card__btn--favorite"
        sx={{
          color: "white",
          background: "rgba(0, 0, 1, 0.2)", //I am here!!!!
          width: "3rem",
          position: "relative",
          display: "inline-block",
          // justifyContent: 'flex-end',
          top: "-18rem",
          left: "7rem",
          // bottom: '5rem',
          // right: '0',
        }}
        onClick={handleFavIconClick}
      >
        <FavoriteBorderIcon
          sx={{
            fontSize: "1.6rem",
          }}
        />
      </IconButton>
      <MediaDialog
        closeDialog={handleClose}
        open={open}
        action={actionBtn}
        mediaType={item.mediaType}
      />
      <Typography
        align="left"
        sx={{ color: "#a29898", position: "relative", top: "-5rem" }} // was color: #eee
      >
        {item?.title}
      </Typography>
    </ImageListItem>
  );
};
