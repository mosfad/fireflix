import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import ImageListItem from '@mui/material/ImageListItem';
import { prependImagePath } from '../utilities/urlGenerator';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { MediaDetailsProps } from '../shared/types';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Typography from '@mui/material/Typography';
import LoadingSpinner from './LoadingSpinner';
import './Media.css';
import { containerClasses } from '@mui/material';
import { MediaFacts } from './MediaFacts';
import { CastCarousel } from './CastCarousel';

export const MediaDetails = ({
  media,
}: {
  media: MediaDetailsProps; // https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/mBJ995JUssgh2hhm4JxNj8hyVVM.jpg
}) => {
  return (
    <div>
      <Grid container direction="column" sx={{ maxWidth: '100%' }}>
        <Grid
          item
          sx={{ flexBasis: '760px', marginBottom: '3rem', textAlign: 'left' }}
        >
          <img
            src={`https://www.themoviedb.org/t/p/w1280${media?.backdropPath}`}
            // srcSet={`${prependImagePath}${media?.poster}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={media?.title}
            loading="lazy"
            style={{
              // objectFit: 'contain',
              marginTop: '5rem',
              borderRadius: '2rem',
              //height: '550px',
            }}
            className="media-details__image--backdrop"
          />
        </Grid>
        <Grid item sx={{ marginBottom: '.5rem' }}>
          <Typography
            variant="h5"
            component="h3"
            align="left"
            sx={{
              color: 'white',
              fontFamily: 'Merriweather Sans, sans-serif',
              letterSpacing: '1px',
            }}
          >
            {media.title}
          </Typography>
        </Grid>
        <Grid item sx={{ marginBottom: '.5rem' }}>
          <MediaFacts
            genres={null}
            runtime={media.runtime}
            mediaRatings={media.ratingsMedia}
            release={media.releaseDate}
          ></MediaFacts>
        </Grid>
        <Grid item>
          <MediaFacts
            genres={media.genre}
            runtime={null}
            mediaRatings={null}
            release={null}
          ></MediaFacts>
        </Grid>
        <Grid item>
          <Box
            sx={{
              borderRadius: '.5rem',
              backgroundColor: '#8080803d',
              color: 'white',
              textAlign: 'left',
              padding: '2rem',
              margin: '2rem 0',
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="h4"
              align="left"
              sx={{
                color: 'white',
                letterSpacing: '1px',
              }}
            >
              Summary
            </Typography>
            <Typography
              sx={{
                color: 'white',
                letterSpacing: '1px',
              }}
            >
              {media.summary}
            </Typography>
          </Box>
        </Grid>
        <Grid item sx={{ marginBottom: '.5rem' }}>
          <Typography color="primary" variant="h5" component="h6">
            <CastCarousel cast={media.actors} />
          </Typography>
        </Grid>
      </Grid>
      {/* <img
            src={`https://www.themoviedb.org/t/p/w1280${media?.backdropPath}`}
            // srcSet={`${prependImagePath}${media?.poster}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={media?.title}
            loading="lazy"
            style={{ objectFit: 'contain' }}
            className="media-details__image--backdrop"
          /> */}
    </div>
  );
};

// type MovieProps = {
//   title: string;
//   poster: string;
//   // id: number;
//   //   media_type: string;
//   //   original_language: string;
//   //   release_date: string;
//   //   vote_average: number;
//   //   vote_count: number;
// } | null;

// export const MediaDetails = ({ item }: { item: MovieProps }) => {
//   return (
//     <ImageListItem className="media-card__item" sx={{ position: 'relative' }}>
//       <img
//         src={`${prependImagePath}${item?.poster}`}
//         // srcSet={`${prependImagePath}${item?.poster}?w=248&fit=crop&auto=format&dpr=2 2x`}
//         alt={item?.title}
//         loading="lazy"
//         style={{ borderRadius: '1rem' }}
//         className="fav-item__image"
//       />
//       <IconButton
//         className="media-card__btn--expand"
//         sx={{
//           color: 'white',
//           opacity: '.85',
//           position: 'relative',
//           top: '-2rem',
//           // bottom: '1rem',
//         }}
//       >
//         <ExpandMoreIcon sx={{ fontSize: '2.2rem' }} />
//       </IconButton>
//       <IconButton
//         className="media-card__btn--favorite"
//         sx={{
//           color: 'white',
//           opacity: '.85',
//           width: '3rem',
//           position: 'relative',
//           display: 'inline-block',
//           // justifyContent: 'flex-end',
//           top: '-18rem',
//           left: '7rem',
//           // bottom: '5rem',
//           // right: '0',
//         }}
//       >
//         <FavoriteBorderIcon
//           sx={{
//             fontSize: '1.6rem',
//           }}
//         />
//       </IconButton>
//       <Typography
//         align="left"
//         sx={{ color: '#eee', position: 'relative', top: '-5rem' }}
//       >
//         {item?.title}
//       </Typography>
//     </ImageListItem>
//   );
// };

//w=248
