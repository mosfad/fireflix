import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { prependImagePath } from '../utilities/urlGenerator';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

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

export const FavoriteCard = ({ item }: { item: MovieProps }) => {
  return (
    <ImageListItem>
      <img
        src={`${prependImagePath}${item?.poster}?w=248&fit=crop&auto=format`}
        srcSet={`${prependImagePath}${item?.poster}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item?.title}
        loading="lazy"
        style={{ borderRadius: '1rem' }}
      />
    </ImageListItem>
  );
};
