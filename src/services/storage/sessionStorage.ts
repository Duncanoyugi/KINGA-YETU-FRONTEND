/**
 * Type-safe sessionStorage wrapper with error handling
 */

export const sessionStorageService = {
  // Generic methods
  getItem: <T = any>(key: string): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from sessionStorage:`, error);
      return null;
    }
  },

  setItem: <T = any>(key: string, value: T): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in sessionStorage:`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from sessionStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },

  // Session-specific data
  setCurrentChild: (childId: string): void => {
    sessionStorageService.setItem('currentChild', childId);
  },

  getCurrentChild: (): string | null => {
    return sessionStorageService.getItem<string>('currentChild');
  },

  removeCurrentChild: (): void => {
    sessionStorageService.removeItem('currentChild');
  },

  setCurrentFacility: (facilityId: string): void => {
    sessionStorageService.setItem('currentFacility', facilityId);
  },

  getCurrentFacility: (): string | null => {
    return sessionStorageService.getItem<string>('currentFacility');
  },

  removeCurrentFacility: (): void => {
    sessionStorageService.removeItem('currentFacility');
  },

  // Form state persistence
  setFormState: (formId: string, data: any): void => {
    sessionStorageService.setItem(`form_${formId}`, data);
  },

  getFormState: (formId: string): any | null => {
    return sessionStorageService.getItem(`form_${formId}`);
  },

  removeFormState: (formId: string): void => {
    sessionStorageService.removeItem(`form_${formId}`);
  },

  // Pagination state
  setPaginationState: (key: string, state: { page: number; limit: number }): void => {
    sessionStorageService.setItem(`pagination_${key}`, state);
  },

  getPaginationState: (key: string): { page: number; limit: number } | null => {
    return sessionStorageService.getItem(`pagination_${key}`);
  },

  removePaginationState: (key: string): void => {
    sessionStorageService.removeItem(`pagination_${key}`);
  },

  // Filter state
  setFilterState: (key: string, filters: any): void => {
    sessionStorageService.setItem(`filters_${key}`, filters);
  },

  getFilterState: (key: string): any | null => {
    return sessionStorageService.getItem(`filters_${key}`);
  },

  removeFilterState: (key: string): void => {
    sessionStorageService.removeItem(`filters_${key}`);
  },

  // Return URL for navigation
  setReturnUrl: (url: string): void => {
    sessionStorageService.setItem('returnUrl', url);
  },

  getReturnUrl: (): string | null => {
    return sessionStorageService.getItem<string>('returnUrl');
  },

  removeReturnUrl: (): void => {
    sessionStorageService.removeItem('returnUrl');
  },

  // Temporary data
  setTempData: (key: string, data: any): void => {
    sessionStorageService.setItem(`temp_${key}`, data);
  },

  getTempData: (key: string): any | null => {
    return sessionStorageService.getItem(`temp_${key}`);
  },

  removeTempData: (key: string): void => {
    sessionStorageService.removeItem(`temp_${key}`);
  },
};

export const {
  getItem,
  setItem,
  removeItem,
  clear,
  setCurrentChild,
  getCurrentChild,
  removeCurrentChild,
  setCurrentFacility,
  getCurrentFacility,
  removeCurrentFacility,
  setFormState,
  getFormState,
  removeFormState,
  setPaginationState,
  getPaginationState,
  removePaginationState,
  setFilterState,
  getFilterState,
  removeFilterState,
  setReturnUrl,
  getReturnUrl,
  removeReturnUrl,
  setTempData,
  getTempData,
  removeTempData,
} = sessionStorageService;