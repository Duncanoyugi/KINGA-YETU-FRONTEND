import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  NotificationsState, 
  Notification, 
  Reminder,
  NotificationPreferences,
  PushSubscription
} from './notificationsTypes';

const initialState: NotificationsState = {
  notifications: [],
  reminders: [],
  unreadCount: 0,
  preferences: null,
  pushSubscription: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Notification operations
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        const isNowRead = action.payload.isRead;
        
        state.notifications[index] = action.payload;
        
        if (wasUnread && isNowRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (!wasUnread && !isNowRead) {
          state.unreadCount += 1;
        }
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    // Reminder operations
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
    },
    
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    
    removeReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(r => r.id !== action.payload);
    },
    
    updateReminderStatus: (state, action: PayloadAction<{ id: string; status: Reminder['status'] }>) => {
      const reminder = state.reminders.find(r => r.id === action.payload.id);
      if (reminder) {
        reminder.status = action.payload.status;
      }
    },

    // Preferences
    setPreferences: (state, action: PayloadAction<NotificationPreferences>) => {
      state.preferences = action.payload;
    },
    
    updatePreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
      }
    },

    // Push subscription
    setPushSubscription: (state, action: PayloadAction<PushSubscription | null>) => {
      state.pushSubscription = action.payload;
    },

    // UI state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Pagination
    setPagination: (state, action: PayloadAction<Partial<NotificationsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // WebSocket real-time updates
    handleWebSocketMessage: (state, action: PayloadAction<{
      type: 'NOTIFICATION' | 'REMINDER' | 'ALERT';
      data: any;
    }>) => {
      const { type, data } = action.payload;
      
      switch (type) {
        case 'NOTIFICATION':
          state.notifications.unshift(data);
          if (!data.isRead) {
            state.unreadCount += 1;
          }
          break;
        case 'REMINDER':
          // Check if reminder already exists
          const existingIndex = state.reminders.findIndex(r => r.id === data.id);
          if (existingIndex >= 0) {
            state.reminders[existingIndex] = data;
          } else {
            state.reminders.push(data);
          }
          break;
        case 'ALERT':
          // Handle system alerts
          console.log('System alert:', data);
          break;
      }
    },

    // Reset state
    resetNotificationsState: () => initialState,
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    clearAllReminders: (state) => {
      state.reminders = [];
    },
  },
});

export const {
  // Notification operations
  setNotifications,
  addNotification,
  updateNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  setUnreadCount,
  
  // Reminder operations
  setReminders,
  addReminder,
  updateReminder,
  removeReminder,
  updateReminderStatus,
  
  // Preferences
  setPreferences,
  updatePreferences,
  
  // Push subscription
  setPushSubscription,
  
  // UI state management
  setLoading,
  setError,
  clearError,
  
  // Pagination
  setPagination,
  
  // WebSocket
  handleWebSocketMessage,
  
  // Reset state
  resetNotificationsState,
  clearAllNotifications,
  clearAllReminders,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;