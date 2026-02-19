import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS, API_RESPONSE_CODES, AXIOS_CONFIG } from '@/config/apiConfig';
import { STORAGE_KEYS } from '@/config/appConfig';
import { handleApiError, logError } from '@/utils/errorHandlers';
import { isDevelopment } from '@/config/environment';

// Extend AxiosRequestConfig to include retry property
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: API_CONFIG.withCredentials,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    if (isDevelopment()) {
      (config as any).metadata = { startTime: new Date().getTime() };
    }
    
    return config;
  },
  (error: AxiosError) => {
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log request duration in development
    if (isDevelopment() && (response.config as any).metadata) {
      const duration = new Date().getTime() - (response.config as any).metadata.startTime;
      console.log(`📡 API Request to ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    // Handle request timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        code: 'TIMEOUT_ERROR',
        message: 'Request timeout. Please try again.',
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
      });
    }

    const status = error.response.status;
    const responseData = error.response.data as any;

    // Handle token refresh on 401
    if (status === API_RESPONSE_CODES.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login?session=expired';
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const { token } = response.data;
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }

    // Handle rate limiting with retry
    if (status === API_RESPONSE_CODES.TOO_MANY_REQUESTS) {
      const retryAfter = error.response.headers['retry-after'];
      const retryCount = originalRequest._retryCount || 0;
      
      if (retryCount < (AXIOS_CONFIG.retry?.retries || 3)) {
        originalRequest._retryCount = retryCount + 1;
        
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 
                     (AXIOS_CONFIG.retry?.retryDelay?.(retryCount) || 1000);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return axiosInstance(originalRequest);
      }
    }

    // Handle server errors with retry
    if (status >= 500 && status <= 599) {
      const retryCount = originalRequest._retryCount || 0;
      
      if (retryCount < (AXIOS_CONFIG.retry?.retries || 3)) {
        originalRequest._retryCount = retryCount + 1;
        
        const delay = AXIOS_CONFIG.retry?.retryDelay?.(retryCount) || 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return axiosInstance(originalRequest);
      }
    }

    // Log error in development
    if (isDevelopment()) {
      console.error('API Error:', {
        status,
        url: originalRequest.url,
        method: originalRequest.method,
        data: responseData,
      });
    }

    // Format and return error
    return Promise.reject(handleApiError(error));
  }
);

// Request cancellation support
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// Abort controller for modern fetch API
export const createAbortController = () => {
  return new AbortController();
};

// Type-safe request wrapper
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// HTTP method shortcuts
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'GET', url }),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'POST', url, data }),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'PUT', url, data }),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'DELETE', url }),
    
  upload: <T>(url: string, file: File | FormData, onProgress?: (percentage: number) => void) => {
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append('file', file);
    }
    
    return apiRequest<T>({
      method: 'POST',
      url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentage);
        }
      },
    });
  },
  
  download: async (url: string, filename?: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance({
      ...config,
      method: 'GET',
      url,
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] 
    });
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    return response.data;
  },
};

export default axiosInstance;