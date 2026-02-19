import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Vaccine,
  VaccineInventory,
  VaccineBatch,
  StockAlert,
  CreateVaccineRequest,
  UpdateVaccineRequest,
  AddInventoryRequest,
  UpdateInventoryRequest,
  VaccineSearchParams,
  InventorySearchParams
} from './vaccinesTypes';
import type { RootState } from '@/app/store/store';
import { API_URL } from '@/config/environment';

export const vaccinesAPI = createApi({
  reducerPath: 'vaccinesAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/vaccines`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Vaccines', 'Vaccine', 'Inventory', 'Batches', 'Alerts'],
  endpoints: (builder) => ({
    // Vaccine CRUD operations
    getVaccines: builder.query<{ data: Vaccine[]; pagination: any }, VaccineSearchParams>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Vaccines'],
    }),

    getVaccineById: builder.query<Vaccine, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vaccine', id }],
    }),

    getVaccineByCode: builder.query<Vaccine, string>({
      query: (code) => `/code/${code}`,
      providesTags: (_result, _error, code) => [{ type: 'Vaccine', id: code }],
    }),

    createVaccine: builder.mutation<Vaccine, CreateVaccineRequest>({
      query: (vaccineData) => ({
        url: '/',
        method: 'POST',
        body: vaccineData,
      }),
      invalidatesTags: ['Vaccines'],
    }),

    updateVaccine: builder.mutation<Vaccine, { id: string; data: UpdateVaccineRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Vaccine', id },
        'Vaccines',
      ],
    }),

    deleteVaccine: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vaccines'],
    }),

    // Vaccine schedule/templates
    getVaccineSchedule: builder.query<Vaccine[], void>({
      query: () => '/schedule',
      providesTags: ['Vaccines'],
    }),

    getBirthDoses: builder.query<Vaccine[], void>({
      query: () => '/birth-doses',
      providesTags: ['Vaccines'],
    }),

    getBoosterVaccines: builder.query<Vaccine[], void>({
      query: () => '/boosters',
      providesTags: ['Vaccines'],
    }),

    // Inventory management
    getInventory: builder.query<{ data: VaccineInventory[]; pagination: any }, InventorySearchParams>({
      query: (params) => ({
        url: '/inventory',
        params,
      }),
      providesTags: ['Inventory'],
    }),

    getFacilityInventory: builder.query<VaccineInventory[], string>({
      query: (facilityId) => `/inventory/facility/${facilityId}`,
      providesTags: ['Inventory'],
    }),

    addInventory: builder.mutation<VaccineInventory, AddInventoryRequest>({
      query: (inventoryData) => ({
        url: '/inventory',
        method: 'POST',
        body: inventoryData,
      }),
      invalidatesTags: ['Inventory', 'Alerts'],
    }),

    updateInventory: builder.mutation<VaccineInventory, { id: string; data: UpdateInventoryRequest }>({
      query: ({ id, data }) => ({
        url: `/inventory/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Inventory', 'Alerts'],
    }),

    deleteInventory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Batch management
    getBatches: builder.query<VaccineBatch[], { vaccineId?: string; facilityId?: string }>({
      query: (params) => ({
        url: '/batches',
        params,
      }),
      providesTags: ['Batches'],
    }),

    getBatchById: builder.query<VaccineBatch, string>({
      query: (id) => `/batches/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Batches', id }],
    }),

    addBatch: builder.mutation<VaccineBatch, FormData>({
      query: (batchData) => ({
        url: '/batches',
        method: 'POST',
        body: batchData,
      }),
      invalidatesTags: ['Batches', 'Inventory'],
    }),

    updateBatch: builder.mutation<VaccineBatch, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/batches/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Batches', 'Inventory'],
    }),

    // Stock alerts
    getStockAlerts: builder.query<StockAlert[], { facilityId?: string }>({
      query: (params) => ({
        url: '/alerts',
        params,
      }),
      providesTags: ['Alerts'],
    }),

    getExpiringVaccines: builder.query<VaccineInventory[], { days?: number; facilityId?: string }>({
      query: (params) => ({
        url: '/alerts/expiring',
        params,
      }),
      providesTags: ['Alerts'],
    }),

    getLowStockVaccines: builder.query<VaccineInventory[], { threshold?: number; facilityId?: string }>({
      query: (params) => ({
        url: '/alerts/low-stock',
        params,
      }),
      providesTags: ['Alerts'],
    }),

    // Usage tracking
    recordVaccineUsage: builder.mutation<void, { inventoryId: string; dosesUsed: number }>({
      query: (data) => ({
        url: '/usage',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Inventory', 'Alerts'],
    }),

    getVaccineStats: builder.query<{
      totalDoses: number;
      usedDoses: number;
      wastedDoses: number;
      expiringSoon: number;
      coverage: number;
    }, { facilityId?: string; startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/stats',
        params,
      }),
      providesTags: ['Vaccines'],
    }),

    // Bulk operations
    bulkImportVaccines: builder.mutation<void, FormData>({
      query: (file) => ({
        url: '/bulk-import',
        method: 'POST',
        body: file,
      }),
      invalidatesTags: ['Vaccines'],
    }),

    exportVaccineData: builder.query<Blob, { format?: 'csv' | 'excel'; filters?: any }>({
      query: (params) => ({
        url: '/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  // Vaccine CRUD
  useGetVaccinesQuery,
  useGetVaccineByIdQuery,
  useGetVaccineByCodeQuery,
  useCreateVaccineMutation,
  useUpdateVaccineMutation,
  useDeleteVaccineMutation,

  // Vaccine schedule
  useGetVaccineScheduleQuery,
  useGetBirthDosesQuery,
  useGetBoosterVaccinesQuery,

  // Inventory
  useGetInventoryQuery,
  useGetFacilityInventoryQuery,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,

  // Batches
  useGetBatchesQuery,
  useGetBatchByIdQuery,
  useAddBatchMutation,
  useUpdateBatchMutation,

  // Alerts
  useGetStockAlertsQuery,
  useGetExpiringVaccinesQuery,
  useGetLowStockVaccinesQuery,

  // Usage
  useRecordVaccineUsageMutation,
  useGetVaccineStatsQuery,

  // Bulk operations
  useBulkImportVaccinesMutation,
  useExportVaccineDataQuery,
} = vaccinesAPI;