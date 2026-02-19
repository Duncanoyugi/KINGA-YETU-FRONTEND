import {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  DEFAULT_DATETIME_FORMAT,
  DEFAULT_TIMEZONE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  IS_DEVELOPMENT,
} from './environment';

/**
 * Application Configuration
 * Centralizes all app-wide settings and feature flags
 */

export const APP_CONFIG = {
  // App info
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION,
  
  // URLs
  urls: {
    website: 'https://immunitrack.co.ke',
    support: 'https://support.immunitrack.co.ke',
    privacy: 'https://immunitrack.co.ke/privacy',
    terms: 'https://immunitrack.co.ke/terms',
    docs: 'https://docs.immunitrack.co.ke',
  },
  
  // Contact
  contact: {
    email: 'support@immunitrack.co.ke',
    phone: '+254700123456',
    address: 'Nairobi, Kenya',
  },
  
  // Social media
  social: {
    facebook: 'https://facebook.com/immunitrack',
    twitter: 'https://twitter.com/immunitrack',
    linkedin: 'https://linkedin.com/company/immunitrack',
  },
};

// Date and Time Configuration
export const DATE_CONFIG = {
  formats: {
    display: DEFAULT_DATE_FORMAT,
    time: DEFAULT_TIME_FORMAT,
    datetime: DEFAULT_DATETIME_FORMAT,
    iso: 'yyyy-MM-dd',
    isoWithTime: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
    api: 'yyyy-MM-dd',
    apiWithTime: 'yyyy-MM-dd HH:mm:ss',
    monthYear: 'MMMM yyyy',
    year: 'yyyy',
  },
  timezone: DEFAULT_TIMEZONE,
  weekStartsOn: 1, // Monday
  firstWeekContainsDate: 4,
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  maxPageSize: MAX_PAGE_SIZE,
  pageSizes: [10, 25, 50, 100],
  showFirstLast: true,
  showPrevNext: true,
  siblingCount: 1,
};

// Table Configuration
export const TABLE_CONFIG = {
  defaultSortDirection: 'asc' as const,
  rowsPerPageOptions: [10, 25, 50, 100],
  enableSelection: true,
  enableExport: true,
  enableColumnVisibility: true,
};

// Chart Configuration
export const CHART_CONFIG = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    gray: '#6b7280',
  },
  colorPalettes: {
    qualitative: [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#6b7280', '#6366f1',
    ],
    sequential: [
      '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6',
      '#4292c6', '#2171b5', '#08519c', '#08306b',
    ],
    diverging: [
      '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf',
      '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850',
    ],
  },
  defaultHeight: 300,
  animation: {
    duration: 300,
    easing: 'ease-in-out',
  },
};

// Form Configuration
export const FORM_CONFIG = {
  validationMode: 'onBlur' as const,
  reValidateMode: 'onChange' as const,
  defaultValues: {},
  shouldFocusError: true,
  shouldUnregister: false,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  accept: {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  },
  multiple: true,
  maxFiles: 5,
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  position: 'top-right' as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light' as const,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'immunitrack_theme',
  LANGUAGE: 'immunitrack_language',
  TOKEN: 'immunitrack_token',
  REFRESH_TOKEN: 'immunitrack_refresh_token',
  USER: 'immunitrack_user',
  PREFERENCES: 'immunitrack_preferences',
  SIDEBAR_STATE: 'immunitrack_sidebar_state',
  DASHBOARD_LAYOUT: 'immunitrack_dashboard_layout',
};

// Theme Configuration
export const THEME_CONFIG = {
  defaultTheme: 'system' as const,
  themes: ['light', 'dark', 'system'] as const,
  colors: {
    light: {
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      primary: '#3b82f6',
      secondary: '#10b981',
    },
    dark: {
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      border: '#374151',
      primary: '#60a5fa',
      secondary: '#34d399',
    },
  },
};

// Language Configuration
export const LANGUAGE_CONFIG = {
  defaultLanguage: 'en' as const,
  languages: [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  ] as const,
  fallbackLanguage: 'en',
};

// Feature Flags
export const FEATURES = {
  analytics: true,
  notifications: true,
  offlineMode: true,
  pushNotifications: true,
  darkMode: true,
  twoFactorAuth: true,
  exportData: true,
  bulkImport: true,
  auditLogs: true,
  reports: true,
  realTimeUpdates: true,
};

// Role-based access control
export const RBAC_CONFIG = {
  roles: {
    SUPER_ADMIN: {
      name: 'Super Administrator',
      permissions: ['*'],
      priority: 100,
    },
    ADMIN: {
      name: 'Administrator',
      permissions: ['users:*', 'facilities:*', 'reports:*', 'analytics:*'],
      priority: 80,
    },
    COUNTY_ADMIN: {
      name: 'County Administrator',
      permissions: ['users:read', 'facilities:manage', 'reports:generate'],
      priority: 60,
    },
    FACILITY_ADMIN: {
      name: 'Facility Administrator',
      permissions: ['children:*', 'vaccines:*', 'reports:read'],
      priority: 40,
    },
    HEALTH_WORKER: {
      name: 'Health Worker',
      permissions: ['children:read', 'children:update', 'vaccines:administer'],
      priority: 20,
    },
    PARENT: {
      name: 'Parent',
      permissions: ['children:read', 'children:update'],
      priority: 10,
    },
  },
};

// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  widgets: {
    stats: { enabled: true, defaultSize: 'small' },
    activityChart: { enabled: true, defaultSize: 'medium' },
    alerts: { enabled: true, defaultSize: 'medium' },
    map: { enabled: true, defaultSize: 'large' },
    recentActivities: { enabled: true, defaultSize: 'medium' },
    upcomingVaccinations: { enabled: true, defaultSize: 'medium' },
  },
  refreshInterval: 30000, // 30 seconds
  defaultLayout: 'grid' as const,
};

// Cache Configuration
export const CACHE_CONFIG = {
  enable: true,
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100, // Maximum number of items in cache
  storage: 'memory' as const,
};

// Development tools
if (IS_DEVELOPMENT) {
  console.log('⚙️ App Config loaded:', {
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
    features: FEATURES,
  });
}