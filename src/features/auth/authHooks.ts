import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useNavigate } from 'react-router-dom';
import { 
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from './authAPI';
import { authAPI } from './authAPI';
import { 
  setCredentials, 
  logout, 
  updateUser,
  setError,
  clearError,
} from './authSlice';
import { ROUTES } from '@/routing/routes';
import type { LoginCredentials, RegisterData, User, OtpType } from './authTypes';
import { toast } from 'react-hot-toast';

// Main auth hook for authentication state and actions
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error } = useAppSelector((state) => state.auth);

  // RTK Query hooks
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [changePasswordMutation] = useChangePasswordMutation();
  const [updateProfileMutation] = useUpdateProfileMutation();

  // Get current user data
  const { data: userData, refetch: refetchUser } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  // Update user data when query returns
  useEffect(() => {
    if (userData) {
      dispatch(updateUser(userData));
    }
  }, [userData, dispatch]);

  // Login handler
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await loginMutation(credentials).unwrap();
      dispatch(setCredentials(response));
      toast.success(`Welcome back, ${response.user.fullName}!`);
      
      // Redirect based on role
      switch (response.user.role) {
        case 'PARENT':
          navigate(ROUTES.PARENT_DASHBOARD);
          break;
        case 'HEALTH_WORKER':
          navigate(ROUTES.HEALTH_WORKER_DASHBOARD);
          break;
        case 'ADMIN':
        case 'SUPER_ADMIN':
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        default:
          navigate(ROUTES.DASHBOARD);
      }
      
      return response;
    } catch (error: any) {
      const message = error.data?.message || 'Login failed';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    }
  }, [dispatch, loginMutation, navigate]);

  // Register handler
  const register = useCallback(async (userData: RegisterData) => {
    try {
      const response = await registerMutation(userData).unwrap();
      dispatch(setCredentials(response));
      toast.success('Registration successful! Please verify your email.');
      navigate(ROUTES.VERIFY_EMAIL);
      return response;
    } catch (error: any) {
      const message = error.data?.message || 'Registration failed';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    }
  }, [dispatch, registerMutation, navigate]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    }
  }, [dispatch, logoutMutation, navigate]);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await changePasswordMutation({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to change password');
      throw error;
    }
  }, [changePasswordMutation]);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const updatedUser = await updateProfileMutation(data).unwrap();
      dispatch(updateUser(updatedUser));
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update profile');
      throw error;
    }
  }, [dispatch, updateProfileMutation]);

  // Clear error
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Expose resetPassword directly for pages that expect it on useAuth
  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string) => {
    const result = await dispatch(authAPI.endpoints.resetPassword.initiate({ email, otp, newPassword }));
    return (result as any);
  }, [dispatch]);

  // Check if user has specific role
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(roles) ? roles : [roles];
    return rolesToCheck.includes(user.role);
  }, [user]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return {
    user,
    token,
    isLoading: isLoading || isLoggingIn || isRegistering || isLoggingOut,
    error,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
    changePassword,
    updateProfile,
    refetchUser,
    clearAuthError,
    // backwards-compatible aliases
    resetPassword,
    clearError: clearAuthError,
    hasRole,
    isParent: user?.role === 'PARENT',
    isHealthWorker: user?.role === 'HEALTH_WORKER',
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
    isEmailVerified: user?.isEmailVerified || false,
    isPhoneVerified: user?.isPhoneVerified || false,
  };
};

// Hook for OTP operations
export const useOTP = () => {
  const [requestOTPMutation] = useRequestOTPMutation();
  const [verifyOTPMutation] = useVerifyOTPMutation();

  const requestOTP = useCallback(async (email?: string, phone?: string, type: OtpType = 'EMAIL_VERIFICATION') => {
    try {
      await requestOTPMutation({ email, phone, type }).unwrap();
      toast.success('OTP sent successfully');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send OTP');
      throw error;
    }
  }, [requestOTPMutation]);

  const verifyOTP = useCallback(async (code: string, email?: string, phone?: string, type: OtpType = 'EMAIL_VERIFICATION') => {
    try {
      const response = await verifyOTPMutation({ code, email, phone, type }).unwrap();
      toast.success('OTP verified successfully');
      return response.verified;
    } catch (error: any) {
      toast.error(error.data?.message || 'Invalid OTP');
      throw error;
    }
  }, [verifyOTPMutation]);

  return { requestOTP, verifyOTP };
};

// Hook for password management
export const usePasswordManagement = () => {
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await forgotPasswordMutation({ email }).unwrap();
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to send reset instructions');
      throw error;
    }
  }, [forgotPasswordMutation]);

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string) => {
    try {
      await resetPasswordMutation({ email, otp, newPassword }).unwrap();
      toast.success('Password reset successful. Please login with your new password.');
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to reset password');
      throw error;
    }
  }, [resetPasswordMutation]);

  return { forgotPassword, resetPassword };
};