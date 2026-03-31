// RTK Query API for schedules
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ScheduleFilter, UpcomingSchedule } from './schedulesTypes';
import { API_URL } from '@/config/environment';

export const schedulesAPI = createApi({
  reducerPath: 'schedulesAPI',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_URL}/schedules`,
    prepareHeaders: (headers) => {
      // Get the token from localStorage or session
      const token = localStorage.getItem('immunitrack_token') || sessionStorage.getItem('immunitrack_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Schedules'],
  endpoints: (builder) => ({
    // Get all schedules with optional filters
    getSchedules: builder.query<Schedule[], ScheduleFilter | undefined>({
      query: (filter) => {
        if (!filter) {
          return { url: '/' };
        }
        return { url: '/', params: filter };
      },
      providesTags: ['Schedules'],
    }),
    
    // Get schedule by ID
    getScheduleById: builder.query<Schedule, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Schedules', id }],
    }),
    
    // Get schedules by child ID
    getSchedulesByChildId: builder.query<Schedule[], string>({
      query: (childId) => `/child/${childId}`,
      providesTags: ['Schedules'],
    }),
    
    // Get upcoming schedules
    getUpcomingSchedules: builder.query<UpcomingSchedule[], number>({
      query: (days = 7) => `/upcoming?days=${days}`,
      providesTags: ['Schedules'],
    }),
    
    // Create new schedule
    createSchedule: builder.mutation<Schedule, CreateScheduleRequest>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedules'],
    }),
    
    // Update schedule
    updateSchedule: builder.mutation<Schedule, { id: string; data: UpdateScheduleRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Schedules'],
    }),
    
    // Delete schedule
    deleteSchedule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedules'],
    }),
    
    // Mark schedule as completed
    completeSchedule: builder.mutation<Schedule, { id: string; administeredBy: string; facilityId?: string }>({
      query: ({ id, ...body }) => ({
        url: `/${id}/complete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedules'],
    }),
    
    // Reschedule
    reschedule: builder.mutation<Schedule, { id: string; newDate: string; reason?: string }>({
      query: ({ id, newDate, reason }) => ({
        url: `/${id}/reschedule`,
        method: 'PATCH',
        body: { newDate, reason },
      }),
      invalidatesTags: ['Schedules'],
    }),
    
    // Get child-specific statistics
    getChildScheduleStats: builder.query<{
      total: number;
      completed: number;
      pending: number;
      overdue: number;
      upcoming: number;
      completionRate: number;
    }, string>({
      query: (childId) => `/schedules/child/${childId}/stats`,
      providesTags: ['Schedules'],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useGetSchedulesByChildIdQuery,
  useGetUpcomingSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useCompleteScheduleMutation,
  useRescheduleMutation,
  useGetChildScheduleStatsQuery,
} = schedulesAPI;
