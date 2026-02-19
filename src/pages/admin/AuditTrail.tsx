import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';
import { Pagination } from '@/components/common/Pagination';
import { Tabs } from '@/components/common/Tabs';
import { formatDate, formatRelativeTime } from '@/utils/dateHelpers';

interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT';
  entityType: string;
  entityId: string;
  entityName?: string;
  oldData?: any;
  newData?: any;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE';
  details?: string;
}

const mockLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    user: {
      id: 'user1',
      name: 'Admin User',
      email: 'admin@immunitrack.ke',
      role: 'ADMIN',
    },
    action: 'CREATE',
    entityType: 'CHILD',
    entityId: 'child123',
    entityName: 'John Doe Jr',
    newData: { name: 'John Doe Jr', dob: '2024-01-01' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'SUCCESS',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: {
      id: 'user2',
      name: 'Dr. Jane Smith',
      email: 'jane@hospital.ke',
      role: 'HEALTH_WORKER',
    },
    action: 'UPDATE',
    entityType: 'IMMUNIZATION',
    entityId: 'imm456',
    entityName: 'BCG Vaccination',
    oldData: { status: 'SCHEDULED' },
    newData: { status: 'ADMINISTERED' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    status: 'SUCCESS',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 'user1',
      name: 'Admin User',
      email: 'admin@immunitrack.ke',
      role: 'ADMIN',
    },
    action: 'DELETE',
    entityType: 'USER',
    entityId: 'user789',
    entityName: 'john.doe@example.com',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'SUCCESS',
    details: 'User account deactivated',
  },
];

const actionColors = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
  LOGIN: 'info',
  LOGOUT: 'default',
  EXPORT: 'primary',
  IMPORT: 'primary',
};

const entityTypes = [
  { value: 'all', label: 'All Entities' },
  { value: 'USER', label: 'User' },
  { value: 'CHILD', label: 'Child' },
  { value: 'VACCINE', label: 'Vaccine' },
  { value: 'IMMUNIZATION', label: 'Immunization' },
  { value: 'FACILITY', label: 'Facility' },
  { value: 'REPORT', label: 'Report' },
  { value: 'SYSTEM', label: 'System' },
];

const actions = [
  { value: 'all', label: 'All Actions' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'EXPORT', label: 'Export' },
  { value: 'IMPORT', label: 'Import' },
];

export const AuditTrail: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { can } = usePermissions();
  const { showToast } = useToast();
  
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(mockLogs);
  const [isLoading, _setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const pageSize = 20;

  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'user', label: 'User Actions' },
    { id: 'data', label: 'Data Changes' },
    { id: 'system', label: 'System Events' },
  ];

  const filterLogs = () => {
    let filtered = [...logs];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      );
    }

    // Apply entity filter
    if (selectedEntity !== 'all') {
      filtered = filtered.filter(log => log.entityType === selectedEntity);
    }

    // Apply action filter
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    // Apply date range filter
    const startDate = new Date(dateRange.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(dateRange.endDate).setHours(23, 59, 59, 999);
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp).getTime();
      return logDate >= startDate && logDate <= endDate;
    });

    // Apply tab filter
    if (activeTab === 'user') {
      filtered = filtered.filter(log => ['LOGIN', 'LOGOUT'].includes(log.action));
    } else if (activeTab === 'data') {
      filtered = filtered.filter(log => ['CREATE', 'UPDATE', 'DELETE'].includes(log.action));
    } else if (activeTab === 'system') {
      filtered = filtered.filter(log => log.entityType === 'SYSTEM');
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    filterLogs();
  }, [searchTerm, selectedEntity, selectedAction, dateRange, activeTab, logs]);

  const handleExport = () => {
    showToast({
      type: 'info',
      message: 'Exporting audit logs...',
    });
    // Implement export logic
  };

  const getActionIcon = (action: string) => {
    const variant = actionColors[action as keyof typeof actionColors] || 'default';
    return <Badge variant={variant}>{action}</Badge>;
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: (row: AuditLog) => (
        <div>
          <div>{formatDate(row.timestamp, 'MMM dd, yyyy HH:mm:ss')}</div>
          <div className="text-xs text-gray-500">{formatRelativeTime(row.timestamp)}</div>
        </div>
      ),
    },
    {
      header: 'User',
      accessor: (row: AuditLog) => (
        <div>
          <div className="font-medium text-gray-900">{row.user.name}</div>
          <div className="text-sm text-gray-500">{row.user.email}</div>
          <Badge size="sm" variant="primary">{row.user.role}</Badge>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: (row: AuditLog) => (
        <div className="space-y-1">
          {getActionIcon(row.action)}
          <div className="text-xs text-gray-500">{row.entityType}</div>
        </div>
      ),
    },
    {
      header: 'Target',
      accessor: (row: AuditLog) => (
        <div>
          <div className="font-medium text-gray-900">{row.entityName || row.entityId}</div>
          <div className="text-xs text-gray-500">ID: {row.entityId}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: AuditLog) => (
        <Badge variant={row.status === 'SUCCESS' ? 'success' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'IP Address',
      accessor: (row: AuditLog) => row.ipAddress,
    },
    {
      header: 'Actions',
      accessor: (row: AuditLog) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(row);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (!isAdmin && !isSuperAdmin && !can('audit:view')) {
    return (
      <Alert
        variant="danger"
        message="You don't have permission to access this page"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        </div>
        <Button
          variant="outline"
          leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
          onClick={handleExport}
        >
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by user, entity, or IP address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {entityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {actions.map(action => (
                    <option key={action.value} value={action.value}>{action.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Logs Table */}
      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Table
                data={paginatedLogs}
                columns={columns}
                emptyMessage="No audit logs found"
              />

              {filteredLogs.length > pageSize && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredLogs.length / pageSize)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <Card.Header
              title="Audit Log Details"
              action={
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            />
            <Card.Body>
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {formatDate(selectedLog.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">User</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    <div>{selectedLog.user.name}</div>
                    <div className="text-gray-500">{selectedLog.user.email}</div>
                    <Badge size="sm" variant="primary">{selectedLog.user.role}</Badge>
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Action</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {getActionIcon(selectedLog.action)}
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Entity Type</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedLog.entityType}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Entity ID</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedLog.entityId}</dd>
                </div>

                {selectedLog.entityName && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Entity Name</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{selectedLog.entityName}</dd>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    <Badge variant={selectedLog.status === 'SUCCESS' ? 'success' : 'danger'}>
                      {selectedLog.status}
                    </Badge>
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedLog.ipAddress}</dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">User Agent</dt>
                  <dd className="text-sm text-gray-900 col-span-2 break-all">
                    {selectedLog.userAgent}
                  </dd>
                </div>

                {selectedLog.details && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Details</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{selectedLog.details}</dd>
                  </div>
                )}

                {(selectedLog.oldData || selectedLog.newData) && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Data Changes</h4>
                    
                    {selectedLog.oldData && (
                      <div className="mb-3">
                        <dt className="text-sm font-medium text-gray-500 mb-1">Previous Data</dt>
                        <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(selectedLog.oldData, null, 2)}
                          </pre>
                        </dd>
                      </div>
                    )}

                    {selectedLog.newData && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-1">New Data</dt>
                        <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(selectedLog.newData, null, 2)}
                          </pre>
                        </dd>
                      </div>
                    )}
                  </div>
                )}
              </dl>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-end">
                <Button variant="primary" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AuditTrail;