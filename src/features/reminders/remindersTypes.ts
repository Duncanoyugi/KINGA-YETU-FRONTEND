// Reminder types for the frontend
export interface Reminder {
  id: string;
  childId: string;
  vaccineId: string;
  scheduledDate: string;
  reminderDate: string;
  status: ReminderStatus;
  notificationMethod: NotificationMethod[];
  isSent: boolean;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReminderStatus = 'PENDING' | 'SENT' | 'FAILED' | 'CANCELLED';

export type NotificationMethod = 'EMAIL' | 'SMS' | 'PUSH';

export interface ReminderSettings {
  id: string;
  userId: string;
  defaultReminderDays: number;
  enableEmail: boolean;
  enableSms: boolean;
  enablePush: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  childId: string;
  vaccineId: string;
  scheduledDate: string;
  reminderDate: string;
  notificationMethod: NotificationMethod[];
}

export interface UpdateReminderRequest {
  scheduledDate?: string;
  reminderDate?: string;
  status?: ReminderStatus;
  notificationMethod?: NotificationMethod[];
}

export interface ReminderFilter {
  childId?: string;
  status?: ReminderStatus;
  startDate?: string;
  endDate?: string;
}
