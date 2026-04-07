import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { useGetFacilityByIdQuery } from '@/features/facilities/facilitiesHooks';
import { ROUTES } from '@/routing/routes';

const FacilityDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const { data: facility, isLoading } = useGetFacilityByIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!facility) {
    return (
      <Card>
        <Card.Body>Facility not found.</Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Facility Details</h1>
        </div>
        <Button variant="outline" leftIcon={<PencilIcon className="h-4 w-4" />} onClick={() => navigate(ROUTES.EDIT_FACILITY.replace(':id', id))}>
          Edit Facility
        </Button>
      </div>

      <Card>
        <Card.Body className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{facility.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium text-gray-900">{facility.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Facility Code</p>
            <p className="font-medium text-gray-900">{facility.code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">MFL Code</p>
            <p className="font-medium text-gray-900">{facility.mflCode || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">County</p>
            <p className="font-medium text-gray-900">{facility.county}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sub County</p>
            <p className="font-medium text-gray-900">{facility.subCounty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ward</p>
            <p className="font-medium text-gray-900">{facility.ward || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge variant={facility.isActive ? 'success' : 'danger'}>{facility.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{facility.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{facility.email || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-gray-900">{facility.address || 'Not provided'}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FacilityDetails;
