import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { Timestamp } from "firebase/firestore";
import {
  addFavoriteDB,
  deleteFavoriteDB,
  getFavoritesDB,
} from "../../services/databaseServices";
import { ErrorProps, MediaProps } from "../../shared/types";
import { userInfo } from "os";

type MediaResponse = {
  id: number;
  title: string;
  posterPath: string;
  mediaType: "movies" | "tv";
};

interface FavoriteState {
  favorites: MediaProps[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  status: "idle",
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (userId: string, thunkAPI) => {
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === "string";
    };
    try {
      const userInfoResponse = await getFavoritesDB(userId);
      /*if (typeof userInfoResponse === "undefined") {
        return thunkAPI.rejectWithValue("Document does not exist");
      }*/
      if (isErrorResponse(userInfoResponse)) {
        return thunkAPI.rejectWithValue(userInfoResponse);
      }
      console.log(userInfoResponse);
      return userInfoResponse;
      // const { id, title, posterPath, mediaType } = userInfoResponse;
      //return { name, uid, email, createdAt: createdAt.toMillis() };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (urlInfo: { url: string }, thunkAPI) => {}
);

export const deleteFavorite = createAsyncThunk(
  "favorites/deleteFavorite",
  async (urlInfo: { url: string }, thunkAPI) => {}
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        // TODO: handle error message....
      })
      .addCase(fetchFavorites.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        for (const fav of action.payload) {
          let index = state.favorites.findIndex((elem) => elem.id === fav.id);
          if (index === -1) state.favorites.push(fav);
        }

        // state.favorites.push(...action.payload);
      })
      .addCase(addFavorite.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = "failed";
        // TODO: handle error message....
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = "succeeded";
        // TODO: Complete code to update store here
        //state.favorites.push(action.payload);
      })
      .addCase(deleteFavorite.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.status = "failed";
        // TODO: handle error message....
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.status = "succeeded";
        // TODO: Complete code to update store here
        /*return {
          ...state,
          favorites: state.favorites.filter(
            (favorite) => favorite.id !== action.id
          ),
        };*/
      });
  },
});

export const selectFavorites = (state: RootState) => state.favorites.favorites;

export default favoritesSlice.reducer;
