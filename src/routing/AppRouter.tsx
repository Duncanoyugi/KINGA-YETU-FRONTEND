import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { ParentDashboard } from '@/Dashboard/ParentDashboard/ParentDashboard';
import HealthWorkerDashboard from '@/Dashboard/HealthWorkerDashboard/HealthWorkerDashboard';
import AdminDashboard from '@/Dashboard/AdminDashboard/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/pages/landing/LandingPage';
import Register from '../pages/auth/Register';
import OTPVerification from '../pages/auth/OTPVerification';
import ForgottenPassword from '../pages/auth/ForgottenPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import ResourcesPage from '../pages/Resources';
import ContactPage from '../pages/Contact';
import TermsPage from '../pages/legal/Terms';
import PrivacyPage from '../pages/legal/Privacy';
import RoleBasedLayout from '../components/layout/RoleBasedLayout';
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import ChildrenList from '../pages/children/ChildrenList';
import AddChild from '../pages/children/AddChild';
import ChildProfile from '../pages/children/ChildProfile';
import EditChild from '../pages/children/EditChild';
import ChildHistory from '../pages/children/ChildHistory';
import Appointments from '../pages/appointments/Appointments';
import NotificationsCenter from '../pages/notifications/NotificationsCenter';
import ReminderSettings from '../pages/notifications/ReminderSettings';
import ReportsDashboard from '../pages/reports/ReportsDashboard';
import AnalyticsOverview from '../pages/analytics/AnalyticsOverview';
import UserManagement from '../pages/admin/UserManagement';
import FacilityManagement from '../pages/admin/FacilityManagement';
import VaccineInventory from '../pages/vaccines/VaccineInventory';
import SystemConfiguration from '../pages/admin/SystemConfiguration';
import AuditTrail from '../pages/admin/AuditTrail';
import CoverageMap from '../components/widgets/CoverageMap/CoverageMap';
import Settings from '../pages/settings/Settings';
import { Login } from '../pages/auth/Login';
import { VaccineSchedule } from '../pages/vaccines/VaccineSchedule';
import VaccinationsPage from '@/pages/vaccinations/VaccinationsPage';
import GrowthTrackingPage from '@/pages/growth-tracking/GrowthTrackingPage';
import CertificatesPage from '@/pages/certificates/CertificatesPage';
import ParentProfile from '@/pages/parents/ParentProfile';
import ParentDashboardLayout from '@/components/layout/ParentDashboardLayout';
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
      <Route path={ROUTES.VERIFY_EMAIL} element={<OTPVerification />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgottenPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.TERMS} element={<TermsPage />} />
      <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />

      {/* Authenticated area - generic dashboard uses RoleBasedLayout */}
      <Route element={<RoleBasedLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<Navigate to={defaultDashboard} replace />} />
          <Route path={ROUTES.CHILDREN_LIST} element={<ChildrenList />} />
          <Route path={ROUTES.CHILD_PROFILE} element={<ChildProfile />} />
          <Route path={ROUTES.EDIT_CHILD} element={<EditChild />} />
          <Route path={ROUTES.CHILD_HISTORY} element={<ChildHistory />} />
          <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsCenter />} />
          <Route path={ROUTES.REMINDER_SETTINGS} element={<ReminderSettings />} />
          <Route path={ROUTES.REPORTS_DASHBOARD} element={<ReportsDashboard />} />
          <Route path={ROUTES.ANALYTICS_OVERVIEW} element={<AnalyticsOverview />} />
          <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagement />} />
          <Route path={ROUTES.FACILITY_MANAGEMENT} element={<FacilityManagement />} />
          <Route path={ROUTES.VACCINE_MANAGEMENT} element={<VaccineInventory />} />
          <Route path={ROUTES.SYSTEM_CONFIG} element={<SystemConfiguration />} />
          <Route path={ROUTES.AUDIT_LOGS} element={<AuditTrail />} />
          <Route path={ROUTES.COVERAGE_MAP} element={<CoverageMap locations={[]} title="Geographic Coverage" />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.VACCINATIONS} element={<VaccineSchedule />} />
          <Route path={ROUTES.VACCINE_SCHEDULE} element={<VaccineSchedule />} />
          <Route path={ROUTES.VACCINES} element={<VaccineSchedule />} />
          {/* Redirects */}
          <Route path={ROUTES.APPOINTMENTS_NEW} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.REMINDERS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.GROWTH_TRACKING} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.GROWTH_TRACKING_NEW} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.CERTIFICATES} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.CERTIFICATES_CHILD} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.IMMUNIZATION_HISTORY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.VACCINATION_HISTORY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.COVERAGE_REPORTS} element={<Navigate to={ROUTES.REPORTS_DASHBOARD} replace />} />
          <Route path={ROUTES.MISSED_VACCINES} element={<Navigate to={ROUTES.REPORTS_DASHBOARD} replace />} />
          <Route path={ROUTES.COVERAGE_ANALYTICS} element={<Navigate to={ROUTES.ANALYTICS_OVERVIEW} replace />} />
          <Route path={ROUTES.DROPOUT_ANALYTICS} element={<Navigate to={ROUTES.ANALYTICS_OVERVIEW} replace />} />
          <Route path={ROUTES.PREDICTIVE_ANALYTICS} element={<Navigate to={ROUTES.ANALYTICS_OVERVIEW} replace />} />
          <Route path={ROUTES.SYSTEM_HEALTH} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.SECURITY} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.DATABASE} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.SECURITY_SCAN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.HEALTH_TIPS} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.ACTIVITY_HISTORY} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
      </Route>

      {/* Role-based dashboards (no DashboardLayout) */}
      <Route element={<ProtectedRoute roles={['PARENT']} />}>
        <Route element={<ParentDashboardLayout />}>
          <Route path={ROUTES.PARENT_DASHBOARD} element={<ParentDashboard showSidebar={false} />} />
          <Route path={ROUTES.PARENT_CHILDREN} element={<ChildrenList />} />
          <Route path={ROUTES.PARENT_ADD_CHILD} element={<AddChild />} />
          <Route path={ROUTES.PARENT_PROFILE} element={<ParentProfile />} />
          <Route path={ROUTES.PARENT_VACCINATIONS} element={<VaccinationsPage />} />
          <Route path={ROUTES.PARENT_APPOINTMENTS} element={<Appointments />} />
          <Route path={ROUTES.PARENT_GROWTH_TRACKING} element={<GrowthTrackingPage />} />
          <Route path={ROUTES.PARENT_CERTIFICATES} element={<CertificatesPage />} />
          <Route path={ROUTES.PARENT_ANALYTICS} element={<AnalyticsOverview />} />
          <Route path={ROUTES.PARENT_REPORTS} element={<ReportsDashboard />} />
          <Route path={ROUTES.PARENT_SETTINGS} element={<Settings />} />
          <Route path={ROUTES.PARENT_NOTIFICATIONS} element={<NotificationsCenter />} />
          <Route path={ROUTES.PARENT_REMINDERS} element={<ReminderSettings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['HEALTH_WORKER']} />}>
        <Route path={`${ROUTES.HEALTH_WORKER_DASHBOARD}/*`} element={<HealthWorkerDashboard />} />
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']} />}>
        <Route element={<AdminDashboardLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Default redirect for /dashboard root based on role */}
      <Route path="/dashboard/*" element={<Navigate to={defaultDashboard} replace />} />

      {/* Catch all - send unknown routes to landing */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRouter;

