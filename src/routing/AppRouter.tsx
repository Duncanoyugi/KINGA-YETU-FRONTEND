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

      {/* Authenticated area */}
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

        {/* Default redirect for /dashboard root based on role */}
        <Route path="/dashboard/*" element={<Navigate to={defaultDashboard} replace />} />
      </Route>

      {/* Catch all - send unknown routes to landing */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRouter;

