import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { store } from './store/store';
import AppRouter from '@/routing/AppRouter';

// CSS is imported in main.tsx via index.css

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <QueryProvider>
          <BrowserRouter>
            <ThemeProvider defaultTheme="system" storageKey="immunitrack-theme">
              <AuthProvider>
                {/* Main App Content */}
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <AppRouter />
                </div>

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                      borderRadius: '8px',
                      padding: '12px 16px',
                    },
                    success: {
                      icon: '✅',
                      style: {
                        background: '#10b981',
                      },
                    },
                    error: {
                      icon: '❌',
                      style: {
                        background: '#ef4444',
                      },
                    },
                    loading: {
                      icon: '⏳',
                      style: {
                        background: '#3b82f6',
                      },
                    },
                  }}
                />
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryProvider>
      </Provider>
    </React.StrictMode>
  );
};

// Export the AppWithErrorBoundary as the main export
// The App component is used internally by AppWithErrorBoundary

// Optional: Add error boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
    // You can log to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the main App component with error boundary
const AppWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;