import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import Dashboard from '../pages/Dashboard';
import ParentDashboard from '@/Dashboard/ParentDashboard/ParentDashboard';
import HealthWorkerDashboard from '@/Dashboard/HealthWorkerDashboard/HealthWorkerDashboard';
import AdminDashboard from '@/Dashboard/AdminDashboard/AdminDashboard';
import CountyAdminDashboard from '@/Dashboard/CountyAdminDashboard/CountyAdmindashboard';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/pages/landing/LandingPage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgottenPassword from '@/pages/auth/ForgottenPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import ResourcesPage from '@/pages/Resources';
import ContactPage from '@/pages/Contact';
import TermsPage from '@/pages/legal/Terms';
import PrivacyPage from '@/pages/legal/Privacy';

// Children pages
import ChildrenList from '@/pages/children/ChildrenList';
import ChildProfile from '@/pages/children/ChildProfile';
import AddChild from '@/pages/children/AddChild';
import EditChild from '@/pages/children/EditChild';
import ChildHistory from '@/pages/children/ChildHistory';

// Notifications pages
import NotificationsCenter from '@/pages/notifications/NotificationsCenter';
import ReminderSettings from '@/pages/notifications/ReminderSettings';

// Vaccine pages
import VaccineSchedule from '@/pages/vaccines/VaccineSchedule';

// Reports pages
import ReportsDashboard from '@/pages/reports/ReportsDashboard';

// Analytics pages
import AnalyticsOverview from '@/pages/analytics/AnalyticsOverview';

// Admin pages
import UserManagement from '@/pages/admin/UserManagement';
import FacilityManagement from '@/pages/admin/FacilityManagement';
import SystemConfiguration from '@/pages/admin/SystemConfiguration';
import AuditTrail from '@/pages/admin/AuditTrail';

// Vaccine pages
import VaccineInventory from '@/pages/vaccines/VaccineInventory';

// Coverage Map
import CoverageMap from '@/components/widgets/CoverageMap/CoverageMap';

// Appointments and Settings pages
import Appointments from '@/pages/appointments/Appointments';
import Settings from '@/pages/settings/Settings';

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout';

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  const defaultDashboard =
    user?.role === 'PARENT'
      ? ROUTES.PARENT_DASHBOARD
      : user?.role === 'HEALTH_WORKER'
      ? ROUTES.HEALTH_WORKER_DASHBOARD
      : user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.DASHBOARD;

  return (
    <Routes>
      {/* Public landing */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />

      {/* Auth */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgottenPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.TERMS} element={<TermsPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />

      {/* Authenticated area - wrapped in DashboardLayout */}
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute />}>
          {/* Generic dashboard placeholder */}
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          {/* Role-based dashboards */}
          <Route
            path={ROUTES.PARENT_DASHBOARD}
            element={<ProtectedRoute roles={['PARENT']} />}
          >
            <Route index element={<ParentDashboard />} />
          </Route>

          <Route
            path={ROUTES.HEALTH_WORKER_DASHBOARD}
            element={<ProtectedRoute roles={['HEALTH_WORKER']} />}
          >
            <Route index element={<HealthWorkerDashboard />} />
          </Route>

          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={<ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']} />}
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route
            path={ROUTES.COUNTY_ADMIN_DASHBOARD}
            element={<ProtectedRoute roles={['COUNTY_ADMIN', 'ADMIN', 'SUPER_ADMIN']} />}
          >
            <Route index element={<CountyAdminDashboard />} />
          </Route>

          {/* Children routes */}
          <Route path={ROUTES.CHILDREN_LIST} element={<ChildrenList />} />
          <Route path={ROUTES.ADD_CHILD} element={<AddChild />} />
          <Route path={ROUTES.CHILD_PROFILE} element={<ChildProfile />} />
          <Route path={ROUTES.EDIT_CHILD} element={<EditChild />} />
          <Route path={ROUTES.CHILD_HISTORY} element={<ChildHistory />} />

          {/* Appointments routes */}
          <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
          <Route path={ROUTES.APPOINTMENTS_NEW} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Reminders routes */}
          <Route path={ROUTES.REMINDERS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Growth Tracking routes */}
          <Route path={ROUTES.GROWTH_TRACKING} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.GROWTH_TRACKING_NEW} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Certificates routes */}
          <Route path={ROUTES.CERTIFICATES} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.CERTIFICATES_CHILD} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Immunizations / Vaccinations routes */}
          <Route path={ROUTES.VACCINATIONS} element={<VaccineSchedule />} />
          <Route path={ROUTES.VACCINE_SCHEDULE} element={<VaccineSchedule />} />
          <Route path={ROUTES.VACCINES} element={<VaccineSchedule />} />
          <Route path={ROUTES.IMMUNIZATION_HISTORY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.VACCINATION_HISTORY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Notifications routes */}
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsCenter />} />
          <Route path={ROUTES.REMINDER_SETTINGS} element={<ReminderSettings />} />

          {/* Reports routes */}
          <Route path={ROUTES.REPORTS_DASHBOARD} element={<ReportsDashboard />} />
          <Route path={ROUTES.COVERAGE_REPORTS} element={<Navigate to={ROUTES.REPORTS_DASHBOARD} replace />} />
          <Route path={ROUTES.MISSED_VACCINES} element={<Navigate to={ROUTES.REPORTS_DASHBOARD} replace />} />

          {/* Analytics routes */}
          <Route path={ROUTES.ANALYTICS_OVERVIEW} element={<AnalyticsOverview />} />
          <Route path={ROUTES.COVERAGE_ANALYTICS} element={<Navigate to={ROUTES.ANALYTICS_OVERVIEW} replace />} />
          <Route path={ROUTES.DROPOUT_ANALYTICS} element={<Navigate to={ROUTES.ANALYTICS_OVERVIEW} replace />} />
          <Route path={ROUTES.PREDICTIVE_ANALYTICS} element={<Navigate to={ROUTES.ANALYTICS_OVERVIEW} replace />} />

          {/* Admin routes - Management */}
          <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
          <Route path={ROUTES.FACILITY_MANAGEMENT} element={<FacilityManagement />} />
          <Route path={ROUTES.VACCINE_MANAGEMENT} element={<VaccineInventory />} />

          {/* Admin routes - System */}
          <Route path={ROUTES.SYSTEM_CONFIG} element={<SystemConfiguration />} />
          <Route path={ROUTES.AUDIT_LOGS} element={<AuditTrail />} />
          <Route path={ROUTES.COVERAGE_MAP} element={<CoverageMap locations={[]} title="Geographic Coverage" />} />
          <Route path={ROUTES.SYSTEM_HEALTH} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.SECURITY} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.DATABASE} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.SECURITY_SCAN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />

          {/* Settings route */}
          <Route path={ROUTES.SETTINGS} element={<Settings />} />

          {/* Health Tips & Activity routes */}
          <Route path={ROUTES.HEALTH_TIPS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.ACTIVITY_HISTORY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* Default redirect for /dashboard root based on role */}
          <Route path="/dashboard/*" element={<Navigate to={defaultDashboard} replace />} />
        </Route>
      </Route>

      {/* Catch all - send unknown routes to landing */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRouter;
