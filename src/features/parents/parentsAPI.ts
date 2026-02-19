import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Parent,
  Child,
  Reminder,
  ParentDashboard,
  CreateParentRequest,
  UpdateParentRequest,
  LinkChildRequest,
  ParentSearchParams
} from './parentsTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const parentsAPI = createApi({
  reducerPath: 'parentsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/parents`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Parents', 'Parent', 'Children', 'Reminders'],
  endpoints: (builder) => ({
    // Parent CRUD operations
    getParents: builder.query<{ data: Parent[]; pagination: any }, ParentSearchParams>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Parents'],
    }),

    getParentById: builder.query<Parent, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Parent', id }],
    }),

    getParentByUserId: builder.query<Parent, string>({
      query: (userId) => `/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Parent', id: userId }],
    }),

    createParent: builder.mutation<Parent, CreateParentRequest>({
      query: (parentData) => ({
        url: '/',
        method: 'POST',
        body: parentData,
      }),
      invalidatesTags: ['Parents'],
    }),

    updateParent: builder.mutation<Parent, { id: string; data: UpdateParentRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Parent', id },
        'Parents',
      ],
    }),

    deleteParent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Parents'],
    }),

    // Child linking
    getParentChildren: builder.query<Child[], string>({
      query: (parentId) => `/${parentId}/children`,
      providesTags: (_result, _error, parentId) => [{ type: 'Children', id: parentId }],
    }),

    linkChild: builder.mutation<void, { parentId: string; data: LinkChildRequest }>({
      query: ({ parentId, data }) => ({
        url: `/${parentId}/children`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { parentId }) => [
        { type: 'Children', id: parentId },
        'Parents',
      ],
    }),

    unlinkChild: builder.mutation<void, { parentId: string; childId: string }>({
      query: ({ parentId, childId }) => ({
        url: `/${parentId}/children/${childId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { parentId }) => [
        { type: 'Children', id: parentId },
        'Parents',
      ],
    }),

    setPrimaryChild: builder.mutation<void, { parentId: string; childId: string }>({
      query: ({ parentId, childId }) => ({
        url: `/${parentId}/children/${childId}/primary`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { parentId }) => [
        { type: 'Children', id: parentId },
      ],
    }),

    // Reminders
    getParentReminders: builder.query<Reminder[], string>({
      query: (parentId) => `/${parentId}/reminders`,
      providesTags: (_result, _error, parentId) => [{ type: 'Reminders', id: parentId }],
    }),

    getUpcomingReminders: builder.query<Reminder[], string>({
      query: (parentId) => `/${parentId}/reminders/upcoming`,
      providesTags: (_result, _error, parentId) => [{ type: 'Reminders', id: parentId }],
    }),

    markReminderAsRead: builder.mutation<void, { parentId: string; reminderId: string }>({
      query: ({ parentId, reminderId }) => ({
        url: `/${parentId}/reminders/${reminderId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { parentId }) => [
        { type: 'Reminders', id: parentId },
      ],
    }),

    // Dashboard
    getParentDashboard: builder.query<ParentDashboard, string>({
      query: (parentId) => `/${parentId}/dashboard`,
      providesTags: (_result, _error, parentId) => [
        { type: 'Parent', id: parentId },
        { type: 'Children', id: parentId },
        { type: 'Reminders', id: parentId },
      ],
    }),

    // Statistics
    getParentStats: builder.query<{
      totalChildren: number;
      completedVaccinations: number;
      upcomingVaccinations: number;
      missedVaccinations: number;
      completionRate: number;
    }, string>({
      query: (parentId) => `/${parentId}/stats`,
      providesTags: (_result, _error, parentId) => [{ type: 'Parent', id: parentId }],
    }),

    // Communication preferences
    updateNotificationPreferences: builder.mutation<void, { 
      parentId: string; 
      preferences: {
        email: boolean;
        sms: boolean;
        push: boolean;
      }
    }>({
      query: ({ parentId, preferences }) => ({
        url: `/${parentId}/preferences`,
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: (_result, _error, { parentId }) => [{ type: 'Parent', id: parentId }],
    }),

    // Bulk operations
    bulkImportParents: builder.mutation<void, FormData>({
      query: (file) => ({
        url: '/bulk-import',
        method: 'POST',
        body: file,
      }),
      invalidatesTags: ['Parents'],
    }),

    exportParentsData: builder.query<Blob, { format?: 'csv' | 'excel'; filters?: any }>({
      query: (params) => ({
        url: '/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  // Parent CRUD
  useGetParentsQuery,
  useGetParentByIdQuery,
  useGetParentByUserIdQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,

  // Child linking
  useGetParentChildrenQuery,
  useLinkChildMutation,
  useUnlinkChildMutation,
  useSetPrimaryChildMutation,

  // Reminders
  useGetParentRemindersQuery,
  useGetUpcomingRemindersQuery,
  useMarkReminderAsReadMutation,

  // Dashboard
  useGetParentDashboardQuery,

  // Statistics
  useGetParentStatsQuery,

  // Preferences
  useUpdateNotificationPreferencesMutation,

  // Bulk operations
  useBulkImportParentsMutation,
  useExportParentsDataQuery,
} = parentsAPI;