import { STORAGE_KEYS } from '@/config/appConfig';

/**
 * Type-safe localStorage wrapper with error handling
 */

export const localStorageService = {
  // Token management
  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error setting token in localStorage:', error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  },

  // Refresh token management
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token from localStorage:', error);
      return null;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error setting refresh token in localStorage:', error);
    }
  },

  removeRefreshToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error removing refresh token from localStorage:', error);
    }
  },

  // User data
  getUser: <T = any>(): T | null => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  },

  setUser: <T = any>(user: T): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user in localStorage:', error);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  },

  // Preferences
  getPreferences: <T = any>(): T | null => {
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.error('Error getting preferences from localStorage:', error);
      return null;
    }
  },

  setPreferences: <T = any>(preferences: T): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting preferences in localStorage:', error);
    }
  },

  // Theme
  getTheme: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME);
    } catch (error) {
      console.error('Error getting theme from localStorage:', error);
      return null;
    }
  },

  setTheme: (theme: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme in localStorage:', error);
    }
  },

  // Language
  getLanguage: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    } catch (error) {
      console.error('Error getting language from localStorage:', error);
      return null;
    }
  },

  setLanguage: (language: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error setting language in localStorage:', error);
    }
  },

  // UI state
  getSidebarState: (): boolean => {
    try {
      const state = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
      return state ? JSON.parse(state) : true;
    } catch (error) {
      console.error('Error getting sidebar state from localStorage:', error);
      return true;
    }
  },

  setSidebarState: (isOpen: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(isOpen));
    } catch (error) {
      console.error('Error setting sidebar state in localStorage:', error);
    }
  },

  // Dashboard layout
  getDashboardLayout: <T = any>(): T | null => {
    try {
      const layout = localStorage.getItem(STORAGE_KEYS.DASHBOARD_LAYOUT);
      return layout ? JSON.parse(layout) : null;
    } catch (error) {
      console.error('Error getting dashboard layout from localStorage:', error);
      return null;
    }
  },

  setDashboardLayout: <T = any>(layout: T): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.DASHBOARD_LAYOUT, JSON.stringify(layout));
    } catch (error) {
      console.error('Error setting dashboard layout in localStorage:', error);
    }
  },

  // Generic methods
  getItem: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  },

  setItem: <T = any>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Clear auth data only
  clearAuth: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing auth from localStorage:', error);
    }
  },
};

export const {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUser,
  setUser,
  removeUser,
  getPreferences,
  setPreferences,
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
  getSidebarState,
  setSidebarState,
  getDashboardLayout,
  setDashboardLayout,
  getItem,
  setItem,
  removeItem,
  clear,
  clearAuth,
} = localStorageService;