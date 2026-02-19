import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Notification,
  Reminder,
  NotificationPreferences,
  PushSubscription,
  NotificationStats,
  CreateNotificationRequest,
  CreateReminderRequest,
  UpdateReminderRequest,
  SendReminderRequest,
  NotificationSearchParams,
  ReminderSearchParams
} from './notificationsTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const notificationsAPI = createApi({
  reducerPath: 'notificationsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/notifications`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Notifications', 'Reminders', 'Preferences', 'Stats'],
  endpoints: (builder) => ({
    // Notifications
    getNotifications: builder.query<{ data: Notification[]; pagination: any }, NotificationSearchParams>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Notifications'],
    }),

    getUserNotifications: builder.query<Notification[], string>({
      query: (userId) => `/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Notifications', id: userId }],
    }),

    getUnreadCount: builder.query<number, string>({
      query: (userId) => `/user/${userId}/unread/count`,
      providesTags: (_result, _error, userId) => [{ type: 'Notifications', id: userId }],
    }),

    markAsRead: builder.mutation<void, { notificationId: string }>({
      query: ({ notificationId }) => ({
        url: `/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'Stats'],
    }),

    markAllAsRead: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/user/${userId}/read-all`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications', 'Stats'],
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications', 'Stats'],
    }),

    createNotification: builder.mutation<Notification, CreateNotificationRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notifications', 'Stats'],
    }),

    // Reminders
    getReminders: builder.query<{ data: Reminder[]; pagination: any }, ReminderSearchParams>({
      query: (params) => ({
        url: '/reminders',
        params,
      }),
      providesTags: ['Reminders'],
    }),

    getPendingReminders: builder.query<Reminder[], void>({
      query: () => '/reminders/pending',
      providesTags: ['Reminders'],
    }),

    getChildReminders: builder.query<Reminder[], string>({
      query: (childId) => `/reminders/child/${childId}`,
      providesTags: (_result, _error, childId) => [{ type: 'Reminders', id: childId }],
    }),

    getParentReminders: builder.query<Reminder[], string>({
      query: (parentId) => `/reminders/parent/${parentId}`,
      providesTags: (_result, _error, parentId) => [{ type: 'Reminders', id: parentId }],
    }),

    createReminder: builder.mutation<Reminder, CreateReminderRequest>({
      query: (data) => ({
        url: '/reminders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reminders'],
    }),

    updateReminder: builder.mutation<Reminder, { id: string; data: UpdateReminderRequest }>({
      query: ({ id, data }) => ({
        url: `/reminders/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Reminders'],
    }),

    cancelReminder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reminders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Reminders'],
    }),

    sendReminder: builder.mutation<void, SendReminderRequest>({
      query: (data) => ({
        url: '/reminders/send',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reminders'],
    }),

    // Preferences
    getNotificationPreferences: builder.query<NotificationPreferences, string>({
      query: (userId) => `/preferences/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Preferences', id: userId }],
    }),

    updateNotificationPreferences: builder.mutation<void, { userId: string; preferences: NotificationPreferences }>({
      query: ({ userId, preferences }) => ({
        url: `/preferences/${userId}`,
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Preferences', id: userId }],
    }),

    // Push subscriptions
    subscribeToPush: builder.mutation<void, PushSubscription>({
      query: (subscription) => ({
        url: '/push/subscribe',
        method: 'POST',
        body: subscription,
      }),
      invalidatesTags: ['Preferences'],
    }),

    unsubscribeFromPush: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/push/unsubscribe/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Preferences'],
    }),

    // Statistics
    getNotificationStats: builder.query<NotificationStats, string>({
      query: (userId) => `/stats/${userId}`,
      providesTags: ['Stats'],
    }),

    getReminderStats: builder.query<{
      total: number;
      sent: number;
      failed: number;
      pending: number;
      successRate: number;
    }, { userId?: string; facilityId?: string }>({
      query: (params) => ({
        url: '/reminders/stats',
        params,
      }),
      providesTags: ['Stats'],
    }),

    // Batch operations
    createBatchReminders: builder.mutation<void, CreateReminderRequest[]>({
      query: (reminders) => ({
        url: '/reminders/batch',
        method: 'POST',
        body: reminders,
      }),
      invalidatesTags: ['Reminders'],
    }),

    sendBatchReminders: builder.mutation<void, string[]>({
      query: (reminderIds) => ({
        url: '/reminders/batch/send',
        method: 'POST',
        body: { reminderIds },
      }),
      invalidatesTags: ['Reminders'],
    }),
  }),
});

export const {
  // Notifications
  useGetNotificationsQuery,
  useGetUserNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,

  // Reminders
  useGetRemindersQuery,
  useGetPendingRemindersQuery,
  useGetChildRemindersQuery,
  useGetParentRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useCancelReminderMutation,
  useSendReminderMutation,

  // Preferences
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,

  // Push subscriptions
  useSubscribeToPushMutation,
  useUnsubscribeFromPushMutation,

  // Statistics
  useGetNotificationStatsQuery,
  useGetReminderStatsQuery,

  // Batch operations
  useCreateBatchRemindersMutation,
  useSendBatchRemindersMutation,
} = notificationsAPI;