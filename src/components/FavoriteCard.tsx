import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { prependImagePath } from "../utilities/urlGenerator";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Typography from "@mui/material/Typography";

import "./Media.css";
import { MediaProps } from "../shared/types";

/*type MediaProps = {
  id: number;
  title: string;
  posterPath: string;
  mediaType: "movies" | "tv";
  //   media_type: string;
  //   original_language: string;
  //   release_date: string;
  //   vote_average: number;
  //   vote_count: number;
} | null;*/

export const FavoriteCard = ({ item }: { item: MediaProps }) => {
  return (
    <ImageListItem className="media-card__item" sx={{ position: "relative" }}>
      <img
        //src={`${prependImagePath}${item?.posterPath}`}
        src={`${prependImagePath}${item?.posterPath}?w=248&fit=crop&auto=format`}
        srcSet={`${prependImagePath}${item?.posterPath}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item?.title}
        loading="lazy"
        style={{ borderRadius: "1rem" }}
        className="fav-item__image"
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
        // NEED onClick button here....
      >
        <ExpandMoreIcon sx={{ fontSize: "2.2rem" }} />
      </IconButton>
      <IconButton
        className="media-card__btn--favorite"
        sx={{
          color: "white",
          opacity: ".85",
          width: "3rem",
          position: "relative",
          display: "inline-block",
          // justifyContent: 'flex-end',
          top: "-18rem",
          left: "7rem",
          // bottom: '5rem',
          // right: '0',
        }}
        // NEED onClick button here...
      >
        <FavoriteBorderIcon
          sx={{
            fontSize: "1.6rem",
          }}
        />
      </IconButton>
      <Typography
        align="left"
        sx={{ color: "#a29898", position: "relative", top: "-5rem" }}
      >
        {item?.title}
      </Typography>
      {/* <IconButton
        className="media-card__btn--expand"
        sx={{
          color: 'white',
          opacity: '.85',
          position: 'relative',
          bottom: '1rem',
        }}
      >
        <ExpandCircleDownIcon sx={{ fontSize: '2rem' }} />
      </IconButton> */}

      {/* <ImageListItemBar
        position="top"
        sx={{ backgroundColor: 'transparent' }}
        actionIcon={
          <IconButton sx={{ color: 'white', opacity: '.85' }}>
            <FavoriteIcon />
          </IconButton>
        }
        actionPosition="right"
      />
      <ImageListItemBar className="media-card__item-bar" /> */}
    </ImageListItem>
  );
};

//w=248
