import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';
import type { RootState } from '../../app/store';
import { addUserDB, getUserDB } from '../../services/databaseServices';
import { ErrorProps, MediaTypeProps } from '../../shared/types';

type UserState = {
  name: string | null;
  uid: string | null;
  email: string | null;
  mediaSelected: MediaTypeProps;
  createdAt: Timestamp | number | null; //timestamp
  loading: 'idle' | 'pending' | 'suceeded' | 'failed';
  error?: string | null;
};

type UserData = {
  name: string;
  email: string;
  uid: string;
};

export const addUserDatabase = createAsyncThunk(
  'users/addUserDatatbase',
  async (userData: UserData, thunkAPI) => {
    const { name, email, uid } = userData;
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const userInfoResponse = await addUserDB(name, email, uid);
      if (isErrorResponse(userInfoResponse))
        return thunkAPI.rejectWithValue(userInfoResponse);
      return userInfoResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserDatabase = createAsyncThunk(
  'users/getUserDatabase',
  async (userId: string, thunkAPI) => {
    try {
      const userInfoResponse = await getUserDB(userId);
      if (typeof userInfoResponse === 'undefined') {
        return thunkAPI.rejectWithValue('Document does not exist');
      }
      const { name, uid, email, createdAt } = userInfoResponse;
      return { name, uid, email, createdAt: createdAt.toMillis() };
    } catch (error) {
      return thunkAPI.rejectWithValue('Document does not exist');
    }
  }
);

const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId: number) => {
    return 'promise';
  }
);

interface UsersState {
  entities: [];
  loading: 'idle' | 'pending' | 'suceeded' | 'failed';
}

const initialState: UserState = {
  name: null,
  uid: null,
  email: null,
  mediaSelected: 'movie',
  createdAt: null,
  loading: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetLoggedoutUser: (state) => {
      state.name = null;
      state.uid = null;
      state.email = null;
      state.createdAt = null;
      state.loading = 'idle';
      state.error = null;
    },
    updateMediaTypeChosen: (state, action) => {
      state.mediaSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDatabase.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(getUserDatabase.fulfilled, (state, action: any) => {
        state.name = action.payload?.name;
        state.uid = action.payload?.uid;
        state.email = action.payload?.email;
        state.createdAt = action.payload?.createdAt;
        state.loading = 'suceeded';
      })
      .addCase(getUserDatabase.rejected, (state, action: any) => {
        state.loading = 'failed';
        state.error = action.payload?.error;
      })
      .addCase(addUserDatabase.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(addUserDatabase.fulfilled, (state, action: any) => {
        // state.name = action.payload?.name;
        // state.uid = action.payload?.uid;
        // state.email = action.payload?.email;
        // state.createdAt = action.payload?.createdAt;
        state.loading = 'suceeded';
      })
      .addCase(addUserDatabase.rejected, (state, action: any) => {
        state.loading = 'failed';
        state.error = action.payload?.error;
      })
      .addCase(fetchUserById.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        // state.entities = ???
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = 'failed';
        // state.error = action.error.message;
      });
  },
});

export const { resetLoggedoutUser, updateMediaTypeChosen } = usersSlice.actions;
export const selectUserName = (state: RootState) => state.users.name;

export const selectUserEmail = (state: RootState) => state.users.email;

export const selectUserId = (state: RootState) => state.users.uid;

export const selectMediaTypeChosen = (state: RootState) =>
  state.users.mediaSelected;

export default usersSlice.reducer;
