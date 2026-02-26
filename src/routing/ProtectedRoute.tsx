import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/app/store/hooks';
import { ROUTES } from './routes';

interface ProtectedRouteProps {
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { isAuthenticated, hasRole, user, getDashboardRoute } = useAuth();
  const location = useLocation();
  
  // Get loggedOut state from Redux
  const { loggedOut } = useAppSelector((state) => state.auth);

  // If user was explicitly logged out, redirect to login
  if (loggedOut) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ message: 'Please log in again to access the dashboard' }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  if (roles && !hasRole(roles)) {
    // Authenticated but not allowed; send to their role-based dashboard
    const dashboardRoute = user ? getDashboardRoute(user.role) : ROUTES.DASHBOARD;
    return <Navigate to={dashboardRoute} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
