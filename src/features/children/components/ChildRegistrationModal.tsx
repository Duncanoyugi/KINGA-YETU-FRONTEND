import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon, UserIcon, BeakerIcon } from '@heroicons/react/24/outline';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import DatePicker from '@/components/common/DatePicker';
import { createChildSchema } from '@/lib/form-validation/validationSchemas';
import type { CreateChildFormData } from '@/lib/form-validation/validationSchemas';

interface ChildRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: CreateChildFormData) => void;
  isLoading?: boolean;
}

export const ChildRegistrationModal: React.FC<ChildRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isLoading
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateChildFormData>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      gender: 'MALE' as const,
    },
  });

  const selectedGender = watch('gender');

  const onSubmit = (data: CreateChildFormData) => {
    onSuccess(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={handleClose} 
        />

        <div className="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-xl">
                <UserIcon className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Register New Child</h3>
                <p className="text-sm text-gray-500">Fill in the child's information below</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="w-5 h-5 text-violet-600" />
                <h4 className="text-base font-semibold text-gray-900">Personal Information</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Enter first name"
                  required
                />
                
                <Input
                  label="Middle Name"
                  {...register('middleName')}
                  error={errors.middleName?.message}
                  placeholder="Enter middle name (optional)"
                />
                
                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date of Birth"
                      value={field.value || ''}
                      onChange={(date: string) => field.onChange(date)}
                      error={errors.dateOfBirth?.message}
                      required
                      maxDate={new Date().toISOString().split('T')[0]}
                    />
                  )}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedGender === 'MALE' 
                        ? 'border-violet-500 bg-violet-50 text-violet-700' 
                        : 'border-gray-200 hover:border-violet-300'
                    }`}>
                      <input
                        type="radio"
                        value="MALE"
                        {...register('gender')}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm">Male</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedGender === 'FEMALE' 
                        ? 'border-violet-500 bg-violet-50 text-violet-700' 
                        : 'border-gray-200 hover:border-violet-300'
                    }`}>
                      <input
                        type="radio"
                        value="FEMALE"
                        {...register('gender')}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm">Female</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedGender === 'OTHER' 
                        ? 'border-violet-500 bg-violet-50 text-violet-700' 
                        : 'border-gray-200 hover:border-violet-300'
                    }`}>
                      <input
                        type="radio"
                        value="OTHER"
                        {...register('gender')}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm">Other</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Birth Details Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <BeakerIcon className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-semibold text-gray-900">Birth Details</h4>
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Birth Certificate Number"
                  {...register('birthCertificateNo')}
                  error={errors.birthCertificateNo?.message}
                  placeholder="e.g., 12345678"
                />
                
                <Input
                  label="Birth Facility ID"
                  {...register('birthFacilityId')}
                  error={errors.birthFacilityId?.message}
                  placeholder="Facility UUID"
                />
                
                <Input
                  label="Birth Weight (kg)"
                  type="number"
                  step="0.01"
                  {...register('birthWeight', { valueAsNumber: true })}
                  error={errors.birthWeight?.message}
                  placeholder="e.g., 3.5"
                />
                
                <Input
                  label="Birth Height (cm)"
                  type="number"
                  step="0.1"
                  {...register('birthHeight', { valueAsNumber: true })}
                  error={errors.birthHeight?.message}
                  placeholder="e.g., 50"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                placeholder="Any additional information about the child..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                type="button"
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                loading={isLoading}
                className="px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                Register Child
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChildRegistrationModal;
