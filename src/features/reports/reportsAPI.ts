import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Report,
  CoverageReportData,
  MissedVaccinesData,
  FacilityPerformanceData,
  DemographicData,
  TimelinessData,
  GenerateReportRequest,
  ReportParameters,
  ReportSearchParams,
  ScheduledReport,
  ReportFormat,
  ReportFrequency,
  ReportType
} from './reportsTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const reportsAPI = createApi({
  reducerPath: 'reportsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/reports`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reports', 'Report', 'Scheduled', 'Generated'],
  endpoints: (builder) => ({
    // Report CRUD operations
    getReports: builder.query<{ data: Report[]; pagination: any }, ReportSearchParams>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Reports'],
    }),

    getReportById: builder.query<Report, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Report', id }],
    }),

    generateReport: builder.mutation<Report, GenerateReportRequest>({
      query: (request) => ({
        url: '/generate',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Reports', 'Generated'],
    }),

    deleteReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reports'],
    }),

    // Report data endpoints
    getCoverageReport: builder.query<CoverageReportData, ReportParameters>({
      query: (params) => ({
        url: '/coverage',
        params,
      }),
      providesTags: ['Generated'],
    }),

    getMissedVaccinesReport: builder.query<MissedVaccinesData, ReportParameters>({
      query: (params) => ({
        url: '/missed-vaccines',
        params,
      }),
      providesTags: ['Generated'],
    }),

    getFacilityPerformance: builder.query<FacilityPerformanceData, { facilityId: string; params: ReportParameters }>({
      query: ({ facilityId, params }) => ({
        url: `/facility/${facilityId}/performance`,
        params,
      }),
      providesTags: ['Generated'],
    }),

    getDemographicReport: builder.query<DemographicData, ReportParameters>({
      query: (params) => ({
        url: '/demographic',
        params,
      }),
      providesTags: ['Generated'],
    }),

    getTimelinessReport: builder.query<TimelinessData, ReportParameters>({
      query: (params) => ({
        url: '/timeliness',
        params,
      }),
      providesTags: ['Generated'],
    }),

    // Report export
    exportReport: builder.query<Blob, { reportId: string; format: ReportFormat }>({
      query: ({ reportId, format }) => ({
        url: `/${reportId}/export`,
        params: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),

    downloadReport: builder.mutation<Blob, { reportId: string; format: ReportFormat }>({
      query: ({ reportId, format }) => ({
        url: `/${reportId}/download`,
        params: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Scheduled reports
    getScheduledReports: builder.query<ScheduledReport[], void>({
      query: () => '/scheduled',
      providesTags: ['Scheduled'],
    }),

    scheduleReport: builder.mutation<ScheduledReport, {
      reportId: string;
      frequency: ReportFrequency;
      recipients: string[];
      startDate: string;
    }>({
      query: (data) => ({
        url: '/scheduled',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Scheduled'],
    }),

    updateScheduledReport: builder.mutation<ScheduledReport, { id: string; data: Partial<ScheduledReport> }>({
      query: ({ id, data }) => ({
        url: `/scheduled/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Scheduled'],
    }),

    deleteScheduledReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/scheduled/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scheduled'],
    }),

    // Report templates
    getReportTemplates: builder.query<Array<{ id: string; name: string; type: ReportType }>, void>({
      query: () => '/templates',
    }),

    // Dashboard statistics
    getReportStats: builder.query<{
      totalReports: number;
      recentReports: Report[];
      scheduledCount: number;
      popularTypes: Array<{ type: ReportType; count: number }>;
    }, void>({
      query: () => '/stats',
      providesTags: ['Reports', 'Scheduled'],
    }),
  }),
});

export const {
  // Report CRUD
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGenerateReportMutation,
  useDeleteReportMutation,

  // Report data
  useGetCoverageReportQuery,
  useGetMissedVaccinesReportQuery,
  useGetFacilityPerformanceQuery,
  useGetDemographicReportQuery,
  useGetTimelinessReportQuery,

  // Export
  useExportReportQuery,
  useDownloadReportMutation,

  // Scheduled reports
  useGetScheduledReportsQuery,
  useScheduleReportMutation,
  useUpdateScheduledReportMutation,
  useDeleteScheduledReportMutation,

  // Templates
  useGetReportTemplatesQuery,

  // Stats
  useGetReportStatsQuery,
} = reportsAPI;