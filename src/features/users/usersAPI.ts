import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  facilityId?: string;
  facilityName?: string;
}

export interface UserFilter {
  role?: string;
  county?: string;
  subCounty?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  unverifiedEmails: number;
  healthWorkers: number;
  byRole: Record<string, number>;
}

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: User[]; pagination: any }, UserFilter | undefined>({
      query: (filter) => {
        const params: Record<string, string> = {};
        if (filter?.role) params.role = filter.role;
        if (filter?.county) params.county = filter.county;
        if (filter?.subCounty) params.subCounty = filter.subCounty;
        if (filter?.search) params.search = filter.search;
        if (filter?.isActive !== undefined) params.isActive = String(filter.isActive);
        if (filter?.page) params.page = String(filter.page);
        if (filter?.limit) params.limit = String(filter.limit);
        return { url: '/', params };
      },
      providesTags: ['Users'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => '/stats',
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'Users'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
    activateUser: builder.mutation<User, string>({
      query: (id) => ({ url: `/${id}/activate`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, 'Users'],
    }),
    deactivateUser: builder.mutation<User, string>({
      query: (id) => ({ url: `/${id}/deactivate`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, 'Users'],
    }),
    updateUserRole: builder.mutation<User, { id: string; role: string }>({
      query: ({ id, role }) => ({ url: `/${id}/role/${role}`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'Users'],
    }),
    verifyUser: builder.mutation<User, { id: string; type: 'email' | 'phone' }>({
      query: ({ id, type }) => ({ url: `/${id}/verify/${type}`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useUpdateUserRoleMutation,
  useVerifyUserMutation,
} = usersAPI;
