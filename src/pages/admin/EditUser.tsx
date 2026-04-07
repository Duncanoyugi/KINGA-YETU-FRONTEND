import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/routing/routes';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/features/users/usersHooks';
import { useGetFacilitiesQuery } from '@/features/facilities/facilitiesHooks';

const roleOptions = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'HEALTH_WORKER', label: 'Health Worker' },
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SUPER_ADMIN', label: 'Super Administrator' },
];

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { data: userData, isLoading } = useGetUserByIdQuery(id, { skip: !id });
  const { data: facilities = [] } = useGetFacilitiesQuery(undefined);
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (userData) {
      setForm({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        role: userData.role || 'PARENT',
        county: userData.profile?.county || '',
        subCounty: userData.profile?.subCounty || '',
        address: userData.profile?.address || '',
        licenseNumber: userData.healthWorker?.licenseNumber || '',
        qualification: userData.healthWorker?.qualification || '',
        specialization: userData.healthWorker?.specialization || '',
        facilityId: userData.healthWorker?.facility?.id || '',
        department: userData.adminProfile?.department || '',
        isActive: userData.isActive ?? true,
      });
    }
  }, [userData]);

  const isHealthWorker = form?.role === 'HEALTH_WORKER';
  const isAdmin = form?.role === 'ADMIN' || form?.role === 'SUPER_ADMIN';
  const activeFacilities = useMemo(() => facilities.filter(facility => facility.isActive !== false), [facilities]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;

    try {
      await updateUser({
        id,
        data: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim() || undefined,
          role: form.role,
          county: form.county.trim() || undefined,
          subCounty: form.subCounty.trim() || undefined,
          address: form.address.trim() || undefined,
          licenseNumber: isHealthWorker ? form.licenseNumber.trim() || undefined : undefined,
          qualification: isHealthWorker ? form.qualification.trim() || undefined : undefined,
          specialization: isHealthWorker ? form.specialization.trim() || undefined : undefined,
          facilityId: isHealthWorker ? form.facilityId || undefined : undefined,
          department: isAdmin ? form.department.trim() || undefined : undefined,
          isActive: form.isActive,
        },
      }).unwrap();

      showToast({
        type: 'success',
        message: 'User updated successfully',
      });
      navigate(ROUTES.USER_DETAILS.replace(':id', id));
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error?.data?.message || 'Failed to update user',
      });
    }
  };

  if (isLoading || !form) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
            <Input label="Phone Number" value={form.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <Input label="County" value={form.county} onChange={(e) => handleChange('county', e.target.value)} />
            <Input label="Sub County" value={form.subCounty} onChange={(e) => handleChange('subCounty', e.target.value)} />
            <Input label="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />

            {isHealthWorker && (
              <>
                <Input label="License Number" value={form.licenseNumber} onChange={(e) => handleChange('licenseNumber', e.target.value)} />
                <Input label="Qualification" value={form.qualification} onChange={(e) => handleChange('qualification', e.target.value)} />
                <Input label="Specialization" value={form.specialization} onChange={(e) => handleChange('specialization', e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
                  <select
                    value={form.facilityId}
                    onChange={(e) => handleChange('facilityId', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select facility</option>
                    {activeFacilities.map(facility => (
                      <option key={facility.id} value={facility.id}>{facility.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {isAdmin && (
              <Input label="Department" value={form.department} onChange={(e) => handleChange('department', e.target.value)} />
            )}

            <div className="flex items-center space-x-3">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">User is active</label>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={isSaving}>Save Changes</Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditUser;
