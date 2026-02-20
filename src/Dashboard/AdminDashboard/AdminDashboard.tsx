import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { useAnalyticsDashboard } from '@/features/analytics/analyticsHooks';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { StatsCard } from '@/components/widgets/StatsCard';
import { ActivityChart } from '@/components/widgets/ActivityChart';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components';
import ROUTES from '@/routing/routes';

const timeRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

// Helper to convert timeframe to date range
const getDateRange = (timeframe: string): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate: string;
  
  switch (timeframe) {
    case 'today':
      startDate = endDate;
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = weekAgo.toISOString().split('T')[0];
      break;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      startDate = monthAgo.toISOString().split('T')[0];
      break;
    case 'quarter':
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      startDate = quarterAgo.toISOString().split('T')[0];
      break;
    case 'year':
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      startDate = yearAgo.toISOString().split('T')[0];
      break;
    default:
      startDate = endDate;
  }
  
  return { startDate, endDate };
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Convert timeframe to date range for the API
  const dateRange = getDateRange(timeRange);

  const { isLoading } = useAnalyticsDashboard({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'users', label: 'Users' },
    { id: 'system', label: 'System' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero/Header with Unsplash background */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg h-56 md:h-64 flex items-center justify-between bg-gradient-to-r from-primary-600/90 to-secondary-600/80">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Admin Dashboard Hero"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="relative z-10 flex-1 px-8 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-white/90 max-w-xl drop-shadow">
            System overview, analytics, and management controls for your organization.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-44 pl-3 pr-10 py-2 text-base border-0 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white/90 text-gray-900"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Cog6ToothIcon className="h-5 w-5" />}
              className="bg-accent-600 hover:bg-accent-700 text-white shadow"
              onClick={() => navigate(ROUTES.SYSTEM_CONFIG)}
            >
              System Settings
            </Button>
          </div>
        </div>
        <div className="hidden md:block relative z-10 w-1/3 h-full">
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
            alt="Analytics Visual"
            className="absolute right-0 top-0 h-full w-full object-cover object-right rounded-l-2xl opacity-80 shadow-lg"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700/80 to-accent-700/60" />
      </div>

      {/* System Health Alert */}
      <div className="flex items-center gap-3 bg-success-50 border-l-4 border-success-500 p-4 rounded-lg shadow-sm">
        <ShieldCheckIcon className="h-6 w-6 text-success-600" />
        <span className="text-success-800 font-semibold">System Status:</span>
        <span className="text-success-700">All systems operational. Last backup: <span className="font-medium">Today at 02:00 AM</span>.</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Facilities"
          value="156"
          icon={<BuildingOfficeIcon className="h-6 w-6" />}
          color="primary"
          trend={{
            value: 12,
            direction: 'up',
            label: 'this year',
          }}
        />
        <StatsCard
          title="Active Users"
          value="2,847"
          icon={<UserGroupIcon className="h-6 w-6" />}
          color="success"
          trend={{
            value: 18,
            direction: 'up',
            label: 'vs last month',
          }}
        />
        <StatsCard
          title="Vaccinations"
          value="45,892"
          icon={<BeakerIcon className="h-6 w-6" />}
          color="info"
          trend={{
            value: 8,
            direction: 'up',
            label: 'this month',
          }}
        />
        <StatsCard
          title="Coverage Rate"
          value="87%"
          icon={<DocumentChartBarIcon className="h-6 w-6" />}
          color="warning"
          trend={{
            value: 3,
            direction: 'up',
            label: 'vs target',
          }}
        />
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="rounded-lg shadow bg-white/80 p-2" />
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Activity Chart */}
            <ActivityChart
              title="System Activity"
              data={[
                { date: 'Mon', vaccinations: 245, registrations: 82, appointments: 190 },
                { date: 'Tue', vaccinations: 282, registrations: 95, appointments: 210 },
                { date: 'Wed', vaccinations: 268, registrations: 88, appointments: 195 },
                { date: 'Thu', vaccinations: 301, registrations: 102, appointments: 225 },
                { date: 'Fri', vaccinations: 285, registrations: 94, appointments: 215 },
                { date: 'Sat', vaccinations: 158, registrations: 48, appointments: 120 },
                { date: 'Sun', vaccinations: 95, registrations: 25, appointments: 75 },
              ]}
              height={350}
            />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <Card.Header title="Top Performing Facilities" />
                <Card.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nairobi Hospital</span>
                      <span className="font-medium text-gray-900">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kenyatta National</span>
                      <span className="font-medium text-gray-900">91%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mombasa Hospital</span>
                      <span className="font-medium text-gray-900">88%</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Areas Needing Attention" />
                <Card.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">North Eastern</span>
                      <span className="font-medium text-red-600">62%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Coastal Region</span>
                      <span className="font-medium text-yellow-600">71%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Western Region</span>
                      <span className="font-medium text-yellow-600">75%</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="System Resources" />
                <Card.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Storage Used</span>
                      <span className="font-medium text-gray-900">156 GB / 500 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '31%' }} />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-600">API Calls Today</span>
                      <span className="font-medium text-gray-900">45.2k</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Facility Distribution by Type" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hospitals</span>
                    <span className="font-medium text-gray-900">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Health Centers</span>
                    <span className="font-medium text-gray-900">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dispensaries</span>
                    <span className="font-medium text-gray-900">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clinics</span>
                    <span className="font-medium text-gray-900">9</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Facility Status" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Operational</span>
                    <span className="font-medium text-green-600">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Under Maintenance</span>
                    <span className="font-medium text-yellow-600">10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Closed</span>
                    <span className="font-medium text-red-600">4</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="Users by Role" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Parents</span>
                    <span className="font-medium text-gray-900">2,145</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Health Workers</span>
                    <span className="font-medium text-gray-900">567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Facility Admins</span>
                    <span className="font-medium text-gray-900">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">County Admins</span>
                    <span className="font-medium text-gray-900">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">System Admins</span>
                    <span className="font-medium text-gray-900">14</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="User Activity" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Today</span>
                    <span className="font-medium text-gray-900">847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active This Week</span>
                    <span className="font-medium text-gray-900">2,156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New Users (30d)</span>
                    <span className="font-medium text-gray-900">234</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header title="System Performance" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="font-medium text-gray-900">245ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uptime (30d)</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="font-medium text-gray-900">0.02%</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Recent System Events" />
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Backup completed at 02:00 AM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Database optimization at 03:00 AM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Security scan completed</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        <Button
          variant="outline"
          fullWidth
          leftIcon={<BuildingOfficeIcon className="h-5 w-5 text-primary-600" />}
          className="border-primary-300 hover:bg-primary-50"
          onClick={() => navigate(ROUTES.FACILITY_MANAGEMENT)}
        >
          Manage Facilities
        </Button>
        <Button
          variant="outline"
          fullWidth
          leftIcon={<UserGroupIcon className="h-5 w-5 text-secondary-600" />}
          className="border-secondary-300 hover:bg-secondary-50"
          onClick={() => navigate(ROUTES.USER_MANAGEMENT)}
        >
          Manage Users
        </Button>
        <Button
          variant="outline"
          fullWidth
          leftIcon={<DocumentChartBarIcon className="h-5 w-5 text-accent-600" />}
          className="border-accent-300 hover:bg-accent-50"
          onClick={() => navigate(ROUTES.REPORTS_DASHBOARD)}
        >
          View Reports
        </Button>
        <Button
          variant="outline"
          fullWidth
          leftIcon={<MapIcon className="h-5 w-5 text-info-600" />}
          className="border-info-300 hover:bg-info-50"
          onClick={() => navigate(ROUTES.ANALYTICS_OVERVIEW)}
        >
          Analytics
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;