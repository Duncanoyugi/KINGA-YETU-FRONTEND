import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

// API Error interface
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status?: number;
}

// Handle API errors
export const handleApiError = (error: any): ApiError => {
  // Axios error
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;
    const response = axiosError.response;
    
    if (response) {
      // Server responded with error
      const status = response.status;
      const data = response.data as any;
      
      // Handle validation errors
      if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY && data.errors) {
        return {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: data.errors,
          status,
        };
      }
      
      // Handle unauthorized
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        return {
          code: 'UNAUTHORIZED',
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status,
        };
      }
      
      // Handle forbidden
      if (status === HTTP_STATUS.FORBIDDEN) {
        return {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action',
          status,
        };
      }
      
      // Handle not found
      if (status === HTTP_STATUS.NOT_FOUND) {
        return {
          code: 'NOT_FOUND',
          message: data.message || ERROR_MESSAGES.NOT_FOUND,
          status,
        };
      }
      
      // Handle server error
      if (status >= 500) {
        return {
          code: 'SERVER_ERROR',
          message: data.message || ERROR_MESSAGES.SERVER_ERROR,
          status,
        };
      }
      
      // Return API error message
      return {
        code: data.code || 'API_ERROR',
        message: data.message || 'An error occurred',
        details: data.details,
        status,
      };
    }
    
    // Network error (no response)
    if (axiosError.request) {
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
      };
    }
  }
  
  // Generic error
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'An unknown error occurred',
  };
};

// Show error toast
export const showErrorToast = (error: any, defaultMessage?: string) => {
  const apiError = handleApiError(error);
  toast.error(apiError.message || defaultMessage || ERROR_MESSAGES.SERVER_ERROR);
};

// Format validation errors for form display
export const formatValidationErrors = (errors: Record<string, any>): Record<string, string> => {
  const formatted: Record<string, string> = {};
  
  Object.entries(errors).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formatted[key] = value[0];
    } else if (typeof value === 'string') {
      formatted[key] = value;
    } else if (value?.message) {
      formatted[key] = value.message;
    }
  });
  
  return formatted;
};

// Log error for debugging
export const logError = (error: any, context?: string) => {
  if (import.meta.env.DEV) {
    console.group(`Error${context ? ` in ${context}` : ''}`);
    console.error(error);
    
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      console.log('Request:', {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        data: axiosError.config?.data,
      });
      
      if (axiosError.response) {
        console.log('Response:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
        });
      }
    }
    
    console.groupEnd();
  }
  
  // Here you could also send to a logging service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }
};

// Create error boundary fallback
export const createErrorFallback = (error: Error, resetError: () => void) => {
  return (
    <div className="p-6 text-center">
      <div className="mb-4 text-red-600">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Try again
      </button>
    </div>
  );
};

// Retry failed operations with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Handle offline errors
export const handleOfflineError = (): boolean => {
  if (!navigator.onLine) {
    toast.error('You are offline. Please check your internet connection.');
    return true;
  }
  return false;
};

// Parse error message from API response
export const parseErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};

// Handle rate limiting
export const handleRateLimit = (error: any): boolean => {
  if (error?.response?.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
    const retryAfter = error.response.headers['retry-after'];
    const message = retryAfter 
      ? `Too many requests. Please try again in ${retryAfter} seconds.`
      : 'Too many requests. Please try again later.';
    
    toast.error(message);
    return true;
  }
  
  return false;
};

// Handle session expiry
export const handleSessionExpiry = (error: any): boolean => {
  if (error?.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login?session=expired';
    return true;
  }
  
  return false;
};
