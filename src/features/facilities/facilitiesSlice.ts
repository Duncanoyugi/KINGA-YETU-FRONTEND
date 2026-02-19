import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Facility } from './facilitiesTypes';

interface FacilitiesState {
  facilities: Facility[];
  currentFacility: Facility | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FacilitiesState = {
  facilities: [],
  currentFacility: null,
  isLoading: false,
  error: null,
};

const facilitiesSlice = createSlice({
  name: 'facilities',
  initialState,
  reducers: {
    setFacilities: (state, action: PayloadAction<Facility[]>) => {
      state.facilities = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addFacility: (state, action: PayloadAction<Facility>) => {
      state.facilities.push(action.payload);
    },
    updateFacility: (state, action: PayloadAction<Facility>) => {
      const index = state.facilities.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.facilities[index] = action.payload;
      }
    },
    removeFacility: (state, action: PayloadAction<string>) => {
      state.facilities = state.facilities.filter(f => f.id !== action.payload);
    },
    setCurrentFacility: (state, action: PayloadAction<Facility | null>) => {
      state.currentFacility = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearFacilities: (state) => {
      state.facilities = [];
      state.currentFacility = null;
      state.error = null;
    },
  },
});

export const {
  setFacilities,
  addFacility,
  updateFacility,
  removeFacility,
  setCurrentFacility,
  setLoading,
  setError,
  clearFacilities,
} = facilitiesSlice.actions;

export default facilitiesSlice.reducer;
