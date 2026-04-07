import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useFacilityPerformance } from '@/features/reports/reportsHooks';
import { useGetFacilitiesQuery } from '@/features/facilities/facilitiesHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Table } from '@/components/common/Table';
import { BarChart } from '@/components/charts/BarChart';

interface Facility {
  id: string;
  name: string;
  type: string;
  code?: string;
  mflCode?: string;
}

export const FacilityReports: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const { data: facilities = [] } = useGetFacilitiesQuery(undefined);

  const { data: performanceData, isLoading, refetch } = useFacilityPerformance(
    selectedFacility?.id || '',
    {
      dateRange,
    }
  );

  const handleGenerateReport = () => {
    if (!selectedFacility) {
      showToast({
        type: 'warning',
        message: 'Please select a facility first',
      });
      return;
    }
    refetch();
    showToast({
      type: 'success',
      message: 'Report generated successfully',
    });
  };

  const handleExport = () => {
    showToast({
      type: 'info',
      message: 'Use the recent reports list on the reports dashboard to download generated files.',
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Facility Performance Reports</h1>
        </div>
        {selectedFacility && (
          <Button
            variant="outline"
            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            onClick={handleExport}
          >
            Export Report
          </Button>
        )}
      </div>

      {/* Facility Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Card.Header title="Select Facility" />
            <Card.Body>
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => setSelectedFacility({
                      id: facility.id,
                      name: facility.name,
                      type: facility.type,
                      code: facility.code,
                      mflCode: facility.code,
                    })}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-colors
                      ${
                        selectedFacility?.id === facility.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{facility.name}</p>
                        <p className="text-sm text-gray-500">
                          {facility.type} • MFL: {facility.mflCode}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!selectedFacility ? (
            <Card>
              <Card.Body className="text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No Facility Selected
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Please select a facility from the list to view its performance report
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <Card.Body>
                  <div className="grid grid-cols-3 gap-4">
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
                    <div className="flex items-end">
                      <Button variant="primary" onClick={handleGenerateReport} className="w-full">
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Performance Data */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" />
                </div>
              ) : performanceData && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-primary-600">
                          {performanceData.coverageRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Coverage Rate</div>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {performanceData.totalImmunizations}
                        </div>
                        <div className="text-sm text-gray-600">Total Immunizations</div>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {performanceData.timelinessRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Timeliness Rate</div>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {performanceData.performanceScore.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Performance Score</div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Monthly Performance Chart */}
                  <Card>
                    <Card.Header title="Monthly Performance" />
                    <Card.Body>
                      <BarChart
                        data={performanceData.monthlyTrends.map((m: any) => ({
                          label: m.month,
                          value: m.immunizations,
                        }))}
                        height={300}
                        showValues
                      />
                    </Card.Body>
                  </Card>

                  {/* Vaccine Breakdown */}
                  <Card>
                    <Card.Header title="Vaccine Breakdown" />
                    <Card.Body>
                      <Table
                        data={performanceData.vaccineBreakdown}
                        columns={[
                          { header: 'Vaccine', accessor: (row) => row.vaccineName },
                          { header: 'Count', accessor: (row) => row.count },
                          {
                            header: 'Share',
                            accessor: (row) => (
                              <span className="font-medium">{row.percentage.toFixed(1)}%</span>
                            ),
                          },
                        ]}
                      />
                    </Card.Body>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <Card.Header title="Recommendations" />
                    <Card.Body>
                      <div className="space-y-3">
                        {performanceData.recommendations.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No recommendations available for this period.
                          </p>
                        ) : (
                          performanceData.recommendations.map((recommendation: string) => (
                            <div
                              key={recommendation}
                              className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
                            >
                              {recommendation}
                            </div>
                          ))
                        )}
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Rankings */}
                  <Card>
                    <Card.Header title="Facility Rankings" />
                    <Card.Body>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {performanceData.ranking ? `#${performanceData.ranking}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">Current Rank</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {performanceData.totalRanked || 0}
                          </div>
                          <div className="text-sm text-gray-600">Facilities Ranked</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacilityReports;
