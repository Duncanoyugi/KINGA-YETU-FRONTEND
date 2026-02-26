import { useCallback } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { addGrowthRecord as addGrowthRecordAction, updateGrowthRecord as updateGrowthRecordAction, removeGrowthRecord as removeGrowthRecordAction } from '@/features/children/childrenSlice';
import type { GrowthRecord as GrowthRecordType } from '@/features/children/childrenTypes';
import { toast } from 'react-hot-toast';

// Types - using local definitions that match the slice expectations
export interface GrowthRecord {
  id: string;
  childId: string;
  measurementDate: string;
  weight: number;
  height?: number;
  headCircumference?: number;
  notes?: string;
  recordedBy?: string;
  recordedById?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddGrowthRecordRequest {
  childId: string;
  measurementDate: string;
  weight: number;
  height?: number;
  headCircumference?: number;
  notes?: string;
}

export interface UpdateGrowthRecordRequest {
  measurementDate?: string;
  weight?: number;
  height?: number;
}

export const useGrowthRecords = () => {
  const dispatch = useAppDispatch();

  const addGrowthRecord = useCallback(async (request: AddGrowthRecordRequest) => {
    try {
      const now = new Date().toISOString();
      const newRecord: GrowthRecord = {
        id: `growth-${Date.now()}`,
        childId: request.childId,
        measurementDate: request.measurementDate,
        weight: request.weight,
        height: request.height ?? undefined,
        headCircumference: request.headCircumference ?? undefined,
        notes: request.notes,
        createdAt: now,
        updatedAt: now,
      };
      
      dispatch(addGrowthRecordAction(newRecord as GrowthRecordType));
      toast.success('Growth record added successfully');
      return newRecord;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to add growth record';
      toast.error(message);
      throw error;
    }
  }, [dispatch]);

  const updateGrowthRecord = useCallback(async (recordId: string, request: UpdateGrowthRecordRequest) => {
    try {
      const now = new Date().toISOString();
      const updatedRecord: GrowthRecord = {
        id: recordId,
        childId: '',
        measurementDate: request.measurementDate || now,
        weight: request.weight || 0,
        height: request.height,
        updatedAt: now,
      };
      
      dispatch(updateGrowthRecordAction(updatedRecord as GrowthRecordType));
      toast.success('Growth record updated successfully');
      return updatedRecord;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to update growth record';
      toast.error(message);
      throw error;
    }
  }, [dispatch]);

  const deleteGrowthRecord = useCallback(async (recordId: string) => {
    try {
      dispatch(removeGrowthRecordAction(recordId));
      toast.success('Growth record deleted successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to delete growth record';
      toast.error(message);
      throw error;
    }
  }, [dispatch]);

  const getGrowthRecords = useCallback(async (_childId: string) => {
    // Placeholder - would fetch from API
    return [];
  }, []);

  return {
    addGrowthRecord,
    updateGrowthRecord,
    deleteGrowthRecord,
    getGrowthRecords,
  };
};
