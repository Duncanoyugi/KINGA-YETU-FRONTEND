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

export const rootReducer = combineReducers({
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
});

export type RootState = ReturnType<typeof rootReducer>;