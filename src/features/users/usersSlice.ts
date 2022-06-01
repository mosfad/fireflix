import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

const initialState: UsersState = {
  entities: [],
  loading: 'idle',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default usersSlice.reducer;
