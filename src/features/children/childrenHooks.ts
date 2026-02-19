import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { 
  useGetChildrenQuery,
  useGetChildByIdQuery,
  useCreateChildMutation,
  useUpdateChildMutation,
  useDeleteChildMutation,
  useAddGrowthRecordMutation,
  useAddDevelopmentRecordMutation,
  useRecordImmunizationMutation,
  useGenerateScheduleMutation,
  useGetChildDashboardQuery,
  useGetImmunizationsQuery,
  useGetVaccinationScheduleQuery,
} from './childrenAPI';
import { childrenAPI } from './childrenAPI';
import {
  setChildren,
  setCurrentChild,
  addChild,
  updateChild,
  removeChild,
  addGrowthRecord,
  addDevelopmentRecord,
  addImmunization,
  setSchedules,
  setLoading,
  setError,
  clearError,
  resetChildrenState,
  setSelectedChildId,
  setPagination,
} from './childrenSlice';
import type { Child, CreateChildRequest, UpdateChildRequest, RecordGrowthRequest, RecordDevelopmentRequest, Immunization, ImmunizationRecord, VaccinationSchedule } from './childrenTypes';
import { toast } from 'react-hot-toast';
import { useAuth } from '../auth/authHooks';

// Main hook for child management
export const useChildren = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { children, currentChild, selectedChildId, isLoading, error, pagination } = 
    useAppSelector((state) => state.children);

  // RTK Query hooks
  const { data: childrenData, refetch: refetchChildren } = useGetChildrenQuery(
    { page: pagination.page, limit: pagination.limit },
    { skip: !user }
  );

  // Fetch children with params (backwards-compatible with previous API)
  const fetchChildren = useCallback(async (params?: any) => {
    const queryParams = params ?? { page: pagination.page, limit: pagination.limit };
    const result = await dispatch(childrenAPI.endpoints.getChildren.initiate(queryParams));
    if ((result as any).data?.data) {
      dispatch(setChildren((result as any).data.data));
    }
    return result;
  }, [dispatch, pagination.page, pagination.limit]);

  const [createChildMutation] = useCreateChildMutation();
  const [updateChildMutation] = useUpdateChildMutation();
  const [deleteChildMutation] = useDeleteChildMutation();

  // Update children from query
  useEffect(() => {
    if (childrenData?.data) {
      dispatch(setChildren(childrenData.data));
    }
  }, [childrenData, dispatch]);

  // Load child details when selected
  const { data: childDetails, refetch: refetchChild } = useGetChildByIdQuery(
    selectedChildId!,
    { skip: !selectedChildId }
  );

  useEffect(() => {
    if (childDetails?.child) {
      dispatch(setCurrentChild(childDetails.child));
    }
  }, [childDetails, dispatch]);

  // Helper to fetch arbitrary child by id (returns Child)
  const getChildById = useCallback(async (id: string) => {
    const result = await dispatch(childrenAPI.endpoints.getChildById.initiate(id));
    // result may be { data } or a full action; prefer result.data
    // @ts-ignore - result typing is complex; return the child payload if present
    return (result as any).data?.child ?? (result as any).data ?? result;
  }, [dispatch]);

  // Create child
  const createChild = useCallback(async (childData: CreateChildRequest) => {
    dispatch(setLoading(true));
    try {
      const newChild = await createChildMutation(childData).unwrap();
      dispatch(addChild(newChild));
      toast.success('Child registered successfully');
      return newChild;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to register child';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, createChildMutation]);

  // Update child
  const updateChildDetails = useCallback(async (id: string, data: UpdateChildRequest) => {
    dispatch(setLoading(true));
    try {
      const updatedChild = await updateChildMutation({ id, data }).unwrap();
      dispatch(updateChild(updatedChild));
      toast.success('Child updated successfully');
      return updatedChild;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update child';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, updateChildMutation]);

  // Delete child
  const deleteChild = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      await deleteChildMutation(id).unwrap();
      dispatch(removeChild(id));
      toast.success('Child deleted successfully');
    } catch (error: any) {
      const message = error.data?.message || 'Failed to delete child';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, deleteChildMutation]);

  // Select child
  const selectChild = useCallback((childId: string | null) => {
    dispatch(setCurrentChild(null));
    dispatch(setSelectedChildId(childId));
    // The useEffect will load the child details when selectedChildId is set
  }, [dispatch]);

  // Clear error
  const clearChildError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetChildrenState());
  }, [dispatch]);

  return {
    children,
    currentChild,
    selectedChildId,
    isLoading,
    error,
    pagination,
    createChild,
    updateChild: updateChildDetails,
    deleteChild,
    selectChild,
    // Backwards-compatible aliases expected by pages
    fetchChildren,
    getChildById,
    refetchChildren,
    refetchChild,
    // Pagination setter wrapper
    setPagination: (p: Partial<typeof pagination>) => dispatch(setPagination(p)),
    clearError: clearChildError,
    resetState,
  };
};

// Hook for child growth tracking
export const useChildGrowth = (childId: string) => {
  const dispatch = useAppDispatch();
  const { growthRecords } = useAppSelector((state) => state.children);
  const [addGrowthRecordMutation] = useAddGrowthRecordMutation();

  const addGrowth = useCallback(async (data: RecordGrowthRequest) => {
    try {
      const record = await addGrowthRecordMutation({ childId, data }).unwrap();
      dispatch(addGrowthRecord(record));
      toast.success('Growth record added successfully');
      return record;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to add growth record');
      throw error;
    }
  }, [dispatch, childId, addGrowthRecordMutation]);

  const calculateGrowthPercentiles = useCallback((weight: number, height: number, _ageMonths: number) => {
    // This would integrate with WHO growth standards
    // For now, return placeholder values
    // TODO: Implement proper WHO growth standards calculation using ageMonths
    return {
      weightPercentile: 50,
      heightPercentile: 50,
      bmi: weight / ((height / 100) ** 2),
      bmiPercentile: 50,
    };
  }, []);

  const getGrowthTrend = useCallback(() => {
    if (growthRecords.length < 2) return null;
    
    const sorted = [...growthRecords].sort((a, b) => 
      new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
    );
    
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const monthsDiff = (new Date(last.measurementDate).getTime() - new Date(first.measurementDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    return {
      weightGain: last.weight - first.weight,
      heightGain: last.height ? (last.height - (first.height || 0)) : 0,
      monthsDiff,
      averageMonthlyWeightGain: (last.weight - first.weight) / monthsDiff,
    };
  }, [growthRecords]);

  return {
    growthRecords,
    addGrowth,
    calculateGrowthPercentiles,
    getGrowthTrend,
  };
};

// Hook for child development tracking
export const useChildDevelopment = (childId: string) => {
  const dispatch = useAppDispatch();
  const { developmentRecords } = useAppSelector((state) => state.children);
  const [addDevelopmentRecordMutation] = useAddDevelopmentRecordMutation();

  const addDevelopment = useCallback(async (data: RecordDevelopmentRequest) => {
    try {
      const record = await addDevelopmentRecordMutation({ childId, data }).unwrap();
      dispatch(addDevelopmentRecord(record));
      toast.success('Development record added successfully');
      return record;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to add development record');
      throw error;
    }
  }, [dispatch, childId, addDevelopmentRecordMutation]);

  const checkMilestones = useCallback((ageMonths: number) => {
    // Standard developmental milestones by age
    const milestonesByAge: Record<number, { motor: string[]; language: string[]; social: string[] }> = {
      1: { motor: ['Lifts head briefly', 'Arms and legs move actively'], language: ['Cries to communicate', 'Startles at loud sounds'], social: ['Focuses on faces', 'Responds to soothing voice'] },
      2: { motor: ['Holds head up when supported', 'Opens and closes hands'], language: ['Coos and makes gurgling sounds', 'Turns toward sounds'], social: ['First social smile', 'Follows objects with eyes'] },
      3: { motor: ['Holds head steady', 'Pushes up on arms when on tummy'], language: ['Babbles strings of consonants', 'Laughs'], social: ['Enjoys playing with people', 'Imitates some movements'] },
      4: { motor: ['Rolls from tummy to back', 'Reaches for toys'], language: ['Babbles to get attention', 'Makes vowel sounds'], social: ['Smiles at self in mirror', 'Enjoys watching surroundings'] },
      5: { motor: ['Rolls both ways', 'Sits with support'], language: ['Babbles to express emotions', 'Responds to name'], social: ['Enjoys looking in mirror', 'Shows interest in other babies'] },
      6: { motor: ['Sits without support', 'Bounces when held standing'], language: ['Responds to sounds by making sounds', 'Strings vowels together'], social: ['Knows familiar people', 'Likes to look in mirror'] },
      7: { motor: ['Sits well without support', 'Reaches with one hand'], language: ['Responds to own name', 'Uses voice to express emotions'], social: ['Enjoys playing with others', 'Shows interest in mirror images'] },
      8: { motor: ['Starts to crawl', 'Pulls to stand'], language: ['Says consonant sounds', 'Understands "no"'], social: ['Plays peek-a-boo', 'Shows stranger anxiety'] },
      9: { motor: ['Crawls well', 'Pulls to stand'], language: ['Says "mama" or "dada"', 'Understands simple words'], social: ['Waves bye-bye', 'Plays pat-a-cake'] },
      10: { motor: ['Cruises along furniture', 'Stands alone briefly'], language: ['Says "mama" and "dada" specifically', 'Imitates speech sounds'], social: ['Plays simple games', 'Shows preferences'] },
      11: { motor: ['Takes first steps', 'Stands confidently'], language: ['Says one or more words', 'Uses simple gestures'], social: ['Shows independence', 'Explores alone with parent nearby'] },
      12: { motor: ['Walks independently', 'Stacks 2 blocks'], language: ['Says 3-5 words', 'Follows simple instructions'], social: ['Shows affection', 'Explores objects in different ways'] },
      15: { motor: ['Walks well', 'Sits down from standing'], language: ['Says 5-10 words', 'Points to named objects'], social: ['Plays simple pretend', 'Hugs parents'] },
      18: { motor: ['Runs', 'Kicks a ball'], language: ['Says 10-20 words', 'Points to body parts'], social: ['Plays alongside others', 'Shows defiant behavior'] },
      24: { motor: ['Runs well', 'Jumps with both feet'], language: ['Says 50+ words', 'Combines 2 words'], social: ['Plays with other children', 'Shows wide range of emotions'] },
    };

    // Find the closest matching milestones
    const ageKeys = Object.keys(milestonesByAge).map(Number).sort((a, b) => a - b);
    const closestAge = ageKeys.reduce((prev, curr) => 
      Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
    );

    return milestonesByAge[closestAge] || { motor: [], language: [], social: [] };
  }, []);

  return {
    developmentRecords,
    addDevelopment,
    checkMilestones,
  };
};

// Hook for child immunizations
export const useChildImmunizations = (childId: string) => {
  const dispatch = useAppDispatch();
  // Use RTK Query hooks to provide loading state and fresh data
  const { data: immunizationsData, isLoading: immunizationsLoading } = useGetImmunizationsQuery(childId, { skip: !childId });
  const { data: schedulesData, isLoading: schedulesLoading } = useGetVaccinationScheduleQuery(childId, { skip: !childId });
  const immunizations = immunizationsData ?? useAppSelector((state) => state.children.immunizations);
  const schedules = schedulesData ?? useAppSelector((state) => state.children.schedules);
  const [recordImmunizationMutation] = useRecordImmunizationMutation();
  const [generateScheduleMutation] = useGenerateScheduleMutation();

  const recordImmunization = useCallback(async (data: ImmunizationRecord) => {
    try {
      const immunization = await recordImmunizationMutation({ childId, data }).unwrap();
      dispatch(addImmunization(immunization));
      toast.success('Immunization recorded successfully');
      return immunization;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to record immunization');
      throw error;
    }
  }, [dispatch, childId, recordImmunizationMutation]);

  const generateSchedule = useCallback(async () => {
    try {
      const newSchedule = await generateScheduleMutation(childId).unwrap();
      dispatch(setSchedules(newSchedule));
      toast.success('Vaccination schedule generated');
      return newSchedule;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to generate schedule');
      throw error;
    }
  }, [dispatch, childId, generateScheduleMutation]);

  const getCompletionRate = useCallback(() => {
    if (!schedules.length) return 0;
    const completed = immunizations.filter((i: Immunization) => i.status === 'ADMINISTERED').length;
    return (completed / schedules.length) * 100;
  }, [immunizations, schedules]);

  const getUpcomingVaccinations = useCallback(() => {
    const now = new Date();
    return schedules
      .filter((s: VaccinationSchedule) => s.status === 'SCHEDULED' && new Date(s.dueDate) > now)
      .sort((a: VaccinationSchedule, b: VaccinationSchedule) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [schedules]);

  const getOverdueVaccinations = useCallback(() => {
    const now = new Date();
    return schedules
      .filter((s: VaccinationSchedule) => s.status === 'SCHEDULED' && new Date(s.dueDate) < now)
      .sort((a: VaccinationSchedule, b: VaccinationSchedule) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [schedules]);

  return {
    immunizations,
    schedules,
    isLoading: immunizationsLoading || schedulesLoading,
    recordImmunization,
    generateSchedule,
    getCompletionRate,
    getUpcomingVaccinations,
    getOverdueVaccinations,
  };
};

// Hook for child dashboard
export const useChildDashboard = (childId: string) => {
  const { data: dashboard, isLoading, refetch } = useGetChildDashboardQuery(childId, {
    skip: !childId,
  });

  const summary = useMemo(() => {
    if (!dashboard) return null;
    
    return {
      ...dashboard,
      ageInMonths: dashboard.child ? 
        Math.floor((new Date().getTime() - new Date(dashboard.child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0,
      nextVaccination: dashboard.upcomingVaccinations?.[0],
      lastGrowth: dashboard.recentGrowth?.[0],
      completionStatus: dashboard.completionRate ? {
        percentage: dashboard.completionRate,
        color: dashboard.completionRate >= 80 ? 'green' : dashboard.completionRate >= 50 ? 'yellow' : 'red',
      } : null,
    };
  }, [dashboard]);

  // Wrap summary so components that expect `dashboard.child` and `dashboard.summary` continue to work
  return {
    dashboard: summary ? { child: summary.child, summary } : null,
    isLoading,
    refetch,
  };
};

// Hook for batch child operations
export const useChildrenBatch = () => {
  const exportChildrenData = useCallback((children: Child[]) => {
    const data = children.map(child => ({
      'Full Name': `${child.firstName} ${child.middleName || ''} ${child.lastName}`,
      'Date of Birth': new Date(child.dateOfBirth).toLocaleDateString(),
      'Gender': child.gender,
      'Birth Certificate': child.birthCertificateNo || 'N/A',
      'Age (Months)': Math.floor((new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30)),
      'Registration Date': new Date(child.createdAt).toLocaleDateString(),
    }));
    
    return data;
  }, []);

  const importChildrenData = useCallback(async (data: any[]) => {
    // Implementation for bulk import
    console.log('Importing children:', data);
  }, []);

  return {
    exportChildrenData,
    importChildrenData,
  };
};