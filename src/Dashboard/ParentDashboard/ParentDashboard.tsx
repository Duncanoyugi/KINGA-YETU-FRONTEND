import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  CalendarIcon,
  BellIcon,
  ChartBarIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/features/children/childrenHooks';
import type { Child } from '@/features/children/childrenTypes';
import { useParentDashboard } from '@/features/parents/parentsHooks';
import { useNotifications } from '@/features/notifications/notificationsHooks';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { StatsCard } from '@/components/widgets/StatsCard';
import { UpcomingVaccinations } from '@/components/widgets/UpcomingVaccinations';
import { RecentActivities } from '@/components/widgets/RecentActivities';
import { Spinner } from '@/components/common/Spinner';
import { Badge } from '@/components/common/Badge';
import { formatDate, formatAge } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children, isLoading: childrenLoading } = useChildren();
  const { dashboard, isLoading: dashboardLoading } = useParentDashboard(user?.id || '');
  const { unreadCount } = useNotifications(user?.id);

  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  // Set first child as selected by default
  useEffect(() => {
    if (children && children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);

  if (childrenLoading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no children, show onboarding
  if (!children || children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-primary-50 via-accent-50 to-white rounded-2xl shadow-lg p-8">
        <UserGroupIcon className="mx-auto h-16 w-16 text-accent-400 mb-4" />
        <h3 className="text-2xl font-bold text-primary-800 mb-2">No children registered</h3>
        <p className="text-base text-primary-600 mb-6 max-w-md text-center">
          Get started by registering your first child for immunization tracking and reminders.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.ADD_CHILD)}
          leftIcon={<PlusCircleIcon className="h-5 w-5" />}
          className="px-6 py-3 rounded-full bg-accent-400 text-primary-900 font-bold shadow hover:bg-accent-300 transition"
        >
          Register Your First Child
        </Button>
      </div>
    );
  }

  const selectedChildData = children.find((c: Child) => c.id === selectedChild);
  const upcomingVaccinations = dashboard?.upcomingReminders || [];
  const recentActivities = dashboard?.recentActivity || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary-50 via-white to-accent-50 rounded-2xl shadow p-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-800 mb-1">
            Welcome back, {user?.fullName?.split(' ')[0]}! <span className="text-accent-400">👋</span>
          </h1>
          <p className="text-base text-primary-600">
            Here&apos;s an overview of your children&apos;s immunization status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BellIcon className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="relative border-accent-400 text-accent-700 hover:bg-accent-50"
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusCircleIcon className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.ADD_CHILD)}
            className="bg-accent-400 text-primary-900 font-bold hover:bg-accent-300 px-5"
          >
            Add Child
          </Button>
        </div>
      </div>

      {/* Child Selector */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {children.map((child: Child) => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child.id)}
            className={`
              flex items-center space-x-3 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap
              ${selectedChild === child.id
                ? 'bg-primary-50 border-primary-500'
                : 'border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium">
                {child.firstName.charAt(0)}
              </span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">
                {child.firstName} {child.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {formatAge(child.dateOfBirth)} • {child.gender}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      {selectedChildData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Immunization Progress"
            value={`${dashboard?.completionRate || 0}%`}
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="primary"
            trend={{
              value: 5,
              direction: 'up',
              label: 'vs last month',
            }}
          />
          <StatsCard
            title="Completed"
            value={dashboard?.completedVaccinations || 0}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color="success"
          />
          <StatsCard
            title="Upcoming"
            value={upcomingVaccinations.length}
            icon={<CalendarIcon className="h-6 w-6" />}
            color="warning"
          />
          <StatsCard
            title="Missed"
            value={dashboard?.missedVaccinations || 0}
            icon={<ExclamationCircleIcon className="h-6 w-6" />}
            color="danger"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Child Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Child Profile Card */}
          {selectedChildData && (
            <Card>
              <Card.Body>
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                    <span className="text-3xl text-primary-700 font-medium">
                      {selectedChildData.firstName.charAt(0)}
                      {selectedChildData.lastName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {selectedChildData.firstName} {selectedChildData.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Born: {formatDate(selectedChildData.dateOfBirth)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Age: {formatAge(selectedChildData.dateOfBirth)}
                  </p>
                  
                  <div className="mt-4 flex justify-center space-x-2">
                    <Badge variant="primary">{selectedChildData.gender}</Badge>
                    {selectedChildData.birthCertificateNo && (
                      <Badge variant="info">Birth Cert: {selectedChildData.birthCertificateNo}</Badge>
                    )}
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => navigate(ROUTES.CHILD_PROFILE.replace(':id', selectedChildData.id))}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => navigate(ROUTES.CHILD_HISTORY.replace(':id', selectedChildData.id))}
                    >
                      History
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <Card.Header title="Quick Actions" />
            <Card.Body>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<CalendarIcon className="h-4 w-4" />}
                  onClick={() => navigate(ROUTES.APPOINTMENTS)}
                >
                  View Appointments
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<BellIcon className="h-4 w-4" />}
                  onClick={() => navigate(ROUTES.REMINDER_SETTINGS)}
                >
                  Reminder Settings
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<ChartBarIcon className="h-4 w-4" />}
                  onClick={() => selectedChild && navigate(ROUTES.GROWTH_CHART.replace(':id', selectedChild))}
                  disabled={!selectedChild}
                >
                  Growth Chart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Right Column - Two columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Vaccinations */}
          <UpcomingVaccinations
            vaccinations={upcomingVaccinations.map(r => ({
              id: r.id,
              childName: r.childName || 'Unknown',
              vaccineName: r.vaccineName || 'Vaccine',
              dueDate: r.scheduledFor,
              status: new Date(r.scheduledFor) > new Date() ? 'upcoming' : 'due',
            }))}
          />

          {/* Recent Activities */}
          <RecentActivities
            activities={recentActivities.map(a => ({
              id: a.id,
              type: a.type,
              title: a.description,
              description: a.description,
              timestamp: a.timestamp,
              child: a.childName,
            }))}
          />
        </div>
      </div>

      {/* Health Tips */}
      <Card>
        <Card.Header title="Health Tips" />
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Stay on Schedule</h4>
              <p className="text-sm text-blue-600">
                Keep track of your child's vaccination dates and set reminders.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Nutrition Matters</h4>
              <p className="text-sm text-green-600">
                Proper nutrition helps boost immunity and vaccine effectiveness.
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">Monitor Growth</h4>
              <p className="text-sm text-purple-600">
                Regular growth tracking helps detect issues early.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ParentDashboard;