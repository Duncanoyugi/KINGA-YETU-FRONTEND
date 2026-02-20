import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logout, updateUser } from '@/features/auth/authSlice';
import {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} from '@/features/auth/authAPI';
import type { User } from '@/features/auth/authTypes';
import { getToken, removeToken, setToken } from '@/services/storage/localStorage';
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // RTK Query mutations and queries
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const { refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined, {
    skip: true, // Only manually fetch when needed
  });

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
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await refetchCurrentUser().unwrap();
      dispatch(updateUser(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If token is invalid, clear it
      removeToken();
      dispatch(logout());
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, refetchCurrentUser]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginMutation({ email, password }).unwrap();

      // Store token
      setToken(response.accessToken);

      // Update Redux state
      dispatch(setCredentials({
        user: response.user,
        token: response.accessToken
      }));

      toast.success(`Welcome back, ${response.user.fullName}!`);
    } catch (error: unknown) {
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
      dispatch(logout());
      toast.success('Logged out successfully');
      setIsLoading(false);
    }
  }, [dispatch, logoutMutation]);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (token) {
        try {
          // Validate token and get user data
          const userData = await refetchCurrentUser().unwrap();
          dispatch(setCredentials({
            user: userData,
            token
          }));
        } catch (error) {
          console.error('Invalid token:', error);
          removeToken();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [dispatch, refetchCurrentUser]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
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
