import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from './DashboardLayout';
import AdminDashboardLayout from './AdminDashboardLayout';

export const RoleBasedLayout: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    return <AdminDashboardLayout />;
  }
  
  return <DashboardLayout />;
};

export default RoleBasedLayout;
