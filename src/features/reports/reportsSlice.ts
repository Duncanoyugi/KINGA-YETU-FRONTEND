import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  ReportsState, 
  Report, 
  ScheduledReport,
  CoverageReportData,
  MissedVaccinesData,
  FacilityPerformanceData,
  DemographicData,
  TimelinessData
} from './reportsTypes';

const initialState: ReportsState = {
  reports: [],
  currentReport: null,
  scheduledReports: [],
  generatedData: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    // Report operations
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
    },
    
    setCurrentReport: (state, action: PayloadAction<Report | null>) => {
      state.currentReport = action.payload;
    },
    
    addReport: (state, action: PayloadAction<Report>) => {
      state.reports.unshift(action.payload);
    },
    
    updateReport: (state, action: PayloadAction<Report>) => {
      const index = state.reports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      if (state.currentReport?.id === action.payload.id) {
        state.currentReport = action.payload;
      }
    },
    
    removeReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(r => r.id !== action.payload);
      if (state.currentReport?.id === action.payload) {
        state.currentReport = null;
      }
    },

    // Generated data
    setGeneratedData: (state, action: PayloadAction<any>) => {
      state.generatedData = action.payload;
    },
    
    clearGeneratedData: (state) => {
      state.generatedData = null;
    },

    // Scheduled reports
    setScheduledReports: (state, action: PayloadAction<ScheduledReport[]>) => {
      state.scheduledReports = action.payload;
    },
    
    addScheduledReport: (state, action: PayloadAction<ScheduledReport>) => {
      state.scheduledReports.push(action.payload);
    },
    
    updateScheduledReport: (state, action: PayloadAction<ScheduledReport>) => {
      const index = state.scheduledReports.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.scheduledReports[index] = action.payload;
      }
    },
    
    removeScheduledReport: (state, action: PayloadAction<string>) => {
      state.scheduledReports = state.scheduledReports.filter(s => s.id !== action.payload);
    },

    // Specific report type data
    setCoverageData: (state, action: PayloadAction<CoverageReportData>) => {
      state.generatedData = { type: 'coverage', data: action.payload };
    },
    
    setMissedVaccinesData: (state, action: PayloadAction<MissedVaccinesData>) => {
      state.generatedData = { type: 'missed-vaccines', data: action.payload };
    },
    
    setFacilityPerformanceData: (state, action: PayloadAction<FacilityPerformanceData>) => {
      state.generatedData = { type: 'facility-performance', data: action.payload };
    },
    
    setDemographicData: (state, action: PayloadAction<DemographicData>) => {
      state.generatedData = { type: 'demographic', data: action.payload };
    },
    
    setTimelinessData: (state, action: PayloadAction<TimelinessData>) => {
      state.generatedData = { type: 'timeliness', data: action.payload };
    },

    // UI state management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Pagination
    setPagination: (state, action: PayloadAction<Partial<ReportsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetReportsState: () => initialState,
    
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
});

export const {
  // Report operations
  setReports,
  setCurrentReport,
  addReport,
  updateReport,
  removeReport,
  
  // Generated data
  setGeneratedData,
  clearGeneratedData,
  
  // Scheduled reports
  setScheduledReports,
  addScheduledReport,
  updateScheduledReport,
  removeScheduledReport,
  
  // Specific report data
  setCoverageData,
  setMissedVaccinesData,
  setFacilityPerformanceData,
  setDemographicData,
  setTimelinessData,
  
  // UI state management
  setLoading,
  setGenerating,
  setError,
  clearError,
  
  // Pagination
  setPagination,
  
  // Reset state
  resetReportsState,
  clearCurrentReport,
} = reportsSlice.actions;

export default reportsSlice.reducer;