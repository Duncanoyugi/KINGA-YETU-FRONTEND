import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { useGetUserByIdQuery } from '@/features/users/usersHooks';
import { ROUTES } from '@/routing/routes';
import { formatDate } from '@/utils/dateHelpers';

const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams<{ id: string }>();
  const { data: user, isLoading } = useGetUserByIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <Card.Body>User not found.</Card.Body>
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
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        </div>
        <Button variant="outline" leftIcon={<PencilIcon className="h-4 w-4" />} onClick={() => navigate(ROUTES.EDIT_USER.replace(':id', id))}>
          Edit User
        </Button>
      </div>

      <Card>
        <Card.Body className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900">{user.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{user.phoneNumber || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <Badge variant="primary">{user.role}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">County</p>
            <p className="font-medium text-gray-900">{user.profile?.county || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sub County</p>
            <p className="font-medium text-gray-900">{user.profile?.subCounty || 'Not provided'}</p>
          </div>
          {user.healthWorker && (
            <>
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium text-gray-900">{user.healthWorker.licenseNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Facility</p>
                <p className="font-medium text-gray-900">{user.healthWorker.facility?.name || 'Not assigned'}</p>
              </div>
            </>
          )}
          {user.adminProfile && (
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium text-gray-900">{user.adminProfile.department || 'Not provided'}</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserDetails;
