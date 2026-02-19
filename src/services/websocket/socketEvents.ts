/**
 * WebSocket event definitions
 */

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
  
  // Authentication events
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  UNAUTHORIZED: 'unauthorized',
  
  // Notification events
  NOTIFICATION: 'notification',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETED: 'notification:deleted',
  NOTIFICATION_COUNT: 'notification:count',
  
  // Reminder events
  REMINDER: 'reminder',
  REMINDER_SENT: 'reminder:sent',
  REMINDER_FAILED: 'reminder:failed',
  REMINDER_ACKNOWLEDGED: 'reminder:acknowledged',
  
  // Alert events
  ALERT: 'alert',
  ALERT_CREATED: 'alert:created',
  ALERT_UPDATED: 'alert:updated',
  ALERT_ACKNOWLEDGED: 'alert:acknowledged',
  ALERT_RESOLVED: 'alert:resolved',
  
  // Real-time updates
  VACCINATION_RECORDED: 'vaccination:recorded',
  CHILD_REGISTERED: 'child:registered',
  CHILD_UPDATED: 'child:updated',
  APPOINTMENT_SCHEDULED: 'appointment:scheduled',
  APPOINTMENT_UPDATED: 'appointment:updated',
  APPOINTMENT_CANCELLED: 'appointment:cancelled',
  INVENTORY_UPDATED: 'inventory:updated',
  INVENTORY_LOW_STOCK: 'inventory:low_stock',
  BATCH_EXPIRING: 'batch:expiring',
  
  // System events
  SYSTEM_STATUS: 'system:status',
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_UPDATE: 'system:update',
  
  // User presence
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_TYPING: 'user:typing',
  
  // Chat events
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  CHAT_READ: 'chat:read',
  
  // Dashboard updates
  DASHBOARD_REFRESH: 'dashboard:refresh',
  STATS_UPDATE: 'stats:update',
  
  // Error events
  ERROR_VALIDATION: 'error:validation',
  ERROR_PERMISSION: 'error:permission',
  ERROR_SERVER: 'error:server',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

// Event payload types
export interface NotificationEventPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  userId: string;
  timestamp: string;
  data?: any;
}

export interface ReminderEventPayload {
  id: string;
  childId: string;
  vaccineId: string;
  dueDate: string;
  message: string;
}

export interface AlertEventPayload {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  facilityId?: string;
  timestamp: string;
  expiresAt?: string;
}

export interface VaccinationEventPayload {
  id: string;
  childId: string;
  childName: string;
  vaccineId: string;
  vaccineName: string;
  dateAdministered: string;
  facilityId: string;
}

export interface InventoryEventPayload {
  vaccineId: string;
  vaccineName: string;
  facilityId: string;
  batchNumber: string;
  currentQuantity: number;
  threshold?: number;
}

export interface SystemEventPayload {
  status: 'healthy' | 'degraded' | 'down';
  message: string;
  timestamp: string;
  maintenance?: {
    startTime: string;
    endTime: string;
    description: string;
  };
}

export interface UserPresencePayload {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface ChatMessagePayload {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Event handler types
export type NotificationHandler = (payload: NotificationEventPayload) => void;
export type ReminderHandler = (payload: ReminderEventPayload) => void;
export type AlertHandler = (payload: AlertEventPayload) => void;
export type VaccinationHandler = (payload: VaccinationEventPayload) => void;
export type InventoryHandler = (payload: InventoryEventPayload) => void;
export type SystemHandler = (payload: SystemEventPayload) => void;
export type UserPresenceHandler = (payload: UserPresencePayload) => void;
export type ChatHandler = (payload: ChatMessagePayload) => void;
export type ErrorHandler = (error: { code: string; message: string }) => void;

// Event maps for type-safe handlers
export interface EventHandlerMap {
  [SOCKET_EVENTS.NOTIFICATION]: NotificationHandler;
  [SOCKET_EVENTS.REMINDER]: ReminderHandler;
  [SOCKET_EVENTS.ALERT]: AlertHandler;
  [SOCKET_EVENTS.VACCINATION_RECORDED]: VaccinationHandler;
  [SOCKET_EVENTS.INVENTORY_LOW_STOCK]: InventoryHandler;
  [SOCKET_EVENTS.SYSTEM_STATUS]: SystemHandler;
  [SOCKET_EVENTS.USER_ONLINE]: UserPresenceHandler;
  [SOCKET_EVENTS.USER_OFFLINE]: UserPresenceHandler;
  [SOCKET_EVENTS.CHAT_MESSAGE]: ChatHandler;
  [SOCKET_EVENTS.ERROR_VALIDATION]: ErrorHandler;
  [SOCKET_EVENTS.ERROR_PERMISSION]: ErrorHandler;
  [SOCKET_EVENTS.ERROR_SERVER]: ErrorHandler;
}