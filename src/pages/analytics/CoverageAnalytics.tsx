import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import type { AnalyticsRequest, CoverageAnalytics as CoverageAnalyticsData } from '@/features/analytics/analyticsTypes';
import { useCoverageAnalytics } from '@/features/analytics/analyticsHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { HeatMap } from '@/components/charts/HeatMap';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { formatPercentage } from '@/utils/formatHelpers';

const timeRanges = [
  { value: 'month', label: 'Last 30 Days' },
  { value: 'quarter', label: 'Last Quarter' },
  { value: 'year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

const regions = [
  { value: 'all', label: 'All Regions' },
  { value: 'nairobi', label: 'Nairobi' },
  { value: 'mombasa', label: 'Mombasa' },
  { value: 'kisumu', label: 'Kisumu' },
  { value: 'nakuru', label: 'Nakuru' },
  { value: 'uasingishu', label: 'Uasin Gishu' },
];

export const CoverageAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { coverage, isLoading, refetch } = useCoverageAnalytics({
    timeframe: timeRange === 'custom' ? 'month' : timeRange as AnalyticsRequest['timeframe'],
    startDate: timeRange === 'custom' ? dateRange.startDate : new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: timeRange === 'custom' ? dateRange.endDate : new Date().toISOString().split('T')[0],
    county: selectedRegion !== 'all' ? selectedRegion : undefined,
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'by-vaccine', label: 'By Vaccine' },
    { id: 'by-region', label: 'Regional Coverage' },
    { id: 'by-age', label: 'By Age Group' },
    { id: 'timeline', label: 'Timeline' },
  ];

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    showToast({
      type: 'info',
      message: `Exporting coverage analytics as ${format.toUpperCase()}...`,
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
          <h1 className="text-2xl font-bold text-gray-900">Coverage Analytics</h1>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
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
                onChange={(e) => setTimeRange(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
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

      {/* Summary Cards */}
      {coverage && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatPercentage(coverage.overall.rate)}
              </div>
              <div className="text-sm text-gray-600">Overall Coverage</div>
              <div className="text-xs text-gray-500 mt-1">
                Target: {formatPercentage(90)}%
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {coverage.overall.covered.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Children Immunized</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {coverage.overall.partiallyCovered.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Partially Immunized</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {coverage.overall.uncovered.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Not Immunized</div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && coverage && (
          <div className="space-y-6">
            {/* Coverage by Age Group */}
            <Card>
              <Card.Header title="Coverage by Age Group" />
              <Card.Body>
                <BarChart
                  data={coverage.byAgeGroup.map((item: CoverageAnalyticsData['byAgeGroup'][number]) => ({
                    label: item.ageGroup,
                    value: item.rate,
                  }))}
                  height={300}
                  showValues
                />
              </Card.Body>
            </Card>

            {/* Coverage by Region */}
            <Card>
              <Card.Header title="Regional Coverage" />
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Table
                      data={coverage.byRegion}
                      columns={[
                        { header: 'Region', accessor: (row) => row.region },
                        {
                          header: 'Coverage',
                          accessor: (row) => (
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-primary-600 rounded-full h-2"
                                  style={{ width: `${row.coverage}%` }}
                                />
                              </div>
                              <span>{formatPercentage(row.coverage)}</span>
                            </div>
                          ),
                        },
                        {
                          header: 'Trend',
                          accessor: (row) => (
                            <span
                              className={
                                row.trend === 'up' ? 'text-green-600' :
                                row.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              }
                            >
                              {row.trend === 'up' ? '↑' : row.trend === 'down' ? '↓' : '→'}
                            </span>
                          ),
                        },
                      ]}
                    />
                  </div>
                  <div>
                    <PieChart
                      data={coverage.byRegion.map((item: CoverageAnalyticsData['byRegion'][number]) => ({
                        label: item.region,
                        value: item.children,
                      }))}
                      title="Population Distribution"
                      size={250}
                      donut
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'by-vaccine' && coverage && (
          <Card>
            <Card.Header title="Vaccine Coverage Details" />
            <Card.Body>
              <div className="space-y-6">
                {coverage.byVaccine.map((vaccine: CoverageAnalyticsData['byVaccine'][number]) => (
                  <div key={vaccine.vaccineId}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium text-gray-900">{vaccine.vaccineName}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          Target: {vaccine.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          Administered: {vaccine.administered.toLocaleString()}
                        </span>
                        <Badge
                          variant={
                            vaccine.coverage >= 90 ? 'success' :
                            vaccine.coverage >= 75 ? 'warning' : 'danger'
                          }
                        >
                          {formatPercentage(vaccine.coverage)}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          vaccine.coverage >= 90 ? 'bg-green-600' :
                          vaccine.coverage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${vaccine.coverage}%` }}
                      />
                    </div>
                    {vaccine.trend !== 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        Trend: {vaccine.trend > 0 ? '+' : ''}{vaccine.trend}% from last period
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'by-region' && coverage && (
          <Card>
            <Card.Header title="Regional Coverage Heat Map" />
            <Card.Body>
              <HeatMap
                data={coverage.byRegion.map((item: CoverageAnalyticsData['byRegion'][number]) => ({
                  x: item.region,
                  y: 'Coverage',
                  value: item.coverage,
                }))}
                width={800}
                height={400}
                xAxisLabel="Region"
                yAxisLabel=""
                showValues
              />
            </Card.Body>
          </Card>
        )}

        {activeTab === 'by-age' && coverage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Coverage by Age Group" />
              <Card.Body>
                <PieChart
                  data={coverage.byAgeGroup.map((item: CoverageAnalyticsData['byAgeGroup'][number]) => ({
                    label: item.ageGroup,
                    value: item.covered,
                  }))}
                  size={300}
                  donut
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Age Group Details" />
              <Card.Body>
                <Table
                  data={coverage.byAgeGroup}
                  columns={[
                    { header: 'Age Group', accessor: (row) => row.ageGroup },
                    { header: 'Population', accessor: (row) => row.population.toLocaleString() },
                    { header: 'Covered', accessor: (row) => row.covered.toLocaleString() },
                    {
                      header: 'Coverage',
                      accessor: (row) => (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-600 rounded-full h-2"
                              style={{ width: `${row.rate}%` }}
                            />
                          </div>
                          <span>{formatPercentage(row.rate)}</span>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && coverage && (
          <Card>
            <Card.Header title="Coverage Timeline" />
            <Card.Body>
              <LineChart
                series={[
                  {
                    name: 'Coverage Rate',
                    data: coverage.timeline.map((item: CoverageAnalyticsData['timeline'][number]) => ({
                      label: item.date,
                      value: item.coverage,
                    })),
                    color: '#3b82f6',
                  },
                  {
                    name: 'Target',
                    data: coverage.timeline.map((item: CoverageAnalyticsData['timeline'][number]) => ({
                      label: item.date,
                      value: item.target,
                    })),
                    color: '#ef4444',
                  },
                ]}
                height={400}
                showLegend
                showGrid
                smooth
                xAxisLabel="Date"
                yAxisLabel="Coverage (%)"
              />
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoverageAnalyticsPage;