import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentChartBarIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CalendarIcon,
  MapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useReports } from '@/features/reports/reportsHooks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { formatRelativeTime } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

const reportTypes = [
  {
    id: 'coverage',
    name: 'Coverage Report',
    description: 'Immunization coverage rates by vaccine, age group, and region',
    icon: DocumentChartBarIcon,
    color: 'bg-blue-500',
    route: ROUTES.COVERAGE_REPORTS,
  },
  {
    id: 'missed',
    name: 'Missed Vaccinations',
    description: 'Track missed appointments and overdue vaccinations',
    icon: ClockIcon,
    color: 'bg-red-500',
    route: ROUTES.MISSED_VACCINES,
  },
  {
    id: 'facility',
    name: 'Facility Performance',
    description: 'Performance metrics for health facilities',
    icon: MapIcon,
    color: 'bg-green-500',
    route: ROUTES.FACILITY_REPORTS,
  },
  {
    id: 'demographic',
    name: 'Demographic Analysis',
    description: 'Population coverage by demographics',
    icon: UserGroupIcon,
    color: 'bg-purple-500',
    route: ROUTES.DEMOGRAPHIC_REPORTS,
  },
  {
    id: 'timeliness',
    name: 'Timeliness Report',
    description: 'Vaccination timeliness metrics',
    icon: CalendarIcon,
    color: 'bg-yellow-500',
    route: ROUTES.TIMELINESS_REPORTS,
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Generate custom reports with specific parameters',
    icon: DocumentArrowDownIcon,
    color: 'bg-gray-500',
    route: ROUTES.CUSTOM_REPORT,
  },
];

export const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isHealthWorker } = useAuth();
  const { getRecentReports, isLoading } = useReports();
  
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const recentReports = getRecentReports(5);

  const periodOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate and manage immunization reports
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(report.route)}
          >
            <Card.Body>
              <div className="flex items-start space-x-4">
                <div className={`${report.color} p-3 rounded-lg`}>
                  <report.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <Card.Header
          title="Recently Generated Reports"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ALL_REPORTS)}>
              View All
            </Button>
          }
        />
        <Card.Body>
          {recentReports.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No reports generated yet</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(ROUTES.REPORT_DETAILS.replace(':id', report.id))}
                >
                  <div className="flex items-center space-x-3">
                    <DocumentChartBarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{report.title}</p>
                      <p className="text-sm text-gray-500">
                        Generated {formatRelativeTime(report.generatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">{report.type}</Badge>
                    <Badge variant="default">{report.format}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">85%</div>
            <div className="text-sm text-gray-600">Overall Coverage</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600">1,234</div>
            <div className="text-sm text-gray-600">Vaccinations This Month</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-600">Missed Appointments</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Reports Generated</div>
          </Card.Body>
        </Card>
      </div>

      {/* Scheduled Reports */}
      {(isAdmin || isHealthWorker) && (
        <Card>
          <Card.Header
            title="Scheduled Reports"
            action={
              <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.SCHEDULE_REPORT)}>
                Schedule New
              </Button>
            }
          />
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Monthly Coverage Report</p>
                    <p className="text-sm text-gray-500">Next run: Tomorrow at 09:00</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Weekly Facility Performance</p>
                    <p className="text-sm text-gray-500">Next run: Monday at 08:00</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ReportsDashboard;