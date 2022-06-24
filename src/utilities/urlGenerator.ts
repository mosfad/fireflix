export const movieTrendingUrl = () => {
  const API_KEY = 'f6d42c2d1af1e3290b133c7d6f7ee495';
  const movieBaseUrl = 'https://api.themoviedb.org/3';
  const pathParam = 'trending/movie/day'; // popular | trending/all/day | top-rated
  let url = `${movieBaseUrl}/${pathParam}?api_key=${API_KEY}`;
  return url;
};

let posterPath =
  'https://www.themoviedb.org/t/p/w220_and_h330_face/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg';

// export const prependImagePath =
//   'https://www.themoviedb.org/t/p/w220_and_h330_face';

export const prependImagePath = 'https://www.themoviedb.org/t/p/w342';
