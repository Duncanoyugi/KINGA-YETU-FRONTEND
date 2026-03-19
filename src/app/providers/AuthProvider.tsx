import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logout, updateUser } from '@/features/auth/authSlice';
import {
  useLoginMutation,
  useLogoutMutation,
  useLazyGetCurrentUserQuery,
} from '@/features/auth/authAPI';
import type { User } from '@/features/auth/authTypes';
import { getToken, removeToken, setToken, getUser, setUser, removeUser } from '@/services/storage/localStorage';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage key for logout flag
const LOGOUT_FLAG_KEY = 'immunitrack_logged_out';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading: reduxIsLoading, loggedOut } = useAppSelector((state) => state.auth);
  
  // Local loading state for initial auth check
  const [isLoading, setIsLoading] = useState(true);

  // RTK Query mutations and queries
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

  // Check if user has specific role(s)
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;

    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  }, [user]);

  // Check if user has specific permission (for admin users)
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    // This would check against user permissions from backend
    // You can expand this based on your permission system
    const userPermissions = (user as unknown as { permissions?: string[] }).permissions || [];
    return userPermissions.includes(permission);
  }, [user]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const currentToken = getToken();
      if (!currentToken) {
        console.log('[AuthProvider] No token found in localStorage');
        setIsLoading(false);
        return;
      }

      console.log('[AuthProvider] Refreshing user data with token:', currentToken.substring(0, 20) + '...');
      
      const userData = await triggerGetCurrentUser().unwrap();
      console.log('[AuthProvider] User data refreshed:', userData);
      dispatch(updateUser(userData));
    } catch (error: unknown) {
      console.error('[AuthProvider] Failed to refresh user:', error);
      // Don't clear auth state on refresh failure - just log it
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, triggerGetCurrentUser]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('[AuthProvider] Starting login for:', email);
      
      const response = await loginMutation({ email, password }).unwrap();

      console.log('[AuthProvider] Login successful, token received:', !!response.accessToken);
      console.log('[AuthProvider] User received:', response.user?.email);

      // Store token and user in localStorage
      setToken(response.accessToken);
      setUser(response.user);
      
      console.log('[AuthProvider] Login response user:', response.user);
      console.log('[AuthProvider] Login response user.parentProfile:', response.user?.parentProfile);

      // Update Redux State - setCredentials clears loggedOut flag
      dispatch(setCredentials({
        user: response.user,
        token: response.accessToken
      }));

      console.log('[AuthProvider] Credentials set in Redux and localStorage');

      // Clear logout flag from localStorage
      localStorage.removeItem(LOGOUT_FLAG_KEY);

      // Don't call /me endpoint - use user data from login response directly
      // This avoids the 401 error issue
      
      toast.success(`Welcome back, ${response.user.fullName}!`);
      
      console.log('[AuthProvider] Login complete, user should be authenticated');
    } catch (error: unknown) {
      console.error('[AuthProvider] Login failed:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, loginMutation]);

  // Logout function
  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call logout API
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API response
      removeToken();
      removeUser();
      // Set logout flag to require re-login
      localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
      dispatch(logout());
      toast.success('Logged out successfully');
      setIsLoading(false);
    }
  }, [dispatch, logoutMutation]);

  // Check authentication status on mount - sync with Redux state
  useEffect(() => {
    const initAuth = async () => {
      console.log('[AuthProvider] Initializing auth...');
      
      // Check if user was explicitly logged out - require re-login
      const wasLoggedOut = localStorage.getItem(LOGOUT_FLAG_KEY) === 'true';
      console.log('[AuthProvider] Was logged out flag:', wasLoggedOut);
      
      if (wasLoggedOut) {
        // User was logged out - clear any existing token but don't clear Redux
        // The Redux state should already be cleared if user explicitly logged out
        removeToken();
        removeUser();
        setIsLoading(false);
        return;
      }

      // If we have a token AND user in localStorage, try to restore without calling /me
      const storedToken = getToken();
      const storedUser = getUser();
      
      console.log('[AuthProvider] Stored token exists:', !!storedToken);
      console.log('[AuthProvider] Stored user exists:', !!storedUser);
      console.log('[AuthProvider] Redux token exists:', !!token);
      
      // Case 1: Have both token and user - restore without API call
      if (storedToken && storedUser && !token) {
        console.log('[AuthProvider] Restoring from localStorage (no /me call needed)');
        console.log('[AuthProvider] Stored user:', storedUser);
        console.log('[AuthProvider] Stored user.parentProfile:', storedUser?.parentProfile);
        dispatch(setCredentials({
          user: storedUser,
          token: storedToken
        }));
        setIsLoading(false);
        return;
      }

      // Case 2: Have token but no user - don't call /me, just clear invalid token
      // This prevents 401 errors from showing in console on landing page
      if (storedToken && !storedUser) {
        console.log('[AuthProvider] Token exists but no user - clearing invalid token');
        removeToken();
        removeUser();
        localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
        setIsLoading(false);
        return;
      }

      // Case 3: Have token in Redux but not localStorage - try to validate with /me
      if (storedToken && !token && !wasLoggedOut) {
        console.log('[AuthProvider] Attempting to restore session...');
        try {
          // Try to validate token and get user data
          const userData = await triggerGetCurrentUser().unwrap();
          console.log('[AuthProvider] Session restored with user:', userData);
          dispatch(setCredentials({
            user: userData,
            token: storedToken
          }));
        } catch (error) {
          console.error('[AuthProvider] Failed to restore session:', error);
          // If /me fails but we have a user in localStorage, use it
          if (storedUser) {
            console.log('[AuthProvider] Using stored user despite /me failure');
            dispatch(setCredentials({
              user: storedUser,
              token: storedToken
            }));
          } else {
            // Token is invalid, clear it
            removeToken();
            removeUser();
            localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
          }
        }
      }

      console.log('[AuthProvider] Auth initialization complete');
      setIsLoading(false);
    };

    initAuth();
  }, []); // Only run on mount - empty deps

  // Sync token to localStorage when Redux token changes
  useEffect(() => {
    if (token && token !== getToken()) {
      setToken(token);
    }
  }, [token]);

  // Compute loading state: combine Redux loading with local initial loading
  const combinedIsLoading = isLoading || reduxIsLoading;

  const value = {
    user,
    isLoading: combinedIsLoading,
    isAuthenticated: !!user && !!token && !loggedOut,
    login,
    logout: logoutUser,
    refreshUser,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
