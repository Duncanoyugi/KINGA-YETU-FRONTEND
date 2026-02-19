import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  VaccinesState, 
  Vaccine, 
  VaccineInventory, 
  VaccineBatch,
  StockAlert
} from './vaccinesTypes';

const initialState: VaccinesState = {
  vaccines: [],
  currentVaccine: null,
  inventory: [],
  batches: [],
  alerts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const vaccinesSlice = createSlice({
  name: 'vaccines',
  initialState,
  reducers: {
    // Vaccine operations
    setVaccines: (state, action: PayloadAction<Vaccine[]>) => {
      state.vaccines = action.payload;
    },
    
    setCurrentVaccine: (state, action: PayloadAction<Vaccine | null>) => {
      state.currentVaccine = action.payload;
    },
    
    addVaccine: (state, action: PayloadAction<Vaccine>) => {
      state.vaccines.push(action.payload);
    },
    
    updateVaccine: (state, action: PayloadAction<Vaccine>) => {
      const index = state.vaccines.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vaccines[index] = action.payload;
      }
      if (state.currentVaccine?.id === action.payload.id) {
        state.currentVaccine = action.payload;
      }
    },
    
    removeVaccine: (state, action: PayloadAction<string>) => {
      state.vaccines = state.vaccines.filter(v => v.id !== action.payload);
      if (state.currentVaccine?.id === action.payload) {
        state.currentVaccine = null;
      }
    },

    // Inventory operations
    setInventory: (state, action: PayloadAction<VaccineInventory[]>) => {
      state.inventory = action.payload;
    },
    
    addInventory: (state, action: PayloadAction<VaccineInventory>) => {
      state.inventory.push(action.payload);
    },
    
    updateInventory: (state, action: PayloadAction<VaccineInventory>) => {
      const index = state.inventory.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.inventory[index] = action.payload;
      }
    },
    
    removeInventory: (state, action: PayloadAction<string>) => {
      state.inventory = state.inventory.filter(i => i.id !== action.payload);
    },

    // Batch operations
    setBatches: (state, action: PayloadAction<VaccineBatch[]>) => {
      state.batches = action.payload;
    },
    
    addBatch: (state, action: PayloadAction<VaccineBatch>) => {
      state.batches.push(action.payload);
    },
    
    updateBatch: (state, action: PayloadAction<VaccineBatch>) => {
      const index = state.batches.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.batches[index] = action.payload;
      }
    },
    
    removeBatch: (state, action: PayloadAction<string>) => {
      state.batches = state.batches.filter(b => b.id !== action.payload);
    },

    // Alert operations
    setAlerts: (state, action: PayloadAction<StockAlert[]>) => {
      state.alerts = action.payload;
    },
    
    addAlert: (state, action: PayloadAction<StockAlert>) => {
      state.alerts.push(action.payload);
    },
    
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.vaccineId !== action.payload);
    },
    
    clearAlerts: (state) => {
      state.alerts = [];
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
    setPagination: (state, action: PayloadAction<Partial<VaccinesState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetVaccinesState: () => initialState,
    
    clearCurrentVaccine: (state) => {
      state.currentVaccine = null;
    },
  },
});

export const {
  // Vaccine operations
  setVaccines,
  setCurrentVaccine,
  addVaccine,
  updateVaccine,
  removeVaccine,
  
  // Inventory operations
  setInventory,
  addInventory,
  updateInventory,
  removeInventory,
  
  // Batch operations
  setBatches,
  addBatch,
  updateBatch,
  removeBatch,
  
  // Alert operations
  setAlerts,
  addAlert,
  removeAlert,
  clearAlerts,
  
  // UI state management
  setLoading,
  setError,
  clearError,
  
  // Pagination
  setPagination,
  
  // Reset state
  resetVaccinesState,
  clearCurrentVaccine,
} = vaccinesSlice.actions;

export default vaccinesSlice.reducer;