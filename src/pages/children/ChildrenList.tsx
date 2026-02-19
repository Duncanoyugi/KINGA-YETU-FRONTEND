import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useChildren } from '@/features/children/childrenHooks';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Pagination } from '@/components/common/Pagination';
import { formatDate, formatAge } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

interface SearchForm {
  search: string;
}

export const ChildrenList: React.FC = () => {
  const navigate = useNavigate();
  const { isParent, isHealthWorker } = useAuth();
  const { children, isLoading, pagination, fetchChildren, setPagination } = useChildren();
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { register, handleSubmit } = useForm<SearchForm>();

  useEffect(() => {
    fetchChildren({
      page: pagination.page,
      limit: pagination.limit,
      search: debouncedSearch,
    });
  }, [debouncedSearch, pagination.page, pagination.limit]);

  const columns = [
    {
      header: 'Child Name',
      accessor: (row: any) => (
        <div>
          <div className="font-medium text-gray-900">
            {`${row.firstName} ${row.middleName || ''} ${row.lastName}`}
          </div>
          <div className="text-sm text-gray-500">
            {row.uniqueIdentifier}
          </div>
        </div>
      ),
    },
    {
      header: 'Date of Birth',
      accessor: (row: any) => (
        <div>
          <div>{formatDate(row.dateOfBirth)}</div>
          <div className="text-sm text-gray-500">{formatAge(row.dateOfBirth)}</div>
        </div>
      ),
    },
    {
      header: 'Gender',
      accessor: (row: any) => (
        <Badge variant={row.gender === 'MALE' ? 'primary' : 'secondary'}>
          {row.gender}
        </Badge>
      ),
    },
    {
      header: 'Immunization Status',
      accessor: (row: any) => {
        const status = row.immunizationStatus || 'unknown';
        const variant = 
          status === 'completed' ? 'success' :
          status === 'partial' ? 'warning' :
          status === 'none' ? 'danger' : 'default';
        
        return (
          <Badge variant={variant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: 'Last Visit',
      accessor: (row: any) => row.lastVisit ? formatDate(row.lastVisit) : 'No visits',
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.CHILD_PROFILE.replace(':id', row.id));
            }}
          >
            View
          </Button>
          {isHealthWorker && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.EDIT_CHILD.replace(':id', row.id));
              }}
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleSearch = (data: SearchForm) => {
    setSearchTerm(data.search);
    setPagination({ page: 1 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track immunization records for all children
          </p>
        </div>
        {(isParent || isHealthWorker) && (
          <Link to={ROUTES.ADD_CHILD}>
            <Button variant="primary" leftIcon={<PlusIcon className="h-5 w-5" />}>
              Register New Child
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit(handleSearch)} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, ID, or birth certificate..."
                {...register('search')}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>
        </Card.Body>
      </Card>

      {/* Children Table */}
      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table
                data={children}
                columns={columns}
                onRowClick={(row) => navigate(ROUTES.CHILD_PROFILE.replace(':id', row.id))}
                emptyMessage="No children found"
              />
              
              {pagination.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => setPagination({ page })}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChildrenList;