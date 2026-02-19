import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { Tabs } from '@/components/common/Tabs';
import { formatDate, formatRelativeTime } from '@/utils/dateHelpers';

interface LogEntry {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipient: string;
  subject?: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  error?: string;
  metadata?: Record<string, any>;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    type: 'email',
    recipient: 'parent@example.com',
    subject: 'Vaccination Reminder',
    message: 'Your child is due for BCG vaccination',
    status: 'delivered',
    sentAt: new Date().toISOString(),
    deliveredAt: new Date().toISOString(),
    readAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'sms',
    recipient: '+254712345678',
    message: 'Reminder: Vaccination tomorrow at 9am',
    status: 'sent',
    sentAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'push',
    recipient: "John's iPhone",
    message: 'Appointment confirmed',
    status: 'failed',
    sentAt: new Date().toISOString(),
    error: 'Device not reachable',
  },
];

export const CommunicationLogs: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const tabs = [
    { id: 'all', label: 'All Communications' },
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'push', label: 'Push' },
    { id: 'failed', label: 'Failed' },
  ];

  const getFilteredLogs = () => {
    let filtered = mockLogs;

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'failed') {
        filtered = filtered.filter(log => log.status === 'failed');
      } else {
        filtered = filtered.filter(log => log.type === activeTab);
      }
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    filtered = filtered.filter(log =>
      log.sentAt >= new Date(dateRange.startDate).toISOString() &&
      log.sentAt <= new Date(dateRange.endDate).toISOString()
    );

    return filtered;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'sent':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-5 w-5" />;
      case 'sms':
        return <PhoneIcon className="h-5 w-5" />;
      case 'push':
        return <ComputerDesktopIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const filteredLogs = getFilteredLogs();
  const totalPages = Math.ceil(filteredLogs.length / 10);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * 10, currentPage * 10);

  const columns = [
    {
      header: 'Type',
      accessor: (row: LogEntry) => (
        <div className="flex items-center">
          <span className="mr-2">{getTypeIcon(row.type)}</span>
          <Badge variant="default" size="sm">
            {row.type.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Recipient',
      accessor: (row: LogEntry) => (
        <div>
          <div className="font-medium text-gray-900">{row.recipient}</div>
          {row.subject && (
            <div className="text-sm text-gray-500">{row.subject}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Message',
      accessor: (row: LogEntry) => (
        <div className="max-w-md truncate">{row.message}</div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: LogEntry) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(row.status)}
          <span className="text-sm text-gray-900 capitalize">{row.status}</span>
        </div>
      ),
    },
    {
      header: 'Sent',
      accessor: (row: LogEntry) => (
        <div>
          <div>{formatDate(row.sentAt)}</div>
          <div className="text-sm text-gray-500">{formatRelativeTime(row.sentAt)}</div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: LogEntry) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Communication Logs</h1>
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            onClick={() => {/* Handle export */}}
          >
            Export Logs
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by recipient or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<FunnelIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div>
              <Input
                type="date"
                label="From"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="date"
                label="To"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Logs Table */}
      <Card>
        <Card.Body>
          <Table
            data={paginatedLogs}
            columns={columns}
            onRowClick={(row) => setSelectedLog(row)}
            emptyMessage="No communication logs found"
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
        </Card.Body>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full">
            <Card.Header
              title="Communication Details"
              action={
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              }
            />
            <Card.Body>
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900 col-span-2 capitalize">
                    {selectedLog.type}
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Recipient</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedLog.recipient}</dd>
                </div>

                {selectedLog.subject && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Subject</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{selectedLog.subject}</dd>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Message</dt>
                  <dd className="text-sm text-gray-900 col-span-2 whitespace-pre-wrap">
                    {selectedLog.message}
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    <div className="flex items-center">
                      {getStatusIcon(selectedLog.status)}
                      <span className="ml-2 capitalize">{selectedLog.status}</span>
                    </div>
                  </dd>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Sent At</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {formatDate(selectedLog.sentAt, 'MMM dd, yyyy HH:mm:ss')}
                  </dd>
                </div>

                {selectedLog.deliveredAt && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Delivered At</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(selectedLog.deliveredAt, 'MMM dd, yyyy HH:mm:ss')}
                    </dd>
                  </div>
                )}

                {selectedLog.readAt && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Read At</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(selectedLog.readAt, 'MMM dd, yyyy HH:mm:ss')}
                    </dd>
                  </div>
                )}

                {selectedLog.error && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Error</dt>
                    <dd className="text-sm text-red-600 col-span-2">{selectedLog.error}</dd>
                  </div>
                )}

                {selectedLog.metadata && (
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Metadata</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      <pre className="bg-gray-50 p-2 rounded">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommunicationLogs;