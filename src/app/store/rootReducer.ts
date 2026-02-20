import { combineReducers } from '@reduxjs/toolkit';

// Import reducers from features
import authReducer from '@/features/auth/authSlice';
import childrenReducer from '@/features/children/childrenSlice';
import vaccinesReducer from '@/features/vaccines/vaccinesSlice';
import parentsReducer from '@/features/parents/parentsSlice';
import remindersReducer from '@/features/reminders/remindersSlice';
import reportsReducer from '@/features/reports/reportsSlice';
import analyticsReducer from '@/features/analytics/analyticsSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';
import facilitiesReducer from '@/features/facilities/facilitiesSlice';
import schedulesReducer from '@/features/schedules/schedulesSlice';

// Import RTK Query API reducers
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

export const rootReducer = combineReducers({
  // Feature slice reducers
  auth: authReducer,
  children: childrenReducer,
  vaccines: vaccinesReducer,
  parents: parentsReducer,
  reminders: remindersReducer,
  reports: reportsReducer,
  analytics: analyticsReducer,
  notifications: notificationsReducer,
  facilities: facilitiesReducer,
  schedules: schedulesReducer,
  
  // RTK Query API reducers
  [authAPI.reducerPath]: authAPI.reducer,
  [childrenAPI.reducerPath]: childrenAPI.reducer,
  [vaccinesAPI.reducerPath]: vaccinesAPI.reducer,
  [parentsAPI.reducerPath]: parentsAPI.reducer,
  [remindersAPI.reducerPath]: remindersAPI.reducer,
  [reportsAPI.reducerPath]: reportsAPI.reducer,
  [analyticsAPI.reducerPath]: analyticsAPI.reducer,
  [notificationsAPI.reducerPath]: notificationsAPI.reducer,
  [facilitiesAPI.reducerPath]: facilitiesAPI.reducer,
  [schedulesAPI.reducerPath]: schedulesAPI.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
