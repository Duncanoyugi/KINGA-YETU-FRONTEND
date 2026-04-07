import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/routing/routes';
import { useCreateFacilityMutation } from '@/features/facilities/facilitiesHooks';

const facilityTypes = ['HOSPITAL', 'HEALTH_CENTER', 'DISPENSARY', 'CLINIC', 'Maternity'];

const AddFacility: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [createFacility, { isLoading }] = useCreateFacilityMutation();
  const [form, setForm] = useState({
    name: '',
    type: 'HOSPITAL',
    code: '',
    mflCode: '',
    county: '',
    subCounty: '',
    ward: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createFacility({
        name: form.name.trim(),
        type: form.type as any,
        code: form.code.trim(),
        mflCode: form.mflCode.trim() || undefined,
        county: form.county.trim(),
        subCounty: form.subCounty.trim(),
        ward: form.ward.trim() || undefined,
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
      }).unwrap();

      showToast({
        type: 'success',
        message: 'Facility created successfully',
      });
      navigate(ROUTES.FACILITY_MANAGEMENT);
    } catch (error: any) {
      showToast({
        type: 'error',
        message: error?.data?.message || 'Failed to create facility',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add Facility</h1>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Facility Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {facilityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <Input label="Facility Code" value={form.code} onChange={(e) => handleChange('code', e.target.value)} required />
            <Input label="MFL Code" value={form.mflCode} onChange={(e) => handleChange('mflCode', e.target.value)} />
            <Input label="County" value={form.county} onChange={(e) => handleChange('county', e.target.value)} required />
            <Input label="Sub County" value={form.subCounty} onChange={(e) => handleChange('subCounty', e.target.value)} required />
            <Input label="Ward" value={form.ward} onChange={(e) => handleChange('ward', e.target.value)} />
            <Input label="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />

            <div className="md:col-span-2 flex justify-end space-x-3">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={isLoading}>Create Facility</Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddFacility;
