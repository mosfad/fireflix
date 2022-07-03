import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import axios from 'axios';
import {
  TMDBErrorProps,
  MovieDetailsProps,
  MediaProps,
} from '../../shared/types';
import { getLocalStore, saveLocalStore } from '../../utilities/localStorage';
import { NumberSchema } from 'yup';
import { mediaUrl } from '../../utilities/urlGenerator';
// import { json } from 'stream/consumers';

// returns movie results from local storage
// const localStore = getLocalStore('movieResults')?.data?.results;

// {
//   condition: (url: string, { getState, extra }) => {
//     const {
//       movies: { movies },
//     } = getState() as {
//       movies: { movies: MovieDataProps };
//     };

//     if (!movies) return true;
//     return false;
//   },
// }
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

type MoviesResponse = {
  id: number;
  title: string;
  poster_path: string;
  media_type: string;
};

// type Movie = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: string;
//   original_language: string;
//   release_date: string;
//   vote_average: number;
//   vote_count: number;
// } | null;

//type MovieDataProps = Movie[];

interface MovieState {
  movies: MediaProps[];
  favorites: string[];
  status: 'idle' | 'pending' | 'suceeded' | 'failed';
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  favorites: [],
  status: 'idle',
  error: null,
};

// Todo: fetch only ids of trending movies.....
// fetch only ids -> for each id, get movie details***
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrendingMovies',
  async (url: string, thunkAPI) => {
    const isErrorResponse = (response: any): response is TMDBErrorProps => {
      console.log(response);
      return typeof response?.status_message === 'string';
    };
    try {
      const response = await axios.get(url);
      console.log(isErrorResponse(response));
      if (isErrorResponse(response)) return thunkAPI.rejectWithValue(response);
      const movies: MediaProps[] = response.data.results.map(
        (movie: MoviesResponse) => {
          const { id, title, poster_path, media_type } = movie;
          return {
            id,
            title,
            posterPath: poster_path,
            mediaType: media_type,
          };
        }
      );
      return movies;
    } catch (err) {
      console.log(err);
      thunkAPI.rejectWithValue(err);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (url: string, thunkAPI) => {
    // type guard function checks if response is an auth error
    // Create TMDB errorProps in types....!!!!!!
    const isErrorResponse = (response: any): response is TMDBErrorProps => {
      return response?.success === false;
    };
    try {
      const response = await axios.get(url);
      if (isErrorResponse(response)) return thunkAPI.rejectWithValue(response);
      // destructure & assign variables new names
      console.log(response);
      const results = response.data; // An object
      const {
        id,
        title,
        poster_path: posterPath,
        backdrop_path: backdropPath,
        media_type: mediaType,
        original_language: originalLanguage,
        release_date: releaseDate,
        overview: summary,
        popularity,
        vote_average: voteAverage,
        vote_count: voteCount,
        runtime,
      } = results;
      const genre: string[] = results.genres.map(
        (singleGenre: GenreProps) => singleGenre.name
      );
      // console.log(results.release_dates.results);
      const countryRatings: CountryRatingsProp =
        results.release_dates.results.find((country: CountryRatingsProp) => {
          // console.log(country);
          return Object.values(country).includes('US'); // why didn't `country.iso_3166_1 === 'US'` work?????...........
        });
      console.log(countryRatings);
      const ratingsMedia = countryRatings.release_dates[0].certification; // Tricky!!!!

      const trailerObj: VideoProps = results.videos.results.find(
        (videoObj: VideoProps) =>
          videoObj.name.includes('Official') &&
          videoObj.type === 'Trailer' &&
          videoObj.site === 'YouTube'
      );
      const trailer = trailerObj.key;

      // To do: casts.................................
      const actors: CastProps[] = results.credits.cast
        .filter(
          (cast: CastProps) =>
            cast.known_for_department === 'Acting' && cast.order < 30
        )
        .map((actor: CastProps) => {
          return {
            name: actor.name,
            profilePath: actor.profile_path,
            character: actor.character,
          };
        });
      const movieDetails = {
        id,
        title,
        posterPath,
        backdropPath,
        mediaType,
        originalLanguage,
        releaseDate,
        summary,
        runtime,
        genre,
        ratingsMedia,
        trailer,
        actors,
      };
      // //  set local storage here if necessary
      // console.log(response);
      // if (response.data?.results) {
      //   saveLocalStore('movies', {
      //     movies: response.data?.results,
      //     favorites: [],
      //     status: 'idle',
      //     error: null,
      //   });
      // }
      // console.log(response.data);
      return movieDetails;
    } catch (err) {
      console.log(err);
    }
  },
  {
    condition: (url: string, { getState, extra }) => {
      const { movies } = getState() as {
        movies: MovieState;
      };
      console.log(movies);
      console.log(typeof movies);
      if (movies.movies.length === 0) return true;
      return false;
    },
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // getAllMovies: (state, action: PayloadAction<>) => {

    // },

    addMovieFav: (state, action: PayloadAction<string>) => {
      state.favorites.push(action.payload);
    },
    removeMovieFav: (state, action: PayloadAction<string>) => {
      const movieIndex = state.favorites.findIndex(
        (fav) => fav === action.payload
      );
      // delete movie at `movieIndex`
      state.favorites.splice(movieIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action: any) => {
        state.status = 'idle';
        // state.movies = [];
        state.movies.push(action?.payload);
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })
      .addCase(fetchTrendingMovies.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action: any) => {
        state.status = 'suceeded';
        state.movies = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Action creators generated for each reducer
export const { addMovieFav, removeMovieFav } = moviesSlice.actions;

export const selectFavoriteMovies = (state: RootState) =>
  state.movies.favorites;

export const selectAllMovies = (state: RootState) => state.movies.movies;

export const selectMovieStatus = (state: RootState) => state.movies.status;

export default moviesSlice.reducer;

// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../../app/store';
// import axios from 'axios';
// import { getLocalStore, saveLocalStore } from '../../utilities/localStorage';
// // import { json } from 'stream/consumers';

// // returns movie results from local storage
// // const localStore = getLocalStore('movieResults')?.data?.results;

// export const fetchAllMovies = createAsyncThunk(
//   'movies/fetchAllMovies',
//   async (url: string, thunkAPI) => {
//     try {
//       const response = await axios.get(url);
//       // set local storage here if necessary
//       console.log(response);
//       if (response.data?.results) {
//         saveLocalStore('movies', {
//           movies: response.data?.results,
//           favorites: [],
//           status: 'idle',
//           error: null,
//         });
//       }
//       // console.log(response.data);
//       return response.data;
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   {
//     condition: (url: string, { getState, extra }) => {
//       const { movies } = getState() as {
//         movies: MoviesState;
//       };
//       console.log(movies);
//       console.log(typeof movies);
//       if (movies.movies.length === 0) return true;
//       return false;
//     },
//   }
// );

// // {
// //   condition: (url: string, { getState, extra }) => {
// //     const {
// //       movies: { movies },
// //     } = getState() as {
// //       movies: { movies: MovieDataProps };
// //     };

// //     if (!movies) return true;
// //     return false;
// //   },
// // }

// // type is for result from TMDB not Firestore!!!
// type MediaProps = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: 'movie' | 'tv' | 'all' | 'person';
//   original_language: string;
//   // genre: number[];
//   genre: string[]; // Get Details -> genres[].name
//   release_date: string;
//   summary: string;
//   language: string;
//   logo?: string; // Get Images -> logo[] -> file_path
//   runtime: string; // Get Details -> runtime
//   backdrop_path: string; // `width = 1920`
//   ratings_media: string; // Get Realease Dates -> iso_31661_1 === 'US' && relase_dates[0].certification.
//   popularity: number;
//   trailer_youtube: string; // Get Videos -> results[{ name: "official trailer", key: *trailer url}]
//   cast: number[]; // Get Credits ->
//   vote_average: number;
//   vote_count: number;
// };

// type Movie = {
//   id: number;
//   title: string;
//   poster_path: string;
//   media_type: string;
//   original_language: string;
//   release_date: string;
//   vote_average: number;
//   vote_count: number;
// } | null;

// type MovieDataProps = Movie[];

// interface MoviesState {
//   movies: MovieDataProps;
//   favorites: string[];
//   status: 'idle' | 'pending' | 'suceeded' | 'failed';
//   error: string | null;
// }

// const initialState: MoviesState = {
//   movies: [],
//   favorites: [],
//   status: 'idle',
//   error: null,
// };

// const moviesSlice = createSlice({
//   name: 'movies',
//   initialState,
//   reducers: {
//     // getAllMovies: (state, action: PayloadAction<>) => {

//     // },

//     addMovieFav: (state, action: PayloadAction<string>) => {
//       state.favorites.push(action.payload);
//     },
//     removeMovieFav: (state, action: PayloadAction<string>) => {
//       const movieIndex = state.favorites.findIndex(
//         (fav) => fav === action.payload
//       );
//       // delete movie at `movieIndex`
//       state.favorites.splice(movieIndex, 1);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllMovies.pending, (state, action) => {
//         state.status = 'pending';
//       })
//       .addCase(fetchAllMovies.fulfilled, (state, action) => {
//         state.status = 'idle';
//         state.movies = [];
//         console.log(action.payload?.results);
//         state.movies.push(...action.payload?.results);
//       })
//       .addCase(fetchAllMovies.rejected, (state, action) => {
//         // state.status = 'failed';
//         // state.error = action.payload;
//       });
//   },
// });

// // Action creators generated for each reducer
// export const { addMovieFav, removeMovieFav } = moviesSlice.actions;

// export const selectFavoriteMovies = (state: RootState) =>
//   state.movies.favorites;

// export const selectAllMovies = (state: RootState) => state.movies.movies;

// export const selectMovieStatus = (state: RootState) => state.movies.status;

// export default moviesSlice.reducer;

// export const fetchTrendingMovies = createAsyncThunk(
//   'movies/fetchTrendingMovies',
//   async (url: string, thunkAPI) => {
//     const isErrorResponse = (response: any): response is TMDBErrorProps => {
//       console.log(response);
//       return typeof response?.status_message === 'string';
//     };
//     try {
//       const response = await axios.get(url);
//       console.log(isErrorResponse(response));
//       if (isErrorResponse(response)) return thunkAPI.rejectWithValue(response);
//       const movieIds: number[] = response.data.results.map(
//         (movie: { id: number }) => {
//           return movie.id;
//         }
//       );
//       console.log(movieIds);
//       movieIds.forEach((id) => {
//         let mediaDetailsUrl = mediaUrl('movie', id);
//         thunkAPI.dispatch(fetchMovieDetails(mediaDetailsUrl));
//       });
//       return movieIds;
//     } catch (err) {
//       console.log(err);
//       thunkAPI.rejectWithValue(err);
//     }
//   }
// );
