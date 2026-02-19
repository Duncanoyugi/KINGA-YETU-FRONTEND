// Custom hooks for schedules feature
import {
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useGetSchedulesByChildIdQuery,
  useGetUpcomingSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useCompleteScheduleMutation,
  useRescheduleMutation,
} from './schedulesAPI';
import type { ScheduleFilter } from './schedulesTypes';

export {
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useGetSchedulesByChildIdQuery,
  useGetUpcomingSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useCompleteScheduleMutation,
  useRescheduleMutation,
};

// Helper hook to get pending schedules
export const usePendingSchedules = (childId?: string) => {
  const filter: ScheduleFilter = { status: 'PENDING' };
  if (childId) filter.childId = childId;
  
  const { data: schedules, isLoading, error, refetch } = useGetSchedulesQuery(filter);
  return { schedules: schedules || [], isLoading, error, refetch };
};

// Helper hook to get completed schedules
export const useCompletedSchedules = (childId?: string) => {
  const filter: ScheduleFilter = { status: 'COMPLETED' };
  if (childId) filter.childId = childId;
  
  const { data: schedules, isLoading, error } = useGetSchedulesQuery(filter);
  return { schedules: schedules || [], isLoading, error };
};
