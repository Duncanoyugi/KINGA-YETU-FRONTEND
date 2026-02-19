import type { User } from './user.types.js';

// Core Notification model
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData | null;
  isRead: boolean;
  isArchived: boolean;
  priority: NotificationPriority;
  sentAt: string;
  readAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  
  user?: User;
}

// Notification data (JSON structure)
export interface NotificationData {
  actionUrl?: string;
  imageUrl?: string;
  icon?: string;
  metadata?: Record<string, any>;
  childId?: string;
  vaccineId?: string;
  appointmentId?: string;
  reportId?: string;
}

// Push notification subscription
export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  deviceInfo: DeviceInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'other';
  platform: 'ios' | 'android' | 'web' | 'windows' | 'mac';
  browser?: string;
  model?: string;
  version?: string;
}

// Notification preferences
export interface NotificationPreferences {
  userId: string;
  email: ChannelPreferences;
  sms: ChannelPreferences;
  push: ChannelPreferences;
  inApp: ChannelPreferences;
  quietHours: QuietHours;
  reminderSettings: ReminderSettings;
  digestSettings: DigestSettings;
  updatedAt: string;
}

export interface ChannelPreferences {
  enabled: boolean;
  types: NotificationType[]; // Which types to send via this channel
  immediate: boolean; // Send immediately or batch
}

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:mm
  end: string; // HH:mm
  timezone: string;
  allowEmergency: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  advanceDays: number[]; // e.g., [7, 3, 1]
  reminderTimes: string[]; // e.g., ["09:00", "14:00"]
  maxReminders: number;
  requireConfirmation: boolean;
}

export interface DigestSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly';
  time: string; // HH:mm
  dayOfWeek?: number; // 0-6 for weekly digest
  includeTypes: NotificationType[];
}

// Template
export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject?: string;
  title: string;
  body: string;
  variables: string[];
  channels: ChannelType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Enums
export type NotificationType = 
  | 'VACCINE_REMINDER'
  | 'APPOINTMENT_CONFIRMATION'
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CANCELLED'
  | 'VACCINE_DUE'
  | 'VACCINE_OVERDUE'
  | 'VACCINE_ADMINISTERED'
  | 'REPORT_READY'
  | 'REPORT_SCHEDULED'
  | 'SYSTEM_ALERT'
  | 'SECURITY_ALERT'
  | 'ACCOUNT_UPDATE'
  | 'PASSWORD_CHANGED'
  | 'LOGIN_ALERT'
  | 'DATA_EXPORT_READY'
  | 'WELCOME_MESSAGE'
  | 'FEEDBACK_REQUEST'
  | 'MILESTONE_ACHIEVED';

export type NotificationPriority = 
  | 'LOW' 
  | 'NORMAL' 
  | 'HIGH' 
  | 'URGENT';

export type ChannelType = 
  | 'EMAIL' 
  | 'SMS' 
  | 'PUSH' 
  | 'IN_APP' 
  | 'WHATSAPP';

export type NotificationStatus = 
  | 'PENDING' 
  | 'SENT' 
  | 'DELIVERED' 
  | 'READ' 
  | 'FAILED' 
  | 'CANCELLED';

// DTOs for requests
export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  priority?: NotificationPriority;
  scheduledFor?: string;
  expiresAt?: string;
}

export interface SendBulkNotificationRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  priority?: NotificationPriority;
}

export interface UpdateNotificationPreferencesRequest {
  email?: Partial<ChannelPreferences>;
  sms?: Partial<ChannelPreferences>;
  push?: Partial<ChannelPreferences>;
  inApp?: Partial<ChannelPreferences>;
  quietHours?: Partial<QuietHours>;
  reminderSettings?: Partial<ReminderSettings>;
  digestSettings?: Partial<DigestSettings>;
}

export interface MarkAsReadRequest {
  notificationIds: string[];
  readAll?: boolean;
}

// Statistics
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  sentToday: number;
  sentThisWeek: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export interface DeliveryReport {
  notificationId: string;
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  opened: number;
  clicked: number;
  failures: Array<{
    userId: string;
    reason: string;
    timestamp: string;
  }>;
}

// WebSocket events
export interface WebSocketMessage {
  type: 'NOTIFICATION' | 'REMINDER' | 'ALERT' | 'STATUS_UPDATE';
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'READ';
  data: any;
  timestamp: string;
}

// In-app notification center
export interface NotificationCenter {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  hasMore: boolean;
  filters: {
    types?: NotificationType[];
    isRead?: boolean;
    priority?: NotificationPriority[];
  };
}