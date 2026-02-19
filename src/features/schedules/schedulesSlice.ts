// Redux slice for schedules (local state if needed)
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScheduleFilter } from './schedulesTypes';

interface SchedulesState {
  selectedScheduleId: string | null;
  filters: ScheduleFilter;
  isLoading: boolean;
}

const initialState: SchedulesState = {
  selectedScheduleId: null,
  filters: {},
  isLoading: false,
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setSelectedSchedule: (state, action: PayloadAction<string | null>) => {
      state.selectedScheduleId = action.payload;
    },
    setFilters: (state, action: PayloadAction<ScheduleFilter>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSelectedSchedule, setFilters, clearFilters, setLoading } = schedulesSlice.actions;
export default schedulesSlice.reducer;
