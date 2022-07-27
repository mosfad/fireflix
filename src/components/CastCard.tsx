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
        className="media-item__image media-item__image--cast" //
      />
      <Typography
        align="center"
        sx={{
          color: '#eee',
          position: 'absolute',
          top: '0rem',
          backgroundColor: '#00000057',
          letterSpacing: '1px',
          width: '100%',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem',
        }}
        className="media-item__text--name"
      >
        {cast?.name}
      </Typography>
      <Typography
        align="center"
        sx={{
          color: '#efefef',
          position: 'absolute',
          top: '11.1rem',
          //marginTop: '1rem',
          backgroundColor: '#000000c2',
          fontWeight: '500',
          letterSpacing: '1px',
          width: '100%',
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
          height: '2.75rem',
          // padding: '.25rem 0rem',
        }}
        className="media-item__text--character"
      >
        {cast?.character}
      </Typography>
    </ImageListItem>
  );
};
