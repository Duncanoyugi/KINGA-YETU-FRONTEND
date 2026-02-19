// App constants
export const APP_NAME = 'ImmuniTrack Kenya';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Child Immunization Tracking System';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'immunitrack_token',
  REFRESH_TOKEN: 'immunitrack_refresh_token',
  USER: 'immunitrack_user',
  THEME: 'immunitrack_theme',
  LANGUAGE: 'immunitrack_language',
  PREFERENCES: 'immunitrack_preferences',
  LAST_ACTIVE: 'immunitrack_last_active',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
  },
  CHILDREN: {
    BASE: '/children',
    GROWTH: '/children/:id/growth',
    DEVELOPMENT: '/children/:id/development',
    IMMUNIZATIONS: '/children/:id/immunizations',
    SCHEDULE: '/children/:id/schedule',
  },
  VACCINES: {
    BASE: '/vaccines',
    INVENTORY: '/vaccines/inventory',
    BATCHES: '/vaccines/batches',
    ALERTS: '/vaccines/alerts',
  },
  PARENTS: {
    BASE: '/parents',
    CHILDREN: '/parents/:id/children',
    REMINDERS: '/parents/:id/reminders',
  },
  REPORTS: {
    BASE: '/reports',
    GENERATE: '/reports/generate',
    SCHEDULED: '/reports/scheduled',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    COVERAGE: '/analytics/coverage',
    DROPOUT: '/analytics/dropout',
    PERFORMANCE: '/analytics/performance',
  },
} as const;

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// User roles
export const USER_ROLES = {
  PARENT: 'PARENT',
  HEALTH_WORKER: 'HEALTH_WORKER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  COUNTY_ADMIN: 'COUNTY_ADMIN',
  FACILITY_ADMIN: 'FACILITY_ADMIN',
} as const;

// Permissions
export const PERMISSIONS = {
  // User permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Child permissions
  CHILD_CREATE: 'child:create',
  CHILD_READ: 'child:read',
  CHILD_UPDATE: 'child:update',
  CHILD_DELETE: 'child:delete',
  
  // Vaccine permissions
  VACCINE_CREATE: 'vaccine:create',
  VACCINE_READ: 'vaccine:read',
  VACCINE_UPDATE: 'vaccine:update',
  VACCINE_DELETE: 'vaccine:delete',
  
  // Report permissions
  REPORT_GENERATE: 'report:generate',
  REPORT_READ: 'report:read',
  REPORT_EXPORT: 'report:export',
  
  // Facility permissions
  FACILITY_MANAGE: 'facility:manage',
  
  // System permissions
  SYSTEM_CONFIGURE: 'system:configure',
  AUDIT_VIEW: 'audit:view',
} as const;

// Vaccine constants
export const VACCINE_CONSTANTS = {
  DEFAULT_REMINDER_DAYS: [7, 3, 1],
  MAX_REMINDER_RETRIES: 3,
  MIN_STOCK_THRESHOLD: 10,
  EXPIRY_WARNING_DAYS: 30,
  STORAGE_TEMPERATURE: {
    fridge: '2°C to 8°C',
    freezer: '-15°C to -25°C',
    roomTemp: '15°C to 25°C',
  },
} as const;

// Age groups (in months)
export const AGE_GROUPS = {
  INFANT: { min: 0, max: 12, label: '0-11 months' },
  TODDLER: { min: 12, max: 24, label: '12-23 months' },
  PRESCHOOL: { min: 24, max: 60, label: '24-59 months' },
  SCHOOL_AGE: { min: 60, max: 144, label: '5-11 years' },
  ADOLESCENT: { min: 144, max: 216, label: '12-17 years' },
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm',
  TIME_12H: 'hh:mm a',
  MONTH_YEAR: 'MMMM yyyy',
  YEAR: 'yyyy',
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^\+?[1-9]\d{1,14}$/, // E.164 format
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s\-']+$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d*\.?\d+$/,
  BIRTH_CERTIFICATE: /^[A-Z0-9-]+$/i,
  MFL_CODE: /^[A-Z0-9]{5,10}$/i,
  BATCH_NUMBER: /^[A-Z0-9\-]+$/i,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_NUMBER: 'Please enter a valid number',
  MIN_VALUE: (min: number) => `Value must be at least ${min}`,
  MAX_VALUE: (max: number) => `Value must not exceed ${max}`,
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error. Please try again later',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  REGISTER: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  CHILD_ADDED: 'Child added successfully',
  CHILD_UPDATED: 'Child updated successfully',
  CHILD_DELETED: 'Child deleted successfully',
  VACCINE_RECORDED: 'Vaccination recorded successfully',
  REPORT_GENERATED: 'Report generated successfully',
  REPORT_EXPORTED: 'Report exported successfully',
  REMINDER_SENT: 'Reminder sent successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
  secondary: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  info: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'],
  gray: ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'],
} as const;

// Theme
export const THEME = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

// Languages
export const LANGUAGES = {
  en: { code: 'en', name: 'English', native: 'English' },
  sw: { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_SPREADSHEETS: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
} as const;

// Local storage defaults
export const STORAGE_DEFAULTS = {
  THEME: THEME.system,
  LANGUAGE: LANGUAGES.en.code,
} as const;