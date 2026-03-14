import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFacilityMutation, type CreateFacilityRequest } from '@/features/facilities/facilitiesAPI';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { createFacilitySchema } from '@/lib/form-validation/validationSchemas';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select, type SelectOption } from '@/components/common/Select';
import { Spinner } from '@/components/common/Spinner';

interface FacilitySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}


export const FacilitySetupModal: React.FC<FacilitySetupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { refetchUser } = useAuth();
  const { showToast } = useToast();
  const [createFacility] = useCreateFacilityMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateFacilityRequest>({
    resolver: zodResolver(createFacilitySchema),
    defaultValues: {
      name: '',
      type: undefined as any,
      code: '',
      mflCode: '',
      county: '',
      subCounty: '',
      ward: '',
      address: '',
      phone: '',
      email: '',
    },
  });


  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateFacilityRequest) => {
    try {
      await createFacility(data).unwrap();
      showToast({ type: 'success', message: 'Facility created successfully! Redirecting...' });
      
      // Refetch user to get updated healthWorker.facility
      await refetchUser();
      
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast({ 
        type: 'error', 
        message: error.data?.message || 'Failed to create facility. Please try again.' 
      });
    }
  };

  const counties: SelectOption[] = [
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Kiambu', label: 'Kiambu' },
    { value: 'Machakos', label: 'Machakos' },
    { value: 'Kajiado', label: 'Kajiado' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kwale', label: 'Kwale' },
    { value: 'Kilifi', label: 'Kilifi' },
    { value: 'Tana River', label: 'Tana River' },
    { value: 'Lamu', label: 'Lamu' },
    { value: 'Taita Taveta', label: 'Taita Taveta' },
  ];

  const facilityTypes: SelectOption[] = [
    { value: 'HOSPITAL', label: 'Hospital' },
    { value: 'HEALTH_CENTER', label: 'Health Center' },
    { value: 'DISPENSARY', label: 'Dispensary' },
    { value: 'CLINIC', label: 'Clinic' },
    { value: 'MOBILE_CLINIC', label: 'Mobile Clinic' },
    { value: 'PRIVATE_PRACTICE', label: 'Private Practice' },
    { value: 'MATERNITY', label: 'Maternity' },
    { value: 'NURSING_HOME', label: 'Nursing Home' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Facility Setup
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enter your facility details to start registering children and managing inventory
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facility Name *
            </label>
            <Input
              {...register('name')}
              placeholder="e.g. Happy Kids Dispensary"
              error={errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facility Type *
              </label>
              <Select
                onChange={(value) => setValue('type' as any, value)}
                value={watch('type') || ''}
                options={facilityTypes}
                placeholder="Select type"
                error={errors.type?.message}
              />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facility Code *
              </label>
              <Input
                {...register('code')}
                placeholder="e.g. FAC001"
                error={errors.code?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                County *
              </label>
              <Select
                onChange={(value) => setValue('county', value)}
                value={watch('county') || ''}
                options={counties}
                placeholder="Select county"
                error={errors.county?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sub-County *
              </label>
              <Input
                {...register('subCounty')}
                placeholder="e.g. Kamukunji"
                error={errors.subCounty?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ward
              </label>
              <Input
                {...register('ward')}
                placeholder="e.g. Lower Kabete"
                error={errors.ward?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                MFL Code
              </label>
              <Input
                {...register('mflCode')}
                placeholder="e.g. 12345"
                error={errors.mflCode?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <Input
              {...register('address')}
              placeholder="e.g. P.O. Box 123, Nairobi"
              error={errors.address?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <Input
                {...register('phone')}
                placeholder="e.g. +254712345678"
                error={errors.phone?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="e.g. facility@example.com"
                error={errors.email?.message}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Facility'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


