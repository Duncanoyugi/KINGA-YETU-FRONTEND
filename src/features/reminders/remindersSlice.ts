import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Reminder, ReminderSettings } from './remindersTypes';

interface RemindersState {
  reminders: Reminder[];
  currentReminder: Reminder | null;
  settings: ReminderSettings | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RemindersState = {
  reminders: [],
  currentReminder: null,
  settings: null,
  isLoading: false,
  error: null,
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    removeReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(r => r.id !== action.payload);
    },
    setCurrentReminder: (state, action: PayloadAction<Reminder | null>) => {
      state.currentReminder = action.payload;
    },
    setSettings: (state, action: PayloadAction<ReminderSettings>) => {
      state.settings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearReminders: (state) => {
      state.reminders = [];
      state.currentReminder = null;
      state.error = null;
    },
  },
});

export const {
  setReminders,
  addReminder,
  updateReminder,
  removeReminder,
  setCurrentReminder,
  setSettings,
  setLoading,
  setError,
  clearReminders,
} = remindersSlice.actions;

export default remindersSlice.reducer;
