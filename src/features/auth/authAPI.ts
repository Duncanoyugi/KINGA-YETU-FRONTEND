import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User,
  OtpRequest,
  OtpVerification,
  PasswordResetRequest,
  ChangePasswordRequest
} from './authTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Public endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),

    // OTP endpoints
    requestOTP: builder.mutation<void, OtpRequest>({
      query: (data) => ({
        url: '/otp/request',
        method: 'POST',
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<{ verified: boolean }, OtpVerification>({
      query: (data) => ({
        url: '/otp/verify',
        method: 'POST',
        body: data,
      }),
    }),

    // Password management
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/password/forgot',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, PasswordResetRequest>({
      query: (data) => ({
        url: '/password/reset',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: '/password/change',
        method: 'POST',
        body: data,
      }),
    }),

    // Protected endpoints
    getCurrentUser: builder.query<User, void>({
      query: () => '/me',
    }),

    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),

    verifyEmail: builder.mutation<void, { token: string }>({
      query: (data) => ({
        url: '/verify-email',
        method: 'POST',
        body: data,
      }),
    }),

    verifyPhone: builder.mutation<void, { code: string }>({
      query: (data) => ({
        url: '/verify-phone',
        method: 'POST',
        body: data,
      }),
    }),

    // Account management
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/profile',
        method: 'PATCH',
        body: data,
      }),
    }),

    deactivateAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/deactivate',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRequestOTPMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useVerifyEmailMutation,
  useVerifyPhoneMutation,
  useUpdateProfileMutation,
  useDeactivateAccountMutation,
} = authAPI;