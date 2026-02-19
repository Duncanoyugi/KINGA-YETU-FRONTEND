import { API_URL, IS_DEVELOPMENT } from './environment';

/**
 * API Configuration
 * Defines endpoints, headers, and API-specific settings
 */

export const API_CONFIG = {
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
    VERIFY_OTP: '/auth/verify-otp',
    REQUEST_OTP: '/auth/request-otp',
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    PREFERENCES: '/users/preferences',
    ACTIVITY: (userId: string) => `/users/${userId}/activity`,
  },

  // Child endpoints
  CHILDREN: {
    BASE: '/children',
    BY_ID: (id: string) => `/children/${id}`,
    GROWTH: (childId: string) => `/children/${childId}/growth`,
    GROWTH_BY_ID: (childId: string, recordId: string) => `/children/${childId}/growth/${recordId}`,
    DEVELOPMENT: (childId: string) => `/children/${childId}/development`,
    DEVELOPMENT_BY_ID: (childId: string, recordId: string) => `/children/${childId}/development/${recordId}`,
    IMMUNIZATIONS: (childId: string) => `/children/${childId}/immunizations`,
    IMMUNIZATION_BY_ID: (childId: string, immunizationId: string) => `/children/${childId}/immunizations/${immunizationId}`,
    SCHEDULE: (childId: string) => `/children/${childId}/schedule`,
    REMINDERS: (childId: string) => `/children/${childId}/reminders`,
    DASHBOARD: (childId: string) => `/children/${childId}/dashboard`,
    SEARCH: '/children/search',
    BY_PARENT: (parentId: string) => `/children/parent/${parentId}`,
    BY_FACILITY: (facilityId: string) => `/children/facility/${facilityId}`,
  },

  // Vaccine endpoints
  VACCINES: {
    BASE: '/vaccines',
    BY_ID: (id: string) => `/vaccines/${id}`,
    BY_CODE: (code: string) => `/vaccines/code/${code}`,
    SCHEDULE: '/vaccines/schedule',
    BIRTH_DOSES: '/vaccines/birth-doses',
    BOOSTERS: '/vaccines/boosters',
    INVENTORY: '/vaccines/inventory',
    INVENTORY_BY_ID: (id: string) => `/vaccines/inventory/${id}`,
    FACILITY_INVENTORY: (facilityId: string) => `/vaccines/inventory/facility/${facilityId}`,
    BATCHES: '/vaccines/batches',
    BATCH_BY_ID: (id: string) => `/vaccines/batches/${id}`,
    ALERTS: '/vaccines/alerts',
    EXPIRING: '/vaccines/alerts/expiring',
    LOW_STOCK: '/vaccines/alerts/low-stock',
    STATS: '/vaccines/stats',
    USAGE: '/vaccines/usage',
  },

  // Parent endpoints
  PARENTS: {
    BASE: '/parents',
    BY_ID: (id: string) => `/parents/${id}`,
    BY_USER_ID: (userId: string) => `/parents/user/${userId}`,
    CHILDREN: (parentId: string) => `/parents/${parentId}/children`,
    LINK_CHILD: (parentId: string) => `/parents/${parentId}/children`,
    UNLINK_CHILD: (parentId: string, childId: string) => `/parents/${parentId}/children/${childId}`,
    REMINDERS: (parentId: string) => `/parents/${parentId}/reminders`,
    UPCOMING_REMINDERS: (parentId: string) => `/parents/${parentId}/reminders/upcoming`,
    DASHBOARD: (parentId: string) => `/parents/${parentId}/dashboard`,
    STATS: (parentId: string) => `/parents/${parentId}/stats`,
    PREFERENCES: (parentId: string) => `/parents/${parentId}/preferences`,
  },

  // Facility endpoints
  FACILITIES: {
    BASE: '/facilities',
    BY_ID: (id: string) => `/facilities/${id}`,
    BY_MFL_CODE: (code: string) => `/facilities/mfl/${code}`,
    HEALTH_WORKERS: (facilityId: string) => `/facilities/${facilityId}/health-workers`,
    INVENTORY: (facilityId: string) => `/facilities/${facilityId}/inventory`,
    STATS: (facilityId: string) => `/facilities/${facilityId}/stats`,
    PERFORMANCE: (facilityId: string) => `/facilities/${facilityId}/performance`,
    NEARBY: '/facilities/nearby',
    BY_COUNTY: (county: string) => `/facilities/county/${county}`,
  },

  // Health Worker endpoints
  HEALTH_WORKERS: {
    BASE: '/health-workers',
    BY_ID: (id: string) => `/health-workers/${id}`,
    BY_USER_ID: (userId: string) => `/health-workers/user/${userId}`,
    BY_FACILITY: (facilityId: string) => `/health-workers/facility/${facilityId}`,
    PERFORMANCE: (workerId: string) => `/health-workers/${workerId}/performance`,
    SCHEDULE: (workerId: string) => `/health-workers/${workerId}/schedule`,
  },

  // Immunization endpoints
  IMMUNIZATIONS: {
    BASE: '/immunizations',
    BY_ID: (id: string) => `/immunizations/${id}`,
    TODAY: '/immunizations/today',
    UPCOMING: '/immunizations/upcoming',
    MISSED: '/immunizations/missed',
    BY_CHILD: (childId: string) => `/immunizations/child/${childId}`,
    BY_FACILITY: (facilityId: string) => `/immunizations/facility/${facilityId}`,
    BY_DATE_RANGE: '/immunizations/range',
    STATS: '/immunizations/stats',
  },

  // Reminder endpoints
  REMINDERS: {
    BASE: '/reminders',
    BY_ID: (id: string) => `/reminders/${id}`,
    PENDING: '/reminders/pending',
    BY_CHILD: (childId: string) => `/reminders/child/${childId}`,
    BY_PARENT: (parentId: string) => `/reminders/parent/${parentId}`,
    SEND: '/reminders/send',
    BATCH_SEND: '/reminders/batch/send',
    STATS: '/reminders/stats',
    CANCEL: (id: string) => `/reminders/${id}/cancel`,
  },

  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    BY_USER: (userId: string) => `/notifications/user/${userId}`,
    UNREAD_COUNT: (userId: string) => `/notifications/user/${userId}/unread/count`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: (userId: string) => `/notifications/user/${userId}/read-all`,
    PREFERENCES: (userId: string) => `/notifications/preferences/${userId}`,
    PUSH_SUBSCRIBE: '/notifications/push/subscribe',
    PUSH_UNSUBSCRIBE: (userId: string) => `/notifications/push/unsubscribe/${userId}`,
    STATS: (userId: string) => `/notifications/stats/${userId}`,
  },

  // Report endpoints
  REPORTS: {
    BASE: '/reports',
    BY_ID: (id: string) => `/reports/${id}`,
    GENERATE: '/reports/generate',
    EXPORT: (id: string) => `/reports/${id}/export`,
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    SCHEDULED: '/reports/scheduled',
    SCHEDULE: '/reports/scheduled',
    SCHEDULE_BY_ID: (id: string) => `/reports/scheduled/${id}`,
    TEMPLATES: '/reports/templates',
    STATS: '/reports/stats',
    COVERAGE: '/reports/coverage',
    MISSED_VACCINES: '/reports/missed-vaccines',
    FACILITY_PERFORMANCE: (facilityId: string) => `/reports/facility/${facilityId}/performance`,
    DEMOGRAPHIC: '/reports/demographic',
    TIMELINESS: '/reports/timeliness',
  },

  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    COVERAGE: '/analytics/coverage',
    DROPOUT: '/analytics/dropout',
    PERFORMANCE: '/analytics/performance',
    TRENDS: '/analytics/trends',
    GEOGRAPHIC: '/analytics/geographic',
    DEMOGRAPHICS: '/analytics/demographics',
    PREDICT: '/analytics/predict',
    COMPARATIVE: '/analytics/comparative',
    REALTIME: '/analytics/realtime',
    ALERTS: '/analytics/alerts',
    EXPORT: (type: string) => `/analytics/export/${type}`,
    CUSTOM: '/analytics/custom',
  },

  // System endpoints
  SYSTEM: {
    HEALTH: '/system/health',
    STATS: '/system/stats',
    CONFIG: '/system/config',
    LOGS: '/system/logs',
    BACKUP: '/system/backup',
    RESTORE: '/system/restore',
    AUDIT_LOGS: '/system/audit-logs',
  },
};

// API Response codes
export const API_RESPONSE_CODES = {
  SUCCESS: 200,
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
  GATEWAY_TIMEOUT: 504,
};

// API Error messages
export const API_ERROR_MESSAGES = {
  [API_RESPONSE_CODES.BAD_REQUEST]: 'Bad request. Please check your input.',
  [API_RESPONSE_CODES.UNAUTHORIZED]: 'Your session has expired. Please login again.',
  [API_RESPONSE_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [API_RESPONSE_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [API_RESPONSE_CODES.CONFLICT]: 'A conflict occurred with the current state.',
  [API_RESPONSE_CODES.UNPROCESSABLE_ENTITY]: 'Validation failed. Please check your input.',
  [API_RESPONSE_CODES.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
  [API_RESPONSE_CODES.INTERNAL_SERVER_ERROR]: 'An internal server error occurred.',
  [API_RESPONSE_CODES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable.',
  [API_RESPONSE_CODES.GATEWAY_TIMEOUT]: 'The request timed out. Please try again.',
};

// Axios interceptors configuration
export const AXIOS_CONFIG = {
  retry: {
    retries: 3,
    retryCondition: (error: any) => {
      return (
        error.code === 'ECONNABORTED' ||
        error.response?.status >= 500 ||
        error.response?.status === 429
      );
    },
    retryDelay: (retryCount: number) => {
      return retryCount * 1000; // 1s, 2s, 3s
    },
  },
  cache: {
    enable: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
  debounce: {
    enable: true,
    wait: 300, // milliseconds
  },
};

// Development tools
if (IS_DEVELOPMENT) {
  console.log('🔧 API Endpoints loaded');
}