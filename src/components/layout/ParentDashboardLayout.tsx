import React from 'react';
import { Outlet } from 'react-router-dom';
import ParentDashboard from '@/Dashboard/ParentDashboard/ParentDashboard';

const ParentDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar and navs are rendered by ParentDashboard */}
      <ParentDashboard isLayoutOnly />
      {/* Main content for nested routes */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ParentDashboardLayout;
