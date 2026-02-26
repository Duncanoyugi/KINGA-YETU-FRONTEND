import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { DatePicker } from '@/components/common/DatePicker';
import type { Child, UpdateChildRequest, Gender } from '../childrenTypes';

interface EditChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  onSuccess: (childId: string, data: UpdateChildRequest) => void;
  isLoading?: boolean;
}

export const EditChildModal: React.FC<EditChildModalProps> = ({
  isOpen,
  onClose,
  child,
  onSuccess,
  isLoading
}) => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    birthCertificateNo: string;
    placeOfBirth: string;
    motherName: string;
    fatherName: string;
    motherPhone: string;
    fatherPhone: string;
    address: string;
    notes: string;
  }>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: undefined as unknown as Gender,
    birthCertificateNo: '',
    placeOfBirth: '',
    motherName: '',
    fatherName: '',
    motherPhone: '',
    fatherPhone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    if (child) {
      setFormData({
        firstName: child.firstName || '',
        lastName: child.lastName || '',
        dateOfBirth: child.dateOfBirth || '',
        gender: child.gender || '',
        birthCertificateNo: child.birthCertificateNo || '',
        placeOfBirth: '',
        motherName: '',
        fatherName: '',
        motherPhone: '',
        fatherPhone: '',
        address: '',
        notes: ''
      });
    }
  }, [child]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (child) {
      onSuccess(child.id, formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit Child Information</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                required
              />
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: value as Gender })}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
                required
              />
            </div>

            <Input
              label="Birth Certificate Number"
              value={formData.birthCertificateNo}
              onChange={(e) => setFormData({ ...formData, birthCertificateNo: e.target.value })}
            />

            <Input
              label="Place of Birth"
              value={formData.placeOfBirth}
              onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Mother's Name"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              />
              <Input
                label="Father's Name"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Mother's Phone"
                value={formData.motherPhone}
                onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
              />
              <Input
                label="Father's Phone"
                value={formData.fatherPhone}
                onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
              />
            </div>

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
