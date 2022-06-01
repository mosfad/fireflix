import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import axios from 'axios';
import { getLocalStore, saveLocalStore } from '../../utilities/localStorage';
// import { json } from 'stream/consumers';

// returns movie results from local storage
// const localStore = getLocalStore('movieResults')?.data?.results;

export const fetchAllMovies = createAsyncThunk(
  'movies/fetchAllMovies',
  async (url: string, thunkAPI) => {
    try {
      const response = await axios.get(url);
      // set local storage here if necessary
      console.log(response);
      if (response.data?.results) {
        saveLocalStore('movies', {
          movies: response.data?.results,
          favorites: [],
          status: 'idle',
          error: null,
        });
      }
      // console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  {
    condition: (url: string, { getState, extra }) => {
      const { movies } = getState() as {
        movies: MoviesState;
      };
      console.log(movies);
      console.log(typeof movies);
      if (movies.movies.length === 0) return true;
      return false;
    },
  }
);

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

type MovieDataProps = MovieProps[];

interface MoviesState {
  movies: MovieDataProps;
  favorites: string[];
  status: 'idle' | 'pending' | 'suceeded' | 'failed';
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  favorites: [],
  status: 'idle',
  error: null,
};

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
      .addCase(fetchAllMovies.pending, (state, action) => {
        state.status = 'pending';
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.status = 'idle';
        state.movies = [];
        console.log(action.payload?.results);
        state.movies.push(...action.payload?.results);
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
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
