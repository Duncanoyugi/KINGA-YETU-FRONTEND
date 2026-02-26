import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { DatePicker } from '@/components/common/DatePicker';
import type { Child } from '@/features/children/childrenTypes';

interface AppointmentSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId?: string;
  childName?: string;
  children?: Child[];
  onSchedule?: (appointmentData: any) => Promise<void>;
  onReschedule?: (appointmentId: string, newDate: Date) => Promise<void>;
  onCancel?: (appointmentId: string) => Promise<void>;
  upcomingAppointments?: any[];
  onSuccess?: (appointmentData: any) => void;
  isLoading?: boolean;
}

export const AppointmentSchedulerModal: React.FC<AppointmentSchedulerModalProps> = ({
  isOpen,
  onClose,
  children,
  onSuccess,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    childId: '',
    appointmentType: '',
    scheduledFor: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.(formData);
  };

  const appointmentTypes = [
    { value: 'VACCINATION', label: 'Vaccination' },
    { value: 'CHECKUP', label: 'General Checkup' },
    { value: 'FOLLOW_UP', label: 'Follow-up Visit' },
    { value: 'OTHER', label: 'Other' },
  ];

  const childOptions = children?.map(child => ({
    value: child.id,
    label: `${child.firstName} ${child.lastName}`,
  })) || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Schedule Appointment</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Select Child"
              value={formData.childId}
              onChange={(value) => setFormData({ ...formData, childId: value })}
              options={childOptions}
              placeholder="Choose a child"
              required
            />

            <Select
              label="Appointment Type"
              value={formData.appointmentType}
              onChange={(value) => setFormData({ ...formData, appointmentType: value })}
              options={appointmentTypes}
              required
            />

            <DatePicker
              label="Schedule Date & Time"
              value={formData.scheduledFor}
              onChange={(date) => setFormData({ ...formData, scheduledFor: date })}
              required
            />

            <Input
              label="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={isLoading}>
                Schedule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
