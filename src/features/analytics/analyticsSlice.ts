import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { 
  type AnalyticsState, 
  type DashboardMetrics,
  type CoverageAnalytics,
  type DropoutAnalytics,
  type PerformanceMetrics,
  type TrendAnalytics,
  type GeographicAnalytics,
  type DemographicsAnalytics
} from './analyticsTypes';

const initialState: AnalyticsState = {
  dashboard: null,
  coverage: null,
  dropout: null,
  performance: null,
  trends: null,
  geographic: null,
  demographics: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  lastUpdated: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Dashboard metrics
    setDashboardMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.dashboard = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateDashboardMetrics: (state, action: PayloadAction<Partial<DashboardMetrics>>) => {
      if (state.dashboard) {
        state.dashboard = { ...state.dashboard, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Coverage analytics
    setCoverageAnalytics: (state, action: PayloadAction<CoverageAnalytics>) => {
      state.coverage = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateCoverageAnalytics: (state, action: PayloadAction<Partial<CoverageAnalytics>>) => {
      if (state.coverage) {
        state.coverage = { ...state.coverage, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Dropout analytics
    setDropoutAnalytics: (state, action: PayloadAction<DropoutAnalytics>) => {
      state.dropout = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateDropoutAnalytics: (state, action: PayloadAction<Partial<DropoutAnalytics>>) => {
      if (state.dropout) {
        state.dropout = { ...state.dropout, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Performance metrics
    setPerformanceMetrics: (state, action: PayloadAction<PerformanceMetrics>) => {
      state.performance = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updatePerformanceMetrics: (state, action: PayloadAction<Partial<PerformanceMetrics>>) => {
      if (state.performance) {
        state.performance = { ...state.performance, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Trend analytics
    setTrendAnalytics: (state, action: PayloadAction<TrendAnalytics>) => {
      state.trends = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateTrendAnalytics: (state, action: PayloadAction<Partial<TrendAnalytics>>) => {
      if (state.trends) {
        state.trends = { ...state.trends, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Geographic analytics
    setGeographicAnalytics: (state, action: PayloadAction<GeographicAnalytics>) => {
      state.geographic = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateGeographicAnalytics: (state, action: PayloadAction<Partial<GeographicAnalytics>>) => {
      if (state.geographic) {
        state.geographic = { ...state.geographic, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
    },

    // Demographics analytics
    setDemographicsAnalytics: (state, action: PayloadAction<DemographicsAnalytics>) => {
      state.demographics = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateDemographicsAnalytics: (state, action: PayloadAction<Partial<DemographicsAnalytics>>) => {
      if (state.demographics) {
        state.demographics = { ...state.demographics, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      }
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

    // Reset state
    resetAnalyticsState: () => initialState,
    
    clearAllAnalytics: (state) => {
      state.dashboard = null;
      state.coverage = null;
      state.dropout = null;
      state.performance = null;
      state.trends = null;
      state.geographic = null;
      state.demographics = null;
      state.lastUpdated = null;
    },
    
    clearDashboard: (state) => {
      state.dashboard = null;
    },
    
    clearCoverage: (state) => {
      state.coverage = null;
    },
    
    clearDropout: (state) => {
      state.dropout = null;
    },
    
    clearPerformance: (state) => {
      state.performance = null;
    },
    
    clearTrends: (state) => {
      state.trends = null;
    },
    
    clearGeographic: (state) => {
      state.geographic = null;
    },
    
    clearDemographics: (state) => {
      state.demographics = null;
    },
  },
});

export const {
  // Dashboard metrics
  setDashboardMetrics,
  updateDashboardMetrics,
  
  // Coverage analytics
  setCoverageAnalytics,
  updateCoverageAnalytics,
  
  // Dropout analytics
  setDropoutAnalytics,
  updateDropoutAnalytics,
  
  // Performance metrics
  setPerformanceMetrics,
  updatePerformanceMetrics,
  
  // Trend analytics
  setTrendAnalytics,
  updateTrendAnalytics,
  
  // Geographic analytics
  setGeographicAnalytics,
  updateGeographicAnalytics,
  
  // Demographics analytics
  setDemographicsAnalytics,
  updateDemographicsAnalytics,
  
  // UI state management
  setLoading,
  setGenerating,
  setError,
  clearError,
  
  // Reset state
  resetAnalyticsState,
  clearAllAnalytics,
  clearDashboard,
  clearCoverage,
  clearDropout,
  clearPerformance,
  clearTrends,
  clearGeographic,
  clearDemographics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;