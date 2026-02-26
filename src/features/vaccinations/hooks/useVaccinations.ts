import { useCallback } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { addImmunization as addImmunizationAction, updateImmunization as updateImmunizationAction, removeImmunization as removeImmunizationAction } from '@/features/children/childrenSlice';
import type { Immunization as ImmunizationType, ImmunizationStatus } from '@/features/children/childrenTypes';
import { toast } from 'react-hot-toast';

// Types
export interface VaccinationRecord {
  id: string;
  childId: string;
  vaccineId: string;
  dateAdministered: string;
  status: ImmunizationStatus;
  batchNumber?: string;
  notes?: string;
  administeredBy?: string;
  facilityId?: string;
  healthWorkerId?: string;
  ageAtDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordVaccinationRequest {
  childId?: string;
  vaccineId?: string;
  dateAdministered?: string;
  batchNumber?: string;
  notes?: string;
  reminderId?: string;
  administeredAt?: Date;
}

export interface UpdateVaccinationRequest {
  status?: ImmunizationStatus;
  dateAdministered?: string;
  batchNumber?: string;
  notes?: string;
}

export const useVaccinations = () => {
  const dispatch = useAppDispatch();

  const recordVaccination = useCallback(async (request: RecordVaccinationRequest) => {
    try {
      const now = new Date().toISOString();
      const newRecord: VaccinationRecord = {
        id: `imm-${Date.now()}`,
        childId: request.childId || '',
        vaccineId: request.vaccineId || '',
        dateAdministered: request.dateAdministered || request.administeredAt?.toISOString() || now,
        status: 'ADMINISTERED' as ImmunizationStatus,
        batchNumber: request.batchNumber,
        notes: request.notes,
        createdAt: now,
        updatedAt: now,
      };
      
      dispatch(addImmunizationAction(newRecord as ImmunizationType));
      toast.success('Vaccination recorded successfully');
      return newRecord;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to record vaccination';
      toast.error(message);
      throw error;
    }
  }, [dispatch]);

  const updateVaccination = useCallback(async (vaccinationId: string, request: UpdateVaccinationRequest) => {
    try {
      const now = new Date().toISOString();
      const updatedRecord: VaccinationRecord = {
        id: vaccinationId,
        childId: '',
        vaccineId: '',
        dateAdministered: request.dateAdministered || now,
        status: request.status || 'ADMINISTERED',
        batchNumber: request.batchNumber,
        notes: request.notes,
        updatedAt: now,
      };
      
      dispatch(updateImmunizationAction(updatedRecord as ImmunizationType));
      toast.success('Vaccination updated successfully');
      return updatedRecord;
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to update vaccination';
      toast.error(message);
      throw error;
    }
  }, [dispatch]);

  const deleteVaccination = useCallback(async (vaccinationId: string) => {
    try {
      dispatch(removeImmunizationAction(vaccinationId));
      toast.success('Vaccination deleted successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || 'Failed to delete vaccination';
      toast.error(message);
      throw error;
    }
  }, [dispatch]);

  return {
    recordVaccination,
    updateVaccination,
    deleteVaccination,
  };
};
