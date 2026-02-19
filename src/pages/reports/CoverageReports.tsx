import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useCoverageReport } from '@/features/reports/reportsHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Table } from '@/components/common/Table';
import { Tabs } from '@/components/common/Tabs';
import { formatPercentage } from '@/utils/formatHelpers';

interface DateRange {
  startDate: string;
  endDate: string;
}

export const CoverageReports: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: coverageData, isLoading, refetch } = useCoverageReport({
    dateRange,
    groupBy: 'month',
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'by-vaccine', label: 'By Vaccine' },
    { id: 'by-region', label: 'By Region' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'demographics', label: 'Demographics' },
  ];

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerateReport = () => {
    refetch();
    showToast({
      type: 'success',
      message: 'Report generated successfully',
    });
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    showToast({
      type: 'info',
      message: `Exporting as ${format.toUpperCase()}...`,
    });
    // Implement export logic
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
          <h1 className="text-2xl font-bold text-gray-900">Coverage Reports</h1>
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
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
              />
            </div>
            <Button variant="primary" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      {coverageData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatPercentage(coverageData.summary.coverageRate)}
              </div>
              <div className="text-sm text-gray-600">Overall Coverage</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {coverageData.summary.fullyImmunized.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Fully Immunized</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {coverageData.summary.partiallyImmunized.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Partially Immunized</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {coverageData.summary.uncovered.toLocaleString()}
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
        {activeTab === 'overview' && coverageData && (
          <div className="space-y-6">
            {/* Coverage by Age Group */}
            <Card>
              <Card.Header title="Coverage by Age Group" />
              <Card.Body>
                <BarChart
                  data={coverageData.byAgeGroup.map(item => ({
                    label: item.ageGroup,
                    value: item.coverage,
                  }))}
                  height={300}
                  showValues
                />
              </Card.Body>
            </Card>

            {/* Vaccine Coverage Table */}
            <Card>
              <Card.Header title="Coverage by Vaccine" />
              <Card.Body>
                <Table
                  data={coverageData.byVaccine}
                  columns={[
                    {
                      header: 'Vaccine',
                      accessor: (row) => row.vaccineName,
                    },
                    {
                      header: 'Target',
                      accessor: (row) => row.target.toLocaleString(),
                    },
                    {
                      header: 'Administered',
                      accessor: (row) => row.administered.toLocaleString(),
                    },
                    {
                      header: 'Coverage',
                      accessor: (row) => (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-600 rounded-full h-2"
                              style={{ width: `${row.coverage}%` }}
                            />
                          </div>
                          <span>{formatPercentage(row.coverage)}</span>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'by-vaccine' && coverageData && (
          <Card>
            <Card.Header title="Vaccine Coverage Details" />
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PieChart
                  data={coverageData.byVaccine.map(v => ({
                    label: v.vaccineName,
                    value: v.administered,
                  }))}
                  title="Distribution by Vaccine"
                  size={300}
                  donut
                />
                <div className="space-y-4">
                  {coverageData.byVaccine.map((vaccine) => (
                    <div key={vaccine.vaccineId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{vaccine.vaccineName}</span>
                        <span className="text-gray-900">{formatPercentage(vaccine.coverage)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            vaccine.coverage >= 90 ? 'bg-green-600' :
                            vaccine.coverage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${vaccine.coverage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Target: {vaccine.target.toLocaleString()}</span>
                        <span>Administered: {vaccine.administered.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'by-region' && coverageData && (
          <Card>
            <Card.Header title="Regional Coverage" />
            <Card.Body>
              <Table
                data={coverageData.byRegion}
                columns={[
                  {
                    header: 'Region',
                    accessor: (row) => row.region,
                  },
                  {
                    header: 'Population',
                    accessor: (row) => row.population.toLocaleString(),
                  },
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
                    header: 'Facilities',
                    accessor: (row) => row.facilities,
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
            </Card.Body>
          </Card>
        )}

        {activeTab === 'timeline' && coverageData && (
          <Card>
            <Card.Header title="Coverage Timeline" />
            <Card.Body>
              <LineChart
                series={[
                  {
                    name: 'Coverage Rate',
                    data: coverageData.timeline.map(item => ({
                      label: item.date,
                      value: item.coverage,
                    })),
                    color: '#3b82f6',
                  },
                  {
                    name: 'Target',
                    data: coverageData.timeline.map(item => ({
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

        {activeTab === 'demographics' && coverageData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Coverage by Age Group" />
              <Card.Body>
                <PieChart
                  data={coverageData.byAgeGroup.map(item => ({
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
                  data={coverageData.byAgeGroup}
                  columns={[
                    { header: 'Age Group', accessor: (row) => row.ageGroup },
                    { header: 'Population', accessor: (row) => row.population.toLocaleString() },
                    { header: 'Covered', accessor: (row) => row.covered.toLocaleString() },
                    {
                      header: 'Coverage',
                      accessor: (row) => formatPercentage(row.coverage),
                    },
                  ]}
                />
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverageReports;