import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  BeakerIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapIcon,
  ChartBarIcon,
  FolderIcon,
  ServerIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import ROUTES from '@/routing/routes';
import { apiService } from '@/services/api/all';

// Types
interface SystemResources {
  usedStorage: number;
  totalStorage: number;
  apiCallsToday: number;
  uptime: number;
  activeSessions: number;
}

const useSystemStore = () => {
  const [systemResources, setSystemResources] = useState<SystemResources | null>(null);

  const fetchSystemResources = async () => {
    try {
      const res = await apiService.system.getStats();
      const data = (res as { data: SystemResources }).data;
      setSystemResources(data || null);
    } catch (err) {
      setSystemResources(null);
    }
  };

  useEffect(() => {
    fetchSystemResources();
  }, []);

  return { systemResources };
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

// Sidebar Navigation Component
const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { systemResources } = useSystemStore();

  const getActiveItemId = () => {
    const path = location.pathname;
    // Map paths to active items correctly
    if (path.includes('/admin/facilities')) return 'facilities';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/vaccines/management')) return 'vaccines';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/admin/audit-logs')) return 'audit-logs';
    if (path.includes('/analytics/coverage-map')) return 'coverage-map';
    if (path.includes('/admin/system-health')) return 'system-health';
    if (path.includes('/admin/security')) return 'security';
    if (path.includes('/admin/database')) return 'database';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/admin/system')) return 'configuration';
    return 'dashboard';
  };

  const activeItem = getActiveItemId();

  const managementItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, path: ROUTES.ADMIN_DASHBOARD },
    { id: 'facilities', label: 'Facilities', icon: BuildingOfficeIcon, path: ROUTES.FACILITY_MANAGEMENT },
    { id: 'users', label: 'Users', icon: UserGroupIcon, path: ROUTES.USER_MANAGEMENT },
    { id: 'vaccines', label: 'Vaccines', icon: BeakerIcon, path: ROUTES.VACCINE_MANAGEMENT },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, path: ROUTES.ANALYTICS_OVERVIEW },
    { id: 'reports', label: 'Reports', icon: DocumentChartBarIcon, path: ROUTES.REPORTS_DASHBOARD },
  ];

  const systemItems = [
    { id: 'audit-logs', label: 'Audit Logs', icon: FolderIcon, path: ROUTES.AUDIT_LOGS },
    { id: 'coverage-map', label: 'Coverage Map', icon: MapIcon, path: ROUTES.COVERAGE_MAP },
    { id: 'system-health', label: 'System Health', icon: ServerIcon, path: ROUTES.SYSTEM_HEALTH },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon, path: ROUTES.SECURITY },
    { id: 'database', label: 'Database', icon: FolderIcon, path: ROUTES.DATABASE },
  ];

  const settingsItems = [
    { id: 'notifications', label: 'Notifications', icon: ClockIcon, path: ROUTES.NOTIFICATIONS },
    { id: 'configuration', label: 'Configuration', icon: Cog6ToothIcon, path: ROUTES.SYSTEM_CONFIG },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-primary-700 to-primary-500 shadow-2xl h-screen fixed left-0 top-0 overflow-y-auto border-r border-primary-200 z-50">
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow">ImmuniTrack</h1>
        <p className="text-sm text-primary-100 mt-1 font-semibold">Admin Panel</p>
      </div>

      <nav className="mt-6">
        {/* Management Section */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-3">Management</h3>
          <ul className="space-y-1">
            {managementItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-xl font-semibold transition-colors ${
                    activeItem === item.id
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${activeItem === item.id ? 'text-primary-700' : 'text-primary-200'}`} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* System Section */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-3">System</h3>
          <ul className="space-y-1">
            {systemItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-xl font-semibold transition-colors ${
                    activeItem === item.id
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${activeItem === item.id ? 'text-primary-700' : 'text-primary-200'}`} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section */}
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-3">Settings</h3>
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-xl font-semibold transition-colors ${
                    activeItem === item.id
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${activeItem === item.id ? 'text-primary-700' : 'text-primary-200'}`} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Log Out */}
        <div className="px-4 mt-auto pt-6 border-t border-primary-300 pb-20">
          <button
            onClick={() => navigate(ROUTES.LOGOUT)}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
            Log Out
          </button>
        </div>
      </nav>

      {/* System Resources - Real-time data */}
      {systemResources && (
        <div className="fixed bottom-0 left-0 w-64 p-4 bg-gray-50 border-t border-gray-200 z-50">
          <div className="text-xs text-gray-500">
            <div className="flex justify-between mb-1">
              <span>Storage</span>
              <span className="font-medium text-gray-700">
                {formatNumber(systemResources.usedStorage)} / {formatNumber(systemResources.totalStorage)} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-primary-600 h-1.5 rounded-full"
                style={{ width: `${(systemResources.usedStorage / systemResources.totalStorage) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-x-hidden p-6 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
