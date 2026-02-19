import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useAuth } from '../auth/authHooks';
import {
  useGetUserNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetParentRemindersQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useSubscribeToPushMutation,
  useUnsubscribeFromPushMutation,
  useGetNotificationStatsQuery,
} from './notificationsAPI';
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  setUnreadCount,
  setReminders,
  setPreferences,
  handleWebSocketMessage,
} from './notificationsSlice';
import type { Notification, NotificationPreferences, Reminder } from './notificationsTypes';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { WS_URL, VAPID_PUBLIC_KEY } from '@/config/environment';

// Main hook for notifications
export const useNotifications = (userId?: string) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { notifications, unreadCount, isLoading, error, pagination } = 
    useAppSelector((state) => state.notifications);
  
  const targetUserId = userId || user?.id;

  // RTK Query hooks
  const { data: notificationsData, refetch: refetchNotifications } = useGetUserNotificationsQuery(
    targetUserId!,
    { skip: !targetUserId, pollingInterval: 30000 } // Poll every 30 seconds
  );

  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery(
    targetUserId!,
    { skip: !targetUserId, pollingInterval: 10000 } // Poll more frequently for unread count
  );

  const [markAsReadMutation] = useMarkAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllAsReadMutation();

  // Update state from queries
  useEffect(() => {
    if (notificationsData) {
      dispatch(setNotifications(notificationsData));
    }
  }, [notificationsData, dispatch]);

  useEffect(() => {
    if (unreadData !== undefined) {
      dispatch(setUnreadCount(unreadData));
    }
  }, [unreadData, dispatch]);

  // Mark single notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await markAsReadMutation({ notificationId }).unwrap();
      dispatch(markAsRead(notificationId));
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [dispatch, markAsReadMutation]);

  // Mark all as read
  const markAllNotificationsAsRead = useCallback(async () => {
    if (!targetUserId) return;
    
    try {
      await markAllAsReadMutation(targetUserId).unwrap();
      dispatch(markAllAsRead());
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error('Failed to mark all as read');
    }
  }, [targetUserId, dispatch, markAllAsReadMutation]);

  // Get unread notifications
  const unreadNotifications = useMemo(() => {
    return notifications.filter((n: Notification) => !n.isRead);
  }, [notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: string) => {
    return notifications.filter((n: Notification) => n.type === type);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    isLoading,
    error,
    pagination,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    refetch: refetchNotifications,
    refetchUnread,
    getNotificationsByType,
  };
};

// Hook for reminders
export const useReminders = (parentId?: string, childId?: string) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { reminders } = useAppSelector((state) => state.notifications);
  
  const targetParentId = parentId || (user?.role === 'PARENT' ? user.id : undefined);

  const { data: remindersData, refetch: refetchReminders } = useGetParentRemindersQuery(
    targetParentId!,
    { skip: !targetParentId, pollingInterval: 60000 } // Poll every minute
  );

  useEffect(() => {
    if (remindersData) {
      dispatch(setReminders(remindersData));
    }
  }, [remindersData, dispatch]);

  // Filter reminders by childId when provided
  const filteredReminders = useMemo(() => {
    if (!childId) return reminders;
    return reminders.filter((r: Reminder) => r.childId === childId);
  }, [reminders, childId]);

  // Filter reminders by child
  const getRemindersByChild = useCallback((id: string) => {
    return reminders.filter((r: Reminder) => r.childId === id);
  }, [reminders]);

  // Get upcoming reminders
  const upcomingReminders = useMemo(() => {
    const now = new Date();
    return filteredReminders
      .filter((r: Reminder) => new Date(r.scheduledFor) > now && r.status === 'PENDING')
      .sort((a: Reminder, b: Reminder) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }, [filteredReminders]);

  // Get overdue reminders
  const overdueReminders = useMemo(() => {
    const now = new Date();
    return filteredReminders
      .filter((r: Reminder) => new Date(r.scheduledFor) < now && r.status === 'PENDING')
      .sort((a: Reminder, b: Reminder) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());
  }, [filteredReminders]);

  // Get reminders by status
  const getRemindersByStatus = useCallback((status: string) => {
    return filteredReminders.filter((r: Reminder) => r.status === status);
  }, [filteredReminders]);

  return {
    reminders: filteredReminders,
    upcomingReminders,
    overdueReminders,
    refetchReminders,
    getRemindersByChild,
    getRemindersByStatus,
  };
};

// Hook for notification preferences
export const useNotificationPreferences = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { preferences } = useAppSelector((state) => state.notifications);

  const { data: preferencesData, refetch: refetchPreferences } = useGetNotificationPreferencesQuery(
    user?.id!,
    { skip: !user }
  );

  const [updatePreferencesMutation] = useUpdateNotificationPreferencesMutation();

  useEffect(() => {
    if (preferencesData) {
      dispatch(setPreferences(preferencesData));
    }
  }, [preferencesData, dispatch]);

  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return;

    try {
      const updated = { ...preferences, ...newPreferences } as NotificationPreferences;
      await updatePreferencesMutation({ userId: user.id, preferences: updated }).unwrap();
      dispatch(setPreferences(updated));
      toast.success('Notification preferences updated');
    } catch (error: any) {
      toast.error('Failed to update preferences');
      throw error;
    }
  }, [user, preferences, dispatch, updatePreferencesMutation]);

  const isChannelEnabled = useCallback((channel: 'email' | 'sms' | 'push') => {
    return preferences?.[channel] || false;
  }, [preferences]);

  const getReminderDays = useCallback(() => {
    return preferences?.reminderDays || [7, 3, 1]; // Default: 7, 3, 1 days before
  }, [preferences]);

  return {
    preferences,
    updatePreferences,
    isChannelEnabled,
    getReminderDays,
    refetch: refetchPreferences,
  };
};

// Hook for push notifications
export const usePushNotifications = () => {
  const { user } = useAuth();
  const [subscribeToPush] = useSubscribeToPushMutation();
  const [unsubscribeFromPush] = useUnsubscribeFromPushMutation();

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support push notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const subscribe = useCallback(async () => {
    if (!user) return;

    try {
      const permission = await requestPermission();
      if (!permission) {
        toast.error('Please enable notifications in your browser settings');
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.ready;
      
      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

      // Send to backend
      await subscribeToPush({
        id: crypto.randomUUID(),
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dh: btoa(String.fromCharCode.apply(null, 
          Array.from(new Uint8Array(subscription.getKey('p256dh') as ArrayBuffer)))),
        auth: btoa(String.fromCharCode.apply(null, 
          Array.from(new Uint8Array(subscription.getKey('auth') as ArrayBuffer)))),
        createdAt: new Date().toISOString(),
      }).unwrap();

      toast.success('Push notifications enabled');
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      toast.error('Failed to enable push notifications');
    }
  }, [user, requestPermission, subscribeToPush]);

  const unsubscribe = useCallback(async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await unsubscribeFromPush(user.id).unwrap();
        toast.success('Push notifications disabled');
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      toast.error('Failed to disable push notifications');
    }
  }, [user, unsubscribeFromPush]);

  return {
    subscribe,
    unsubscribe,
    requestPermission,
  };
};

// Hook for WebSocket connection
export const useNotificationWebSocket = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { preferences } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    if (!user || !preferences?.push) return;

    let socket: Socket;

    const connectWebSocket = () => {
      socket = io(WS_URL, {
        query: { userId: user.id },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('notification', (data) => {
        dispatch(handleWebSocketMessage({ type: 'NOTIFICATION', data }));
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/icon-192.png',
          });
        }
      });

      socket.on('reminder', (data) => {
        dispatch(handleWebSocketMessage({ type: 'REMINDER', data }));
      });

      socket.on('alert', (data) => {
        dispatch(handleWebSocketMessage({ type: 'ALERT', data }));
        toast.error(data.message);
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, preferences?.push, dispatch]);

  return null;
};

// Hook for notification statistics
export const useNotificationStats = () => {
  const { user } = useAuth();
  
  const { data: stats, isLoading, refetch } = useGetNotificationStatsQuery(
    user?.id!,
    { skip: !user, pollingInterval: 60000 }
  );

  const statsSummary = useMemo(() => {
    if (!stats) return null;
    
    return {
      ...stats,
      readRate: stats.total > 0 ? ((stats.total - stats.unread) / stats.total) * 100 : 0,
      typeDistribution: Object.entries(stats.byType).map(([type, count]) => ({
        type,
        count,
        percentage: (count / stats.total) * 100,
      })),
    };
  }, [stats]);

  return {
    stats: statsSummary,
    isLoading,
    refetch,
  };
};