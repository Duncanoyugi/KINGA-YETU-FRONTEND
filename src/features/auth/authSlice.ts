import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authTypes';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('token', token);
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    
    updateUserRole: (state, action: PayloadAction<User['role']>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    
    updateVerificationStatus: (state, action: PayloadAction<{
      email?: boolean;
      phone?: boolean;
    }>) => {
      if (state.user) {
        if (action.payload.email !== undefined) {
          state.user.isEmailVerified = action.payload.email;
        }
        if (action.payload.phone !== undefined) {
          state.user.isPhoneVerified = action.payload.phone;
        }
      }
    },
  },
});

export const { 
  setCredentials, 
  setUser,
  updateUser,
  logout, 
  setLoading, 
  setError,
  clearError,
  updateToken,
  updateUserRole,
  updateVerificationStatus,
} = authSlice.actions;

export default authSlice.reducer;