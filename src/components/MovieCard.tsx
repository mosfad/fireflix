import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { prependImagePath } from '../utilities/urlGenerator';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

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

type MovieProps = {
  id: number;
  title: string;
  poster_path: string;
  media_type: string;
  original_language: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
} | null;

type ItemProps = {
  item: MovieProps;
};

export const MovieCard = ({ item }: ItemProps) => {
  return (
    <ImageListItem>
      <img
        src={`${prependImagePath}${item?.poster_path}?w=248&fit=crop&auto=format`}
        srcSet={`${prependImagePath}${item?.poster_path}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item?.title}
        loading="lazy"
        style={{ borderRadius: '1rem' }}
      />
    </ImageListItem>
  );
};

// export const MovieCard = ({ item }: MovieProps) => {
//   return (
//     <ImageListItem key={item.img}>
//       <img
//         src={`${item.img}?w=248&fit=crop&auto=format`}
//         srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
//         alt={item.title}
//         loading="lazy"
//         style={{ borderRadius: '1rem' }}
//       />
//       <ImageListItemBar
//         title={item.title}
//         subtitle={item.author}
//         actionIcon={
//           <IconButton
//             sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
//             aria-label={`info about ${item.title}`}
//           >
//             <InfoIcon />
//           </IconButton>
//         }
//         sx={{
//           borderBottomLeftRadius: '1rem',
//           borderBottomRightRadius: '1rem',
//         }}
//       />
//     </ImageListItem>
//   );
// };
