import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  MapIcon,
  UserGroupIcon,
  BeakerIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useAnalyticsDashboard } from '@/features/analytics/analyticsHooks';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { StatsCard } from '@/components/widgets/StatsCard';
import { ActivityChart } from '@/components/widgets/ActivityChart';
import { AlertsWidget } from '@/components/widgets/AlertsWidget';
import { UpcomingVaccinations } from '@/components/widgets/UpcomingVaccinations';
import { RecentActivities } from '@/components/widgets/RecentActivities';
import { ROUTES } from '@/routing/routes';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfDay, endOfDay } from 'date-fns';

type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

// Helper function to get date range from timeframe
const getDateRangeFromTimeframe = (timeframe: TimeRange): { startDate: string; endDate: string } => {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (timeframe) {
    case 'today':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'week':
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
    default:
      start = startOfMonth(now);
      end = endOfMonth(now);
  }

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
  };
};

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

export const AnalyticsOverview: React.FC = () => {
  const navigate = useNavigate();
  useAuth();
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // Calculate date range from timeframe - recalculates when timeRange changes
  const { startDate, endDate } = useMemo(
    () => getDateRangeFromTimeframe(timeRange),
    [timeRange]
  );

  const { kpis, isLoading } = useAnalyticsDashboard({
    timeframe: timeRange,
    startDate,
    endDate,
  });

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    showToast({
      type: 'info',
      message: `Exporting analytics as ${format.toUpperCase()}...`,
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="mt-2 text-sm text-gray-700">
            Key metrics and insights for immunization coverage and performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            onClick={() => handleExport('pdf')}
          >
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Coverage Rate"
            value={`${kpis.coverage.value.toFixed(1)}%`}
            trend={{
              value: kpis.coverage.value - kpis.coverage.target,
              direction: kpis.coverage.value >= kpis.coverage.target ? 'up' : 'down',
              label: `Target: ${kpis.coverage.target}%`,
            }}
            color="primary"
            icon={<ChartBarIcon className="h-6 w-6" />}
          />
          <StatsCard
            title="Dropout Rate"
            value={`${kpis.dropout.value.toFixed(1)}%`}
            trend={{
              value: kpis.dropout.value - kpis.dropout.target,
              direction: kpis.dropout.value <= kpis.dropout.target ? 'down' : 'up',
              label: `Target: ${kpis.dropout.target}%`,
            }}
            color={kpis.dropout.status === 'excellent' ? 'success' : 'warning'}
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
          />
          <StatsCard
            title="Timeliness Rate"
            value={`${kpis.timeliness.value.toFixed(1)}%`}
            trend={{
              value: kpis.timeliness.value - kpis.timeliness.target,
              direction: kpis.timeliness.value >= kpis.timeliness.target ? 'up' : 'down',
              label: `Target: ${kpis.timeliness.target}%`,
            }}
            color="secondary"
            icon={<CalendarIcon className="h-6 w-6" />}
          />
          <StatsCard
            title="Active Children"
            value={kpis.children.active.toLocaleString()}
            trend={{
              value: (kpis.children.active / kpis.children.total) * 100,
              direction: 'up',
              label: `${((kpis.children.active / kpis.children.total) * 100).toFixed(1)}% of total`,
            }}
            color="info"
            icon={<UserGroupIcon className="h-6 w-6" />}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ActivityChart
            title="Vaccination Activity"
            data={[
              { date: 'Mon', vaccinations: 45, registrations: 12, appointments: 38 },
              { date: 'Tue', vaccinations: 52, registrations: 15, appointments: 42 },
              { date: 'Wed', vaccinations: 48, registrations: 10, appointments: 35 },
              { date: 'Thu', vaccinations: 61, registrations: 18, appointments: 45 },
              { date: 'Fri', vaccinations: 55, registrations: 14, appointments: 40 },
              { date: 'Sat', vaccinations: 38, registrations: 8, appointments: 25 },
              { date: 'Sun', vaccinations: 25, registrations: 5, appointments: 15 },
            ]}
            height={350}
          />
        </div>

        {/* Alerts Widget */}
        <div className="lg:col-span-1">
          <AlertsWidget
            alerts={[
              {
                id: '1',
                type: 'warning',
                title: 'Low Stock Alert',
                message: 'BCG vaccine running low at Nairobi Hospital',
                timestamp: new Date().toISOString(),
              },
              {
                id: '2',
                type: 'danger',
                title: 'Critical Alert',
                message: 'Temperature excursion detected in Mombasa facility',
                timestamp: new Date().toISOString(),
              },
              {
                id: '3',
                type: 'info',
                title: 'Report Ready',
                message: 'Monthly coverage report is now available',
                timestamp: new Date().toISOString(),
              },
            ]}
            maxHeight={350}
            onViewAll={() => navigate(ROUTES.NOTIFICATIONS)}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Vaccinations */}
        <UpcomingVaccinations
          vaccinations={[
            {
              id: '1',
              childName: 'Baby John',
              vaccineName: 'BCG',
              dueDate: new Date().toISOString(),
              status: 'due',
            },
            {
              id: '2',
              childName: 'Baby Mary',
              vaccineName: 'OPV',
              dueDate: new Date(Date.now() + 86400000).toISOString(),
              status: 'upcoming',
            },
            {
              id: '3',
              childName: 'Baby Peter',
              vaccineName: 'DPT',
              dueDate: new Date(Date.now() - 86400000).toISOString(),
              status: 'overdue',
            },
          ]}
        />

        {/* Recent Activities */}
        <RecentActivities
          activities={[
            {
              id: '1',
              type: 'vaccination',
              title: 'Vaccination Recorded',
              description: 'BCG administered to Baby John',
              timestamp: new Date().toISOString(),
              user: 'Dr. Smith',
              child: 'Baby John',
            },
            {
              id: '2',
              type: 'registration',
              title: 'New Child Registered',
              description: 'Baby Mary was registered',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              user: 'Nurse Jane',
              child: 'Baby Mary',
            },
            {
              id: '3',
              type: 'appointment',
              title: 'Appointment Scheduled',
              description: 'Follow-up for Baby Peter',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              user: 'System',
              child: 'Baby Peter',
            },
            {
              id: '4',
              type: 'report',
              title: 'Report Generated',
              description: 'Monthly analytics report',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              user: 'Admin',
            },
          ]}
        />
      </div>

      {/* Quick Links to Detailed Analytics */}
      <Card>
        <Card.Header title="Detailed Analytics" />
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate(ROUTES.COVERAGE_ANALYTICS)}
              className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all text-left"
            >
              <ChartBarIcon className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-medium text-gray-900">Coverage Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Detailed coverage rates by vaccine, age, and region
              </p>
            </button>

            <button
              onClick={() => navigate(ROUTES.DROPOUT_ANALYTICS)}
              className="p-6 border border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all text-left"
            >
              <ArrowTrendingUpIcon className="h-8 w-8 text-yellow-600 mb-3" />
              <h3 className="font-medium text-gray-900">Dropout Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Identify dropout rates and contributing factors
              </p>
            </button>

            <button
              onClick={() => navigate(ROUTES.PERFORMANCE_ANALYTICS)}
              className="p-6 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all text-left"
            >
              <BeakerIcon className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-medium text-gray-900">Performance Metrics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Facility and health worker performance analysis
              </p>
            </button>

            <button
              onClick={() => navigate(ROUTES.PREDICTIVE_ANALYTICS)}
              className="p-6 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left"
            >
              <MapIcon className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-medium text-gray-900">Predictive Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Forecasts and risk predictions
              </p>
            </button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;