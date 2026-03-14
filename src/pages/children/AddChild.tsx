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
// import { ROUTES } from '@/routing/routes';

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
      console.log('AddChild form submitted:', data);
      try {
        await createChild(data);
        showToast({
          type: 'success',
          message: 'Child registered successfully',
        });
        navigate('/dashboard/parent/children');
      } catch (err: any) {
        setError(err.message || 'Failed to register child');
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Back
            </Button>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Register New Child</h1>
          </div>
          <Card className="shadow-lg border border-blue-200">
            <Card.Body>
              {error && (
                <Alert
                  variant="error"
                  message={error}
                  onClose={() => setError(null)}
                  className="mb-6"
                />
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6 bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">Personal Information</h3>
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="FEMALE"
                            {...register('gender')}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Female</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="OTHER"
                            {...register('gender')}
                            className="h-4 w-4 text-gray-600 focus:ring-gray-500"
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
                  <div className="space-y-6 bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">Birth Details</h3>
                    <Input
                      label="Birth Certificate Number (Optional)"
                      {...register('birthCertificateNo')}
                      error={errors.birthCertificateNo?.message}
                      placeholder="e.g., 12345678"
                    />
                    <Input
                      label="Birth Facility (Optional)"
                      {...register('birthFacilityName')}
                      error={errors.birthFacilityName?.message}
                      placeholder="Enter facility name (e.g., Nairobi Hospital)"
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
                <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Any additional information about the child..."
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                  )}
                </div>
                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md"
                  >
                    Register Child
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
};

export default AddChild;