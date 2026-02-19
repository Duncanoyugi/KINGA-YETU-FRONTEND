import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Facility, 
  CreateFacilityRequest, 
  UpdateFacilityRequest,
  FacilityFilter 
} from './facilitiesTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const facilitiesAPI = createApi({
  reducerPath: 'facilitiesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/facilities`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all facilities with optional filters
    getFacilities: builder.query<Facility[], FacilityFilter | undefined>({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter?.county) params.append('county', filter.county);
        if (filter?.subCounty) params.append('subCounty', filter.subCounty);
        if (filter?.type) params.append('type', filter.type);
        if (filter?.status) params.append('status', filter.status);
        if (filter?.search) params.append('search', filter.search);
        return `?${params.toString()}`;
      },
    }),

    // Get a single facility by ID
    getFacilityById: builder.query<Facility, string>({
      query: (id) => `/${id}`,
    }),

    // Get facilities by county
    getFacilitiesByCounty: builder.query<Facility[], string>({
      query: (county) => `/county/${county}`,
    }),

    // Create a new facility
    createFacility: builder.mutation<Facility, CreateFacilityRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
    }),

    // Update a facility
    updateFacility: builder.mutation<Facility, { id: string; data: UpdateFacilityRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // Delete a facility
    deleteFacility: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),

    // Activate a facility
    activateFacility: builder.mutation<Facility, string>({
      query: (id) => ({
        url: `/${id}/activate`,
        method: 'POST',
      }),
    }),

    // Deactivate a facility
    deactivateFacility: builder.mutation<Facility, string>({
      query: (id) => ({
        url: `/${id}/deactivate`,
        method: 'POST',
      }),
    }),

    // Get facility statistics
    getFacilityStats: builder.query<{
      total: number;
      active: number;
      inactive: number;
      byType: Record<string, number>;
    }, void>({
      query: () => '/stats',
    }),
  }),
});

export const {
  useGetFacilitiesQuery,
  useGetFacilityByIdQuery,
  useGetFacilitiesByCountyQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useActivateFacilityMutation,
  useDeactivateFacilityMutation,
  useGetFacilityStatsQuery,
} = facilitiesAPI;
