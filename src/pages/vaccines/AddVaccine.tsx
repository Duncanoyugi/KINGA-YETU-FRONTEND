import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useVaccines } from '@/features/vaccines/vaccinesHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Tabs } from '@/components/common/Tabs';
import { createVaccineSchema } from '@/lib/form-validation/validationSchemas';
import type { CreateVaccineFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';

export const AddVaccine: React.FC = () => {
  const navigate = useNavigate();
  const { createVaccine, isLoading } = useVaccines();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm<CreateVaccineFormData>({
    resolver: zodResolver(createVaccineSchema),
    defaultValues: {
      isBirthDose: false,
      isBooster: false,
      isMandatory: true,
      dosesRequired: 1,
    },
  });

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'medical', label: 'Medical Info' },
    { id: 'storage', label: 'Storage' },
  ];

  const onSubmit = async (data: CreateVaccineFormData) => {
    try {
      await createVaccine(data);
      showToast({
        type: 'success',
        message: 'Vaccine added successfully',
      });
      navigate(ROUTES.VACCINE_SCHEDULE);
    } catch (err: any) {
      setError(err.message || 'Failed to add vaccine');
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Vaccine</h1>
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

            <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6 space-y-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Vaccine Code"
                      {...register('code')}
                      error={errors.code?.message}
                      placeholder="e.g., BCG01"
                    />
                    <Input
                      label="Vaccine Name"
                      {...register('name')}
                      error={errors.name?.message}
                      placeholder="e.g., BCG"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Brief description of the vaccine"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Vaccine Type"
                      {...register('vaccineType')}
                      error={errors.vaccineType?.message}
                      placeholder="e.g., Live attenuated"
                    />
                    <Input
                      label="Category"
                      {...register('category')}
                      error={errors.category?.message}
                      placeholder="e.g., CHILDHOOD_IMMUNIZATION"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Disease Prevented"
                      {...register('diseasePrevented')}
                      error={errors.diseasePrevented?.message}
                      placeholder="e.g., Tuberculosis"
                    />
                    <Input
                      label="Manufacturer"
                      {...register('manufacturer')}
                      error={errors.manufacturer?.message}
                      placeholder="e.g., Serum Institute"
                    />
                  </div>

                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isBirthDose')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Birth Dose</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isBooster')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Booster</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('isMandatory')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mandatory</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Recommended Age (days)"
                      type="number"
                      {...register('recommendedAgeDays', { valueAsNumber: true })}
                      error={errors.recommendedAgeDays?.message}
                    />
                    <Input
                      label="Doses Required"
                      type="number"
                      {...register('dosesRequired', { valueAsNumber: true })}
                      error={errors.dosesRequired?.message}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Minimum Age (days) - Optional"
                      type="number"
                      {...register('minAgeDays', { valueAsNumber: true })}
                      error={errors.minAgeDays?.message}
                    />
                    <Input
                      label="Maximum Age (days) - Optional"
                      type="number"
                      {...register('maxAgeDays', { valueAsNumber: true })}
                      error={errors.maxAgeDays?.message}
                    />
                  </div>

                  <Input
                    label="Interval Between Doses (days) - Optional"
                    type="number"
                    {...register('intervalDays', { valueAsNumber: true })}
                    error={errors.intervalDays?.message}
                    helperText="For multi-dose vaccines only"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Administration Route"
                      {...register('administrationRoute')}
                      error={errors.administrationRoute?.message}
                      placeholder="e.g., Intramuscular"
                    />
                    <Input
                      label="Administration Site"
                      {...register('administrationSite')}
                      error={errors.administrationSite?.message}
                      placeholder="e.g., Left thigh"
                    />
                  </div>

                  <Input
                    label="Dosage"
                    {...register('dosage')}
                    error={errors.dosage?.message}
                    placeholder="e.g., 0.5ml"
                  />
                </div>
              )}

              {/* Medical Info Tab */}
              {activeTab === 'medical' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraindications
                    </label>
                    <textarea
                      {...register('contraindications')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="List any contraindications"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Side Effects
                    </label>
                    <textarea
                      {...register('sideEffects')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="List common side effects"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precautions
                    </label>
                    <textarea
                      {...register('precautions')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Any special precautions"
                    />
                  </div>
                </div>
              )}

              {/* Storage Tab */}
              {activeTab === 'storage' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage Requirements
                    </label>
                    <textarea
                      {...register('storageRequirements')}
                      rows={2}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="e.g., Store at 2-8°C"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Minimum Temperature (°C)"
                      type="number"
                      step="0.1"
                      {...register('temperatureMin', { valueAsNumber: true })}
                      error={errors.temperatureMin?.message}
                    />
                    <Input
                      label="Maximum Temperature (°C)"
                      type="number"
                      step="0.1"
                      {...register('temperatureMax', { valueAsNumber: true })}
                      error={errors.temperatureMax?.message}
                    />
                  </div>

                  <Input
                    label="Shelf Life (days)"
                    type="number"
                    {...register('shelfLifeDays', { valueAsNumber: true })}
                    error={errors.shelfLifeDays?.message}
                    helperText="From manufacturing date"
                  />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
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
                Add Vaccine
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddVaccine;