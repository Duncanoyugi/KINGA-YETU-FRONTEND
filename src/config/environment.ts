/**
 * Environment configuration
 * Centralizes all environment variables with type safety and defaults
 */

// Environment type
export type Environment = 'development' | 'staging' | 'production';

// Get current environment
export const NODE_ENV = (import.meta.env.MODE as Environment) || 'development';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_URL = `${API_BASE_URL}/api`;
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ImmuniTrack Kenya';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const APP_DESCRIPTION = 'Child Immunization Tracking System';

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_NOTIFICATIONS = import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true';
export const ENABLE_OFFLINE_MODE = import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true';
export const ENABLE_PUSH_NOTIFICATIONS = import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true';
export const ENABLE_DARK_MODE = import.meta.env.VITE_ENABLE_DARK_MODE === 'true';
export const ENABLE_2FA = import.meta.env.VITE_ENABLE_2FA === 'true';

// VAPID Configuration for Push Notifications
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

// Authentication
export const TOKEN_KEY = 'immunitrack_token';
export const REFRESH_TOKEN_KEY = 'immunitrack_refresh_token';
export const USER_KEY = 'immunitrack_user';
export const TOKEN_EXPIRY_DAYS = 7;
export const REFRESH_TOKEN_EXPIRY_DAYS = 30;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Date and Time
export const DEFAULT_DATE_FORMAT = 'MMM dd, yyyy';
export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const DEFAULT_TIMEZONE = 'Africa/Nairobi';

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Cache Configuration
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const GC_TIME = 10 * 60 * 1000; // 10 minutes

// Map Configuration (if using maps)
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
export const DEFAULT_MAP_CENTER: [number, number] = [-1.286389, 36.817223]; // Nairobi
export const DEFAULT_MAP_ZOOM = 8;

// Feature availability based on environment
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_STAGING = NODE_ENV === 'staging';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Debug mode
export const DEBUG_MODE = IS_DEVELOPMENT || import.meta.env.VITE_DEBUG_MODE === 'true';

// Sentry (error tracking)
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
export const SENTRY_ENABLED = IS_PRODUCTION && !!SENTRY_DSN;

// Analytics
export const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '';

// Export environment check helpers
export const isDevelopment = () => IS_DEVELOPMENT;
export const isStaging = () => IS_STAGING;
export const isProduction = () => IS_PRODUCTION;

// Log environment info in development
if (IS_DEVELOPMENT) {
  console.log('🌍 Environment:', {
    NODE_ENV,
    API_URL,
    APP_NAME,
    APP_VERSION,
    features: {
      analytics: ENABLE_ANALYTICS,
      notifications: ENABLE_NOTIFICATIONS,
      offlineMode: ENABLE_OFFLINE_MODE,
      pushNotifications: ENABLE_PUSH_NOTIFICATIONS,
      darkMode: ENABLE_DARK_MODE,
      twoFactor: ENABLE_2FA,
    },
  });
}