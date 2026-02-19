import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  ParentsState, 
  Parent, 
  Child,
  Reminder
} from './parentsTypes';

const initialState: ParentsState = {
  parents: [],
  currentParent: null,
  linkedChildren: [],
  reminders: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const parentsSlice = createSlice({
  name: 'parents',
  initialState,
  reducers: {
    // Parent operations
    setParents: (state, action: PayloadAction<Parent[]>) => {
      state.parents = action.payload;
    },
    
    setCurrentParent: (state, action: PayloadAction<Parent | null>) => {
      state.currentParent = action.payload;
    },
    
    addParent: (state, action: PayloadAction<Parent>) => {
      state.parents.push(action.payload);
    },
    
    updateParent: (state, action: PayloadAction<Parent>) => {
      const index = state.parents.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.parents[index] = action.payload;
      }
      if (state.currentParent?.id === action.payload.id) {
        state.currentParent = action.payload;
      }
    },
    
    removeParent: (state, action: PayloadAction<string>) => {
      state.parents = state.parents.filter(p => p.id !== action.payload);
      if (state.currentParent?.id === action.payload) {
        state.currentParent = null;
      }
    },

    // Linked children operations
    setLinkedChildren: (state, action: PayloadAction<Child[]>) => {
      state.linkedChildren = action.payload;
    },
    
    addLinkedChild: (state, action: PayloadAction<Child>) => {
      state.linkedChildren.push(action.payload);
    },
    
    removeLinkedChild: (state, action: PayloadAction<string>) => {
      state.linkedChildren = state.linkedChildren.filter(c => c.id !== action.payload);
    },
    
    updateLinkedChild: (state, action: PayloadAction<Child>) => {
      const index = state.linkedChildren.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.linkedChildren[index] = action.payload;
      }
    },

    // Reminder operations
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
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
    
    markReminderAsRead: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find(r => r.id === action.payload);
      if (reminder) {
        reminder.status = 'READ';
      }
    },

    // UI state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Pagination
    setPagination: (state, action: PayloadAction<Partial<ParentsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetParentsState: () => initialState,
    
    clearCurrentParent: (state) => {
      state.currentParent = null;
      state.linkedChildren = [];
      state.reminders = [];
    },
  },
});

export const {
  // Parent operations
  setParents,
  setCurrentParent,
  addParent,
  updateParent,
  removeParent,
  
  // Linked children operations
  setLinkedChildren,
  addLinkedChild,
  removeLinkedChild,
  updateLinkedChild,
  
  // Reminder operations
  setReminders,
  addReminder,
  updateReminder,
  removeReminder,
  markReminderAsRead,
  
  // UI state management
  setLoading,
  setError,
  clearError,
  
  // Pagination
  setPagination,
  
  // Reset state
  resetParentsState,
  clearCurrentParent,
} = parentsSlice.actions;

export default parentsSlice.reducer;