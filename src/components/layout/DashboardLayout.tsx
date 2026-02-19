import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`
          fixed inset-0 flex z-40 lg:hidden
          ${sidebarOpen ? 'visible' : 'invisible'}
        `}
      >
        {/* Overlay */}
        <div
          className={`
            fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity
            ${sidebarOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div
          className={`
            relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 flex flex-col">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto focus:outline-none">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;