import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  ChildrenState, 
  Child, 
  Immunization, 
  GrowthRecord, 
  DevelopmentRecord,
  VaccinationSchedule,
  Reminder
} from './childrenTypes';

const initialState: ChildrenState = {
  children: [],
  currentChild: null,
  selectedChildId: null,
  immunizations: [],
  growthRecords: [],
  developmentRecords: [],
  schedules: [],
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

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    // Child operations
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;
    },
    
    setCurrentChild: (state, action: PayloadAction<Child | null>) => {
      state.currentChild = action.payload;
      if (action.payload) {
        state.selectedChildId = action.payload.id;
      }
    },
    
    addChild: (state, action: PayloadAction<Child>) => {
      state.children.push(action.payload);
    },
    
    updateChild: (state, action: PayloadAction<Child>) => {
      const index = state.children.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.children[index] = action.payload;
      }
      if (state.currentChild?.id === action.payload.id) {
        state.currentChild = action.payload;
      }
    },
    
    removeChild: (state, action: PayloadAction<string>) => {
      state.children = state.children.filter(c => c.id !== action.payload);
      if (state.currentChild?.id === action.payload) {
        state.currentChild = null;
        state.selectedChildId = null;
      }
    },

    // Immunization operations
    setImmunizations: (state, action: PayloadAction<Immunization[]>) => {
      state.immunizations = action.payload;
    },
    
    addImmunization: (state, action: PayloadAction<Immunization>) => {
      state.immunizations.push(action.payload);
    },
    
    updateImmunization: (state, action: PayloadAction<Immunization>) => {
      const index = state.immunizations.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.immunizations[index] = action.payload;
      }
    },
    
    removeImmunization: (state, action: PayloadAction<string>) => {
      state.immunizations = state.immunizations.filter(i => i.id !== action.payload);
    },

    // Growth record operations
    setGrowthRecords: (state, action: PayloadAction<GrowthRecord[]>) => {
      state.growthRecords = action.payload;
    },
    
    addGrowthRecord: (state, action: PayloadAction<GrowthRecord>) => {
      state.growthRecords.push(action.payload);
    },
    
    updateGrowthRecord: (state, action: PayloadAction<GrowthRecord>) => {
      const index = state.growthRecords.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.growthRecords[index] = action.payload;
      }
    },
    
    removeGrowthRecord: (state, action: PayloadAction<string>) => {
      state.growthRecords = state.growthRecords.filter(g => g.id !== action.payload);
    },

    // Development record operations
    setDevelopmentRecords: (state, action: PayloadAction<DevelopmentRecord[]>) => {
      state.developmentRecords = action.payload;
    },
    
    addDevelopmentRecord: (state, action: PayloadAction<DevelopmentRecord>) => {
      state.developmentRecords.push(action.payload);
    },
    
    updateDevelopmentRecord: (state, action: PayloadAction<DevelopmentRecord>) => {
      const index = state.developmentRecords.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.developmentRecords[index] = action.payload;
      }
    },
    
    removeDevelopmentRecord: (state, action: PayloadAction<string>) => {
      state.developmentRecords = state.developmentRecords.filter(d => d.id !== action.payload);
    },

    // Schedule operations
    setSchedules: (state, action: PayloadAction<VaccinationSchedule[]>) => {
      state.schedules = action.payload;
    },
    
    addSchedule: (state, action: PayloadAction<VaccinationSchedule>) => {
      state.schedules.push(action.payload);
    },
    
    updateSchedule: (state, action: PayloadAction<VaccinationSchedule>) => {
      const index = state.schedules.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.schedules[index] = action.payload;
      }
    },
    
    removeSchedule: (state, action: PayloadAction<string>) => {
      state.schedules = state.schedules.filter(s => s.id !== action.payload);
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

    // UI state management
    setSelectedChildId: (state, action: PayloadAction<string | null>) => {
      state.selectedChildId = action.payload;
    },
    
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
    setPagination: (state, action: PayloadAction<Partial<ChildrenState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetChildrenState: () => initialState,
    
    clearCurrentChild: (state) => {
      state.currentChild = null;
    },
    
    clearAllRecords: (state) => {
      state.immunizations = [];
      state.growthRecords = [];
      state.developmentRecords = [];
      state.schedules = [];
      state.reminders = [];
    },
  },
});

export const {
  // Child operations
  setChildren,
  setCurrentChild,
  addChild,
  updateChild,
  removeChild,
  
  // Immunization operations
  setImmunizations,
  addImmunization,
  updateImmunization,
  removeImmunization,
  
  // Growth record operations
  setGrowthRecords,
  addGrowthRecord,
  updateGrowthRecord,
  removeGrowthRecord,
  
  // Development record operations
  setDevelopmentRecords,
  addDevelopmentRecord,
  updateDevelopmentRecord,
  removeDevelopmentRecord,
  
  // Schedule operations
  setSchedules,
  addSchedule,
  updateSchedule,
  removeSchedule,
  
  // Reminder operations
  setReminders,
  addReminder,
  updateReminder,
  removeReminder,
  
  // UI state management
  setSelectedChildId,
  setLoading,
  setError,
  clearError,
  
  // Pagination
  setPagination,
  
  // Reset state
  resetChildrenState,
  clearCurrentChild,
  clearAllRecords,
} = childrenSlice.actions;

export default childrenSlice.reducer;