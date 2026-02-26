import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/features/children/childrenHooks';
import type { Child } from '@/features/children/childrenTypes';
import { useParentDashboard } from '@/features/parents/parentsHooks';
import { useNotifications } from '@/features/notifications/notificationsHooks';
import { Button } from '@/components/common/Button';
import { formatDate, formatAge } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';
import { ChildRegistrationModal } from '@/features/children/components/ChildRegistrationModal';
import { useChildrenMutations } from '@/features/children/hooks/useChildrenMutations';
import { Toast } from '@/components/common/Toast';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children, isLoading: childrenLoading, refetch: refetchChildren } = useChildren();
  const { dashboard, isLoading: dashboardLoading, refetch: refetchDashboard } = useParentDashboard(user?.id || '');
  const { unreadCount } = useNotifications(user?.id);
  const { addChild } = useChildrenMutations();

  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  useEffect(() => {
    if (children && children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 3000);
  };

  const handleAddChild = async (childData: any) => {
    try {
      setIsLoading(true);
      await addChild(childData);
      await refetchChildren();
      await refetchDashboard();
      showToast('success', 'Child registered successfully!');
      setShowAddChildModal(false);
    } catch (error) {
      showToast('error', 'Failed to register child.');
    } finally {
      setIsLoading(false);
    }
  };

  if (childrenLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const selectedChildData = children?.find((c: Child) => c.id === selectedChild);
  
  // Use dashboard directly from hook (properly typed)
  const completionRate = dashboard?.completionRate ?? 0;
  const completedVaccinations = dashboard?.completedVaccinations ?? 0;
  const missedVaccinations = dashboard?.missedVaccinations ?? 0;
  const upcomingReminders = dashboard?.upcomingReminders ?? [];
  const recentActivities = dashboard?.recentActivity ?? [];

  // Find the next appointment date from actual reminders
  const nextAppointment = upcomingReminders.length > 0 
    ? upcomingReminders.reduce((earliest, current) => 
        new Date(current.scheduledFor) < new Date(earliest.scheduledFor) ? current : earliest
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">ImmuniTrack</h1>
          <p className="text-sm text-gray-500">Kenya</p>
        </div>

        <nav className="px-4">
          {/* Main Menu */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-blue-50 text-blue-600"
                >
                  <HomeIcon className="h-5 w-5 text-blue-600" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.CHILDREN_LIST)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  <span>My Children</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.VACCINATIONS)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                  <span>Vaccinations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.APPOINTMENTS)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span>Appointments</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.GROWTH_TRACKING)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ChartBarIcon className="h-5 w-5 text-gray-400" />
                  <span>Growth Tracking</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.CERTIFICATES)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" />
                  <span>Certificates</span>
                </button>
              </li>
            </ul>
          </div>

          {/* More Section */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">More</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => navigate(ROUTES.NOTIFICATIONS)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 relative"
                >
                  <BellIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(ROUTES.REMINDERS)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">Reminders</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0] || 'Parent'}!</h2>
            <p className="text-gray-500">Here's your children's immunization overview</p>
          </div>
          <Button
            onClick={() => setShowAddChildModal(true)}
            leftIcon={<PlusIcon className="h-5 w-5" />}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Child
          </Button>
        </div>

        {/* Stats Cards - Always visible with real data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Immunization Progress */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">+0%</span>
            </div>
            <div className="text-3xl font-bold mb-1">{completionRate}%</div>
            <div className="text-sm text-white/80">Immunization Progress</div>
          </div>

          {/* Completed Vaccines */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="mb-4">
              <div className="bg-white/20 p-3 rounded-xl w-fit">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{completedVaccinations}</div>
            <div className="text-sm text-white/80">Completed Vaccines</div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="mb-4">
              <div className="bg-white/20 p-3 rounded-xl w-fit">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{upcomingReminders.length}</div>
            <div className="text-sm text-white/80 mb-1">Upcoming Appointments</div>
            {nextAppointment && (
              <div className="text-xs text-white/60">
                Next: {new Date(nextAppointment.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* Missed Vaccinations */}
          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="mb-4">
              <div className="bg-white/20 p-3 rounded-xl w-fit">
                <BellIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{missedVaccinations}</div>
            <div className="text-sm text-white/80">Missed Vaccinations</div>
          </div>
        </div>

        {/* Children Overview Cards */}
        {children && children.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {children?.map((child) => {
              // Get child-specific reminders count
              const childUpcomingCount = upcomingReminders.filter((r) => r.childId === child.id).length;
              
              return (
                <div
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                    selectedChild === child.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {child.firstName?.charAt(0)}{child.lastName?.charAt(0) || ''}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{child.firstName} {child.lastName}</h3>
                        <p className="text-sm text-gray-500">
                          Born {formatDate(child.dateOfBirth)} • {formatAge(child.dateOfBirth)} • {child.gender}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="font-bold text-blue-600">{completionRate}%</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <div className="text-gray-500">Completed</div>
                      <div className="font-semibold text-gray-900">{completedVaccinations}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Upcoming</div>
                      <div className="font-semibold text-gray-900">{childUpcomingCount}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Missed</div>
                      <div className="font-semibold text-gray-900">{missedVaccinations}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Growth</div>
                      <div className="font-semibold text-gray-900">+0%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Child Details */}
        {selectedChildData && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedChildData.firstName} {selectedChildData.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  Born {formatDate(selectedChildData.dateOfBirth)} • {formatAge(selectedChildData.dateOfBirth)} • {selectedChildData.gender}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Immunization Progress</span>
                <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => navigate(`/child-profile/${selectedChildData.id}`)}
                className="py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </button>
              <button 
                onClick={() => navigate(`/vaccination-history/${selectedChildData.id}`)}
                className="py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                History
              </button>
              <button 
                onClick={() => navigate(`/certificates/${selectedChildData.id}`)}
                className="py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Certificate
              </button>
              <button 
                onClick={() => navigate(`/schedule/${selectedChildData.id}`)}
                className="py-2 px-4 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Schedule
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions & Emergency Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-1">Quick Actions</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your child's health</p>
            
            <div className="grid grid-cols-4 gap-4">
              <button className="text-center group" onClick={() => navigate('/appointments/new')}>
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-600">Schedule</span>
              </button>
              <button className="text-center group" onClick={() => navigate('/growth-tracking/new')}>
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-600">Growth</span>
              </button>
              <button className="text-center group" onClick={() => navigate('/certificates')}>
                <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <DocumentDuplicateIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-600">Certificates</span>
              </button>
              <button className="text-center group" onClick={() => navigate('/reminders')}>
                <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <BellIcon className="h-6 w-6" />
                </div>
                <span className="text-xs text-gray-600">Reminders</span>
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-xs text-red-600">Hotline</p>
                  <p className="text-sm font-semibold">1199</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Health Facility</p>
                  <p className="text-sm font-medium">Nearest Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Vaccinations & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Vaccinations */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Upcoming Vaccinations</h3>
                <p className="text-sm text-gray-500">Next appointments</p>
              </div>
              <button 
                onClick={() => navigate('/appointments')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.slice(0, 4).map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{reminder.vaccineName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(reminder.scheduledFor)} • {reminder.childName}
                      </p>
                    </div>
                    <button 
                      onClick={() => {/* Handle mark as done */}}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                    >
                      Done
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No upcoming vaccinations</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Due Today</span>
                <div className="flex gap-3">
                  <span className="text-gray-400">□ Done</span>
                  <span className="text-gray-400">✓ Due</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest updates</p>
              </div>
              <button 
                onClick={() => navigate('/activity')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'vaccination' ? 'bg-green-100' :
                      activity.type === 'appointment' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      {activity.type === 'vaccination' && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
                      {activity.type === 'appointment' && <CalendarIcon className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'reminder' && <BellIcon className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.timestamp)} • {activity.childName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Health Tips</h3>
              <p className="text-sm text-gray-500">Expert advice for your family</p>
            </div>
            <button 
              onClick={() => navigate('/health-tips')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              More Tips
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Stay on Schedule</h4>
              <p className="text-sm text-gray-600">Keep track of vaccination dates for optimal protection</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Nutrition Matters</h4>
              <p className="text-sm text-gray-600">Proper nutrition boosts vaccine effectiveness</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">Monitor Growth</h4>
              <p className="text-sm text-gray-600">Regular tracking helps detect issues early</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ChildRegistrationModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onSuccess={handleAddChild}
        isLoading={isLoading}
      />

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default ParentDashboard;