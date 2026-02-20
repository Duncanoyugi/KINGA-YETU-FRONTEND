import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} from '@/features/auth/authAPI';
import {
  setCredentials,
  logout,
  updateUser,
  setLoading,
  setError,
} from '@/features/auth/authSlice';
import type { LoginCredentials, RegisterData, User } from '@/features/auth/authTypes';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './useToast';
  import { authAPI } from '@/features/auth/authAPI';
import { STORAGE_KEYS } from '@/config/appConfig';
import { ROUTES } from '@/routing/routes';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, token, isLoading, error } = useAppSelector((state) => state.auth);
  
  // Local storage for persistence
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(STORAGE_KEYS.TOKEN, null);
  const [storedUser, setStoredUser] = useLocalStorage<User | null>(STORAGE_KEYS.USER, null);

  // RTK Query mutations
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Get current user data
  const { data: userData, refetch: refetchUser } = useGetCurrentUserQuery(undefined, {
    skip: !token && !storedToken,
  });

  // Sync with localStorage and restore auth state on initial load
  useEffect(() => {
    // Restore auth state from localStorage on initial load
    if (!user && !token && storedUser && storedToken) {
      dispatch(setCredentials({ user: storedUser, token: storedToken }));
    }
  }, []); // Only run on mount

  useEffect(() => {
    if (token) {
      setStoredToken(token);
    } else if (storedToken && !token) {
      // Could implement token refresh here
    }
  }, [token, storedToken, setStoredToken]);

  useEffect(() => {
    if (user) {
      setStoredUser(user);
    }
  }, [user, setStoredUser]);

  // Update user data when query returns
  useEffect(() => {
    if (userData) {
      dispatch(updateUser(userData));
    }
  }, [userData, dispatch]);

  // Login handler
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch(setLoading(true));
    try {
      const response = await loginMutation(credentials).unwrap();
      dispatch(setCredentials({
        user: response.user,
        token: response.accessToken
      }));
      showToast({
        type: 'success',
        message: `Welcome back, ${response.user.fullName}!`,
      });
      
      // Redirect based on role
      const dashboardRoute = getDashboardRoute(response.user.role);
      navigate(dashboardRoute);
      
      return response;
    } catch (error: any) {
      const message = error.data?.message || 'Login failed';
      dispatch(setError(message));
      showToast({
        type: 'error',
        message,
      });
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loginMutation, navigate, showToast]);

  // Register handler
  const register = useCallback(async (userData: RegisterData) => {
    dispatch(setLoading(true));
    try {
      const response = await registerMutation(userData).unwrap();
      
      // Store the email for OTP verification
      localStorage.setItem('pendingVerificationEmail', userData.email);
      
      showToast({
        type: 'success',
        message: response.message || 'Registration successful! Please verify your email.',
      });
      
      // Navigate to OTP verification page with the email
      navigate(ROUTES.VERIFY_EMAIL, {
        state: { email: userData.email }
      });
      
      return response;
    } catch (error: any) {
      const message = error.data?.message || 'Registration failed';
      dispatch(setError(message));
      showToast({
        type: 'error',
        message,
      });
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, registerMutation, navigate, showToast]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await logoutMutation().unwrap();
      showToast({
        type: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      setStoredToken(null);
      setStoredUser(null);
      navigate(ROUTES.LOGIN);
      dispatch(setLoading(false));
    }
  }, [dispatch, logoutMutation, navigate, showToast, setStoredToken, setStoredUser]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await refreshTokenMutation().unwrap();
      return response.token;
    } catch (error) {
      await handleLogout();
      throw error;
    }
  }, [refreshTokenMutation, handleLogout]);

  // OTP handlers
  const [requestOTPMutation] = authAPI.useRequestOTPMutation();
  const [verifyOTPMutation] = authAPI.useVerifyOTPMutation();

  const requestOTP = useCallback(async (data: import('@/features/auth/authTypes').OtpRequest) => {
    try {
      await requestOTPMutation(data).unwrap();
      showToast({ type: 'success', message: 'OTP sent successfully' });
      return true;
    } catch (error: any) {
      showToast({ type: 'error', message: error.data?.message || 'Failed to send OTP' });
      throw error;
    }
  }, [requestOTPMutation, showToast]);

  const verifyOTP = useCallback(async (data: import('@/features/auth/authTypes').OtpVerification) => {
    try {
      const response = await verifyOTPMutation(data).unwrap();
      showToast({ type: 'success', message: 'OTP verified successfully' });
      return response.valid;
    } catch (error: any) {
      showToast({ type: 'error', message: error.data?.message || 'Invalid OTP' });
      throw error;
    }
  }, [verifyOTPMutation, showToast]);

  // Check permissions
  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    
    // This would check against actual permissions from the backend
    const permissions = (user as any).permissions || [];
    return permissions.includes(permission);
  }, [user]);

  // Check roles
  const hasRole = useCallback((roles: string | string[]) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  }, [user]);

  // Get dashboard route based on role
  const getDashboardRoute = useCallback((role: string) => {
    switch (role) {
      case 'PARENT':
        return ROUTES.PARENT_DASHBOARD;
      case 'HEALTH_WORKER':
        return ROUTES.HEALTH_WORKER_DASHBOARD;
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return ROUTES.ADMIN_DASHBOARD;
      case 'COUNTY_ADMIN':
        return ROUTES.COUNTY_ADMIN_DASHBOARD;
      default:
        return ROUTES.DASHBOARD;
    }
  }, []);

  // Computed properties
  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);
  const isParent = useMemo(() => user?.role === 'PARENT', [user]);
  const isHealthWorker = useMemo(() => user?.role === 'HEALTH_WORKER', [user]);
  const isAdmin = useMemo(() => user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN', [user]);
  const isSuperAdmin = useMemo(() => user?.role === 'SUPER_ADMIN', [user]);
  const isEmailVerified = useMemo(() => user?.isEmailVerified || false, [user]);
  const isPhoneVerified = useMemo(() => user?.isPhoneVerified || false, [user]);

  // Backwards-compatible aliases
  const resetPassword = useCallback(async (data: any) => {
    const result = await dispatch(authAPI.endpoints.resetPassword.initiate(data));
    return (result as any);
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    // State
    user,
    token,
    isLoading: isLoading || isLoggingIn || isRegistering || isLoggingOut,
    error,
    isAuthenticated,
    // Stored values for persistence
    storedUser,
    storedToken,
    
    // Role checks
    hasRole,
    hasPermission,
    isParent,
    isHealthWorker,
    isAdmin,
    isSuperAdmin,
    isEmailVerified,
    isPhoneVerified,
    
    // Actions
    login,
    register,
    logout: handleLogout,
    refreshToken,
    refetchUser,
    
    // Utilities
    getDashboardRoute,
    // aliases
    resetPassword,
    clearError: clearAuthError,
    requestOTP,
    verifyOTP,
  };
};