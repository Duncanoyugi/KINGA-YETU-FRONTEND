import { ENABLE_PUSH_NOTIFICATIONS, WS_URL, IS_DEVELOPMENT, VAPID_PUBLIC_KEY } from './environment';

/**
 * Notification Configuration
 * Manages all notification-related settings
 */

// WebSocket Configuration
export const WS_CONFIG = {
  url: WS_URL,
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  withCredentials: true,
};

// Push Notification Configuration
export const PUSH_NOTIFICATION_CONFIG = {
  enabled: ENABLE_PUSH_NOTIFICATIONS,
  publicKey: VAPID_PUBLIC_KEY,
  serviceWorkerPath: '/service-worker.js',
  applicationServerKey: VAPID_PUBLIC_KEY,
  userVisibleOnly: true,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  VACCINE_REMINDER: 'vaccine_reminder',
  APPOINTMENT_CONFIRMATION: 'appointment_confirmation',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  VACCINE_DUE: 'vaccine_due',
  VACCINE_OVERDUE: 'vaccine_overdue',
  VACCINE_ADMINISTERED: 'vaccine_administered',
  REPORT_READY: 'report_ready',
  REPORT_SCHEDULED: 'report_scheduled',
  SYSTEM_ALERT: 'system_alert',
  SECURITY_ALERT: 'security_alert',
  ACCOUNT_UPDATE: 'account_update',
  PASSWORD_CHANGED: 'password_changed',
  LOGIN_ALERT: 'login_alert',
  DATA_EXPORT_READY: 'data_export_ready',
  WELCOME_MESSAGE: 'welcome_message',
  FEEDBACK_REQUEST: 'feedback_request',
  MILESTONE_ACHIEVED: 'milestone_achieved',
} as const;

// Notification Priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Notification Channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app',
  WHATSAPP: 'whatsapp',
} as const;

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  email: {
    enabled: true,
    types: [
      NOTIFICATION_TYPES.VACCINE_REMINDER,
      NOTIFICATION_TYPES.APPOINTMENT_CONFIRMATION,
      NOTIFICATION_TYPES.REPORT_READY,
      NOTIFICATION_TYPES.SECURITY_ALERT,
    ],
    immediate: true,
  },
  sms: {
    enabled: true,
    types: [
      NOTIFICATION_TYPES.VACCINE_REMINDER,
      NOTIFICATION_TYPES.APPOINTMENT_REMINDER,
      NOTIFICATION_TYPES.VACCINE_DUE,
      NOTIFICATION_TYPES.VACCINE_OVERDUE,
    ],
    immediate: true,
  },
  push: {
    enabled: true,
    types: [
      NOTIFICATION_TYPES.VACCINE_REMINDER,
      NOTIFICATION_TYPES.APPOINTMENT_REMINDER,
      NOTIFICATION_TYPES.VACCINE_ADMINISTERED,
      NOTIFICATION_TYPES.SYSTEM_ALERT,
    ],
    immediate: true,
  },
  in_app: {
    enabled: true,
    types: Object.values(NOTIFICATION_TYPES),
    immediate: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '06:00',
    timezone: 'Africa/Nairobi',
    allowEmergency: true,
  },
  reminderSettings: {
    enabled: true,
    advanceDays: [7, 3, 1],
    reminderTimes: ['09:00', '14:00'],
    maxReminders: 3,
    requireConfirmation: false,
  },
  digestSettings: {
    enabled: false,
    frequency: 'daily',
    time: '18:00',
    includeTypes: [
      NOTIFICATION_TYPES.REPORT_READY,
      NOTIFICATION_TYPES.MILESTONE_ACHIEVED,
    ],
  },
};

// Notification Templates
export const NOTIFICATION_TEMPLATES = {
  // Vaccine reminders
  [NOTIFICATION_TYPES.VACCINE_REMINDER]: {
    email: {
      subject: 'Vaccination Reminder for {{childName}}',
      body: `
        Dear {{parentName}},
        
        This is a reminder that {{childName}} is due for {{vaccineName}} on {{dueDate}}.
        Please visit {{facilityName}} at {{facilityAddress}}.
        
        Thank you for keeping your child healthy!
      `,
    },
    sms: {
      body: 'Reminder: {{childName}} due for {{vaccineName}} on {{dueDate}}. Visit {{facilityName}}.',
    },
    push: {
      title: 'Vaccination Reminder',
      body: '{{childName}} is due for {{vaccineName}} on {{dueDate}}',
    },
  },

  // Appointment confirmation
  [NOTIFICATION_TYPES.APPOINTMENT_CONFIRMATION]: {
    email: {
      subject: 'Appointment Confirmation',
      body: `
        Dear {{parentName}},
        
        Your appointment for {{childName}} has been confirmed for:
        Date: {{appointmentDate}}
        Time: {{appointmentTime}}
        Location: {{facilityName}}
        
        Please arrive 15 minutes early.
      `,
    },
    sms: {
      body: 'Appointment confirmed for {{childName}} on {{appointmentDate}} at {{appointmentTime}}.',
    },
    push: {
      title: 'Appointment Confirmed',
      body: '{{childName}} - {{appointmentDate}} at {{appointmentTime}}',
    },
  },

  // Report ready
  [NOTIFICATION_TYPES.REPORT_READY]: {
    email: {
      subject: 'Your Report is Ready',
      body: `
        Dear {{userName}},
        
        Your {{reportType}} report is now ready for download.
        You can access it from your dashboard or click the link below:
        
        {{reportLink}}
        
        This report will be available for {{expiryDays}} days.
      `,
    },
    push: {
      title: 'Report Ready',
      body: 'Your {{reportType}} report is now available',
    },
  },

  // Security alert
  [NOTIFICATION_TYPES.SECURITY_ALERT]: {
    email: {
      subject: 'Security Alert: New Login Detected',
      body: `
        Dear {{userName}},
        
        A new login to your account was detected:
        Device: {{device}}
        Location: {{location}}
        Time: {{loginTime}}
        
        If this wasn't you, please change your password immediately.
      `,
    },
    sms: {
      body: 'Security alert: New login detected from {{device}} at {{loginTime}}',
    },
    push: {
      title: 'Security Alert',
      body: 'New login detected from {{device}}',
      priority: NOTIFICATION_PRIORITIES.HIGH,
    },
  },
};

// WebSocket Events
export const WS_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT: 'reconnect',
  
  // Notification events
  NOTIFICATION: 'notification',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_DELETED: 'notification:deleted',
  
  // Reminder events
  REMINDER: 'reminder',
  REMINDER_SENT: 'reminder:sent',
  REMINDER_FAILED: 'reminder:failed',
  
  // Alert events
  ALERT: 'alert',
  ALERT_ACKNOWLEDGED: 'alert:acknowledged',
  ALERT_RESOLVED: 'alert:resolved',
  
  // Real-time updates
  VACCINATION_RECORDED: 'vaccination:recorded',
  CHILD_REGISTERED: 'child:registered',
  APPOINTMENT_SCHEDULED: 'appointment:scheduled',
  APPOINTMENT_UPDATED: 'appointment:updated',
  INVENTORY_UPDATED: 'inventory:updated',
  
  // System events
  SYSTEM_STATUS: 'system:status',
  SYSTEM_MAINTENANCE: 'system:maintenance',
};

// Notification Display Settings
export const NOTIFICATION_DISPLAY = {
  maxInList: 50,
  maxInDropdown: 10,
  autoHideDuration: 5000,
  showTimestamps: true,
  groupSimilar: true,
  playSound: true,
  soundFile: '/sounds/notification.mp3',
  vibration: true,
  vibrationPattern: [200, 100, 200],
};

// Email Configuration
export const EMAIL_CONFIG = {
  from: 'ImmuniTrack Kenya <notifications@immunitrack.co.ke>',
  replyTo: 'support@immunitrack.co.ke',
  footer: `
    <hr />
    <p style="color: #666; font-size: 12px;">
      This is an automated message from ImmuniTrack Kenya.<br />
      Please do not reply to this email.<br />
      For assistance, contact support@immunitrack.co.ke
    </p>
  `,
  logo: 'https://immunitrack.co.ke/logo.png',
};

// SMS Configuration
export const SMS_CONFIG = {
  senderId: 'ImmuniTrack',
  maxLength: 160,
  unicodeSupport: true,
  deliveryReports: true,
};

// Push Notification Icons
export const PUSH_ICONS = {
  default: '/icons/icon-192.png',
  success: '/icons/success.png',
  warning: '/icons/warning.png',
  error: '/icons/error.png',
  info: '/icons/info.png',
};

// Notification Sounds
export const NOTIFICATION_SOUNDS = {
  default: '/sounds/notification.mp3',
  reminder: '/sounds/reminder.mp3',
  alert: '/sounds/alert.mp3',
  success: '/sounds/success.mp3',
};

// Development tools
if (IS_DEVELOPMENT) {
  console.log('🔔 Notification Config loaded:', {
    wsUrl: WS_CONFIG.url,
    pushEnabled: PUSH_NOTIFICATION_CONFIG.enabled,
    channels: Object.keys(NOTIFICATION_CHANNELS),
    events: Object.keys(WS_EVENTS).length,
  });
}

// Export all configurations
export const NOTIFICATION_CONFIG = {
  ws: WS_CONFIG,
  push: PUSH_NOTIFICATION_CONFIG,
  types: NOTIFICATION_TYPES,
  priorities: NOTIFICATION_PRIORITIES,
  channels: NOTIFICATION_CHANNELS,
  defaults: DEFAULT_NOTIFICATION_PREFERENCES,
  templates: NOTIFICATION_TEMPLATES,
  events: WS_EVENTS,
  display: NOTIFICATION_DISPLAY,
  email: EMAIL_CONFIG,
  sms: SMS_CONFIG,
  icons: PUSH_ICONS,
  sounds: NOTIFICATION_SOUNDS,
};