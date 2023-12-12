import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {
  signoutUser,
  signinUser,
  createUser,
  updateUserProfile,
  reauthenticateUserCred,
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
} from '../../services/authServices';
import { uploadPhoto } from '../../services/storageServices';
import { AppUser, ErrorProps } from '../../shared/types';
import { User as FirebaseUser } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

type LoginData = {
  currentUser?: FirebaseUser | null;
  email: string;
  password: string;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
};

type ProfileData = {
  currentUser: FirebaseUser | null;
  name: string;
  photoUrl: string;
};

type AuthState = {
  user: AppUser | null;
  isLoggedin: boolean;
  isAuthenticating: boolean;
  hasReauthenticated: boolean;
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

// upload photo
export const uploadPhotoUser = createAsyncThunk(
  'auth/uploadPhotoUser',
  async (imageFile: File, thunkAPI) => {
    try {
      // type guard function checks if response is an error message
      const isErrorResponse = (response: any): response is ErrorProps => {
        return typeof response?.message === 'string';
      };

      const authResponse = await uploadPhoto(imageFile); //"API call from storageServices goes here"
      console.log(authResponse);

      if (isErrorResponse(authResponse)) {
        return thunkAPI.rejectWithValue(authResponse);
      }

      return authResponse;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// update profile
export const updateProfileUser = createAsyncThunk(
  'auth/updateProfileUser',
  async (profileData: ProfileData, thunkAPI) => {
    const { currentUser, name, photoUrl } = profileData;
    // console.log(profileData);
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      console.log('Updating user profile in authSlice()', name, photoUrl);
      // console.log('In authSlice()', profileData.name, profileData.photoUrl);
      const authResponse = await updateUserProfile(currentUser, name, photoUrl);
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

// update email
export const updateEmailUser = createAsyncThunk(
  'auth/updateEmailUser',
  async (newEmail: string, thunkAPI) => {
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await updateUserEmail(newEmail);
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

// update password
export const updatePasswordUser = createAsyncThunk(
  'auth/updateEmailUser',
  async (newPassword: string, thunkAPI) => {
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await updateUserPassword(newPassword);
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

// reauthenticate user: Non-serializable data reqd; so not useful in RTK
export const reauthenticateUser = createAsyncThunk(
  'auth/reauthenticateUser',
  async (loginData: LoginData, thunkAPI) => {
    const { currentUser, email, password } = loginData;
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await reauthenticateUserCred(
        currentUser as FirebaseUser | null,
        email,
        password
      );
      if (isErrorResponse(authResponse))
        return thunkAPI.rejectWithValue(authResponse);
      return authResponse;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// delete user
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (currentUser: FirebaseUser | null, thunkAPI) => {
    // type guard function checks if response is an auth error
    const isErrorResponse = (response: any): response is ErrorProps => {
      return typeof response?.message === 'string';
    };
    try {
      const authResponse = await deleteUserAccount(currentUser);
      if (isErrorResponse(authResponse))
        return thunkAPI.rejectWithValue(authResponse);
      return authResponse;
    } catch (err) {
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
  hasReauthenticated: false,
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
      .addCase(uploadPhotoUser.fulfilled, (state, action: any) => {
        if (state.user) state.user.photoURL = action.payload;
      })
      .addCase(uploadPhotoUser.rejected, (state, action) => {
        console.log(action.payload);
        console.log(action.error);
      })
      .addCase(fetchUser.rejected, (state, action: any) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedin = false;
        state.user = null;
      })
      .addCase(reauthenticateUser.pending, (state) => {
        state.hasReauthenticated = false;
        state.error = null;
      })
      .addCase(reauthenticateUser.fulfilled, (state) => {
        state.isLoggedin = true;
        state.hasReauthenticated = true;
      })
      .addCase(reauthenticateUser.rejected, (state, action: any) => {
        state.isLoggedin = false;
        state.error = action.error;
      })
      .addCase(updateProfileUser.pending, (state) => {})
      .addCase(updateProfileUser.fulfilled, (state, action: any) => {})
      .addCase(updateProfileUser.rejected, (state, action: any) => {
        state.error = action.error;
      })
      .addCase(deleteUser.pending, (state) => {})
      .addCase(deleteUser.fulfilled, (state) => {
        console.log('user account has been deleted');
      })
      .addCase(deleteUser.rejected, (state, action: any) => {
        state.error = action.error;
      });
  },
});

export const { updateUser, updateLoginStatus, updateDisplayName } =
  authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectLoginStatus = (state: RootState) => state.auth.isLoggedin;

export const selectReAuthStatus = (state: RootState) =>
  state.auth.hasReauthenticated;

export const selectAuthStatus = (state: RootState) =>
  state.auth.isAuthenticating;

export default authSlice.reducer;
