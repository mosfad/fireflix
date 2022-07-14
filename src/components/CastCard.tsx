import { useState, useEffect } from 'react';
import { ActorProps } from '../shared/types';
import { prependImagePath } from '../utilities/urlGenerator';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';

export const CastCard = ({ cast }: { cast: ActorProps }) => {
  return (
    <ImageListItem sx={{ position: 'relative' }}>
      <img
        src={`${prependImagePath}${cast?.profilePath}?w=248&fit=crop&auto=format`}
        srcSet={`${prependImagePath}${cast?.profilePath}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={cast?.name}
        loading="lazy"
        style={{ borderRadius: '1rem' }}
        className="media-item__image" //
      />
      <Typography
        align="left"
        sx={{ color: '#eee', position: 'relative', top: '-5rem' }}
      >
        {cast?.name}
      </Typography>
      <Typography
        align="left"
        sx={{ color: '#eee', position: 'relative', top: '-5rem' }}
      >
        {cast?.character}
      </Typography>
    </ImageListItem>
  );
};
