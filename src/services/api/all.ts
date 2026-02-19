import { api } from './axiosInstance';
import { API_ENDPOINTS } from '@/config/apiConfig';

// Type-safe API service aggregator
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
      
    register: (userData: any) =>
      api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
      
    logout: () =>
      api.post(API_ENDPOINTS.AUTH.LOGOUT),
      
    refreshToken: (refreshToken: string) =>
      api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }),
      
    forgotPassword: (email: string) =>
      api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
      
    resetPassword: (data: { token: string; newPassword: string }) =>
      api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
      
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
      
    verifyEmail: (token: string) =>
      api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),
      
    verifyPhone: (code: string) =>
      api.post(API_ENDPOINTS.AUTH.VERIFY_PHONE, { code }),
      
    requestOTP: (data: { email?: string; phone?: string; type: string }) =>
      api.post(API_ENDPOINTS.AUTH.REQUEST_OTP, data),
      
    verifyOTP: (data: { code: string; email?: string; phone?: string }) =>
      api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data),
  },

  // Users endpoints
  users: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.USERS.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.USERS.BY_ID(id)),
      
    getProfile: () =>
      api.get(API_ENDPOINTS.USERS.PROFILE),
      
    updateProfile: (data: any) =>
      api.patch(API_ENDPOINTS.USERS.UPDATE_PROFILE, data),
      
    updatePreferences: (data: any) =>
      api.patch(API_ENDPOINTS.USERS.PREFERENCES, data),
      
    getActivity: (userId: string, params?: any) =>
      api.get(API_ENDPOINTS.USERS.ACTIVITY(userId), { params }),
  },

  // Children endpoints
  children: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.CHILDREN.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.CHILDREN.BY_ID(id)),
      
    create: (data: any) =>
      api.post(API_ENDPOINTS.CHILDREN.BASE, data),
      
    update: (id: string, data: any) =>
      api.patch(API_ENDPOINTS.CHILDREN.BY_ID(id), data),
      
    delete: (id: string) =>
      api.delete(API_ENDPOINTS.CHILDREN.BY_ID(id)),
      
    search: (params: any) =>
      api.get(API_ENDPOINTS.CHILDREN.SEARCH, { params }),
      
    getByParent: (parentId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.BY_PARENT(parentId)),
      
    getByFacility: (facilityId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.BY_FACILITY(facilityId)),
      
    getDashboard: (childId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.DASHBOARD(childId)),
      
    // Growth records
    getGrowthRecords: (childId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.GROWTH(childId)),
      
    addGrowthRecord: (childId: string, data: any) =>
      api.post(API_ENDPOINTS.CHILDREN.GROWTH(childId), data),
      
    updateGrowthRecord: (childId: string, recordId: string, data: any) =>
      api.patch(API_ENDPOINTS.CHILDREN.GROWTH_BY_ID(childId, recordId), data),
      
    deleteGrowthRecord: (childId: string, recordId: string) =>
      api.delete(API_ENDPOINTS.CHILDREN.GROWTH_BY_ID(childId, recordId)),
      
    // Development records
    getDevelopmentRecords: (childId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.DEVELOPMENT(childId)),
      
    addDevelopmentRecord: (childId: string, data: any) =>
      api.post(API_ENDPOINTS.CHILDREN.DEVELOPMENT(childId), data),
      
    // Immunizations
    getImmunizations: (childId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.IMMUNIZATIONS(childId)),
      
    recordImmunization: (childId: string, data: any) =>
      api.post(API_ENDPOINTS.CHILDREN.IMMUNIZATIONS(childId), data),
      
    // Schedule
    getSchedule: (childId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.SCHEDULE(childId)),
      
    getReminders: (childId: string) =>
      api.get(API_ENDPOINTS.CHILDREN.REMINDERS(childId)),
  },

  // Vaccines endpoints
  vaccines: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.VACCINES.BY_ID(id)),
      
    getByCode: (code: string) =>
      api.get(API_ENDPOINTS.VACCINES.BY_CODE(code)),
      
    create: (data: any) =>
      api.post(API_ENDPOINTS.VACCINES.BASE, data),
      
    update: (id: string, data: any) =>
      api.patch(API_ENDPOINTS.VACCINES.BY_ID(id), data),
      
    delete: (id: string) =>
      api.delete(API_ENDPOINTS.VACCINES.BY_ID(id)),
      
    getSchedule: () =>
      api.get(API_ENDPOINTS.VACCINES.SCHEDULE),
      
    getBirthDoses: () =>
      api.get(API_ENDPOINTS.VACCINES.BIRTH_DOSES),
      
    getBoosters: () =>
      api.get(API_ENDPOINTS.VACCINES.BOOSTERS),
      
    // Inventory
    getInventory: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.INVENTORY, { params }),
      
    getFacilityInventory: (facilityId: string) =>
      api.get(API_ENDPOINTS.VACCINES.FACILITY_INVENTORY(facilityId)),
      
    addInventory: (data: any) =>
      api.post(API_ENDPOINTS.VACCINES.INVENTORY, data),
      
    updateInventory: (id: string, data: any) =>
      api.patch(API_ENDPOINTS.VACCINES.INVENTORY_BY_ID(id), data),
      
    deleteInventory: (id: string) =>
      api.delete(API_ENDPOINTS.VACCINES.INVENTORY_BY_ID(id)),
      
    // Batches
    getBatches: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.BATCHES, { params }),
      
    getBatchById: (id: string) =>
      api.get(API_ENDPOINTS.VACCINES.BATCH_BY_ID(id)),
      
    addBatch: (data: FormData) =>
      api.upload(API_ENDPOINTS.VACCINES.BATCHES, data),
      
    // Alerts
    getAlerts: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.ALERTS, { params }),
      
    getExpiring: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.EXPIRING, { params }),
      
    getLowStock: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.LOW_STOCK, { params }),
      
    // Stats
    getStats: (params?: any) =>
      api.get(API_ENDPOINTS.VACCINES.STATS, { params }),
      
    recordUsage: (data: any) =>
      api.post(API_ENDPOINTS.VACCINES.USAGE, data),
  },

  // Parents endpoints
  parents: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.PARENTS.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.PARENTS.BY_ID(id)),
      
    getByUserId: (userId: string) =>
      api.get(API_ENDPOINTS.PARENTS.BY_USER_ID(userId)),
      
    create: (data: any) =>
      api.post(API_ENDPOINTS.PARENTS.BASE, data),
      
    update: (id: string, data: any) =>
      api.patch(API_ENDPOINTS.PARENTS.BY_ID(id), data),
      
    delete: (id: string) =>
      api.delete(API_ENDPOINTS.PARENTS.BY_ID(id)),
      
    // Children management
    getChildren: (parentId: string) =>
      api.get(API_ENDPOINTS.PARENTS.CHILDREN(parentId)),
      
    linkChild: (parentId: string, data: any) =>
      api.post(API_ENDPOINTS.PARENTS.LINK_CHILD(parentId), data),
      
    unlinkChild: (parentId: string, childId: string) =>
      api.delete(API_ENDPOINTS.PARENTS.UNLINK_CHILD(parentId, childId)),
      
    // Reminders
    getReminders: (parentId: string) =>
      api.get(API_ENDPOINTS.PARENTS.REMINDERS(parentId)),
      
    getUpcomingReminders: (parentId: string) =>
      api.get(API_ENDPOINTS.PARENTS.UPCOMING_REMINDERS(parentId)),
      
    // Dashboard
    getDashboard: (parentId: string) =>
      api.get(API_ENDPOINTS.PARENTS.DASHBOARD(parentId)),
      
    getStats: (parentId: string) =>
      api.get(API_ENDPOINTS.PARENTS.STATS(parentId)),
      
    updatePreferences: (parentId: string, data: any) =>
      api.patch(API_ENDPOINTS.PARENTS.PREFERENCES(parentId), data),
  },

  // Facilities endpoints
  facilities: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.FACILITIES.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.FACILITIES.BY_ID(id)),
      
    getByMFLCode: (code: string) =>
      api.get(API_ENDPOINTS.FACILITIES.BY_MFL_CODE(code)),
      
    create: (data: any) =>
      api.post(API_ENDPOINTS.FACILITIES.BASE, data),
      
    update: (id: string, data: any) =>
      api.patch(API_ENDPOINTS.FACILITIES.BY_ID(id), data),
      
    delete: (id: string) =>
      api.delete(API_ENDPOINTS.FACILITIES.BY_ID(id)),
      
    getHealthWorkers: (facilityId: string) =>
      api.get(API_ENDPOINTS.FACILITIES.HEALTH_WORKERS(facilityId)),
      
    getInventory: (facilityId: string) =>
      api.get(API_ENDPOINTS.FACILITIES.INVENTORY(facilityId)),
      
    getStats: (facilityId: string) =>
      api.get(API_ENDPOINTS.FACILITIES.STATS(facilityId)),
      
    getPerformance: (facilityId: string, params?: any) =>
      api.get(API_ENDPOINTS.FACILITIES.PERFORMANCE(facilityId), { params }),
      
    getNearby: (params: { lat: number; lng: number; radius?: number }) =>
      api.get(API_ENDPOINTS.FACILITIES.NEARBY, { params }),
      
    getByCounty: (county: string) =>
      api.get(API_ENDPOINTS.FACILITIES.BY_COUNTY(county)),
  },

  // Immunizations endpoints
  immunizations: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.BY_ID(id)),
      
    getToday: () =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.TODAY),
      
    getUpcoming: (params?: any) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.UPCOMING, { params }),
      
    getMissed: (params?: any) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.MISSED, { params }),
      
    getByChild: (childId: string) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.BY_CHILD(childId)),
      
    getByFacility: (facilityId: string, params?: any) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.BY_FACILITY(facilityId), { params }),
      
    getByDateRange: (params: { startDate: string; endDate: string }) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.BY_DATE_RANGE, { params }),
      
    getStats: (params?: any) =>
      api.get(API_ENDPOINTS.IMMUNIZATIONS.STATS, { params }),
  },

  // Reports endpoints
  reports: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.REPORTS.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.REPORTS.BY_ID(id)),
      
    generate: (data: any) =>
      api.post(API_ENDPOINTS.REPORTS.GENERATE, data),
      
    delete: (id: string) =>
      api.delete(API_ENDPOINTS.REPORTS.BY_ID(id)),
      
    export: (id: string, format: string) =>
      api.get(API_ENDPOINTS.REPORTS.EXPORT(id), { params: { format } }),
      
    download: (id: string, format: string) =>
      api.download(API_ENDPOINTS.REPORTS.DOWNLOAD(id), `report-${id}.${format.toLowerCase()}`),
      
    getScheduled: () =>
      api.get(API_ENDPOINTS.REPORTS.SCHEDULED),
      
    schedule: (data: any) =>
      api.post(API_ENDPOINTS.REPORTS.SCHEDULE, data),
      
    updateSchedule: (id: string, data: any) =>
      api.patch(API_ENDPOINTS.REPORTS.SCHEDULE_BY_ID(id), data),
      
    deleteSchedule: (id: string) =>
      api.delete(API_ENDPOINTS.REPORTS.SCHEDULE_BY_ID(id)),
      
    getTemplates: () =>
      api.get(API_ENDPOINTS.REPORTS.TEMPLATES),
      
    getStats: () =>
      api.get(API_ENDPOINTS.REPORTS.STATS),
      
    // Specific report types
    getCoverage: (params?: any) =>
      api.get(API_ENDPOINTS.REPORTS.COVERAGE, { params }),
      
    getMissedVaccines: (params?: any) =>
      api.get(API_ENDPOINTS.REPORTS.MISSED_VACCINES, { params }),
      
    getFacilityPerformance: (facilityId: string, params?: any) =>
      api.get(API_ENDPOINTS.REPORTS.FACILITY_PERFORMANCE(facilityId), { params }),
      
    getDemographic: (params?: any) =>
      api.get(API_ENDPOINTS.REPORTS.DEMOGRAPHIC, { params }),
      
    getTimeliness: (params?: any) =>
      api.get(API_ENDPOINTS.REPORTS.TIMELINESS, { params }),
  },

  // Analytics endpoints
  analytics: {
    getDashboard: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, { params }),
      
    getCoverage: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.COVERAGE, { params }),
      
    getDropout: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.DROPOUT, { params }),
      
    getPerformance: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.PERFORMANCE, { params }),
      
    getTrends: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.TRENDS, { params }),
      
    getGeographic: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.GEOGRAPHIC, { params }),
      
    getDemographics: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.DEMOGRAPHICS, { params }),
      
    getPredictions: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.PREDICT, { params }),
      
    getComparative: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.COMPARATIVE, { params }),
      
    getRealtime: () =>
      api.get(API_ENDPOINTS.ANALYTICS.REALTIME),
      
    getAlerts: (params?: any) =>
      api.get(API_ENDPOINTS.ANALYTICS.ALERTS, { params }),
      
    export: (type: string, params?: any) =>
      api.download(API_ENDPOINTS.ANALYTICS.EXPORT(type), `analytics-${type}.csv`, { params }),
  },

  // Notifications endpoints
  notifications: {
    getAll: (params?: any) =>
      api.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params }),
      
    getById: (id: string) =>
      api.get(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)),
      
    getByUser: (userId: string) =>
      api.get(API_ENDPOINTS.NOTIFICATIONS.BY_USER(userId)),
      
    getUnreadCount: (userId: string) =>
      api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT(userId)),
      
    markAsRead: (id: string) =>
      api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
      
    markAllAsRead: (userId: string) =>
      api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId)),
      
    delete: (id: string) =>
      api.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)),
      
    getPreferences: (userId: string) =>
      api.get(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES(userId)),
      
    updatePreferences: (userId: string, data: any) =>
      api.put(API_ENDPOINTS.NOTIFICATIONS.PREFERENCES(userId), data),
      
    subscribePush: (data: any) =>
      api.post(API_ENDPOINTS.NOTIFICATIONS.PUSH_SUBSCRIBE, data),
      
    unsubscribePush: (userId: string) =>
      api.post(API_ENDPOINTS.NOTIFICATIONS.PUSH_UNSUBSCRIBE(userId)),
      
    getStats: (userId: string) =>
      api.get(API_ENDPOINTS.NOTIFICATIONS.STATS(userId)),
  },

  // System endpoints
  system: {
    getHealth: () =>
      api.get(API_ENDPOINTS.SYSTEM.HEALTH),
      
    getStats: () =>
      api.get(API_ENDPOINTS.SYSTEM.STATS),
      
    getConfig: () =>
      api.get(API_ENDPOINTS.SYSTEM.CONFIG),
      
    updateConfig: (data: any) =>
      api.put(API_ENDPOINTS.SYSTEM.CONFIG, data),
      
    getLogs: (params?: any) =>
      api.get(API_ENDPOINTS.SYSTEM.LOGS, { params }),
      
    createBackup: () =>
      api.post(API_ENDPOINTS.SYSTEM.BACKUP),
      
    restoreBackup: (data: FormData) =>
      api.upload(API_ENDPOINTS.SYSTEM.RESTORE, data),
      
    getAuditLogs: (params?: any) =>
      api.get(API_ENDPOINTS.SYSTEM.AUDIT_LOGS, { params }),
  },
};

export default apiService;