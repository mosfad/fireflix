import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { MediaDetailsProps } from '../shared/types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { convertToHourMin, getYearOnly } from '../utilities/utilityFunctions';
import './Media.css';

export const MediaFacts = ({
  genres,
  runtime,
  mediaRatings,
  release,
}: {
  genres: string[] | null;
  runtime: string | null; // runtime should be a number!!!
  mediaRatings: string | null;
  release: string | null;
}) => {
  const renderGenres = () => {
    if (!genres) return;
    return genres.map((genre: string, index: number) => {
      return (
        <Grid item sx={{}} key={`${genre}${index}`}>
          <Chip
            label={genre}
            size="small"
            color="secondary"
            variant="outlined"
            sx={{
              color: 'white',
              marginRight: '.5rem',
              borderWidth: '1px',
              letterSpacing: '1px',
            }}
          />
        </Grid>
      );
    });
  };

  const renderMediaRatings = () => {
    if (!mediaRatings) return;
    return (
      <Grid item sx={{ marginRight: '.5rem' }}>
        <Chip
          label={mediaRatings}
          variant="outlined"
          size="small"
          sx={{
            color: 'white',

            borderWidth: '1px',
            borderRadius: '.25rem',
            borderColor: '#8e8e8e',
            letterSpacing: '1px',
          }}
        />
      </Grid>
    );
  };

  const renderRunTime = () => {
    if (!runtime) return;
    const formatRuntime = convertToHourMin(Number(runtime));
    return (
      <Grid item sx={{ marginRight: '.5rem' }}>
        <Chip
          label={formatRuntime}
          size="small"
          sx={{
            color: 'white',
            backgroundColor: '#80808052',
            borderWidth: '1px',
            borderRadius: '.25rem',
            borderColor: '#8e8e8e',
            letterSpacing: '1px',
          }}
        />
      </Grid>
    );
  };

  const renderReleaseYear = () => {
    if (!release) return;
    const year = getYearOnly(release);
    return (
      <Grid item sx={{ marginRight: '.5rem' }}>
        <Chip
          label={year}
          size="small"
          color="secondary"
          sx={{
            color: 'white',
            borderWidth: '1px',
            borderRadius: '.25rem',
            backgroundColor: '#80808052',
            letterSpacing: '1px',
            // borderColor: '#8e8e8e',
          }}
        />
      </Grid>
    );
  };

  return (
    <div>
      <Grid container direction="row" sx={{}}>
        <>
          {release ? renderReleaseYear() : ''}
          {runtime ? renderRunTime() : ''}
          {mediaRatings ? renderMediaRatings() : ''}

          {genres ? renderGenres() : ''}
        </>
      </Grid>
    </div>
  );
};
