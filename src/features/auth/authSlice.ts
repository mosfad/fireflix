import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  signoutUser,
  signinUser,
  createUser,
  updateUserProfile,
} from '../../services/authServices';
import { AppUser, ErrorProps } from '../../shared/types';
// import { User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

type LoginData = {
  email: string;
  password: string;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
};

type ProfileData = {
  name: string;
  photoUrl: string;
};

type AuthState = {
  user: AppUser | null;
  isLoggedin: boolean;
  isAuthenticating: boolean;
  error: ErrorProps | null;
};

// register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (signupData: SignupData, thunkAPI) => {
    const { name, email, password } = signupData;
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await createUser(email, password, name);
      console.log(authResponse);
      if (isErrorResponse(authResponse))
        return thunkAPI.rejectWithValue(authResponse);
      return authResponse;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// fetch user
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (loginData: LoginData, { rejectWithValue }) => {
    const { email, password } = loginData;
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await signinUser(email, password);
      console.log(typeof authResponse);
      // ret
      if (isErrorResponse(authResponse)) return rejectWithValue(authResponse);
      return authResponse;
    } catch (err) {
      // return rejectWithValue(err.user)
      return rejectWithValue(err);
    }
  }
);

// update profile
export const updateProfileUser = createAsyncThunk(
  'auth/updateProfileUser',
  async (profileData: ProfileData, thunkAPI) => {
    const { name, photoUrl } = profileData;
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await updateUserProfile(name, photoUrl);
      console.log(typeof authResponse);
      // return type is Promise<void | ErrorProps>
      if (isErrorResponse(authResponse))
        return thunkAPI.rejectWithValue(authResponse);
      return authResponse;
    } catch (err) {
      // return rejectWithValue(err.user)
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// sign out user
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await signoutUser();
  } catch (err) {
    return err;
  }
});

const initialState: AuthState = {
  user: null,
  isLoggedin: false,
  isAuthenticating: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateLoginStatus: (state, action) => {
      state.isLoggedin = action.payload;
    },
    updateDisplayName: (state, action) => {
      if (state.user) {
        state.user.displayName = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.isAuthenticating = true;
      })
      .addCase(registerUser.fulfilled, (state, action: any) => {
        state.isAuthenticating = false;
        state.isLoggedin = true;
        // state.user = action.payload; // type coercion???
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.isAuthenticating = false;
        state.error = action.payload; // type coercion???
      })
      .addCase(fetchUser.pending, (state, action) => {
        state.isAuthenticating = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: any) => {
        // redo this!!
        state.isAuthenticating = false;
        state.isLoggedin = true;
        state.user = action.payload; // type coercion???
      })
      .addCase(fetchUser.rejected, (state, action: any) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedin = false;
        state.user = null;
      });
  },
});

export const { updateUser, updateLoginStatus, updateDisplayName } =
  authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectLoginStatus = (state: RootState) => state.auth.isLoggedin;

export const selectAuthStatus = (state: RootState) =>
  state.auth.isAuthenticating;

export default authSlice.reducer;
