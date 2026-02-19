import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useChildren } from '@/features/children/childrenHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { createChildSchema } from '@/lib/form-validation/validationSchemas';
import type { CreateChildFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';

export const AddChild: React.FC = () => {
  const navigate = useNavigate();
  const { createChild, isLoading } = useChildren();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateChildFormData>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      gender: 'MALE',
    },
  });

  const onSubmit = async (data: CreateChildFormData) => {
    try {
      await createChild(data);
      showToast({
        type: 'success',
        message: 'Child registered successfully',
      });
      navigate(ROUTES.CHILDREN_LIST);
    } catch (err: any) {
      setError(err.message || 'Failed to register child');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Register New Child</h1>
      </div>

      <Card>
        <Card.Body>
          {error && (
            <Alert
              variant="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                
                <Input
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Enter first name"
                />

                <Input
                  label="Middle Name (Optional)"
                  {...register('middleName')}
                  error={errors.middleName?.message}
                  placeholder="Enter middle name"
                />

                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Enter last name"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="MALE"
                        {...register('gender')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="FEMALE"
                        {...register('gender')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Female</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="OTHER"
                        {...register('gender')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Other</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dateOfBirth')}
                  error={errors.dateOfBirth?.message}
                />
              </div>

              {/* Birth Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Birth Details</h3>

                <Input
                  label="Birth Certificate Number (Optional)"
                  {...register('birthCertificateNo')}
                  error={errors.birthCertificateNo?.message}
                  placeholder="e.g., 12345678"
                />

                <Input
                  label="Birth Facility ID (Optional)"
                  {...register('birthFacilityId')}
                  error={errors.birthFacilityId?.message}
                  placeholder="Facility UUID"
                />

                <Input
                  label="Birth Weight (kg) - Optional"
                  type="number"
                  step="0.01"
                  {...register('birthWeight', { valueAsNumber: true })}
                  error={errors.birthWeight?.message}
                  placeholder="e.g., 3.5"
                />

                <Input
                  label="Birth Height (cm) - Optional"
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
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Any additional information about the child..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
              >
                Register Child
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddChild;