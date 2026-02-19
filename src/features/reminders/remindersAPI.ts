import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Reminder, 
  ReminderSettings, 
  CreateReminderRequest, 
  UpdateReminderRequest,
  ReminderFilter 
} from './remindersTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const remindersAPI = createApi({
  reducerPath: 'remindersAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/reminders`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all reminders with optional filters
    getReminders: builder.query<Reminder[], ReminderFilter | undefined>({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter?.childId) params.append('childId', filter.childId);
        if (filter?.status) params.append('status', filter.status);
        if (filter?.startDate) params.append('startDate', filter.startDate);
        if (filter?.endDate) params.append('endDate', filter.endDate);
        return `?${params.toString()}`;
      },
    }),

    // Get a single reminder by ID
    getReminderById: builder.query<Reminder, string>({
      query: (id) => `/${id}`,
    }),

    // Get reminders for a specific child
    getRemindersByChild: builder.query<Reminder[], string>({
      query: (childId) => `/child/${childId}`,
    }),

    // Create a new reminder
    createReminder: builder.mutation<Reminder, CreateReminderRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
    }),

    // Update a reminder
    updateReminder: builder.mutation<Reminder, { id: string; data: UpdateReminderRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // Delete a reminder
    deleteReminder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),

    // Get reminder settings for current user
    getReminderSettings: builder.query<ReminderSettings, void>({
      query: () => '/settings',
    }),

    // Update reminder settings
    updateReminderSettings: builder.mutation<ReminderSettings, Partial<ReminderSettings>>({
      query: (data) => ({
        url: '/settings',
        method: 'PATCH',
        body: data,
      }),
    }),

    // Send reminder manually
    sendReminder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}/send`,
        method: 'POST',
      }),
    }),

    // Cancel a pending reminder
    cancelReminder: builder.mutation<Reminder, string>({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useGetReminderByIdQuery,
  useGetRemindersByChildQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useGetReminderSettingsQuery,
  useUpdateReminderSettingsMutation,
  useSendReminderMutation,
  useCancelReminderMutation,
} = remindersAPI;
