import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useAuth } from '../auth/authHooks';
import {
  useGetParentsQuery,
  useGetParentByIdQuery,
  useGetParentByUserIdQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
  useGetParentChildrenQuery,
  useLinkChildMutation,
  useUnlinkChildMutation,
  useGetParentRemindersQuery,
  useGetParentDashboardQuery,
  useGetParentStatsQuery,
  useUpdateNotificationPreferencesMutation,
} from './parentsAPI';
import {
  setParents,
  setCurrentParent,
  addParent,
  updateParent,
  removeParent,
  setLinkedChildren,
  removeLinkedChild,
  setReminders,
  setLoading,
  setError,
  clearError,
} from './parentsSlice';
import { type Parent, type Child, type Reminder, type CreateParentRequest, type UpdateParentRequest, type LinkChildRequest } from './parentsTypes';
import { toast } from 'react-hot-toast';

// Main hook for parent management
export const useParents = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { parents, currentParent, isLoading, error, pagination } = 
    useAppSelector((state) => state.parents);

  // RTK Query hooks
  const { data: parentsData, refetch: refetchParents } = useGetParentsQuery(
    { page: pagination.page, limit: pagination.limit },
    { skip: !user }
  );

  const [createParentMutation] = useCreateParentMutation();
  const [updateParentMutation] = useUpdateParentMutation();
  const [deleteParentMutation] = useDeleteParentMutation();

  // Update parents from query
  useEffect(() => {
    if (parentsData?.data) {
      dispatch(setParents(parentsData.data));
    }
  }, [parentsData, dispatch]);

  // Load parent details when selected
  const { data: parentDetails, refetch: refetchParent } = useGetParentByIdQuery(
    currentParent?.id!,
    { skip: !currentParent?.id }
  );

  useEffect(() => {
    if (parentDetails) {
      dispatch(setCurrentParent(parentDetails));
    }
  }, [parentDetails, dispatch]);

  // Get current user's parent profile if applicable
  const { data: userParentProfile } = useGetParentByUserIdQuery(
    user?.id!,
    { skip: !user || user.role !== 'PARENT' }
  );

  useEffect(() => {
    if (userParentProfile && !currentParent) {
      dispatch(setCurrentParent(userParentProfile));
    }
  }, [userParentProfile, currentParent, dispatch]);

  // Create parent
  const createParent = useCallback(async (parentData: CreateParentRequest) => {
    dispatch(setLoading(true));
    try {
      const newParent = await createParentMutation(parentData).unwrap();
      dispatch(addParent(newParent));
      toast.success('Parent registered successfully');
      return newParent;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to register parent';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, createParentMutation]);

  // Update parent
  const updateParentDetails = useCallback(async (id: string, data: UpdateParentRequest) => {
    dispatch(setLoading(true));
    try {
      const updatedParent = await updateParentMutation({ id, data }).unwrap();
      dispatch(updateParent(updatedParent));
      toast.success('Parent updated successfully');
      return updatedParent;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update parent';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, updateParentMutation]);

  // Delete parent
  const deleteParent = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      await deleteParentMutation(id).unwrap();
      dispatch(removeParent(id));
      toast.success('Parent deleted successfully');
    } catch (error: any) {
      const message = error.data?.message || 'Failed to delete parent';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, deleteParentMutation]);

  // Select parent
  const selectParent = useCallback((parent: Parent | null) => {
    dispatch(setCurrentParent(parent));
  }, [dispatch]);

  // Clear error
  const clearParentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    parents,
    currentParent,
    isLoading,
    error,
    pagination,
    createParent,
    updateParent: updateParentDetails,
    deleteParent,
    selectParent,
    refetchParents,
    refetchParent,
    clearError: clearParentError,
  };
};

// Hook for managing parent's children
export const useParentChildren = (parentId: string) => {
  const dispatch = useAppDispatch();
  const { linkedChildren } = useAppSelector((state) => state.parents);

  const { data: children, refetch: refetchChildren } = useGetParentChildrenQuery(
    parentId,
    { skip: !parentId }
  );

  const [linkChildMutation] = useLinkChildMutation();
  const [unlinkChildMutation] = useUnlinkChildMutation();

  useEffect(() => {
    if (children) {
      dispatch(setLinkedChildren(children));
    }
  }, [children, dispatch]);

  const linkChild = useCallback(async (childId: string, relationship: LinkChildRequest['relationship'], isPrimary: boolean = false) => {
    try {
      await linkChildMutation({ parentId, data: { childId, relationship, isPrimary } }).unwrap();
      toast.success('Child linked successfully');
      await refetchChildren();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to link child');
      throw error;
    }
  }, [parentId, linkChildMutation, refetchChildren]);

  const unlinkChild = useCallback(async (childId: string) => {
    try {
      await unlinkChildMutation({ parentId, childId }).unwrap();
      dispatch(removeLinkedChild(childId));
      toast.success('Child unlinked successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to unlink child');
      throw error;
    }
  }, [parentId, unlinkChildMutation, dispatch]);

  const getPrimaryChild = useCallback((): Child | undefined => {
    return linkedChildren.find((c: Child) => c.isPrimary);
  }, [linkedChildren]);

  return {
    children: linkedChildren,
    linkChild,
    unlinkChild,
    getPrimaryChild,
    refetchChildren,
  };
};

// Hook for parent reminders
export const useParentReminders = (parentId: string) => {
  const dispatch = useAppDispatch();
  const { reminders } = useAppSelector((state) => state.parents);

  const { data: remindersData, refetch: refetchReminders } = useGetParentRemindersQuery(
    parentId,
    { skip: !parentId, pollingInterval: 60000 } // Poll every minute for new reminders
  );

  useEffect(() => {
    if (remindersData) {
      dispatch(setReminders(remindersData));
    }
  }, [remindersData, dispatch]);

  const getUpcomingReminders = useCallback((): Reminder[] => {
    const now = new Date();
    return reminders
      .filter((r: Reminder) => new Date(r.scheduledFor) > now && r.status !== 'CANCELLED')
      .sort((a: Reminder, b: Reminder) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }, [reminders]);

  const getPastReminders = useCallback((): Reminder[] => {
    const now = new Date();
    return reminders
      .filter((r: Reminder) => new Date(r.scheduledFor) <= now)
      .sort((a: Reminder, b: Reminder) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());
  }, [reminders]);

  const getRemindersByChild = useCallback((childId: string): Reminder[] => {
    return reminders.filter((r: Reminder) => r.childId === childId);
  }, [reminders]);

  return {
    reminders,
    refetchReminders,
    getUpcomingReminders,
    getPastReminders,
    getRemindersByChild,
  };
};

// Hook for parent dashboard
export const useParentDashboard = (parentId: string) => {
  const { data: dashboard, isLoading, refetch } = useGetParentDashboardQuery(
    parentId,
    { skip: !parentId }
  );

  const { data: stats } = useGetParentStatsQuery(parentId, { skip: !parentId });

  const summary = useMemo(() => {
    if (!dashboard) return null;
    
    return {
      ...dashboard,
      completionRate: stats?.completionRate || 0,
      nextReminder: dashboard.upcomingReminders?.[0],
      childrenSummary: dashboard.children.map(child => ({
        ...child,
        ageInMonths: Math.floor((new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30)),
      })),
    };
  }, [dashboard, stats]);

  return {
    dashboard: summary,
    stats,
    isLoading,
    refetch,
  };
};

// Hook for parent notification preferences
export const useParentPreferences = (parentId: string) => {
  const [updatePreferencesMutation] = useUpdateNotificationPreferencesMutation();

  const updatePreferences = useCallback(async (preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  }) => {
    try {
      await updatePreferencesMutation({ parentId, preferences }).unwrap();
      toast.success('Notification preferences updated');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update preferences');
      throw error;
    }
  }, [parentId, updatePreferencesMutation]);

  return {
    updatePreferences,
  };
};

// Hook for parent search/filter
export const useParentSearch = () => {
  const { parents } = useAppSelector((state) => state.parents);

  const searchParents = useCallback((searchTerm: string): Parent[] => {
    const term = searchTerm.toLowerCase();
    return parents.filter((p: Parent) => 
      p.user?.fullName?.toLowerCase().includes(term) ||
      p.user?.email?.toLowerCase().includes(term) ||
      p.user?.phoneNumber?.includes(term) ||
      p.emergencyContact?.toLowerCase().includes(term)
    );
  }, [parents]);

  const filterByLocation = useCallback((county?: string, subCounty?: string): Parent[] => {
    return parents.filter((p: Parent) => {
      if (county && p.user?.profile?.county !== county) return false;
      if (subCounty && p.user?.profile?.subCounty !== subCounty) return false;
      return true;
    });
  }, [parents]);

  const filterByChildren = useCallback((hasChildren: boolean): Parent[] => {
    return parents.filter((p: Parent) => 
      hasChildren ? (p.children?.length || 0) > 0 : (p.children?.length || 0) === 0
    );
  }, [parents]);

  return {
    searchParents,
    filterByLocation,
    filterByChildren,
  };
};