import { useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast, type ToastOptions } from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'loading' | 'info' | 'warning';

export interface ToastMessage {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastOptions['position'];
  icon?: string;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface ToastTypeStyles {
  success: {
    duration: number;
    icon: string;
    style: {
      background: string;
    };
  };
  error: {
    duration: number;
    icon: string;
    style: {
      background: string;
    };
  };
  loading: {
    duration: number;
    icon: string;
    style: {
      background: string;
    };
  };
}

const defaultOptions: ToastOptions & ToastTypeStyles = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
  },
  success: {
    duration: 4000,
    icon: '✅',
    style: {
      background: '#10b981',
    },
  },
  error: {
    duration: 5000,
    icon: '❌',
    style: {
      background: '#ef4444',
    },
  },
  loading: {
    duration: Infinity,
    icon: '⏳',
    style: {
      background: '#3b82f6',
    },
  },
};

export const useToast = () => {
  // Show a simple toast
  const showToast = useCallback(({ 
    type = 'info', 
    title, 
    message, 
    duration, 
    position,
    icon,
    actions 
  }: ToastMessage) => {
    const options: ToastOptions = {
      ...defaultOptions,
      duration: duration || defaultOptions.duration,
      position: position || defaultOptions.position,
    };

    // Add custom icon if provided
    if (icon) {
      options.icon = icon;
    }

    // Build message with optional title
    const displayMessage = title ? `${title}\n${message}` : message;

    // Handle different toast types
    switch (type) {
      case 'success':
        toast.success(displayMessage, options);
        break;
      case 'error':
        toast.error(displayMessage, options);
        break;
      case 'loading':
        toast.loading(displayMessage, options);
        break;
      default:
        toast(displayMessage, options);
    }

    // Handle actions (would need custom toast component for this)
    if (actions?.length) {
      // You'd need a custom toast component for interactive toasts
      console.warn('Actions require custom toast component');
    }
  }, []);

  // Show a promise toast
  const showPromiseToast = useCallback(<T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, {
      ...defaultOptions,
      ...options,
    });
  }, []);

  // Show a custom toast
  const showCustomToast = useCallback(
    (
      component: ReactNode,
      options?: ToastOptions
    ) => {
      return toast.custom(component as never, {
        ...defaultOptions,
        ...options,
      });
    },
    []
  );

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Dismiss a specific toast
  const dismiss = useCallback((toastId: string) => {
    toast.dismiss(toastId);
  }, []);

  // Update an existing toast
  const update = useCallback(
    (
      toastId: string,
      { type, message, duration }: Partial<ToastMessage>
    ) => {
      // react-hot-toast doesn't support updating message directly
      // So we dismiss the old toast and show a new one if message is provided
      if (message) {
        toast.dismiss(toastId);
        
        const typeStyles = type
          ? {
              success: { icon: '✅', style: { background: '#10b981' } },
              error: { icon: '❌', style: { background: '#ef4444' } },
              loading: { icon: '⏳', style: { background: '#3b82f6' } },
              info: { icon: 'ℹ️', style: { background: '#363636' } },
              warning: { icon: '⚠️', style: { background: '#f59e0b' } },
            }[type]
          : { icon: undefined, style: undefined };

        const options: ToastOptions = {
          duration: duration || 4000,
          ...typeStyles,
        };

        // Show new toast with the updated message
        if (type === 'success') {
          toast.success(message, options);
        } else if (type === 'error') {
          toast.error(message, options);
        } else if (type === 'loading') {
          toast.loading(message, options);
        } else {
          toast(message, options);
        }
        return;
      }

      // If no message, just update style/duration (for existing toast types that support it)
      const typeStyles = type
        ? {
            success: { style: { background: '#10b981' } },
            error: { style: { background: '#ef4444' } },
            loading: { style: { background: '#3b82f6' } },
            info: { style: { background: '#363636' } },
            warning: { style: { background: '#f59e0b' } },
          }[type]
        : undefined;

      toast(toastId, {
        duration: duration || 4000,
        ...typeStyles,
      });
    },
    []
  );

  return {
    showToast,
    showPromiseToast,
    showCustomToast,
    dismiss,
    dismissAll,
    update,
  };
};

export default useToast;