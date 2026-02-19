import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useMissedVaccinesReport } from '@/features/reports/reportsHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Alert } from '@/components/common/Alert';
import { Tabs } from '@/components/common/Tabs';
import { formatDate } from '@/utils/dateHelpers';

interface DateRange {
  startDate: string;
  endDate: string;
}

export const MissedVaccinesReport: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: missedData, isLoading, refetch, getCriticalMisses } = useMissedVaccinesReport({
    dateRange,
    facilityIds: selectedFacility !== 'all' ? [selectedFacility] : undefined,
  });

  const tabs = [
    { id: 'list', label: 'Missed Vaccinations' },
    { id: 'by-facility', label: 'By Facility' },
    { id: 'critical', label: 'Critical Cases' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const facilities = [
    { id: 'all', name: 'All Facilities' },
    { id: 'fac1', name: 'Nairobi Hospital' },
    { id: 'fac2', name: 'Kenyatta National' },
    { id: 'fac3', name: 'Mombasa Hospital' },
  ];

  const handleGenerateReport = () => {
    refetch();
    showToast({
      type: 'success',
      message: 'Report updated successfully',
    });
  };

  const handleSendReminder = (parentContact: string, type: 'sms' | 'email') => {
    // In a real application, this would call an API to send the reminder
    console.log(`Sending ${type} reminder to ${parentContact}`);
    showToast({
      type: 'info',
      message: `Reminder sent via ${type.toUpperCase()} to ${parentContact}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const criticalMisses = missedData ? getCriticalMisses() : [];

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
          <h1 className="text-2xl font-bold text-gray-900">Missed Vaccinations Report</h1>
        </div>
        <Button
          variant="outline"
          leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
          onClick={() => {/* Handle export */}}
        >
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {facilities.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="primary" onClick={handleGenerateReport} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Summary Stats */}
      {missedData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {missedData.summary.totalMissed}
              </div>
              <div className="text-sm text-gray-600">Total Missed</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {missedData.summary.uniqueChildren}
              </div>
              <div className="text-sm text-gray-600">Affected Children</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {missedData.summary.mostMissedVaccine}
              </div>
              <div className="text-sm text-gray-600">Most Missed</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {missedData.summary.averageDelay} days
              </div>
              <div className="text-sm text-gray-600">Avg. Delay</div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Critical Alerts */}
      {criticalMisses.length > 0 && (
        <Alert
          variant="danger"
          title="Critical Missed Vaccinations"
          message={`${criticalMisses.length} children have missed vaccinations by more than 30 days. Immediate action required.`}
        />
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'list' && missedData && (
          <Card>
            <Card.Header title="Missed Vaccinations List" />
            <Card.Body>
              <Table
                data={missedData.missedVaccines}
                columns={[
                  {
                    header: 'Child',
                    accessor: (row) => (
                      <div>
                        <div className="font-medium text-gray-900">{row.childName}</div>
                        <div className="text-sm text-gray-500">ID: {row.childId}</div>
                      </div>
                    ),
                  },
                  {
                    header: 'Vaccine',
                    accessor: (row) => row.vaccineName,
                  },
                  {
                    header: 'Due Date',
                    accessor: (row) => (
                      <div>
                        <div>{formatDate(row.dueDate)}</div>
                        <Badge
                          variant={row.daysOverdue > 30 ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {row.daysOverdue} days overdue
                        </Badge>
                      </div>
                    ),
                  },
                  {
                    header: 'Facility',
                    accessor: (row) => row.facilityName,
                  },
                  {
                    header: 'Parent Contact',
                    accessor: (row) => (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendReminder(row.parentContact, 'sms')}
                          className="p-1 text-gray-400 hover:text-primary-600"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSendReminder(row.parentContact, 'email')}
                          className="p-1 text-gray-400 hover:text-primary-600"
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            </Card.Body>
          </Card>
        )}

        {activeTab === 'by-facility' && missedData && (
          <Card>
            <Card.Header title="Missed Vaccinations by Facility" />
            <Card.Body>
              <Table
                data={missedData.byFacility}
                columns={[
                  {
                    header: 'Facility',
                    accessor: (row) => row.facilityName,
                  },
                  {
                    header: 'Missed Count',
                    accessor: (row) => (
                      <Badge variant="danger">{row.missedCount}</Badge>
                    ),
                  },
                  {
                    header: 'Total Appointments',
                    accessor: (row) => row.totalAppointments,
                  },
                  {
                    header: 'Missed Rate',
                    accessor: (row) => (
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              row.missedRate > 20 ? 'bg-red-600' :
                              row.missedRate > 10 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${row.missedRate}%` }}
                          />
                        </div>
                        <span>{row.missedRate.toFixed(1)}%</span>
                      </div>
                    ),
                  },
                ]}
              />
            </Card.Body>
          </Card>
        )}

        {activeTab === 'critical' && missedData && (
          <Card>
            <Card.Header title="Critical Cases (>30 days overdue)" />
            <Card.Body>
              {criticalMisses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No critical cases found
                </p>
              ) : (
                <div className="space-y-4">
                  {criticalMisses.map((miss, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{miss.childName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {miss.vaccineName} - Due: {formatDate(miss.dueDate)}
                          </p>
                          <p className="text-sm text-red-600 font-medium mt-1">
                            {miss.daysOverdue} days overdue
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<PhoneIcon className="h-4 w-4" />}
                            onClick={() => handleSendReminder(miss.parentContact, 'sms')}
                          >
                            SMS
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                            onClick={() => handleSendReminder(miss.parentContact, 'email')}
                          >
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {activeTab === 'analytics' && missedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Delay Distribution" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">1-7 days</span>
                    <span className="font-medium">
                      {missedData.missedVaccines.filter(m => m.daysOverdue <= 7).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (missedData.missedVaccines.filter(m => m.daysOverdue <= 7).length /
                            missedData.missedVaccines.length) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">8-30 days</span>
                    <span className="font-medium">
                      {missedData.missedVaccines.filter(m => m.daysOverdue > 7 && m.daysOverdue <= 30).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (missedData.missedVaccines.filter(m => m.daysOverdue > 7 && m.daysOverdue <= 30).length /
                            missedData.missedVaccines.length) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">&gt;30 days</span>
                    <span className="font-medium">
                      {missedData.missedVaccines.filter(m => m.daysOverdue > 30).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (missedData.missedVaccines.filter(m => m.daysOverdue > 30).length /
                            missedData.missedVaccines.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Common Reasons" />
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forgot appointment</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport issues</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Child sick</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No vaccine available</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissedVaccinesReport;