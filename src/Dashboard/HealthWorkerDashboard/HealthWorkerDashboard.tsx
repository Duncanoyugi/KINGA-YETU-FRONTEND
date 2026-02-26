import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // Navigation & Layout
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Settings,
  
  // Health & Medical
  Syringe,
  Users,
  UserPlus,
  
  // Calendar & Appointments
  CalendarCheck,
  Calendar,
  Clock,
  
  // Inventory & Stock
  Package,
  PackageSearch,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  
  // Statistics & Charts
  TrendingUp,
  BarChart3,
  
  // Actions
  Search,
  
  // Communication
  Bell,
  
  // Security
  Shield,
  
  // Status Icons
  CheckCircle2,
} from 'lucide-react';

// API imports
import { useGetSchedulesQuery, useGetUpcomingSchedulesQuery } from '@/features/schedules/schedulesAPI';
import { useGetChildrenQuery } from '@/features/children/childrenAPI';
import { useGetInventoryQuery, useGetStockAlertsQuery } from '@/features/vaccines/vaccinesAPI';
import { useGetRealTimeStatsQuery, useGetDashboardMetricsQuery } from '@/features/analytics/analyticsAPI';
import { useAuth } from '@/hooks/useAuth';

// Loading spinner component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  return (
    <div className={`animate-spin rounded-full border-2 border-primary-600 border-t-transparent ${sizeClasses[size]}`} />
  );
};

// Type definitions
type AppointmentStatus = 'checked-in' | 'waiting' | 'scheduled' | 'completed' | 'no-show';
type StockStatus = 'ok' | 'low' | 'critical';
type AlertType = 'critical' | 'warning' | 'info' | 'success';
type ViewMode = 'dashboard' | 'appointments' | 'children' | 'inventory' | 'reports' | 'settings';

interface Appointment {
  id: string;
  childName: string;
  age: string;
  vaccine: string;
  time: string;
  status: AppointmentStatus;
  parentName?: string;
  parentPhone?: string;
  notes?: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  lastVisit: string;
  completion: number;
  parentName: string;
  parentPhone: string;
  address?: string;
  nextAppointment?: string;
  vaccinations: VaccinationRecord[];
}

interface VaccinationRecord {
  id: string;
  vaccine: string;
  dateAdministered: string;
  dose: string;
  administeredBy: string;
  batchNumber: string;
  nextDue?: string;
}

interface StockItem {
  id: string;
  vaccine: string;
  stock: number;
  threshold: number;
  status: StockStatus;
  expiryDate?: string;
  batchNumber?: string;
  manufacturer?: string;
}

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  time: string;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface QueueSummary {
  checkedIn: number;
  waiting: number;
  completed: number;
  noShows: number;
}

// Status configuration
const statusConfig: Record<AppointmentStatus, { label: string; className: string; icon: React.ElementType }> = {
  'checked-in': { 
    label: 'Checked In', 
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: CheckCircle2,
  },
  waiting: { 
    label: 'Waiting', 
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    icon: Clock,
  },
  scheduled: { 
    label: 'Scheduled', 
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
    icon: Calendar,
  },
  completed: { 
    label: 'Completed', 
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
    icon: CheckCircle,
  },
  'no-show': { 
    label: 'No-show', 
    className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800',
    icon: XCircle,
  },
};

const stockStatusConfig: Record<StockStatus, { label: string; className: string; icon: React.ElementType }> = {
  ok: { 
    label: 'Good', 
    className: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle,
  },
  low: { 
    label: 'Low', 
    className: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
  },
  critical: { 
    label: 'Critical', 
    className: 'text-rose-600 dark:text-rose-400',
    icon: AlertCircle,
  },
};

const alertTypeConfig: Record<AlertType, { className: string; icon: React.ElementType }> = {
  critical: {
    className: 'border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30',
    icon: AlertCircle,
  },
  warning: {
    className: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
    icon: AlertTriangle,
  },
  info: {
    className: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
    icon: Info,
  },
  success: {
    className: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30',
    icon: CheckCircle,
  },
};

// Components
const Sidebar: React.FC<{
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}> = ({ activeView, onViewChange, isCollapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments' as ViewMode, label: 'Appointments', icon: CalendarCheck },
    { id: 'children' as ViewMode, label: 'Children', icon: Users },
    { id: 'inventory' as ViewMode, label: 'Inventory', icon: Package },
    { id: 'reports' as ViewMode, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as ViewMode, label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 z-30 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">ImmuniTrack</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Health Worker</p>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto" />
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : ''}`} />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                NW
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Nurse Wambui
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  wambui@immunitrack.com
                </p>
              </div>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
              NW
            </div>
            <button className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

const Header: React.FC<{
  greeting: string;
  facilityName: string;
  date: string;
  onInventoryClick: () => void;
  onRegisterClick: () => void;
}> = ({ greeting, facilityName, date, onInventoryClick, onRegisterClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-primary-600 to-secondary-600"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="white" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {greeting}, Nurse Wambui! <span className="inline-block animate-wave">👩‍⚕️</span>
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              {facilityName} • {date}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onInventoryClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors text-sm font-medium"
            >
              <PackageSearch className="h-4 w-4" />
              Inventory
            </button>
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-primary-700 rounded-xl hover:bg-white/90 transition-colors text-sm font-medium shadow-lg"
            >
              <UserPlus className="h-4 w-4" />
              Register Child
            </button>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+4 vs yesterday</span>
          </div>
          <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>24 children today</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsGrid: React.FC<{
  appointments: number;
  vaccinations: number;
  children: number;
  alerts: number;
  onStatClick?: (stat: string) => void;
}> = ({ appointments, vaccinations, children, alerts, onStatClick }) => {
  const stats = [
    {
      id: 'appointments',
      label: "Today's Appointments",
      value: appointments,
      subtitle: '3 remaining',
      icon: CalendarCheck,
      color: 'primary',
      trend: null,
    },
    {
      id: 'vaccinations',
      label: 'Vaccinations Given',
      value: vaccinations,
      subtitle: null,
      icon: Syringe,
      color: 'success',
      trend: { value: 4, direction: 'up', label: 'vs yesterday' },
    },
    {
      id: 'children',
      label: 'Children Seen',
      value: children,
      subtitle: 'Today',
      icon: Users,
      color: 'info',
      trend: null,
    },
    {
      id: 'alerts',
      label: 'Stock Alerts',
      value: alerts,
      subtitle: 'Require attention',
      icon: AlertTriangle,
      color: 'warning',
      trend: null,
    },
  ];

  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-950/30',
      text: 'text-primary-700 dark:text-primary-400',
      icon: 'text-primary-600 dark:text-primary-400',
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: 'text-amber-600 dark:text-amber-400',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];
        
        return (
          <motion.div
            key={stat.id}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStatClick?.(stat.id)}
            className={`
              rounded-xl p-5 border border-gray-200 dark:border-gray-800 
              bg-white dark:bg-gray-900 shadow-sm hover:shadow-md 
              transition-all cursor-pointer
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                <Icon className={`h-5 w-5 ${colors.icon}`} />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.trend.value}%</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const AppointmentsSection: React.FC<{
  appointments: Appointment[];
  upcoming: Appointment[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRecordClick: (appointmentId: string) => void;
}> = ({ appointments, upcoming, searchTerm, onSearchChange, onRecordClick }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
  
  const filteredAppointments = appointments.filter(
    (a) =>
      a.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.vaccine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appointments</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage today's schedule</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search child or vaccine..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('today')}
              className={`
                pb-3 px-1 text-sm font-medium border-b-2 transition-colors
                ${activeTab === 'today'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }
              `}
            >
              Today ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`
                pb-3 px-1 text-sm font-medium border-b-2 transition-colors
                ${activeTab === 'upcoming'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }
              `}
            >
              Upcoming ({upcoming.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {(activeTab === 'today' ? filteredAppointments : upcoming).map((appt) => {
                const StatusIcon = statusConfig[appt.status].icon;
                return (
                  <motion.div
                    key={appt.id}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="group relative flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                        {appt.childName.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      {/* Details */}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {appt.childName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appt.age} • {appt.vaccine}
                        </p>
                        {appt.parentName && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Parent: {appt.parentName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Time & Status */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{appt.time}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[appt.status].className}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusConfig[appt.status].label}</span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordClick(appt.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg"
                      >
                        Record
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ChildrenTable: React.FC<{
  children: Child[];
  onViewAll: () => void;
  onViewChild: (childId: string) => void;
}> = ({ children, onViewAll, onViewChild }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Children</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Recently attended patients</p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          View All <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Child</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Last Visit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {children.map((child) => (
              <motion.tr
                key={child.id}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                onClick={() => onViewChild(child.id)}
                className="cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                      <span className="text-secondary-700 dark:text-secondary-400 text-sm font-medium">
                        {child.firstName[0]}{child.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {child.gender}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {child.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  {child.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 dark:bg-primary-400 rounded-full"
                        style={{ width: `${child.completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{child.completion}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const AlertsWidget: React.FC<{
  alerts: Alert[];
  onViewAll: () => void;
}> = ({ alerts, onViewAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h2>
          {alerts.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          View All
        </button>
      </div>

      <div className="p-6 space-y-3">
        {alerts.slice(0, 3).map((alert) => {
          const AlertIcon = alertTypeConfig[alert.type].icon;
          return (
            <motion.div
              key={alert.id}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-4 rounded-xl border ${alertTypeConfig[alert.type].className}`}
            >
              <div className="flex items-start gap-3">
                <AlertIcon className={`h-5 w-5 mt-0.5 shrink-0 ${
                  alert.type === 'critical' ? 'text-rose-600' :
                  alert.type === 'warning' ? 'text-amber-600' :
                  alert.type === 'info' ? 'text-blue-600' :
                  'text-emerald-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">{alert.time}</span>
                    {alert.actionable && (
                      <button className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        {alert.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const QueueSummary: React.FC<{
  queue: QueueSummary;
}> = ({ queue }) => {
  const queueItems = [
    { label: 'Checked In', count: queue.checkedIn, icon: CheckCircle2, color: 'text-primary-600' },
    { label: 'Waiting', count: queue.waiting, icon: Clock, color: 'text-amber-600' },
    { label: 'Completed', count: queue.completed, icon: Syringe, color: 'text-emerald-600' },
    { label: 'No-shows', count: queue.noShows, icon: XCircle, color: 'text-rose-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Queue</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Today's status</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {queueItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Icon className={`h-6 w-6 ${item.color} mx-auto mb-2`} />
                <p className="text-xl font-bold text-gray-900 dark:text-white">{item.count}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const InventorySummary: React.FC<{
  stockItems: StockItem[];
  onManage: () => void;
}> = ({ stockItems, onManage }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vaccine Stock</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current inventory levels</p>
        </div>
        <button
          onClick={onManage}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          Manage <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {stockItems.slice(0, 6).map((item) => {
          const StatusIcon = stockStatusConfig[item.status].icon;
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${stockStatusConfig[item.status].className}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.vaccine}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.stock} doses</span>
                {item.status !== 'ok' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status === 'critical'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {item.status === 'critical' ? 'Critical' : 'Low'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
const HealthWorkerDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Get current user from auth
  const { user } = useAuth();

  // Fetch real-time stats
  const { data: realtimeStats, isLoading: realtimeLoading } = useGetRealTimeStatsQuery(undefined, {
    pollingInterval: 60000,
  });

  // Fetch dashboard metrics
  const today = new Date().toISOString().split('T')[0];
  const { data: dashboardMetrics, isLoading: metricsLoading } = useGetDashboardMetricsQuery(
    { startDate: today, endDate: today },
    { skip: !user }
  );

  // Fetch children list
  const { data: childrenData, isLoading: childrenLoading } = useGetChildrenQuery(
    { page: 1, limit: 10 },
    { skip: !user }
  );

  // Fetch inventory
  const { data: inventoryData, isLoading: inventoryLoading } = useGetInventoryQuery(
    { facilityId: user?.healthWorker?.facility?.id },
    { skip: !user?.healthWorker?.facility?.id }
  );

  // Fetch stock alerts
  const { data: alertsData, isLoading: alertsLoading } = useGetStockAlertsQuery(
    { facilityId: user?.healthWorker?.facility?.id },
    { skip: !user?.healthWorker?.facility?.id, pollingInterval: 300000 }
  );

  // Fetch upcoming schedules
  const { data: upcomingData, isLoading: upcomingLoading } = useGetUpcomingSchedulesQuery(7);

  // Fetch today's schedules
  const { data: schedulesData, isLoading: schedulesLoading } = useGetSchedulesQuery({
    startDate: new Date().toISOString().split('T')[0],
  });

  // Transform API data to component format
  const appointments: Appointment[] = React.useMemo(() => {
    if (!schedulesData) return [];
    return schedulesData.map((schedule: any) => ({
      id: schedule.id,
      childName: schedule.child?.firstName ? `${schedule.child.firstName} ${schedule.child.lastName || ''}` : 'Unknown',
      age: schedule.child?.dateOfBirth ? 
        `${Math.floor((new Date().getTime() - new Date(schedule.child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30))} months` : 'Unknown',
      vaccine: schedule.vaccine?.name || schedule.vaccineName || 'N/A',
      time: new Date(schedule.scheduledDate).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
      status: (schedule.status === 'COMPLETED' ? 'completed' : 
              schedule.status === 'CANCELLED' ? 'no-show' :
              schedule.status === 'IN_PROGRESS' ? 'waiting' : 'scheduled') as AppointmentStatus,
      parentName: schedule.child?.parent?.firstName ? `${schedule.child.parent.firstName} ${schedule.child.parent.lastName || ''}` : undefined,
      parentPhone: schedule.child?.parent?.phoneNumber,
    }));
  }, [schedulesData]);

  const upcomingAppointments: Appointment[] = React.useMemo(() => {
    if (!upcomingData) return [];
    return upcomingData.map((schedule: any) => ({
      id: schedule.id,
      childName: schedule.child?.firstName ? `${schedule.child.firstName} ${schedule.child.lastName || ''}` : 'Unknown',
      age: schedule.child?.dateOfBirth ? 
        `${Math.floor((new Date().getTime() - new Date(schedule.child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30))} months` : 'Unknown',
      vaccine: schedule.vaccine?.name || schedule.vaccineName || 'N/A',
      time: new Date(schedule.scheduledDate).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' }),
      status: 'scheduled' as AppointmentStatus,
      parentName: schedule.child?.parent?.firstName ? `${schedule.child.parent.firstName} ${schedule.child.parent.lastName || ''}` : undefined,
    }));
  }, [upcomingData]);

  const dashboardChildren: Child[] = React.useMemo(() => {
    if (!childrenData?.data) return [];
    return childrenData.data.map((child: any) => ({
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      age: child.dateOfBirth ? 
        `${Math.floor((new Date().getTime() - new Date(child.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30))} months` : 'Unknown',
      gender: child.gender as 'Male' | 'Female' | 'Other',
      dateOfBirth: child.dateOfBirth,
      lastVisit: child.lastVisit ? new Date(child.lastVisit).toLocaleDateString() : 'Never',
      completion: child.completionRate || 0,
      parentName: child.parent?.firstName ? `${child.parent.firstName} ${child.parent.lastName || ''}` : 'N/A',
      parentPhone: child.parent?.phoneNumber || 'N/A',
      vaccinations: [],
    }));
  }, [childrenData]);

  const stockItems: StockItem[] = React.useMemo(() => {
    if (!inventoryData?.data) return [];
    return inventoryData.data.map((item: any) => ({
      id: item.id,
      vaccine: item.vaccine?.name || item.vaccineName || 'Unknown',
      stock: item.quantity || 0,
      threshold: item.threshold || 10,
      status: (item.quantity <= 0 ? 'critical' : 
              item.quantity <= item.threshold ? 'low' : 'ok') as StockStatus,
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
      manufacturer: item.manufacturer,
    }));
  }, [inventoryData]);

  const alerts: Alert[] = React.useMemo(() => {
    if (!alertsData) return [];
    return alertsData.map((alert: any) => ({
      id: alert.id,
      type: (alert.severity === 'HIGH' ? 'critical' : 
             alert.severity === 'MEDIUM' ? 'warning' : 'info') as AlertType,
      title: alert.title || alert.message,
      message: alert.message,
      time: alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Recently',
      actionable: true,
      actionLabel: 'View',
    }));
  }, [alertsData]);

  // Calculate queue summary from schedules
  const queueSummary: QueueSummary = React.useMemo(() => {
    if (!schedulesData) return { checkedIn: 0, waiting: 0, completed: 0, noShows: 0 };
    return {
      checkedIn: schedulesData.filter((s: any) => s.status === 'CHECKED_IN').length,
      waiting: schedulesData.filter((s: any) => s.status === 'IN_PROGRESS').length,
      completed: schedulesData.filter((s: any) => s.status === 'COMPLETED').length,
      noShows: schedulesData.filter((s: any) => s.status === 'NO_SHOW' || s.status === 'CANCELLED').length,
    };
  }, [schedulesData]);

  // Get stats from API data
  const stats = {
    appointments: realtimeStats?.pendingAppointments || appointments.length,
    vaccinations: realtimeStats?.todayVaccinations || dashboardMetrics?.totalVaccinations || 0,
    children: dashboardChildren.length,
    alerts: alerts.length,
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get user info
  const facilityName = user?.healthWorker?.facility?.name || 'Your Facility';

  const handleRecordClick = (appointmentId: string) => {
    console.log('Record vaccination for appointment:', appointmentId);
  };

  const handleViewChild = (childId: string) => {
    console.log('View child profile:', childId);
  };

  const handleInventoryClick = () => {
    setActiveView('inventory');
  };

  const handleRegisterClick = () => {
    console.log('Register new child');
  };

  // Show loading state
  const isLoading = realtimeLoading || metricsLoading || childrenLoading || inventoryLoading || alertsLoading || schedulesLoading || upcomingLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300
          ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}
          p-4 md:p-6 lg:p-8
        `}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <Header
            greeting={greeting}
            facilityName={facilityName}
            date={currentDate}
            onInventoryClick={handleInventoryClick}
            onRegisterClick={handleRegisterClick}
          />

          {/* Stats Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <StatsGrid
              appointments={stats.appointments}
              vaccinations={stats.vaccinations}
              children={stats.children}
              alerts={stats.alerts}
              onStatClick={(stat) => console.log('Stat clicked:', stat)}
            />
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Appointments & Children */}
            <div className="lg:col-span-2 space-y-6">
              <AppointmentsSection
                appointments={appointments}
                upcoming={upcomingAppointments}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRecordClick={handleRecordClick}
              />

              <ChildrenTable
                children={dashboardChildren}
                onViewAll={() => setActiveView('children')}
                onViewChild={handleViewChild}
              />
            </div>

            {/* Right Column - Alerts, Queue, Inventory */}
            <div className="space-y-6">
              <AlertsWidget
                alerts={alerts}
                onViewAll={() => setActiveView('reports')}
              />

              <QueueSummary queue={queueSummary} />

              <InventorySummary
                stockItems={stockItems}
                onManage={() => setActiveView('inventory')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthWorkerDashboard;
