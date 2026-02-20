import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Child, 
  ChildResponse,
  CreateChildRequest,
  UpdateChildRequest,
  GrowthRecord,
  RecordGrowthRequest,
  DevelopmentRecord,
  RecordDevelopmentRequest,
  Immunization,
  ImmunizationRecord,
  VaccinationSchedule,
  ChildSearchParams,
  Reminder
} from './childrenTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const childrenAPI = createApi({
  reducerPath: 'childrenAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/children`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Children', 'Child', 'Growth', 'Development', 'Immunizations', 'Schedules'],
  endpoints: (builder) => ({
    // Child CRUD operations
    getChildren: builder.query<{ data: Child[]; pagination: any }, ChildSearchParams>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Children'],
    }),

    getChildById: builder.query<ChildResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Child', id }],
    }),

    getChildrenByParent: builder.query<Child[], void>({
      query: () => '/my-children',
      providesTags: ['Children'],
    }),

    createChild: builder.mutation<Child, CreateChildRequest>({
      query: (childData) => ({
        url: '/',
        method: 'POST',
        body: childData,
      }),
      invalidatesTags: ['Children'],
    }),

    updateChild: builder.mutation<Child, { id: string; data: UpdateChildRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Child', id },
        'Children',
      ],
    }),

    deleteChild: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Children'],
    }),

    // Growth records
    getGrowthRecords: builder.query<GrowthRecord[], string>({
      query: (childId) => `/${childId}/growth`,
      providesTags: (_result, _error, childId) => [{ type: 'Growth', id: childId }],
    }),

    addGrowthRecord: builder.mutation<GrowthRecord, { childId: string; data: RecordGrowthRequest }>({
      query: ({ childId, data }) => ({
        url: `/${childId}/growth`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { childId }) => [{ type: 'Growth', id: childId }],
    }),

    updateGrowthRecord: builder.mutation<GrowthRecord, { id: string; data: Partial<RecordGrowthRequest> }>({
      query: ({ id, data }) => ({
        url: `/growth/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Growth'],
    }),

    deleteGrowthRecord: builder.mutation<void, string>({
      query: (id) => ({
        url: `/growth/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Growth'],
    }),

    // Development records
    getDevelopmentRecords: builder.query<DevelopmentRecord[], string>({
      query: (childId) => `/${childId}/development`,
      providesTags: (_result, _error, childId) => [{ type: 'Development', id: childId }],
    }),

    addDevelopmentRecord: builder.mutation<DevelopmentRecord, { childId: string; data: RecordDevelopmentRequest }>({
      query: ({ childId, data }) => ({
        url: `/${childId}/development`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { childId }) => [{ type: 'Development', id: childId }],
    }),

    updateDevelopmentRecord: builder.mutation<DevelopmentRecord, { id: string; data: Partial<RecordDevelopmentRequest> }>({
      query: ({ id, data }) => ({
        url: `/development/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Development'],
    }),

    deleteDevelopmentRecord: builder.mutation<void, string>({
      query: (id) => ({
        url: `/development/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Development'],
    }),

    // Immunizations
    getImmunizations: builder.query<Immunization[], string>({
      query: (childId) => `/${childId}/immunizations`,
      providesTags: (_result, _error, childId) => [{ type: 'Immunizations', id: childId }],
    }),

    recordImmunization: builder.mutation<Immunization, { childId: string; data: ImmunizationRecord }>({
      query: ({ childId, data }) => ({
        url: `/${childId}/immunizations`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { childId }) => [
        { type: 'Immunizations', id: childId },
        { type: 'Schedules', id: childId },
      ],
    }),

    updateImmunization: builder.mutation<Immunization, { id: string; data: Partial<ImmunizationRecord> }>({
      query: ({ id, data }) => ({
        url: `/immunizations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Immunizations'],
    }),

    // Vaccination schedules
    getVaccinationSchedule: builder.query<VaccinationSchedule[], string>({
      query: (childId) => `/${childId}/schedule`,
      providesTags: (_result, _error, childId) => [{ type: 'Schedules', id: childId }],
    }),

    generateSchedule: builder.mutation<VaccinationSchedule[], string>({
      query: (childId) => ({
        url: `/${childId}/schedule/generate`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, childId) => [{ type: 'Schedules', id: childId }],
    }),

    updateScheduleStatus: builder.mutation<VaccinationSchedule, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/schedule/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Schedules'],
    }),

    // Reminders
    getChildReminders: builder.query<Reminder[], string>({
      query: (childId) => `/${childId}/reminders`,
      providesTags: (_result, _error, childId) => [{ type: 'Schedules', id: childId }],
    }),

    // Dashboard/Overview
    getChildDashboard: builder.query<{
      child: Child;
      upcomingVaccinations: VaccinationSchedule[];
      recentGrowth: GrowthRecord[];
      immunizationHistory: Immunization[];
      completionRate: number;
    }, string>({
      query: (childId) => `/${childId}/dashboard`,
      providesTags: (_result, _error, childId) => [
        { type: 'Child', id: childId },
        { type: 'Growth', id: childId },
        { type: 'Immunizations', id: childId },
        { type: 'Schedules', id: childId },
      ],
    }),

    // Batch operations
    // Facility-level child listing is not implemented directly on children controller yet.
    // Use reports/analytics endpoints for facility views instead, or add a dedicated backend route.
  }),
});

export const {
  // Child CRUD
  useGetChildrenQuery,
  useGetChildByIdQuery,
  useGetChildrenByParentQuery,
  useCreateChildMutation,
  useUpdateChildMutation,
  useDeleteChildMutation,

  // Growth records
  useGetGrowthRecordsQuery,
  useAddGrowthRecordMutation,
  useUpdateGrowthRecordMutation,
  useDeleteGrowthRecordMutation,

  // Development records
  useGetDevelopmentRecordsQuery,
  useAddDevelopmentRecordMutation,
  useUpdateDevelopmentRecordMutation,
  useDeleteDevelopmentRecordMutation,

  // Immunizations
  useGetImmunizationsQuery,
  useRecordImmunizationMutation,
  useUpdateImmunizationMutation,

  // Schedules
  useGetVaccinationScheduleQuery,
  useGenerateScheduleMutation,
  useUpdateScheduleStatusMutation,

  // Reminders
  useGetChildRemindersQuery,

  // Dashboard
  useGetChildDashboardQuery,

} = childrenAPI;