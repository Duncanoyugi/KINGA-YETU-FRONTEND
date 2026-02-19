import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useDropoutAnalytics } from '@/features/analytics/analyticsHooks';
import type { DropoutAnalytics as DropoutAnalyticsType } from '@/features/analytics/analyticsTypes';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Alert } from '@/components/common/Alert';
import { Tabs } from '@/components/common/Tabs';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatPercentage } from '@/utils/formatHelpers';
import { ROUTES } from '@/routing/routes';

const timeRanges = [
  { value: 'month', label: 'Last 30 Days' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

type TimeRange = 'month' | 'quarter' | 'year' | 'custom';

export const DropoutAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { dropout, isLoading, refetch } = useDropoutAnalytics({
    timeframe: timeRange === 'custom' ? undefined : timeRange as 'month' | 'quarter' | 'year' | 'week' | 'today',
    startDate: timeRange === 'custom' ? dateRange.startDate : new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: timeRange === 'custom' ? dateRange.endDate : new Date().toISOString().split('T')[0],
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'by-vaccine', label: 'By Vaccine' },
    { id: 'by-facility', label: 'By Facility' },
    { id: 'reasons', label: 'Reasons & Factors' },
  ];

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    showToast({
      type: 'info',
      message: `Exporting dropout analytics as ${format.toUpperCase()}...`,
    });
  };

  const handleGenerateReport = () => {
    refetch();
    showToast({
      type: 'success',
      message: 'Analytics updated successfully',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Dropout Analytics</h1>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as unknown as TimeRange)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {timeRange === 'custom' && (
              <>
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
              </>
            )}

            <div className="flex items-end">
              <Button variant="primary" onClick={handleGenerateReport} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Critical Alert */}
      {dropout && dropout.overall.rate > 20 && (
        <Alert
          variant="danger"
          title="High Dropout Rate Detected"
          message={`Overall dropout rate is ${formatPercentage(dropout.overall.rate)}. Immediate action required.`}
        />
      )}

      {/* Summary Cards */}
      {dropout && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatPercentage(dropout.overall.rate)}
              </div>
              <div className="text-sm text-gray-600">Overall Dropout Rate</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dropout.overall.totalDropouts.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Dropouts</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dropout.overall.totalEnrolled.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Enrolled</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dropout.byVaccine.length}
              </div>
              <div className="text-sm text-gray-600">Vaccines Tracked</div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && dropout && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Dropout Rate by Vaccine" />
              <Card.Body>
                <BarChart
                  data={dropout.byVaccine.map((item: DropoutAnalyticsType['byVaccine'][number]) => ({
                    label: item.vaccineName,
                    value: item.dropoutRate,
                  }))}
                  height={300}
                  showValues
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Dropout Distribution" />
              <Card.Body>
                <PieChart
                  data={dropout.byVaccine.map((item: DropoutAnalyticsType['byVaccine'][number]) => ({
                    label: item.vaccineName,
                    value: item.droppedCount,
                  }))}
                  size={300}
                  donut
                />
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'by-vaccine' && dropout && (
          <Card>
            <Card.Header title="Vaccine-Specific Dropout Rates" />
            <Card.Body>
              <Table
                data={dropout.byVaccine}
                columns={[
                  { header: 'Vaccine', accessor: (row) => row.vaccineName },
                  {
                    header: 'Dropout Rate',
                    accessor: (row) => (
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              row.dropoutRate > 20 ? 'bg-red-600' :
                              row.dropoutRate > 10 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${row.dropoutRate}%` }}
                          />
                        </div>
                        <span>{formatPercentage(row.dropoutRate)}</span>
                      </div>
                    ),
                  },
                  { header: 'Dropped', accessor: (row) => row.droppedCount.toLocaleString() },
                  { header: 'Total', accessor: (row) => row.totalCount.toLocaleString() },
                  {
                    header: 'Trend',
                    accessor: (row) => (
                      <Badge
                        variant={
                          row.trend === 'improving' ? 'success' :
                          row.trend === 'worsening' ? 'danger' : 'default'
                        }
                      >
                        {row.trend}
                      </Badge>
                    ),
                  },
                ]}
              />
            </Card.Body>
          </Card>
        )}

        {activeTab === 'by-facility' && dropout && (
          <Card>
            <Card.Header title="Facility Performance" />
            <Card.Body>
              <Table
                data={dropout.byFacility}
                columns={[
                  { header: 'Facility', accessor: (row) => row.facilityName },
                  {
                    header: 'Dropout Rate',
                    accessor: (row) => (
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              row.dropoutRate > 20 ? 'bg-red-600' :
                              row.dropoutRate > 10 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${row.dropoutRate}%` }}
                          />
                        </div>
                        <span>{formatPercentage(row.dropoutRate)}</span>
                      </div>
                    ),
                  },
                  {
                    header: 'Performance',
                    accessor: (row) => {
                      const performance = row.dropoutRate <= 10 ? 'good' : row.dropoutRate <= 20 ? 'average' : 'poor';
                      return (
                        <Badge
                          variant={performance === 'good' ? 'success' : performance === 'average' ? 'warning' : 'danger'}
                        >
                          {performance}
                        </Badge>
                      );
                    },
                  },
                  {
                    header: 'Trend',
                    accessor: (row) => (
                      <span
                        className={
                          row.trend === 'improving' ? 'text-green-600' :
                          row.trend === 'worsening' ? 'text-red-600' : 'text-gray-600'
                        }
                      >
                        {row.trend === 'improving' ? '↑' :
                         row.trend === 'worsening' ? '↓' : '→'}
                      </span>
                    ),
                  },
                  {
                    header: 'Actions',
                    accessor: (row) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(ROUTES.FACILITY_DETAILS.replace(':id', row.facilityId))}
                      >
                        View Details
                      </Button>
                    ),
                  },
                ]}
              />
            </Card.Body>
          </Card>
        )}

        {activeTab === 'reasons' && dropout && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Dropout Reasons" />
              <Card.Body>
                <div className="space-y-4">
                  {dropout.reasons.map((reason: DropoutAnalyticsType['reasons'][number]) => (
                    <div key={reason.reason}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{reason.reason}</span>
                        <span className="font-medium">{formatPercentage(reason.percentage)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${reason.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Risk Factors" />
              <Card.Body>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">High Risk Factors</h4>
                    <ul className="space-y-2 text-sm text-red-700">
                      <li className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Previous missed appointments
                      </li>
                      <li className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Transportation difficulties
                      </li>
                      <li className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Lack of awareness
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Medium Risk Factors</h4>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Single parent household
                      </li>
                      <li className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                        Low income
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Protective Factors</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>Regular reminders</li>
                      <li>Support from community health workers</li>
                      <li>Health education</li>
                    </ul>
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

export default DropoutAnalytics;