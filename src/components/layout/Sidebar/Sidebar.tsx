import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth/authHooks';
import {
  HomeIcon,
  UsersIcon,
  BeakerIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CalendarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Children', href: '/children', icon: UsersIcon },
  { name: 'Vaccines', href: '/vaccines', icon: BeakerIcon },
  { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export const Sidebar: React.FC = () => {
  const { hasRole } = useAuth();

  // Filter navigation based on user role
  const filteredNav = navigation.filter(item => {
    if (item.name === 'Admin' && !hasRole(['ADMIN', 'SUPER_ADMIN'])) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col flex-1 h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
        <span className="text-xl font-bold text-white">ImmuniTrack</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${isActive
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`
                    mr-3 h-6 w-6
                    ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">Help & Support</p>
            <p className="text-xs text-gray-500">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;