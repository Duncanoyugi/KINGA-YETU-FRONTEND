import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useFacilityPerformance } from '@/features/reports/reportsHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { BarChart } from '@/components/charts/BarChart';

interface Facility {
  id: string;
  name: string;
  type: string;
  mflCode: string;
}

const mockFacilities: Facility[] = [
  { id: 'fac1', name: 'Nairobi Hospital', type: 'Hospital', mflCode: '12345' },
  { id: 'fac2', name: 'Kenyatta National', type: 'National Referral', mflCode: '12346' },
  { id: 'fac3', name: 'Mombasa Hospital', type: 'Hospital', mflCode: '12347' },
  { id: 'fac4', name: 'Kisumu Clinic', type: 'Clinic', mflCode: '12348' },
];

export const FacilityReports: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: performanceData, isLoading, refetch } = useFacilityPerformance(
    selectedFacility?.id || '',
    {
      dateRange,
      groupBy: 'month',
    }
  );

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacility(facility);
  };

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
      message: 'Exporting report...',
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
                {mockFacilities.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => handleSelectFacility(facility)}
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
                          {performanceData.summary.coverageRate}%
                        </div>
                        <div className="text-sm text-gray-600">Coverage Rate</div>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {performanceData.summary.totalVaccinations}
                        </div>
                        <div className="text-sm text-gray-600">Total Vaccinations</div>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {performanceData.summary.uniqueChildren}
                        </div>
                        <div className="text-sm text-gray-600">Unique Children</div>
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Body className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {performanceData.summary.wastageRate}%
                        </div>
                        <div className="text-sm text-gray-600">Wastage Rate</div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Monthly Performance Chart */}
                  <Card>
                    <Card.Header title="Monthly Performance" />
                    <Card.Body>
                      <BarChart
                        data={performanceData.monthly.map(m => ({
                          label: m.month,
                          value: m.vaccinations,
                        }))}
                        height={300}
                        showValues
                      />
                    </Card.Body>
                  </Card>

                  {/* Vaccine Stock */}
                  <Card>
                    <Card.Header title="Vaccine Stock Status" />
                    <Card.Body>
                      <Table
                        data={performanceData.vaccineStock}
                        columns={[
                          { header: 'Vaccine', accessor: (row) => row.vaccineName },
                          { header: 'Opening', accessor: (row) => row.openingStock },
                          { header: 'Received', accessor: (row) => row.received },
                          { header: 'Administered', accessor: (row) => row.administered },
                          { header: 'Wastage', accessor: (row) => row.wastage },
                          {
                            header: 'Closing',
                            accessor: (row) => (
                              <span className="font-medium">{row.closingStock}</span>
                            ),
                          },
                        ]}
                      />
                    </Card.Body>
                  </Card>

                  {/* Staff Performance */}
                  <Card>
                    <Card.Header title="Staff Performance" />
                    <Card.Body>
                      <Table
                        data={performanceData.staff}
                        columns={[
                          { header: 'Name', accessor: (row) => row.name },
                          { header: 'Role', accessor: (row) => row.role },
                          { header: 'Vaccinations', accessor: (row) => row.vaccinations },
                          {
                            header: 'Avg/Day',
                            accessor: (row) => row.averagePerDay.toFixed(1),
                          },
                          {
                            header: 'Performance',
                            accessor: (row) => {
                              const performance = (row.vaccinations / row.averagePerDay) * 100;
                              return (
                                <Badge
                                  variant={
                                    performance > 100 ? 'success' :
                                    performance > 80 ? 'warning' : 'danger'
                                  }
                                >
                                  {performance > 100 ? 'Above Target' :
                                   performance > 80 ? 'Meeting Target' : 'Below Target'}
                                </Badge>
                              );
                            },
                          },
                        ]}
                      />
                    </Card.Body>
                  </Card>

                  {/* Rankings */}
                  <Card>
                    <Card.Header title="Facility Rankings" />
                    <Card.Body>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            #{performanceData.rankings.withinCounty}
                          </div>
                          <div className="text-sm text-gray-600">Within County</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            #{performanceData.rankings.withinRegion}
                          </div>
                          <div className="text-sm text-gray-600">Within Region</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            #{performanceData.rankings.nationally}
                          </div>
                          <div className="text-sm text-gray-600">Nationally</div>
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