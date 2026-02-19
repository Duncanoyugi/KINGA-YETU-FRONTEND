import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  MapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { StatsCard } from '@/components/widgets/StatsCard';
import { ActivityChart } from '@/components/widgets/ActivityChart';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { ROUTES } from '@/routing/routes';

export const CountyAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCounty] = useState('Nairobi');
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for county dashboard
  const facilityStats = [
    { name: 'Nairobi Hospital', coverage: 94, status: 'excellent', children: 1245 },
    { name: 'Kenyatta National', coverage: 91, status: 'excellent', children: 2341 },
    { name: 'Mbagathi Hospital', coverage: 78, status: 'good', children: 876 },
    { name: 'Pumwani Maternity', coverage: 82, status: 'good', children: 1543 },
    { name: 'Mathare Clinic', coverage: 65, status: 'needs-improvement', children: 432 },
  ];

  const subCountyStats = [
    { name: 'Westlands', coverage: 88, facilities: 12, population: 145000 },
    { name: 'Langata', coverage: 82, facilities: 8, population: 98000 },
    { name: 'Kasarani', coverage: 79, facilities: 15, population: 187000 },
    { name: 'Embakasi', coverage: 75, facilities: 10, population: 156000 },
    { name: 'Dagoretti', coverage: 71, facilities: 7, population: 89000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCounty} County Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor immunization coverage across the county
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<DocumentChartBarIcon className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.COVERAGE_REPORTS)}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* County Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Coverage"
          value="82%"
          icon={<ChartBarIcon className="h-6 w-6" />}
          color="primary"
          trend={{
            value: 5,
            direction: 'up',
            label: 'vs target',
          }}
        />
        <StatsCard
          title="Active Facilities"
          value="52"
          icon={<BuildingOfficeIcon className="h-6 w-6" />}
          color="success"
        />
        <StatsCard
          title="Health Workers"
          value="387"
          icon={<UserGroupIcon className="h-6 w-6" />}
          color="info"
          trend={{
            value: 12,
            direction: 'up',
            label: 'this year',
          }}
        />
        <StatsCard
          title="Children Registered"
          value="45,892"
          icon={<BeakerIcon className="h-6 w-6" />}
          color="warning"
        />
      </div>

      {/* Performance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Attention needed:</span> 3 facilities have coverage below 70%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <span className="font-medium">Positive trend:</span> Coverage improved by 5% this month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sub-county Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <Card.Header title="Sub-county Performance" />
            <Card.Body>
              <div className="space-y-4">
                {subCountyStats.map((subCounty) => (
                  <div key={subCounty.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{subCounty.name}</span>
                      <span className="text-gray-600">{subCounty.coverage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          subCounty.coverage >= 85 ? 'bg-green-600' :
                          subCounty.coverage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${subCounty.coverage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{subCounty.facilities} facilities</span>
                      <span>{subCounty.population.toLocaleString()} pop</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Quick Actions" />
            <Card.Body>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<BuildingOfficeIcon className="h-4 w-4" />}
                  onClick={() => navigate(ROUTES.FACILITY_MANAGEMENT)}
                >
                  Manage Facilities
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<UserGroupIcon className="h-4 w-4" />}
                  onClick={() => navigate(ROUTES.USER_MANAGEMENT)}
                >
                  Manage Health Workers
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<MapIcon className="h-4 w-4" />}
                  onClick={() => navigate(ROUTES.GEOGRAPHIC_ANALYTICS)}
                >
                  View Geographic Data
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right Column - Charts and Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Chart */}
          <ActivityChart
            title="Vaccination Trends by Sub-county"
            data={[
              { date: 'Jan', vaccinations: 2450, registrations: 820, appointments: 1900 },
              { date: 'Feb', vaccinations: 2820, registrations: 950, appointments: 2100 },
              { date: 'Mar', vaccinations: 2680, registrations: 880, appointments: 1950 },
              { date: 'Apr', vaccinations: 3010, registrations: 1020, appointments: 2250 },
              { date: 'May', vaccinations: 2850, registrations: 940, appointments: 2150 },
              { date: 'Jun', vaccinations: 3150, registrations: 1100, appointments: 2400 },
            ]}
            height={300}
          />

          {/* Facility Performance Table */}
          <Card>
            <Card.Header
              title="Facility Performance"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.FACILITY_REPORTS)}
                >
                  View All
                </Button>
              }
            />
            <Card.Body>
              <Table
                data={facilityStats}
                columns={[
                  { header: 'Facility', accessor: (row) => row.name },
                  {
                    header: 'Coverage',
                    accessor: (row) => (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              row.coverage >= 85 ? 'bg-green-600' :
                              row.coverage >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${row.coverage}%` }}
                          />
                        </div>
                        <span>{row.coverage}%</span>
                      </div>
                    ),
                  },
                  {
                    header: 'Status',
                    accessor: (row) => (
                      <Badge
                        variant={
                          row.status === 'excellent' ? 'success' :
                          row.status === 'good' ? 'warning' : 'danger'
                        }
                      >
                        {row.status}
                      </Badge>
                    ),
                  },
                  {
                    header: 'Children',
                    accessor: (row) => row.children.toLocaleString(),
                  },
                ]}
              />
            </Card.Body>
          </Card>

          {/* Resource Distribution */}
          <Card>
            <Card.Header title="Resource Distribution" />
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-gray-600">Vaccine Fridges</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Cold Chain Trucks</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Mobile Clinics</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Target vs Achievement */}
      <Card>
        <Card.Header title="Target vs Achievement by Sub-county" />
        <Card.Body>
          <div className="space-y-4">
            {subCountyStats.map((subCounty) => (
              <div key={subCounty.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">{subCounty.name}</span>
                  <span className="text-gray-600">
                    {subCounty.coverage}% vs 85% target
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full"
                        style={{ width: `${subCounty.coverage}%` }}
                      />
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-700">
                      {subCounty.coverage >= 85 ? '✓' : '⚠️'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CountyAdminDashboard;