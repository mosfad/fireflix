export type AppUser = {
  displayName: string | null;
  email: string;
  uid: string;
  photoURL: string | null;
} | null;

export type ErrorProps = {
  code: string;
  message: string;
  success?: false;
};

export type TMDBErrorProps = {
  success: false;
};

export type TimeDelayProp = number;

export type MediaTypeProps = 'all' | 'movie' | 'tv' | 'person';
export type MediaTimeWindowProps = 'day' | 'week';

type GenreProps = {
  id: number;
  name: string;
};

type CastProps = {
  id: number;
  name: string;
  profile_path: string;
  character: string;
  known_for_department: string;
  order: number;
};

type CountryRatingsProp = {
  iso_31661_1: string;
  release_dates: {
    certification: string;
    iso_639_1: string;
    note: string;
    release_date: string;
    type: number;
  }[];
};

type VideoProps = {
  name: string;
  site: string;
  key: string;
  type: string;
  official: true;
  size: number;
};

export type MediaProps = {
  id: number;
  title: string;
  posterPath: string;
  mediaType: 'movie' | 'tv' | 'all' | 'person';
};

export type MediaDetailsProps = {
  id: number;
  title: string;
  posterPath: string;
  mediaType: 'movie' | 'tv' | 'all' | 'person';
  originalLanguage?: string;
  // genre: number[];
  genre: string[]; // Get Details -> genres[].name
  releaseDate: string;
  summary: string;
  language?: string;
  logo?: string; // Get Images -> logo[] -> file_path
  runtime: string; // Get Details -> runtime
  backdropPath: string; // `width = 1920`
  ratingsMedia: string; // Get Realease Dates -> iso_31661_1 === 'US' && relase_dates[0].certification.
  popularity: number;
  trailerYoutube: string; // Get Videos -> results[{ name: "official trailer", key: *trailer url}]
  cast: CastProps[]; // Get Credits ->
  voteAverage: number;
  voteCount: number;
};

export interface MovieDetailsProps extends MediaDetailsProps {
  mediaType: 'movie';
}
