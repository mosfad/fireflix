import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movies/moviesSlice';
import usersReducer from '../features/users/usersSlice';
import authReducer from '../features/auth/authSlice';
import {
  getLocalStore,
  deleteLocalStoreTimeExpires,
} from '../utilities/localStorage';

const preloadedState = () => {
  // deleteLocalStoreTimeExpires('movies');
  // return getLocalStore('movies') ? { movies: getLocalStore('movies') } : null;
  return {
    movies: getLocalStore('movies') || {
      movies: [],
      favorites: [],
      status: 'idle',
      error: null,
    },
  };
};

const store = configureStore({
  reducer: {
    movies: moviesReducer,
    // shows: showsReducer,
    users: usersReducer,
    auth: authReducer,
  },
  preloadedState: preloadedState(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {movies: MoviesState, shows: ShowsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
