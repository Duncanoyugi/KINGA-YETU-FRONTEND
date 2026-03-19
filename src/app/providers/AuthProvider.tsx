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
  const { user, token, isLoading: reduxIsLoading } = useAppSelector((state) => state.auth);
  
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

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('[AuthProvider] Initializing auth...');

      const wasLoggedOut = localStorage.getItem(LOGOUT_FLAG_KEY) === 'true';
      console.log('[AuthProvider] Was logged out flag:', wasLoggedOut);

      // If user was explicitly logged out, don't auto-authenticate
      if (wasLoggedOut) {
        console.log('[AuthProvider] User was logged out - not auto-authenticating');
        setIsLoading(false);
        return;
      }

      // Get stored values
      const storedToken = getToken();
      const storedUser = getUser();
      
      console.log('[AuthProvider] Stored token exists:', !!storedToken);
      console.log('[AuthProvider] Stored user exists:', !!storedUser);
      console.log('[AuthProvider] Redux token exists:', !!token);
      
      // IMPORTANT: Always try to get fresh user data from /me when there's a token
      // This ensures we have the latest parentProfile
      if (storedToken) {
        console.log('[AuthProvider] Token found - calling /me to get fresh user data...');
        try {
          const userData = await triggerGetCurrentUser().unwrap();
          console.log('[AuthProvider] Fresh user from /me:', userData);
          console.log('[AuthProvider] Fresh user.parentProfile:', userData?.parentProfile);
          dispatch(setCredentials({
            user: userData,
            token: storedToken
          }));
        } catch (error) {
          console.error('[AuthProvider] /me failed:', error);
          // If /me fails, check if we have a stored user with parentProfile
          if (storedUser?.parentProfile) {
            console.log('[AuthProvider] Using stored user WITH parentProfile');
            dispatch(setCredentials({
              user: storedUser,
              token: storedToken
            }));
          } else if (storedUser) {
            // Token is invalid or user doesn't have parentProfile - clear everything
            console.log('[AuthProvider] Stored user has NO parentProfile - clearing invalid session');
            removeToken();
            removeUser();
            localStorage.setItem(LOGOUT_FLAG_KEY, 'true');
          }
        }
        setIsLoading(false);
        return;
      }

      console.log('[AuthProvider] No token found - user not authenticated');
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

  const value: AuthContextType = {
    user,
    isLoading: isLoading || reduxIsLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout: logoutUser,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
