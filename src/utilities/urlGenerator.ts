import { MediaTypeProps, MediaTimeWindowProps } from '../shared/types';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';

export const prependImagePath = 'https://www.themoviedb.org/t/p/w342';

// 🌟🌟🌟Media details with appended responses
export const mediaUrl = (
  mediaType: MediaTypeProps,
  mediaId: number
): string => {
  const pathParam = `${mediaType}/${mediaId}`;
  const queryParam = 'videos,images,credits,release_dates';
  // combine sub requests to get appended responses
  let url = `${baseUrl}/${pathParam}?api_key=f6d42c2d1af1e3290b133c7d6f7ee495&append_to_response=${queryParam}`;
  return url;
};

// Trending (day & week)
export const mediaTrendingUrl = (
  mediaType: MediaTypeProps,
  timeWindow: MediaTimeWindowProps
): string => {
  const pathParam = `trending/${mediaType}/${timeWindow}`; // popular | trending/all/day | top-rated
  let url = `${baseUrl}/${pathParam}?api_key=f6d42c2d1af1e3290b133c7d6f7ee495`;
  return url;
};

// Top rated (all time)
export const mediaTopRatedUrl = (mediaType: MediaTypeProps): string => {
  const pathParam = `${mediaType}/top_rated`; // popular | trending/all/day | top-rated
  let url = `${baseUrl}/${pathParam}?api_key=f6d42c2d1af1e3290b133c7d6f7ee495&language=en-US&page=1`;
  return url;
};

// Popular (updated daily)
export const mediaPopularUrl = (mediaType: MediaTypeProps): string => {
  const pathParam = `${mediaType}/popular`; // popular | trending/all/day | top-rated
  let url = `${baseUrl}/${pathParam}?api_key=f6d42c2d1af1e3290b133c7d6f7ee495&language=en-US&page=1`;
  return url;
};

// Upcoming (theaters)
export const mediaUpcomingUrl = (mediaType: MediaTypeProps): string => {
  const pathParam = `${mediaType}/upcoming`; // popular | trending/all/day | top-rated
  let url = `${baseUrl}/${pathParam}?api_key=f6d42c2d1af1e3290b133c7d6f7ee495&language=en-US&page=1`;
  return url;
};

// Media details
export const mediaDetailsUrl = (
  mediaType: MediaTypeProps,
  mediaId: number
): string => {
  const pathParam = `${mediaType}/${mediaId}`;
  let url = `${baseUrl}/${pathParam}?api_key=${API_KEY}&language=en-US`;
  return url;
};

// Casts
export const castsUrl = (
  mediaType: MediaTypeProps,
  mediaId: number
): string => {
  const pathParam = `${mediaType}/${mediaId}/credits`;
  let url = `${baseUrl}/${pathParam}?api_key=${API_KEY}&language=en-US`;
  return url;
};

// Ratings: PG13, R, ...
export const ratingsUrl = (
  mediaType: MediaTypeProps,
  mediaId: number
): string => {
  const pathParam = `${mediaType}/${mediaId}/release_dates`;
  let url = `${baseUrl}/${pathParam}?api_key=${API_KEY}`;
  return url;
};

// Trailers(Youtube)
export const videosUrl = (
  mediaType: MediaTypeProps,
  mediaId: number
): string => {
  const pathParam = `${mediaType}/${mediaId}/videos`;
  let url = `${baseUrl}/${pathParam}?api_key=${API_KEY}&language=en-US`;
  return url;
};

// Images(Posters, Backdrops & Logos)
// todo: Get logos to add to backdrop; do this later.
export const imagesUrl = (
  mediaType: MediaTypeProps,
  mediaId: number
): string => {
  const pathParam = `${mediaType}/${mediaId}/images`;
  let url = `${baseUrl}/${pathParam}?api_key=${API_KEY}&language=en-US&include_image_language=en,null`;
  return url;
};

// let posterPath = 'https://www.themoviedb.org/t/p/w220_and_h330_face/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg';

// export const prependImagePath =
//   'https://www.themoviedb.org/t/p/w220_and_h330_face';

// https://www.themoviedb.org/t/p/w500/w8LBnUgKpK6oiqw87gHSiHgGKRE.png

// 🌟todo: create function that takes in media id and media name and returns
// the appropriate url for media details
export const mediaDetailsPageUrl = (
  mediaTitle: string,
  mediaId: number
): string => {
  const indexOfColon = mediaTitle.indexOf(':');
  let titleWithoutColon =
    indexOfColon === -1
      ? mediaTitle
      : mediaTitle.slice(0, indexOfColon) + mediaTitle.slice(indexOfColon + 1);
  let formatTitle = titleWithoutColon.split(' ').join('-');
  console.log(formatTitle);
  return `/${formatTitle}/${mediaId}`;
};
