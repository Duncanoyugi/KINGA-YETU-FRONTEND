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
import { 
  useGetCountyAdminDashboardQuery,
  useGetRealTimeStatsQuery,
} from '@/features/analytics/analyticsAPI';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { StatsCard } from '@/components/widgets/StatsCard';
import { AlertsWidget } from '@/components/widgets/AlertsWidget';
import { UpcomingVaccinations } from '@/components/widgets/UpcomingVaccinations';
import { RecentActivities } from '@/components/widgets/RecentActivities';
import LineChart from '@/components/charts/LineChart';
import { ROUTES } from '@/routing/routes';

type TimeRange = 'today' | 'week' | 'month' | 'quarter' | 'year';

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

  const { data: countyDashboard, isLoading: countyDashboardLoading } = useGetCountyAdminDashboardQuery();
  const { data: realtimeStats, isLoading: realtimeLoading } = useGetRealTimeStatsQuery(undefined);

  const handleExport = (exportFormat: 'pdf' | 'csv' | 'excel') => {
    showToast({
      type: 'info',
      message: `Exporting analytics as ${exportFormat.toUpperCase()}...`,
    });
    // Implement export logic
  };

  const activityChartData = useMemo(() => {
    const subCountyStats = countyDashboard?.subCountyStats || [];

    return subCountyStats.slice(0, 7).map((item: any) => ({
      date: item.name || 'N/A',
      vaccinations: item.coverage || 0,
      registrations: item.facilities || 0,
      appointments: item.healthWorkers || 0,
    }));
  }, [countyDashboard, timeRange]);

  const alerts = useMemo(() => {
    const coverageAlerts = countyDashboard?.coverageAlerts || [];
    const alertTypes = coverageAlerts.map((alert: any, index: number) => ({
      id: String(index + 1),
      type: alert.severity === 'high' ? 'danger' as const : 'warning' as const,
      title: alert.type === 'low_coverage' ? 'Low Coverage Alert' : 'Coverage Alert',
      message: alert.message,
      timestamp: new Date().toISOString(),
    }));

    if (alertTypes.length === 0) {
      alertTypes.push({
        id: 'default-alert',
        type: 'info' as const,
        title: 'System Status',
        message: realtimeStats?.alerts ? `${realtimeStats.alerts} alerts total` : 'All systems operating normally',
        timestamp: new Date().toISOString(),
      });
    }

    return alertTypes;
  }, [countyDashboard, realtimeStats]);

  const recentActivities = useMemo(() => {
    const activities = countyDashboard?.recentActivities || [];

    if (activities.length === 0) {
      return [
        {
          id: '1',
          type: 'vaccination' as const,
          title: 'No Recent Activity',
          description: 'No new activities recorded today',
          timestamp: new Date().toISOString(),
          user: 'System',
        },
      ];
    }

    return activities.slice(0, 6).map((activity: any, index: number) => ({
      id: String(index + 1),
      type: 'vaccination' as const,
      title: activity.action,
      description: `${activity.facility} • ${activity.time}`,
      timestamp: new Date().toISOString(),
      user: activity.user || 'System',
    }));
  }, [countyDashboard]);

  const upcomingVaccinations = useMemo(() => {
    const upcoming = countyDashboard?.upcomingAppointments || [];

    return upcoming.slice(0, 5).map((item: any, index: number) => ({
      id: String(index + 1),
      childName: item.child || 'Unknown',
      vaccineName: item.vaccine || 'N/A',
      dueDate: new Date().toISOString(),
      status: item.status || 'due',
    }));
  }, [countyDashboard]);

  const isAnyLoading = countyDashboardLoading || realtimeLoading;

  if (isAnyLoading && !countyDashboard) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Coverage Rate"
          value={`${(countyDashboard?.totalCoverage || 0).toFixed(1)}%`}
          trend={{
            value: countyDashboard?.coverageTrend || 0,
            direction: (countyDashboard?.coverageTrend || 0) >= 0 ? 'up' : 'down',
            label: 'vs previous month',
          }}
          color="primary"
          icon={<ChartBarIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Today Vaccinations"
          value={(realtimeStats?.todayVaccinations || 0).toLocaleString()}
          trend={{
            value: realtimeStats?.pendingAppointments || 0,
            direction: (realtimeStats?.pendingAppointments || 0) > 0 ? 'up' : 'down',
            label: 'pending appointments',
          }}
          color="success"
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Registered Children"
          value={(countyDashboard?.totalChildren || 0).toLocaleString()}
          trend={{
            value: countyDashboard?.totalFacilities || 0,
            direction: 'up',
            label: 'facilities reporting',
          }}
          color="secondary"
          icon={<CalendarIcon className="h-6 w-6" />}
        />
        <StatsCard
          title="Active Health Workers"
          value={(countyDashboard?.totalHealthWorkers || 0).toLocaleString()}
          trend={{
            value: realtimeStats?.activeUsers || 0,
            direction: 'up',
            label: 'active users now',
          }}
          color="info"
          icon={<UserGroupIcon className="h-6 w-6" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header title="Sub-county Performance" />
            <Card.Body>
              <LineChart
                series={[
                  {
                    name: 'Coverage %',
                    data: activityChartData.map((item: any) => ({ label: item.date, value: item.vaccinations })),
                    color: '#3b82f6',
                  },
                  {
                    name: 'Facilities',
                    data: activityChartData.map((item: any) => ({ label: item.date, value: item.registrations })),
                    color: '#10b981',
                  },
                  {
                    name: 'Health Workers',
                    data: activityChartData.map((item: any) => ({ label: item.date, value: item.appointments })),
                    color: '#f59e0b',
                  },
                ]}
                height={350}
                showLegend
                showGrid
                smooth
              />
            </Card.Body>
          </Card>
        </div>

        {/* Alerts Widget */}
        <div className="lg:col-span-1">
          <AlertsWidget
            alerts={alerts}
            maxHeight={350}
            onViewAll={() => navigate(ROUTES.NOTIFICATIONS)}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Vaccinations */}
        <UpcomingVaccinations
          vaccinations={upcomingVaccinations.length > 0 ? upcomingVaccinations : [
            {
              id: '1',
              childName: 'No data',
              vaccineName: 'N/A',
              dueDate: new Date().toISOString(),
              status: 'due',
            },
          ]}
        />

        {/* Recent Activities */}
        <RecentActivities
          activities={recentActivities}
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
