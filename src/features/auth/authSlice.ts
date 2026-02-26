import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authTypes';
import { STORAGE_KEYS } from '@/config/appConfig';

// Storage key for logout flag
const LOGOUT_FLAG_KEY = 'immunitrack_logged_out';

// Helper function to get token from localStorage using consistent key
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error reading token from localStorage:', error);
    return null;
  }
};

// Helper function to set token in localStorage using consistent key
const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
  }
};

// Helper function to remove token from localStorage
const removeStoredToken = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
};

// Helper function to check if user was explicitly logged out
const getLoggedOutFlag = (): boolean => {
  try {
    return localStorage.getItem(LOGOUT_FLAG_KEY) === 'true';
  } catch (error) {
    console.error('Error reading logout flag from localStorage:', error);
    return false;
  }
};

// Helper function to set logout flag
const setLoggedOutFlag = (value: boolean): void => {
  try {
    if (value) {
      localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
    } else {
      localStorage.removeItem(LOGOUT_FLAG_KEY);
    }
  } catch (error) {
    console.error('Error setting logout flag in localStorage:', error);
  }
};

// Helper function to clear logout flag
const clearLoggedOutFlag = (): void => {
  try {
    localStorage.removeItem(LOGOUT_FLAG_KEY);
  } catch (error) {
    console.error('Error clearing logout flag from localStorage:', error);
  }
};

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  isLoading: false,
  error: null,
  // Track if user was explicitly logged out - this requires re-login
  loggedOut: getLoggedOutFlag(),
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
      state.loggedOut = false;
      setStoredToken(token);
      clearLoggedOutFlag();
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
      state.loggedOut = true;
      removeStoredToken();
      setLoggedOutFlag(true);
    },
    
    // Action to clear the logout flag when user successfully logs in
    clearLogoutFlag: (state) => {
      state.loggedOut = false;
      clearLoggedOutFlag();
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
      setStoredToken(action.payload);
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
  clearLogoutFlag,
  setLoading, 
  setError,
  clearError,
  updateToken,
  updateUserRole,
  updateVerificationStatus,
} = authSlice.actions;

export default authSlice.reducer;
