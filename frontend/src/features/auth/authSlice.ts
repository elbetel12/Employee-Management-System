import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

interface User {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

// Get user from localStorage
const user = localStorage.getItem('user');

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; password: string; first_name: string; last_name: string; email: string; role: string }, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { username: string; password: string }, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    passwordData: { currentPassword: string; newPassword: string },
    thunkAPI
  ) => {
    try {
      const state = thunkAPI.getState() as { auth: AuthState };
      return await authService.changePassword(passwordData, state.auth.user?.token);
    } catch (error: any) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer; 