import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useVaccines } from '@/features/vaccines/vaccinesHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { createVaccineSchema } from '@/lib/form-validation/validationSchemas';
import type { CreateVaccineFormData } from '@/lib/form-validation/validationSchemas';
import { ROUTES } from '@/routing/routes';

export const EditVaccine: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVaccineById, updateVaccine, isLoading } = useVaccines();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  const {
    handleSubmit,
    reset,
  } = useForm<CreateVaccineFormData>({
    resolver: zodResolver(createVaccineSchema),
  });

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'medical', label: 'Medical Info' },
    { id: 'storage', label: 'Storage' },
  ];

  useEffect(() => {
    const loadVaccine = async () => {
      try {
        const vaccine = await getVaccineById(id!);
        reset({
          code: vaccine.code,
          name: vaccine.name,
          description: vaccine.description || '',
          vaccineType: vaccine.vaccineType || '',
          category: vaccine.category || '',
          diseasePrevented: vaccine.diseasePrevented || '',
          manufacturer: vaccine.manufacturer || '',
          isBirthDose: vaccine.isBirthDose,
          isBooster: vaccine.isBooster,
          isMandatory: vaccine.isMandatory,
          recommendedAgeDays: vaccine.recommendedAgeDays,
          dosesRequired: vaccine.dosesRequired,
          minAgeDays: vaccine.minAgeDays || undefined,
          maxAgeDays: vaccine.maxAgeDays || undefined,
          intervalDays: vaccine.intervalDays || undefined,
          administrationRoute: vaccine.administrationRoute || '',
          administrationSite: vaccine.administrationSite || '',
          dosage: vaccine.dosage || '',
          contraindications: vaccine.contraindications || '',
          sideEffects: vaccine.sideEffects || '',
          precautions: vaccine.precautions || '',
          storageRequirements: vaccine.storageRequirements || '',
          temperatureMin: vaccine.temperatureMin || undefined,
          temperatureMax: vaccine.temperatureMax || undefined,
          shelfLifeDays: vaccine.shelfLifeDays || undefined,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load vaccine');
      } finally {
        setLoading(false);
      }
    };

    loadVaccine();
  }, [id, getVaccineById, reset]);

  const onSubmit = async (data: CreateVaccineFormData) => {
    try {
      await updateVaccine(id!, data);
      showToast({
        type: 'success',
        message: 'Vaccine updated successfully',
      });
      navigate(ROUTES.VACCINE_SCHEDULE);
    } catch (err: any) {
      setError(err.message || 'Failed to update vaccine');
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Vaccine</h1>
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

          <form onSubmit={handleSubmit(onSubmit as any)}>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6 space-y-6">
              {/* Basic Info Tab - Same fields as AddVaccine */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* ... (same fields as AddVaccine basic tab) ... */}
                </div>
              )}

              {/* Schedule Tab - Same fields as AddVaccine */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  {/* ... (same fields as AddVaccine schedule tab) ... */}
                </div>
              )}

              {/* Medical Info Tab - Same fields as AddVaccine */}
              {activeTab === 'medical' && (
                <div className="space-y-4">
                  {/* ... (same fields as AddVaccine medical tab) ... */}
                </div>
              )}

              {/* Storage Tab - Same fields as AddVaccine */}
              {activeTab === 'storage' && (
                <div className="space-y-4">
                  {/* ... (same fields as AddVaccine storage tab) ... */}
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
                Save Changes
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditVaccine;