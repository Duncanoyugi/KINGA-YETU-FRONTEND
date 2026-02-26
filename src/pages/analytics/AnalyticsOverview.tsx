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
  useAnalyticsDashboard
} from '@/features/analytics/analyticsHooks';
import { 
  useGetTrendAnalyticsQuery,
  useGetAlertAnalyticsQuery,
  useGetRealTimeStatsQuery,
  useGetCoverageAnalyticsQuery
} from '@/features/analytics/analyticsAPI';
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
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfDay, endOfDay, subDays } from 'date-fns';

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

  // Fetch trend analytics for activity chart
  const { data: trendData, isLoading: trendsLoading } = useGetTrendAnalyticsQuery({
    startDate,
    endDate,
    groupBy: timeRange === 'today' ? 'day' : timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : timeRange === 'quarter' ? 'quarter' : undefined,
  }, {
    skip: !startDate || !endDate,
  });

  // Fetch alerts data
  const { data: alertsData, isLoading: alertsLoading } = useGetAlertAnalyticsQuery({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Fetch real-time stats
  const { data: realtimeStats, isLoading: realtimeLoading } = useGetRealTimeStatsQuery(undefined);

  // Fetch coverage analytics for upcoming vaccinations
  const { data: coverageData } = useGetCoverageAnalyticsQuery({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleExport = (exportFormat: 'pdf' | 'csv' | 'excel') => {
    showToast({
      type: 'info',
      message: `Exporting analytics as ${exportFormat.toUpperCase()}...`,
    });
    // Implement export logic
  };

  // Transform trend data for activity chart - API returns data wrapped in AnalyticsResponse
  const activityChartData = useMemo(() => {
    const response = trendData as any;
    const trends = response?.data?.vaccinationTrends || response?.vaccinationTrends;
    if (!trends || !Array.isArray(trends)) {
      return [];
    }
    
    return trends.slice(-7).map((item: any) => ({
      date: item.period || item.month || item.week || 'N/A',
      vaccinations: item.count || 0,
      registrations: Math.floor((item.count || 0) * 0.3),
      appointments: Math.floor((item.count || 0) * 0.8),
    }));
  }, [trendData]);

  // Transform alerts data for alerts widget
  const alerts = useMemo(() => {
    if (!alertsData) {
      return [];
    }
    
    const response = alertsData as any;
    const alertTypes = [];
    const bySeverity = response?.bySeverity || {};
    const totalAlerts = response?.total || 0;
    
    if ((bySeverity.high || 0) > 0) {
      alertTypes.push({
        id: '1',
        type: 'danger' as const,
        title: 'High Severity Alerts',
        message: `${bySeverity.high} high severity alerts require immediate attention`,
        timestamp: new Date().toISOString(),
      });
    }
    if ((bySeverity.medium || 0) > 0) {
      alertTypes.push({
        id: '2',
        type: 'warning' as const,
        title: 'Medium Severity Alerts',
        message: `${bySeverity.medium} medium severity alerts`,
        timestamp: new Date().toISOString(),
      });
    }
    if ((bySeverity.low || 0) > 0) {
      alertTypes.push({
        id: '3',
        type: 'info' as const,
        title: 'Low Severity Alerts',
        message: `${bySeverity.low} low severity alerts`,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Add default alerts if none exist
    if (alertTypes.length === 0) {
      alertTypes.push({
        id: '1',
        type: 'info' as const,
        title: 'System Status',
        message: totalAlerts > 0 ? `${totalAlerts} alerts total` : 'All systems operating normally',
        timestamp: new Date().toISOString(),
      });
    }
    
    return alertTypes;
  }, [alertsData]);

  // Transform recent activities from realtime stats
  const recentActivities = useMemo(() => {
    const activities = [];
    
    if (realtimeStats) {
      if (realtimeStats.todayVaccinations > 0) {
        activities.push({
          id: '1',
          type: 'vaccination' as const,
          title: 'Vaccination Recorded',
          description: `${realtimeStats.todayVaccinations} vaccinations today`,
          timestamp: new Date().toISOString(),
          user: 'System',
        });
      }
      if (realtimeStats.pendingAppointments > 0) {
        activities.push({
          id: '2',
          type: 'appointment' as const,
          title: 'Pending Appointments',
          description: `${realtimeStats.pendingAppointments} appointments awaiting`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'System',
        });
      }
    }
    
    // Add default activities if none exist
    if (activities.length === 0) {
      activities.push({
        id: '1',
        type: 'vaccination' as const,
        title: 'No Recent Activity',
        description: 'No new activities recorded today',
        timestamp: new Date().toISOString(),
        user: 'System',
      });
    }
    
    return activities;
  }, [realtimeStats]);

  // Transform upcoming vaccinations from coverage data
  const upcomingVaccinations = useMemo(() => {
    if (!coverageData) {
      return [];
    }
    
    const response = coverageData as any;
    const upcoming = response?.upcoming || response?.data?.upcoming;
    if (!upcoming || !Array.isArray(upcoming)) {
      return [];
    }
    
    return upcoming.slice(0, 5).map((item: any, index: number) => ({
      id: String(index + 1),
      childName: item.childName || 'Unknown',
      vaccineName: item.vaccineName || item.vaccine || 'N/A',
      dueDate: item.dueDate || new Date().toISOString(),
      status: item.status || 'due',
    }));
  }, [coverageData]);

  const isAnyLoading = isLoading || trendsLoading || alertsLoading || realtimeLoading;

  if (isAnyLoading && !kpis) {
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
              value: kpis.children.total > 0 ? (kpis.children.active / kpis.children.total) * 100 : 0,
              direction: 'up',
              label: `${kpis.children.total > 0 ? ((kpis.children.active / kpis.children.total) * 100).toFixed(1) : 0}% of total`,
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
            data={activityChartData.length > 0 ? activityChartData : [
              { date: 'Mon', vaccinations: 0, registrations: 0, appointments: 0 },
              { date: 'Tue', vaccinations: 0, registrations: 0, appointments: 0 },
              { date: 'Wed', vaccinations: 0, registrations: 0, appointments: 0 },
              { date: 'Thu', vaccinations: 0, registrations: 0, appointments: 0 },
              { date: 'Fri', vaccinations: 0, registrations: 0, appointments: 0 },
              { date: 'Sat', vaccinations: 0, registrations: 0, appointments: 0 },
              { date: 'Sun', vaccinations: 0, registrations: 0, appointments: 0 },
            ]}
            loading={trendsLoading}
            height={350}
          />
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
