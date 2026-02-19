// Forward declarations to avoid circular dependency
import type { Child } from './child.types.js';
// Note: Parent is used as a type only in optional fields, not as a value
type Parent = import('./parent.types.js').Parent;
import type { Vaccine } from './vaccine.types.js';

// Core Reminder model
export interface Reminder {
  id: string;
  childId: string;
  parentId: string;
  vaccineId: string;
  
  type: ReminderType;
  channel: ReminderChannel;
  priority: ReminderPriority;
  
  title: string;
  message: string;
  
  scheduledFor: string;
  sentAt?: string | null;
  readAt?: string | null;
  actionedAt?: string | null;
  
  status: ReminderStatus;
  retryCount: number;
  maxRetries: number;
  
  metadata?: ReminderMetadata | null;
  errorMessage?: string | null;
  
  batchNumber?: string | null;
  trackingId?: string | null;
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  child?: Child;
  parent?: Parent;
  vaccine?: Vaccine;
}

export interface ReminderMetadata {
  dueDate?: string;
  appointmentDate?: string;
  facilityName?: string;
  facilityAddress?: string;
  healthWorkerName?: string;
  vaccineName?: string;
  doseNumber?: number;
  alternateContacts?: string[];
  cancellationReason?: string;
  rescheduledDate?: string;
  customFields?: Record<string, any>;
}

// Reminder template
export interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  channel: ReminderChannel;
  subject?: string;
  title: string;
  message: string;
  variables: string[];
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Reminder schedule
export interface ReminderSchedule {
  id: string;
  childId: string;
  vaccineId: string;
  
  dueDate: string;
  schedule: ScheduledReminder[];
  
  status: 'active' | 'completed' | 'cancelled';
  completedAt?: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledReminder {
  daysBefore: number;
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
  reminderId?: string;
}

// Reminder analytics
export interface ReminderAnalytics {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  actioned: number;
  failed: number;
  
  byChannel: Record<ReminderChannel, ChannelStats>;
  byType: Record<ReminderType, number>;
  byPriority: Record<ReminderPriority, number>;
  
  deliveryRate: number;
  openRate: number;
  actionRate: number;
  
  averageDeliveryTime: number; // in seconds
  averageOpenTime: number; // in seconds
  averageActionTime: number; // in seconds
  
  timeline: Array<{
    date: string;
    sent: number;
    delivered: number;
    opened: number;
  }>;
}

export interface ChannelStats {
  sent: number;
  delivered: number;
  failed: number;
  cost?: number;
}

// Enums
export type ReminderType = 
  | 'VACCINE_DUE'
  | 'VACCINE_OVERDUE'
  | 'APPOINTMENT_CONFIRMATION'
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_CANCELLED'
  | 'GROWTH_RECORD_DUE'
  | 'MISSED_VISIT'
  | 'FOLLOW_UP'
  | 'GENERAL';

export type ReminderChannel = 
  | 'EMAIL'
  | 'SMS'
  | 'PUSH'
  | 'WHATSAPP'
  | 'USSD'
  | 'VOICE';

export type ReminderPriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type ReminderStatus = 
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'ACTIONED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

// DTOs for requests
export interface CreateReminderRequest {
  childId: string;
  parentId: string;
  vaccineId: string;
  
  type: ReminderType;
  channel: ReminderChannel;
  priority?: ReminderPriority;
  
  title: string;
  message: string;
  
  scheduledFor: string;
  metadata?: ReminderMetadata;
}

export interface CreateBatchRemindersRequest {
  reminders: CreateReminderRequest[];
  sendImmediately?: boolean;
}

export interface UpdateReminderRequest {
  scheduledFor?: string;
  status?: ReminderStatus;
  priority?: ReminderPriority;
  metadata?: ReminderMetadata;
  maxRetries?: number;
}

export interface CancelReminderRequest {
  reminderId: string;
  reason: string;
  notify?: boolean;
}

export interface ReminderSearchParams {
  childId?: string;
  parentId?: string;
  vaccineId?: string;
  type?: ReminderType;
  channel?: ReminderChannel;
  status?: ReminderStatus;
  priority?: ReminderPriority;
  scheduledFrom?: string;
  scheduledTo?: string;
  sentFrom?: string;
  sentTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Reminder statistics
export interface ReminderStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  
  today: number;
  thisWeek: number;
  thisMonth: number;
  
  byType: Record<ReminderType, number>;
  byStatus: Record<ReminderStatus, number>;
  byPriority: Record<ReminderPriority, number>;
  
  successRate: number;
  failureRate: number;
  
  averageRetries: number;
  
  upcoming: number;
  overdue: number;
}

// Reminder preferences (per parent)
export interface ReminderPreferences {
  parentId: string;
  
  enabled: boolean;
  channels: ReminderChannel[];
  
  timing: {
    daysBefore: number[]; // e.g., [7, 3, 1]
    timeOfDay: string; // HH:mm
    timezone: string;
  };
  
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  
  types: ReminderType[]; // Which types to send
  
  maxPerDay: number;
  
  language: string;
  
  updatedAt: string;
}

// Reminder delivery receipt
export interface DeliveryReceipt {
  reminderId: string;
  channel: ReminderChannel;
  status: 'delivered' | 'failed' | 'pending';
  timestamp: string;
  provider?: string;
  messageId?: string;
  cost?: number;
  error?: string;
}