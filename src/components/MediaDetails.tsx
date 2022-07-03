import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { prependImagePath } from '../utilities/urlGenerator';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';

import './Media.css';

type MovieProps = {
  title: string;
  poster: string;
  // id: number;
  //   media_type: string;
  //   original_language: string;
  //   release_date: string;
  //   vote_average: number;
  //   vote_count: number;
} | null;

export const MediaDetails = ({ item }: { item: MovieProps }) => {
  return (
    <ImageListItem className="media-card__item" sx={{ position: 'relative' }}>
      <img
        src={`${prependImagePath}${item?.poster}`}
        // srcSet={`${prependImagePath}${item?.poster}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item?.title}
        loading="lazy"
        style={{ borderRadius: '1rem' }}
        className="fav-item__image"
      />
      <IconButton
        className="media-card__btn--expand"
        sx={{
          color: 'white',
          opacity: '.85',
          position: 'relative',
          top: '-2rem',
          // bottom: '1rem',
        }}
      >
        <ExpandMoreIcon sx={{ fontSize: '2.2rem' }} />
      </IconButton>
      <IconButton
        className="media-card__btn--favorite"
        sx={{
          color: 'white',
          opacity: '.85',
          width: '3rem',
          position: 'relative',
          display: 'inline-block',
          // justifyContent: 'flex-end',
          top: '-18rem',
          left: '7rem',
          // bottom: '5rem',
          // right: '0',
        }}
      >
        <FavoriteBorderIcon
          sx={{
            fontSize: '1.6rem',
          }}
        />
      </IconButton>
      <Typography
        align="left"
        sx={{ color: '#eee', position: 'relative', top: '-5rem' }}
      >
        {item?.title}
      </Typography>
    </ImageListItem>
  );
};

//w=248
