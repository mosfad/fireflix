import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import axios from 'axios';

type CharacterProps = {
  [key: number]: {
    id: number;
    name: string;
  };
};
type CastProps = {
  [key: number]: {
    id: number;
    name: string;
    characters: CharacterProps;
  };
};

type PeopleState = {
  casts: CastProps[];
};

const initialState: PeopleState = {
  casts: [],
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    // getAllMovies: (state, action: PayloadAction<>) => {

    // },

    addCast: (state, action: PayloadAction<any>) => {
      state.casts.push(action.payload);
    },
    removeCast: (state, action: PayloadAction<any>) => {
      const castIndex = state.casts.findIndex(
        (cast) => Object.keys(cast)[0] === action.payload.id
      );
      // delete cast at `castIndex`
      state.casts.splice(castIndex, 1);
    },
  },
});

// Action creators generated for each reducer
export const { addCast, removeCast } = peopleSlice.actions;

export const selectCastById = (castId: number, state: RootState) => {
  const castIndex = state.people.casts.findIndex(
    (cast) => Number(Object.keys(cast)[0]) === castId
  );
  return state.people.casts[castIndex];
};

export const selectAllCast = (state: RootState) => state.people.casts;

export default peopleSlice.reducer;
