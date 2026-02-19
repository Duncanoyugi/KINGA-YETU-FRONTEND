import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import Dashboard from '../pages/Dashboard';

// AppRouter component that handles routing
// This is a simple router that redirects to dashboard
const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard route */}
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRouter;
