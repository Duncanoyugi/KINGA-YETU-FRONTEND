export const ROUTES = {
  // Public / Landing
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  RESOURCES: '/resources',
  CONTACT: '/contact',

  // Main Dashboard
  DASHBOARD: '/dashboard',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // Role-based Dashboards
  PARENT_DASHBOARD: '/dashboard/parent',
  HEALTH_WORKER_DASHBOARD: '/dashboard/health-worker',
  ADMIN_DASHBOARD: '/dashboard/admin',
  COUNTY_ADMIN_DASHBOARD: '/dashboard/county-admin',

  // Children
  ADD_CHILD: '/children/add',
  CHILDREN_LIST: '/children',
  CHILD_PROFILE: '/children/:id',
  EDIT_CHILD: '/children/:id/edit',
  CHILD_HISTORY: '/children/:id/history',
  GROWTH_CHART: '/children/:id/growth',

  // Vaccines
  VACCINE_SCHEDULE: '/vaccines/schedule',
  VACCINE_INVENTORY: '/vaccines/inventory',
  VACCINE_DETAILS: '/vaccines/:id',
  ADD_VACCINE: '/vaccines/add',
  BATCH_TRACKING: '/inventory/batch/:id',
  ADD_INVENTORY: '/inventory/add',

  // Immunizations
  RECORD_VACCINATION: '/immunizations/record/:appointmentId',
  IMMUNIZATION_HISTORY: '/immunizations/:childId',

  // Reports
  REPORTS_DASHBOARD: '/reports',
  COVERAGE_REPORTS: '/reports/coverage',
  MISSED_VACCINES: '/reports/missed-vaccines',
  FACILITY_REPORTS: '/reports/facility',
  DEMOGRAPHIC_REPORTS: '/reports/demographic',
  TIMELINESS_REPORTS: '/reports/timeliness',
  CUSTOM_REPORT: '/reports/custom',
  REPORT_DETAILS: '/reports/:id',
  ALL_REPORTS: '/reports/all',
  SCHEDULE_REPORT: '/reports/schedule',

  // Notifications
  NOTIFICATIONS: '/notifications',
  REMINDER_SETTINGS: '/notifications/reminders',

  // Admin
  USER_MANAGEMENT: '/admin/users',
  ADD_USER: '/admin/users/add',
  USER_DETAILS: '/admin/users/:id',
  EDIT_USER: '/admin/users/:id/edit',
  FACILITY_MANAGEMENT: '/admin/facilities',
  ADD_FACILITY: '/admin/facilities/add',
  FACILITY_DETAILS: '/admin/facilities/:id',
  EDIT_FACILITY: '/admin/facilities/:id/edit',
  SYSTEM_CONFIG: '/admin/system',
  VACCINE_MANAGEMENT: '/vaccines/management',
  AUDIT_LOGS: '/admin/audit-logs',
  COVERAGE_MAP: '/analytics/coverage-map',
  SYSTEM_HEALTH: '/admin/system-health',
  SECURITY: '/admin/security',
  DATABASE: '/admin/database',
  LOGOUT: '/auth/logout',
  SECURITY_SCAN: '/admin/security/scan',

  // Analytics
  ANALYTICS_OVERVIEW: '/analytics',
  COVERAGE_ANALYTICS: '/analytics/coverage',
  DROPOUT_ANALYTICS: '/analytics/dropout',
  PERFORMANCE_ANALYTICS: '/analytics/performance',
  PREDICTIVE_ANALYTICS: '/analytics/predictive',
  GEOGRAPHIC_ANALYTICS: '/analytics/geographic',

  // Misc
  APPOINTMENTS: '/appointments',
  APPOINTMENTS_NEW: '/appointments/new',
  SETTINGS: '/settings',
  REMINDERS: '/reminders',
  VACCINES: '/vaccines',

  // Health Tips & Activity
  HEALTH_TIPS: '/health-tips',
  ACTIVITY_HISTORY: '/activity-history',

  // Growth Tracking
  GROWTH_TRACKING: '/growth-tracking',
  GROWTH_TRACKING_NEW: '/growth-tracking/new',

  // Certificates
  CERTIFICATES: '/certificates',
  CERTIFICATES_CHILD: '/certificates/:childId',

  // Immunizations (for parent view)
  IMMUNIZATIONS: '/immunizations',
  VACCINATION_HISTORY: '/vaccination-history/:childId',
  VACCINATIONS: '/vaccinations',

  // Legal
  TERMS: '/terms',
  PRIVACY: '/privacy',
};

export default ROUTES;
