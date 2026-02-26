import { configureStore, type Middleware, type Dispatch } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { authAPI } from '@/features/auth/authAPI';
import { childrenAPI } from '@/features/children/childrenAPI';
import { vaccinesAPI } from '@/features/vaccines/vaccinesAPI';
import { parentsAPI } from '@/features/parents/parentsAPI';
import { remindersAPI } from '@/features/reminders/remindersAPI';
import { reportsAPI } from '@/features/reports/reportsAPI';
import { analyticsAPI } from '@/features/analytics/analyticsAPI';
import { notificationsAPI } from '@/features/notifications/notificationsAPI';
import { facilitiesAPI } from '@/features/facilities/facilitiesAPI';
import { schedulesAPI } from '@/features/schedules/schedulesAPI';
import { usersAPI } from '@/features/users/usersAPI';

// Custom middleware for logging actions in development
// Using type assertion to handle Redux Toolkit's middleware type
const loggerMiddleware: Middleware<{}, unknown, Dispatch<AnyAction>> = (store) => (next) => (action) => {
  if (import.meta.env.DEV) {
    console.group(`Action: ${(action as AnyAction).type}`);
    console.log('Payload:', (action as AnyAction).payload);
    console.log('Current State:', store.getState());
    console.groupEnd();
  }
  return next(action);
};

// Middleware for handling API errors globally
const apiErrorMiddleware: Middleware<{}, unknown, Dispatch<AnyAction>> = () => (next) => (action) => {
  const typedAction = action as AnyAction;
  // Check if action is a rejected API action
  if (typedAction.type.endsWith('/rejected') && typedAction.payload) {
    console.error('API Error:', typedAction.payload);
    
    // You can add global error handling here
    // e.g., show toast, log to monitoring service, etc.
    if (typedAction.payload.status === 401) {
      // Handle unauthorized - redirect to login
      // This will be handled by the AuthProvider
    }
  }
  
  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/setCredentials',
          'persist/PERSIST',
          'persist/REHYDRATE'
        ],
        // Ignore these field paths in state
        ignoredPaths: [
          'auth.user.createdAt',
          'auth.user.updatedAt',
          'auth.user.lastLoginAt'
        ],
      },
      thunk: {
        extraArgument: {
          // You can inject dependencies here if needed
        },
      },
    }).concat(
      loggerMiddleware,
      apiErrorMiddleware,
      authAPI.middleware,
      childrenAPI.middleware,
      vaccinesAPI.middleware,
      parentsAPI.middleware,
      remindersAPI.middleware,
      reportsAPI.middleware,
      analyticsAPI.middleware,
      notificationsAPI.middleware,
      facilitiesAPI.middleware,
      schedulesAPI.middleware,
      usersAPI.middleware
    ) as unknown as ReturnType<typeof getDefaultMiddleware>,
  devTools: import.meta.env.PROD !== true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: Setup for Redux Persist if you want to persist specific slices
/*
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // ... rest of config
});

export const persistor = persistStore(store);
*/