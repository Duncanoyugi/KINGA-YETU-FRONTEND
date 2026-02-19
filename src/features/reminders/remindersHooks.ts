// Custom hooks for reminders feature
import { useGetRemindersQuery, useGetReminderByIdQuery, useGetRemindersByChildQuery, useCreateReminderMutation, useUpdateReminderMutation, useDeleteReminderMutation, useGetReminderSettingsQuery, useUpdateReminderSettingsMutation, useSendReminderMutation, useCancelReminderMutation } from './remindersAPI';

export {
  useGetRemindersQuery,
  useGetReminderByIdQuery,
  useGetRemindersByChildQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useGetReminderSettingsQuery,
  useUpdateReminderSettingsMutation,
  useSendReminderMutation,
  useCancelReminderMutation,
};

// Helper hook to get upcoming reminders
export const useUpcomingReminders = (daysAhead: number = 7) => {
  const { data: reminders, isLoading, error } = useGetRemindersQuery(undefined);
  
  const upcomingReminders = reminders?.filter(reminder => {
    const scheduledDate = new Date(reminder.scheduledDate);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return scheduledDate >= now && scheduledDate <= futureDate && reminder.status === 'PENDING';
  }) || [];
  
  return {
    upcomingReminders,
    isLoading,
    error,
  };
};

// Helper hook to get overdue reminders
export const useOverdueReminders = () => {
  const { data: reminders, isLoading, error } = useGetRemindersQuery(undefined);
  
  const overdueReminders = reminders?.filter(reminder => {
    const scheduledDate = new Date(reminder.scheduledDate);
    const now = new Date();
    
    return scheduledDate < now && reminder.status === 'PENDING';
  }) || [];
  
  return {
    overdueReminders,
    isLoading,
    error,
  };
};
