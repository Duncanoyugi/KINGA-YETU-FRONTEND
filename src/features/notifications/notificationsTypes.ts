// Notification model from Prisma
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: string | null; // JSON string
  isRead: boolean;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'VACCINE_REMINDER'
  | 'APPOINTMENT_CONFIRMATION'
  | 'REPORT_READY'
  | 'PUSH_NOTIFICATION'
  | 'SYSTEM_ALERT'
  | 'SECURITY_ALERT';

// Reminder model from Prisma
export interface Reminder {
  id: string;
  childId: string;
  parentId: string;
  vaccineId: string;
  type: ReminderType;
  message: string;
  scheduledFor: string;
  status: ReminderStatus;
  metadata?: string | null;
  retryCount: number;
  batchNumber?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ReminderType = 'EMAIL' | 'SMS' | 'PUSH';
export type ReminderStatus = 'PENDING' | 'SENT' | 'FAILED' | 'CANCELLED';

// Notification preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderDays: number[]; // Days before due date to send reminders
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string;
}

// Push notification subscription
export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: string;
}

// DTOs for API requests/responses
export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export interface CreateReminderRequest {
  childId: string;
  parentId: string;
  vaccineId: string;
  type: ReminderType;
  message: string;
  scheduledFor: string;
  metadata?: any;
}

export interface UpdateReminderRequest {
  status?: ReminderStatus;
  retryCount?: number;
  errorMessage?: string;
}

export interface SendReminderRequest {
  reminderId: string;
  channel: ReminderType;
}

export interface NotificationSearchParams {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ReminderSearchParams {
  childId?: string;
  parentId?: string;
  status?: ReminderStatus;
  scheduledFrom?: string;
  scheduledTo?: string;
  page?: number;
  limit?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  sentToday: number;
  failedReminders: number;
}

// WebSocket events
export interface WebSocketMessage {
  type: 'NOTIFICATION' | 'REMINDER' | 'ALERT';
  data: any;
  timestamp: string;
}

// State interface
export interface NotificationsState {
  notifications: Notification[];
  reminders: Reminder[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  pushSubscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}