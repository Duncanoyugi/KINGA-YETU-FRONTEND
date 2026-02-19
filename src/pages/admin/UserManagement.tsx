import React, { useState, useEffect } from 'react';
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

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  facilityId?: string;
  facilityName?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+254712345678',
    role: 'PARENT',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Dr. Jane Smith',
    email: 'jane.smith@hospital.ke',
    phoneNumber: '+254723456789',
    role: 'HEALTH_WORKER',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    facilityId: 'fac1',
    facilityName: 'Nairobi Hospital',
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    fullName: 'Admin User',
    email: 'admin@immunitrack.ke',
    role: 'ADMIN',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const roles = [
  { value: 'PARENT', label: 'Parent' },
  { value: 'HEALTH_WORKER', label: 'Health Worker' },
  { value: 'FACILITY_ADMIN', label: 'Facility Administrator' },
  { value: 'COUNTY_ADMIN', label: 'County Administrator' },
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SUPER_ADMIN', label: 'Super Administrator' },
];

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions();
  const { showToast } = useToast();
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    filterUsers();
  }, [debouncedSearch, selectedRole, selectedStatus, users]);

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.phoneNumber?.includes(debouncedSearch)
      );
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user =>
        selectedStatus === 'active' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      // API call would go here
      setUsers(users.filter(u => u.id !== selectedUser.id));
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setIsLoading(true);
      // API call would go here
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setIsLoading(true);
      // API call would go here
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));
      showToast({
        type: 'success',
        message: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to update user status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (user: User, type: 'email' | 'phone') => {
    try {
      setIsLoading(true);
      // API call would use user.id, user.email, or user.phoneNumber based on type
      console.log(`Resending ${type} verification to user:`, user.id);
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast({
        type: 'success',
        message: `Verification ${type} resent successfully to ${type === 'email' ? user.email : user.phoneNumber}`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: `Failed to resend verification ${type}`,
      });
    } finally {
      setIsLoading(false);
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

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {users.filter(u => !u.isEmailVerified).length}
            </div>
            <div className="text-sm text-gray-600">Unverified Emails</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'HEALTH_WORKER').length}
            </div>
            <div className="text-sm text-gray-600">Health Workers</div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
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

      {/* Users Table */}
      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table
                data={paginatedUsers}
                columns={columns}
                onRowClick={(row) => navigate(ROUTES.USER_DETAILS.replace(':id', row.id))}
                emptyMessage="No users found"
              />

              {filteredUsers.length > pageSize && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUsers.length / pageSize)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Delete User"
        size="sm"
      >
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to delete {selectedUser?.fullName}? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>

      {/* Change Role Modal */}
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
        <Modal.Body>
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
          </div>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;