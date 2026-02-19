import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  DashboardMetrics,
  CoverageAnalytics,
  DropoutAnalytics,
  PerformanceMetrics,
  TrendAnalytics,
  GeographicAnalytics,
  DemographicsAnalytics,
  AnalyticsRequest,
  PredictionRequest,
  AnalyticsResponse
} from './analyticsTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const analyticsAPI = createApi({
  reducerPath: 'analyticsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/analytics`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard', 'Coverage', 'Dropout', 'Performance', 'Trends', 'Geographic', 'Demographics'],
  endpoints: (builder) => ({
    // Dashboard metrics
    getDashboardMetrics: builder.query<DashboardMetrics, AnalyticsRequest>({
      query: (params) => ({
        url: '/dashboard',
        params,
      }),
      providesTags: ['Dashboard'],
    }),

    // Coverage analytics
    getCoverageAnalytics: builder.query<AnalyticsResponse<CoverageAnalytics>, AnalyticsRequest>({
      query: (params) => ({
        url: '/coverage',
        params,
      }),
      providesTags: ['Coverage'],
    }),

    // Dropout analytics
    getDropoutAnalytics: builder.query<AnalyticsResponse<DropoutAnalytics>, AnalyticsRequest>({
      query: (params) => ({
        url: '/dropout',
        params,
      }),
      providesTags: ['Dropout'],
    }),

    // Performance metrics
    getPerformanceMetrics: builder.query<AnalyticsResponse<PerformanceMetrics>, AnalyticsRequest>({
      query: (params) => ({
        url: '/performance',
        params,
      }),
      providesTags: ['Performance'],
    }),

    // Trend analytics
    getTrendAnalytics: builder.query<AnalyticsResponse<TrendAnalytics>, AnalyticsRequest>({
      query: (params) => ({
        url: '/trends',
        params,
      }),
      providesTags: ['Trends'],
    }),

    // Geographic analytics
    getGeographicAnalytics: builder.query<AnalyticsResponse<GeographicAnalytics>, AnalyticsRequest>({
      query: (params) => ({
        url: '/geographic',
        params,
      }),
      providesTags: ['Geographic'],
    }),

    // Demographics analytics
    getDemographicsAnalytics: builder.query<AnalyticsResponse<DemographicsAnalytics>, AnalyticsRequest>({
      query: (params) => ({
        url: '/demographics',
        params,
      }),
      providesTags: ['Demographics'],
    }),

    // Predictions
    getPredictions: builder.query<{
      predictions: any[];
      confidence: number;
      factors: string[];
    }, PredictionRequest & AnalyticsRequest>({
      query: (params) => ({
        url: '/predict',
        params,
      }),
      providesTags: ['Trends'],
    }),

    // Comparative analytics
    getComparativeAnalytics: builder.query<{
      facilities: Array<{
        id: string;
        name: string;
        metrics: Record<string, number>;
        rank: number;
      }>;
      benchmarks: Record<string, number>;
    }, AnalyticsRequest>({
      query: (params) => ({
        url: '/comparative',
        params,
      }),
      providesTags: ['Performance'],
    }),

    // Real-time statistics
    getRealTimeStats: builder.query<{
      activeUsers: number;
      todayVaccinations: number;
      pendingAppointments: number;
      alerts: number;
    }, void>({
      query: () => '/realtime',
      providesTags: ['Dashboard'],
    }),

    // Export analytics
    exportAnalytics: builder.mutation<Blob, { type: string; params: AnalyticsRequest; format: 'csv' | 'excel' | 'pdf' }>({
      query: ({ type, params, format }) => ({
        url: `/export/${type}`,
        method: 'POST',
        params,
        body: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Custom report generation
    generateCustomReport: builder.mutation<Blob, {
      metrics: string[];
      dimensions: string[];
      filters: any;
      format: 'csv' | 'excel' | 'pdf';
    }>({
      query: (request) => ({
        url: '/custom',
        method: 'POST',
        body: request,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Alert analytics
    getAlertAnalytics: builder.query<{
      total: number;
      byType: Record<string, number>;
      bySeverity: Record<string, number>;
      responseTime: number;
      resolved: number;
    }, AnalyticsRequest>({
      query: (params) => ({
        url: '/alerts',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  // Dashboard
  useGetDashboardMetricsQuery,
  
  // Core analytics
  useGetCoverageAnalyticsQuery,
  useGetDropoutAnalyticsQuery,
  useGetPerformanceMetricsQuery,
  useGetTrendAnalyticsQuery,
  useGetGeographicAnalyticsQuery,
  useGetDemographicsAnalyticsQuery,
  
  // Advanced analytics
  useGetPredictionsQuery,
  useGetComparativeAnalyticsQuery,
  useGetRealTimeStatsQuery,
  useGetAlertAnalyticsQuery,
  
  // Export
  useExportAnalyticsMutation,
  useGenerateCustomReportMutation,
} = analyticsAPI;