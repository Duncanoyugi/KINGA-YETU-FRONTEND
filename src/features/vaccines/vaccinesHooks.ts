import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useAuth } from '../auth/authHooks';
import {
  useGetVaccinesQuery,
  useGetVaccineByIdQuery,
  useCreateVaccineMutation,
  useUpdateVaccineMutation,
  useDeleteVaccineMutation,
  useGetInventoryQuery,
  useAddInventoryMutation,
  useUpdateInventoryMutation,
  useGetStockAlertsQuery,
  useGetVaccineStatsQuery,
  useRecordVaccineUsageMutation,
} from './vaccinesAPI';
import { vaccinesAPI } from './vaccinesAPI';
import {
  setVaccines,
  setCurrentVaccine,
  addVaccine,
  updateVaccine,
  removeVaccine,
  setInventory,
  addInventory,
  updateInventory,
  setAlerts,
  setLoading,
  setError,
  clearError,
} from './vaccinesSlice';
import type { Vaccine, CreateVaccineRequest, UpdateVaccineRequest, AddInventoryRequest, VaccineInventory, StockAlert } from './vaccinesTypes';
import { toast } from 'react-hot-toast';

// Main hook for vaccine management
export const useVaccines = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { vaccines, currentVaccine, isLoading, error, pagination } = 
    useAppSelector((state) => state.vaccines);

  // RTK Query hooks
  const { data: vaccinesData, refetch: refetchVaccines, isLoading: vaccinesLoading } = useGetVaccinesQuery(
    { page: pagination.page, limit: pagination.limit },
    { skip: !user }
  );

  const fetchVaccines = useCallback(async (params?: any) => {
    const queryParams = params ?? { page: pagination.page, limit: pagination.limit };
    const result = await dispatch(vaccinesAPI.endpoints.getVaccines.initiate(queryParams));
    if ((result as any).data?.data) dispatch(setVaccines((result as any).data.data));
    return result;
  }, [dispatch, pagination.page, pagination.limit]);

  const [createVaccineMutation] = useCreateVaccineMutation();
  const [updateVaccineMutation] = useUpdateVaccineMutation();
  const [deleteVaccineMutation] = useDeleteVaccineMutation();

  // Update vaccines from query
  useEffect(() => {
    if (vaccinesData?.data) {
      dispatch(setVaccines(vaccinesData.data));
    }
  }, [vaccinesData, dispatch]);

  // Load vaccine details when selected
  const { data: vaccineDetails, refetch: refetchVaccine } = useGetVaccineByIdQuery(
    currentVaccine?.id!,
    { skip: !currentVaccine?.id }
  );

  useEffect(() => {
    if (vaccineDetails) {
      dispatch(setCurrentVaccine(vaccineDetails));
    }
  }, [vaccineDetails, dispatch]);

  const getVaccineById = useCallback(async (id: string) => {
    const result = await dispatch(vaccinesAPI.endpoints.getVaccineById.initiate(id));
    return (result as any).data ?? result;
  }, [dispatch]);

  // Create vaccine
  const createVaccine = useCallback(async (vaccineData: CreateVaccineRequest) => {
    dispatch(setLoading(true));
    try {
      const newVaccine = await createVaccineMutation(vaccineData).unwrap();
      dispatch(addVaccine(newVaccine));
      toast.success('Vaccine created successfully');
      return newVaccine;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to create vaccine';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, createVaccineMutation]);

  // Update vaccine
  const updateVaccineDetails = useCallback(async (id: string, data: UpdateVaccineRequest) => {
    dispatch(setLoading(true));
    try {
      const updatedVaccine = await updateVaccineMutation({ id, data }).unwrap();
      dispatch(updateVaccine(updatedVaccine));
      toast.success('Vaccine updated successfully');
      return updatedVaccine;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update vaccine';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, updateVaccineMutation]);

  // Delete vaccine
  const deleteVaccine = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      await deleteVaccineMutation(id).unwrap();
      dispatch(removeVaccine(id));
      toast.success('Vaccine deleted successfully');
    } catch (error: any) {
      const message = error.data?.message || 'Failed to delete vaccine';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, deleteVaccineMutation]);

  // Select vaccine
  const selectVaccine = useCallback((vaccine: Vaccine | null) => {
    dispatch(setCurrentVaccine(vaccine));
  }, [dispatch]);

  // Clear error
  const clearVaccineError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get vaccines by type
  const getVaccinesByType = useCallback((type: string) => {
    return vaccines.filter((v: Vaccine) => v.vaccineType === type);
  }, [vaccines]);

  // Get birth doses
  const getBirthDoses = useCallback(() => {
    return vaccines.filter((v: Vaccine) => v.isBirthDose);
  }, [vaccines]);

  // Get boosters
  const getBoosters = useCallback(() => {
    return vaccines.filter((v: Vaccine) => v.isBooster);
  }, [vaccines]);

  return {
    vaccines,
    currentVaccine,
    isLoading: vaccinesLoading || isLoading,
    error,
    pagination,
    createVaccine,
    updateVaccine: updateVaccineDetails,
    deleteVaccine,
    selectVaccine,
    fetchVaccines,
    refetchVaccines,
    getVaccineById,
    refetchVaccine,
    clearError: clearVaccineError,
    getVaccinesByType,
    getBirthDoses,
    getBoosters,
  };
};

// Hook for inventory management
export const useVaccineInventory = (facilityId?: string) => {
  const dispatch = useAppDispatch();
  const { inventory } = useAppSelector((state) => state.vaccines);
  
  const { data: inventoryData, refetch: refetchInventory, isLoading: inventoryLoading } = useGetInventoryQuery(
    { facilityId },
    { skip: !facilityId }
  );

  const [addInventoryMutation] = useAddInventoryMutation();
  const [updateInventoryMutation] = useUpdateInventoryMutation();
  const [recordUsageMutation] = useRecordVaccineUsageMutation();

  useEffect(() => {
    if (inventoryData?.data) {
      dispatch(setInventory(inventoryData.data));
    }
  }, [inventoryData, dispatch]);

  const addInventoryItem = useCallback(async (data: AddInventoryRequest) => {
    try {
      const newInventory = await addInventoryMutation(data).unwrap();
      dispatch(addInventory(newInventory));
      toast.success('Inventory added successfully');
      return newInventory;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to add inventory');
      throw error;
    }
  }, [dispatch, addInventoryMutation]);

  const updateInventoryItem = useCallback(async (id: string, quantity: number, notes?: string) => {
    try {
      const updated = await updateInventoryMutation({ id, data: { quantity, notes } }).unwrap();
      dispatch(updateInventory(updated));
      toast.success('Inventory updated successfully');
      return updated;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update inventory');
      throw error;
    }
  }, [dispatch, updateInventoryMutation]);

  const recordUsage = useCallback(async (inventoryId: string, dosesUsed: number) => {
    try {
      await recordUsageMutation({ inventoryId, dosesUsed }).unwrap();
      toast.success('Usage recorded successfully');
      await refetchInventory();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to record usage');
      throw error;
    }
  }, [recordUsageMutation, refetchInventory]);

  const getLowStockItems = useCallback((threshold: number = 10) => {
    return inventory.filter((item: VaccineInventory) => item.quantity < threshold);
  }, [inventory]);

  const getExpiringItems = useCallback((days: number = 30) => {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return inventory.filter((item: VaccineInventory) => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= future && expiryDate >= now;
    });
  }, [inventory]);

  const getExpiredItems = useCallback(() => {
    const now = new Date();
    return inventory.filter((item: VaccineInventory) => new Date(item.expiryDate) < now);
  }, [inventory]);

  return {
    inventory,
    addInventory: addInventoryItem,
    updateInventory: updateInventoryItem,
    recordUsage,
    getLowStockItems,
    getExpiringItems,
    getExpiredItems,
    refetchInventory,
    isLoading: inventoryLoading,
    getBatchById: (id: string) => inventory.find((item: VaccineInventory) => item.id === id),
  };
};

// Hook for vaccine alerts
export const useVaccineAlerts = (facilityId?: string) => {
  const dispatch = useAppDispatch();
  const { alerts } = useAppSelector((state) => state.vaccines);

  const { data: alertsData, refetch: refetchAlerts } = useGetStockAlertsQuery(
    { facilityId },
    { skip: !facilityId, pollingInterval: 300000 } // Poll every 5 minutes
  );

  useEffect(() => {
    if (alertsData) {
      dispatch(setAlerts(alertsData));
    }
  }, [alertsData, dispatch]);

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter((a: StockAlert) => a.status === 'EXPIRED' || 
      (a.status === 'LOW_STOCK' && a.currentQuantity === 0));
  }, [alerts]);

  const getWarningAlerts = useCallback(() => {
    return alerts.filter((a: StockAlert) => a.status === 'LOW_STOCK' || 
      (a.status === 'EXPIRING_SOON' && a.daysUntilExpiry && a.daysUntilExpiry <= 7));
  }, [alerts]);

  const getInformationalAlerts = useCallback(() => {
    return alerts.filter((a: StockAlert) => a.status === 'EXPIRING_SOON' && 
      a.daysUntilExpiry && a.daysUntilExpiry > 7);
  }, [alerts]);

  return {
    alerts,
    refetchAlerts,
    getCriticalAlerts,
    getWarningAlerts,
    getInformationalAlerts,
  };
};

// Hook for vaccine statistics
export const useVaccineStats = (facilityId?: string, dateRange?: { startDate: string; endDate: string }) => {
  const { data: stats, isLoading, refetch } = useGetVaccineStatsQuery(
    { facilityId, ...dateRange },
    { skip: !facilityId }
  );

  const coverageRate = useMemo(() => {
    if (!stats) return 0;
    return stats.coverage;
  }, [stats]);

  const wastageRate = useMemo(() => {
    if (!stats) return 0;
    return (stats.wastedDoses / stats.totalDoses) * 100;
  }, [stats]);

  return {
    stats,
    isLoading,
    refetch,
    coverageRate,
    wastageRate,
  };
};

// Hook for vaccine schedule calculations
export const useVaccineSchedule = () => {
  const { vaccines } = useVaccines();

  const calculateDueDate = useCallback((birthDate: string, recommendedAgeDays: number) => {
    const birth = new Date(birthDate);
    return new Date(birth.getTime() + recommendedAgeDays * 24 * 60 * 60 * 1000);
  }, []);

  const isVaccineDue = useCallback((birthDate: string, vaccine: Vaccine, currentDate: Date = new Date()) => {
    const dueDate = calculateDueDate(birthDate, vaccine.recommendedAgeDays);
    
    if (dueDate > currentDate) return false;
    
    if (vaccine.maxAgeDays) {
      const birth = new Date(birthDate);
      const maxDate = new Date(birth.getTime() + vaccine.maxAgeDays * 24 * 60 * 60 * 1000);
      if (currentDate > maxDate) return false;
    }
    
    return true;
  }, [calculateDueDate]);

  const getVaccinesByAge = useCallback((ageInDays: number) => {
    return vaccines.filter((v: Vaccine) => 
      ageInDays >= (v.minAgeDays || 0) && 
      ageInDays <= (v.maxAgeDays || Infinity) &&
      v.isActive
    );
  }, [vaccines]);

  const groupVaccinesByAgeCategory = useCallback((vaccineList: Vaccine[]) => {
    const groups: Record<string, Vaccine[]> = {
      'Birth': [],
      '6 Weeks': [],
      '10 Weeks': [],
      '14 Weeks': [],
      '6 Months': [],
      '9 Months': [],
      '12 Months': [],
      '18 Months': [],
      '24 Months': [],
      '5-6 Years': [],
      '10-12 Years': [],
    };

    vaccineList.forEach((vaccine: Vaccine) => {
      if (!vaccine.isActive) return;

      // Handle birth dose
      if (vaccine.isBirthDose) {
        groups['Birth'].push(vaccine);
        return;
      }

      const ageDays = vaccine.recommendedAgeDays;

      // Group by age category based on recommended age
      if (ageDays <= 0) {
        groups['Birth'].push(vaccine);
      } else if (ageDays <= 42) {
        groups['6 Weeks'].push(vaccine);
      } else if (ageDays <= 70) {
        groups['10 Weeks'].push(vaccine);
      } else if (ageDays <= 98) {
        groups['14 Weeks'].push(vaccine);
      } else if (ageDays <= 180) {
        groups['6 Months'].push(vaccine);
      } else if (ageDays <= 270) {
        groups['9 Months'].push(vaccine);
      } else if (ageDays <= 365) {
        groups['12 Months'].push(vaccine);
      } else if (ageDays <= 540) {
        groups['18 Months'].push(vaccine);
      } else if (ageDays <= 730) {
        groups['24 Months'].push(vaccine);
      } else if (ageDays <= 2190) {
        groups['5-6 Years'].push(vaccine);
      } else {
        groups['10-12 Years'].push(vaccine);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  }, []);

  return {
    calculateDueDate,
    isVaccineDue,
    getVaccinesByAge,
    groupVaccinesByAgeCategory,
  };
};