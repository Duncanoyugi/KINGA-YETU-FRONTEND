// Custom hooks for facilities feature
import { 
  useGetFacilitiesQuery, 
  useGetFacilityByIdQuery, 
  useGetFacilitiesByCountyQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useActivateFacilityMutation,
  useDeactivateFacilityMutation,
  useGetFacilityStatsQuery
} from './facilitiesAPI';
import type { FacilityType } from './facilitiesTypes';

export {
  useGetFacilitiesQuery,
  useGetFacilityByIdQuery,
  useGetFacilitiesByCountyQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useActivateFacilityMutation,
  useDeactivateFacilityMutation,
  useGetFacilityStatsQuery,
};

// Helper hook to get active facilities
export const useActiveFacilities = () => {
  const { data: facilities, isLoading, error } = useGetFacilitiesQuery({ status: 'ACTIVE' });
  return { facilities: facilities || [], isLoading, error };
};

// Helper hook to get facilities by type
export const useFacilitiesByType = (type: FacilityType) => {
  const { data: facilities, isLoading, error } = useGetFacilitiesQuery({ type });
  return { facilities: facilities || [], isLoading, error };
};
