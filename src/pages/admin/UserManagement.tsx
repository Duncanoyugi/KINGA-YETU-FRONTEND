import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/useToast';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useUpdateUserRoleMutation,
  useVerifyUserMutation,
} from '@/features/users/usersHooks';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { formatDate } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';
import type { User } from '@/features/users/usersAPI';

const roles = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'HEALTH_WORKER', label: 'Health Worker' },
  { value: 'FACILITY_ADMIN', label: 'Facility Administrator' },
  { value: 'COUNTY_ADMIN', label: 'County Administrator' },
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SUPER_ADMIN', label: 'Super Administrator' },
];

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);
  const pageSize = 10;

  const filterParams = useMemo(() => ({
    search: debouncedSearch || undefined,
    role: selectedRole !== 'all' ? selectedRole : undefined,
    isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
    page: currentPage,
    limit: pageSize,
  }), [debouncedSearch, selectedRole, selectedStatus, currentPage]);

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery(filterParams);
  const { data: statsData } = useGetUserStatsQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();

  const users = usersData?.data || [];
  const totalUsers = usersData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const isLoading = isLoadingUsers || isDeleting || isActivating || isDeactivating || isUpdatingRole || isVerifying;

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id).unwrap();
      showToast({
        type: 'success',
        message: 'User deleted successfully',
      });
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to delete user',
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole({ id: selectedUser.id, role: newRole }).unwrap();
      showToast({
        type: 'success',
        message: 'User role updated successfully',
      });
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to update user role',
      });
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.isActive) {
        await deactivateUser(user.id).unwrap();
      } else {
        await activateUser(user.id).unwrap();
      }
      showToast({
        type: 'success',
        message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to update user status',
      });
    }
  };

  const handleResendVerification = async (user: User, type: 'email' | 'phone') => {
    try {
      await verifyUser({ id: user.id, type }).unwrap();
      showToast({
        type: 'success',
        message: `Verification ${type} sent successfully`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: `Failed to resend verification ${type}`,
      });
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: (row: User) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-medium">
              {row.fullName.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{row.fullName}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
            {row.phoneNumber && (
              <div className="text-sm text-gray-500">{row.phoneNumber}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (row: User) => (
        <Badge variant="primary">{row.role.replace('_', ' ')}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: (row: User) => (
        <div className="space-y-1">
          <Badge variant={row.isActive ? 'success' : 'danger'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {!row.isEmailVerified && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResendVerification(row, 'email');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              title="Resend email verification"
            >
              <EnvelopeIcon className="h-3 w-3" />
              Resend email
            </button>
          )}
          {row.phoneNumber && !row.isPhoneVerified && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResendVerification(row, 'phone');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              title="Resend phone verification"
            >
              <EnvelopeIcon className="h-3 w-3" />
              Resend SMS
            </button>
          )}
        </div>
      ),
    },
    {
      header: 'Last Login',
      accessor: (row: User) => (
        <div>
          {row.lastLoginAt ? (
            <>
              <div>{formatDate(row.lastLoginAt)}</div>
              <div className="text-xs text-gray-500">
                {formatDate(row.lastLoginAt, 'HH:mm')}
              </div>
            </>
          ) : (
            <span className="text-gray-400">Never</span>
          )}
        </div>
      ),
    },
    {
      header: 'Joined',
      accessor: (row: User) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <div className="flex space-x-2">
          {can('users:update') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(row);
                }}
                title={row.isActive ? 'Deactivate User' : 'Activate User'}
                className={row.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
              >
                {row.isActive ? (
                  <XCircleIcon className="h-4 w-4" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUser(row);
                  setShowRoleModal(true);
                  setNewRole(row.role);
                }}
                title="Change Role"
              >
                <ShieldCheckIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.EDIT_USER.replace(':id', row.id));
                }}
                title="Edit User"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </>
          )}
          {can('users:delete') && row.id !== currentUser?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row);
                setShowDeleteModal(true);
              }}
              title="Delete User"
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage users, roles, and permissions across the system
          </p>
        </div>
        {can('users:create') && (
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              leftIcon={<UserPlusIcon className="h-5 w-5" />}
              onClick={() => navigate(ROUTES.ADD_USER)}
            >
              Add New User
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">{statsData?.total || totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {statsData?.active || users.filter(u => u.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {statsData?.unverifiedEmails || users.filter(u => !u.isEmailVerified).length}
            </div>
            <div className="text-sm text-gray-600">Unverified Emails</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {statsData?.healthWorkers || users.filter(u => u.role === 'HEALTH_WORKER').length}
            </div>
            <div className="text-sm text-gray-600">Health Workers</div>
          </Card.Body>
        </Card>
      </div>

      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table
                data={users}
                columns={columns}
                onRowClick={(row) => navigate(ROUTES.USER_DETAILS.replace(':id', row.id))}
                emptyMessage="No users found"
              />

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete {selectedUser?.fullName}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
          setNewRole('');
        }}
        title="Change User Role"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Change role for <span className="font-medium">{selectedUser?.fullName}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
                setNewRole('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateRole}
              disabled={!newRole || newRole === selectedUser?.role}
            >
              Update Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
