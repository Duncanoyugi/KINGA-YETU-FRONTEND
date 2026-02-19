import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useChildren } from '@/features/children/childrenHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';
import { updateChildSchema } from '@/lib/form-validation/validationSchemas';
import type { UpdateChildFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';

export const EditChild: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChildById, updateChild, isLoading } = useChildren();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateChildFormData>({
    resolver: zodResolver(updateChildSchema),
  });

  useEffect(() => {
    const loadChild = async () => {
      try {
        const child = await getChildById(id!);
        reset({
          firstName: child.firstName,
          middleName: child.middleName,
          lastName: child.lastName,
          dateOfBirth: child.dateOfBirth.split('T')[0],
          gender: child.gender,
          birthCertificateNo: child.birthCertificateNo,
          birthFacilityId: child.birthFacilityId,
          notes: child.notes,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load child data');
      } finally {
        setLoading(false);
      }
    };

    loadChild();
  }, [id, getChildById, reset]);

  const onSubmit = async (data: UpdateChildFormData) => {
    try {
      await updateChild(id!, data);
      showToast({
        type: 'success',
        message: 'Child information updated successfully',
      });
      navigate(ROUTES.CHILD_PROFILE.replace(':id', id!));
    } catch (err: any) {
      setError(err.message || 'Failed to update child');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Edit Child Information</h1>
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
              <Input
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />

              <Input
                label="Middle Name (Optional)"
                {...register('middleName')}
                error={errors.middleName?.message}
              />

              <Input
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
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

              <Input
                label="Birth Certificate Number (Optional)"
                {...register('birthCertificateNo')}
                error={errors.birthCertificateNo?.message}
              />

              <Input
                label="Birth Facility ID (Optional)"
                {...register('birthFacilityId')}
                error={errors.birthFacilityId?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

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
                Save Changes
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditChild;