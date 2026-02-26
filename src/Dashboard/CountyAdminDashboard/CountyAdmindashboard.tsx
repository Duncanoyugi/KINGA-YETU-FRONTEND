import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  BarChart3,
  Map,
  TrendingUp,
  AlertTriangle,
  FileText,
  Landmark,
  Truck,
  ThermometerSnowflake,
  ChevronDown,
  Bell,
  Search,
  Menu,
  LogOut,
  Home,
  Settings,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Eye,
  Edit,
  MoreVertical,
  PlusCircle,
  Calendar,
  ClipboardList,
  Zap,
  Filter,
  Download,
  Layers,
  UserCog,
  HelpCircle,
  Baby,
  Stethoscope,
  Syringe,
  Users2,
  Settings2,
  Ambulance,
} from "lucide-react";
import { useGetCountyAdminDashboardQuery } from "@/features/analytics/analyticsAPI";

// TypeScript interfaces
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<any>;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary" | "purple";
  className?: string;
}

interface ProgressProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  color?: "primary" | "success" | "warning" | "danger" | "info" | "purple";
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<any>;
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

// Custom Card Components
const Card: React.FC<CardProps> = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
      hover ? "hover:shadow-lg hover:border-primary-200 transition-all duration-300" : ""
    } ${className}`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => (
  <div className={`p-5 border-b border-gray-100 ${className}`}>{children}</div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = "", icon: Icon }) => (
  <div className="flex items-center gap-2">
    {Icon && (
      <div className="p-2 bg-primary-50 rounded-lg">
        <Icon className="h-4 w-4 text-primary-600" />
      </div>
    )}
    <h3 className={`text-sm font-semibold text-gray-900 ${className}`}>{children}</h3>
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    primary: "bg-primary-100 text-primary-800",
    purple: "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

const Progress: React.FC<ProgressProps> = ({ value, size = "md", showValue = false, color = "primary" }) => {
  const sizes: Record<string, string> = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const colors: Record<string, string> = {
    primary: "bg-primary-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
    info: "bg-blue-600",
    purple: "bg-purple-600",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-100 rounded-full ${sizes[size]}`}>
        <div
          className={`${colors[color]} rounded-full transition-all duration-500 ease-out ${sizes[size]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showValue && <span className="text-xs font-medium text-gray-600">{value}%</span>}
    </div>
  );
};

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon: Icon, 
  fullWidth = false, 
  className = "", 
  ...props 
}) => {
  const variants: Record<string, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
    outline: "bg-transparent text-primary-600 border border-primary-300 hover:bg-primary-50 hover:border-primary-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={`${size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4 w-4" : "h-5 w-5"}`} />}
      {children}
    </button>
  );
};

// Types for data
interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  trend: string;
  trendUp: boolean;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

interface SubCounty {
  name: string;
  coverage: number;
  facilities: number;
  population: string;
  target: number;
  healthWorkers: number;
  children: string;
  status: string;
  trend: string;
  coordinates: { lat: number; lng: number };
}

interface Facility {
  name: string;
  coverage: number;
  status: string;
  children: string;
  healthWorkers: number;
  vaccines: number;
  lastUpdated: string;
  type: string;
  contact: string;
}

interface Resource {
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  status: string;
  active?: number;
  lastChecked: string;
  capacity?: string;
}

interface Activity {
  action: string;
  facility: string;
  time: string;
  user: string;
  icon: React.ComponentType<any>;
  alert?: boolean;
}

interface Appointment {
  child: string;
  vaccine: string;
  facility: string;
  time: string;
  status: string;
  parent: string;
}

// Main Component
export default function CountyDashboard() {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("subcounties");
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Fetch real data from API
  const { data: dashboardData, isLoading, error } = useGetCountyAdminDashboardQuery();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-red-200 max-w-md">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Failed to Load Dashboard</h2>
          <p className="text-gray-600 text-center">Unable to fetch dashboard data. Please try again later.</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Transform API data to component format - Stats
  const stats: Stat[] = dashboardData ? [
    { 
      label: "County Coverage", 
      value: `${dashboardData.coverageRate || 0}%`, 
      icon: Target, 
      trend: `${dashboardData.coverageTrend || 0}%`, 
      trendUp: (dashboardData.coverageTrend || 0) >= 0,
      color: "primary",
      bgColor: "bg-primary-50",
      textColor: "text-primary-600",
      description: "vs national target of 85%"
    },
    { 
      label: "Total Facilities", 
      value: String(dashboardData.totalFacilities || 0), 
      icon: Building2, 
      trend: "+0", 
      trendUp: true,
      color: "info",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: `across ${dashboardData.subCounties?.length || 0} sub-counties`
    },
    { 
      label: "Children Registered", 
      value: String(dashboardData.totalChildren || 0), 
      icon: Baby, 
      trend: "+0", 
      trendUp: true,
      color: "success",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      description: "registered children"
    },
    { 
      label: "Active Health Workers", 
      value: String(dashboardData.totalHealthWorkers || 0), 
      icon: Stethoscope, 
      trend: "+0", 
      trendUp: true,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: "across all facilities"
    },
  ] : [
    { label: "County Coverage", value: "0%", icon: Target, trend: "+0%", trendUp: true, color: "primary", bgColor: "bg-primary-50", textColor: "text-primary-600", description: "vs national target of 85%" },
    { label: "Total Facilities", value: "0", icon: Building2, trend: "+0", trendUp: true, color: "info", bgColor: "bg-blue-50", textColor: "text-blue-600", description: "across 0 sub-counties" },
    { label: "Children Registered", value: "0", icon: Baby, trend: "+0", trendUp: true, color: "success", bgColor: "bg-green-50", textColor: "text-green-600", description: "registered children" },
    { label: "Active Health Workers", value: "0", icon: Stethoscope, trend: "+0", trendUp: true, color: "purple", bgColor: "bg-purple-50", textColor: "text-purple-600", description: "across all facilities" },
  ];

  // Sub-county stats from API
  const subCountyStats: SubCounty[] = dashboardData?.subCounties?.map((sc: any) => ({
    name: sc.name || "Unknown",
    coverage: sc.coverageRate || 0,
    facilities: sc.facilityCount || 0,
    population: sc.population || "0",
    target: 85,
    healthWorkers: sc.healthWorkerCount || 0,
    children: String(sc.childCount || 0),
    status: sc.coverageRate >= 85 ? "exceeding" : sc.coverageRate >= 70 ? "on-track" : sc.coverageRate >= 60 ? "behind" : "critical",
    trend: `${sc.coverageTrend || 0}%`,
    coordinates: { lat: sc.latitude || 0, lng: sc.longitude || 0 }
  })) || [];

  // Facility stats from API
  const facilityStats: Facility[] = dashboardData?.facilities?.slice(0, 5).map((facility: any) => ({
    name: facility.name || "Unknown Facility",
    coverage: facility.coverageRate || 0,
    status: facility.coverageRate >= 85 ? "excellent" : facility.coverageRate >= 70 ? "good" : "needs-improvement",
    children: String(facility.childCount || 0),
    healthWorkers: facility.healthWorkerCount || 0,
    vaccines: facility.vaccineDosesAdministered || 0,
    lastUpdated: "Just now",
    type: facility.type || "Level 3",
    contact: facility.phoneNumber || "N/A"
  })) || [];

  // Resources from API
  const resources: Resource[] = [
    { label: "Vaccine Fridges", value: dashboardData?.vaccineFridges || 0, icon: ThermometerSnowflake, status: "operational", capacity: "85%", lastChecked: "1 hour ago" },
    { label: "Cold Chain Trucks", value: dashboardData?.coldChainTrucks || 0, icon: Truck, status: "on-route", active: dashboardData?.coldChainTrucks || 0, lastChecked: "30 mins ago" },
    { label: "Mobile Clinics", value: dashboardData?.mobileClinics || 0, icon: Ambulance, status: "deployed", active: dashboardData?.mobileClinics || 0, lastChecked: "2 hours ago" },
  ];

  // Recent activities from API
  const recentActivities: Activity[] = dashboardData?.recentActivities?.map((activity: any) => ({
    action: activity.action || "Unknown action",
    facility: activity.facilityName || "Unknown facility",
    time: activity.timeAgo || "Just now",
    user: activity.performedBy || "System",
    icon: activity.actionType === 'alert' ? AlertTriangle : activity.actionType === 'vaccine' ? Syringe : activity.actionType === 'child' ? Baby : FileText,
    alert: activity.actionType === 'alert'
  })) || [{ action: "No recent activity", facility: "-", time: "-", user: "-", icon: Activity }];

  // Upcoming appointments from API
  const upcomingAppointments: Appointment[] = dashboardData?.upcomingAppointments?.map((apt: any) => ({
    child: apt.childName || "Unknown",
    vaccine: apt.vaccineName || "Unknown",
    facility: apt.facilityName || "Unknown",
    time: apt.scheduledTime || "-",
    status: apt.status || "pending",
    parent: apt.parentName || "Unknown"
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Matching the photos */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center gap-2 px-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Syringe className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">ImmuniTrack</span>
              <span className="block text-xs text-gray-500">County Admin</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
            </div>
            
            {[
              { name: "Dashboard", icon: Home, active: true },
              { name: "Sub-Counties", icon: Layers },
              { name: "Facilities", icon: Building2 },
              { name: "Health Workers", icon: Users2 },
              { name: "Coverage Map", icon: Map },
            ].map((item) => (
              <button
                key={item.name}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                  ${item.active 
                    ? "bg-primary-50 text-primary-600 border-l-3 border-primary-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${item.active ? "text-primary-600" : "text-gray-400"}`} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}

            <div className="px-3 mt-4 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Analytics</p>
            </div>

            {[
              { name: "Analytics", icon: BarChart3 },
              { name: "Performance", icon: Activity },
              { name: "Reports", icon: FileText },
            ].map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}

            <div className="px-3 mt-4 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</p>
            </div>

            {[
              { name: "Notifications", icon: Bell },
              { name: "Settings", icon: Settings2 },
            ].map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}

            <div className="px-3 mt-4 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parent Dashboard</p>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="font-medium">Parent Portal</span>
            </button>

            <div className="px-3 mt-4 mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    Nairobi County Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Monitor immunization coverage across the county
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="ml-2 bg-transparent border-none focus:outline-none text-sm w-48"
                  />
                </div>

                {/* Time Range Selector */}
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="hidden md:block h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {recentActivities.map((activity, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                              <div className="flex gap-3">
                                <div className={`p-2 rounded-lg ${
                                  activity.alert ? 'bg-red-100' : 'bg-gray-100'
                                }`}>
                                  <activity.icon className={`h-4 w-4 ${
                                    activity.alert ? 'text-red-600' : 'text-gray-600'
                                  }`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{activity.facility}</p>
                                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-gray-100">
                          <Button variant="ghost" size="sm">View All</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Generate Report Button */}
                <Button variant="primary" size="sm" icon={FileText}>
                  Generate Report
                </Button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <UserCog className="h-4 w-4 text-primary-600" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">Dr. Jane Smith</p>
                          <p className="text-xs text-gray-500">County Admin</p>
                        </div>
                        <div className="p-2">
                          {[
                            { name: "Profile", icon: UserCog },
                            { name: "Settings", icon: Settings },
                            { name: "Help", icon: HelpCircle },
                          ].map((item) => (
                            <button
                              key={item.name}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                              <item.icon className="h-4 w-4" />
                              {item.name}
                            </button>
                          ))}
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                            <LogOut className="h-4 w-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl border border-red-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">Attention Needed</h4>
                    <p className="text-sm text-red-700 mt-1">
                      3 facilities have coverage below 70%
                    </p>
                    <button className="text-xs font-medium text-red-700 hover:text-red-800 mt-2 underline underline-offset-2">
                      View facilities →
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-800">Positive Trend</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Coverage improved by 5% this month
                    </p>
                    <button className="text-xs font-medium text-green-700 hover:text-green-800 mt-2 underline underline-offset-2">
                      View details →
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                        </div>
                        <Badge variant={stat.trendUp ? "success" : "danger"}>
                          {stat.trend}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">vs last month</span>
                          <span className={`font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tabs Section */}
            <Card>
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">County Overview</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={Filter}>Filter</Button>
                    <Button variant="ghost" size="sm" icon={Download}>Export</Button>
                  </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex gap-1 mt-4">
                  {[
                    { id: "subcounties", label: "Sub-Counties", icon: Layers },
                    { id: "facilities", label: "Facilities", icon: Building2 },
                    { id: "resources", label: "Resources", icon: ThermometerSnowflake },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                        ${selectedTab === tab.id
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      <tab.icon className={`h-4 w-4 ${
                        selectedTab === tab.id ? "text-primary-600" : "text-gray-400"
                      }`} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <AnimatePresence mode="wait">
                  {/* Sub-Counties Tab */}
                  {selectedTab === "subcounties" && (
                    <motion.div
                      key="subcounties"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Sub-County Performance */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-primary-600" />
                            Sub-County Performance
                          </h3>
                          {subCountyStats.map((sc) => (
                            <motion.div
                              key={sc.name}
                              whileHover={{ scale: 1.02 }}
                              className="p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="text-sm font-semibold text-gray-900">{sc.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant={
                                        sc.status === "exceeding" ? "success" :
                                        sc.status === "on-track" ? "info" :
                                        sc.status === "behind" ? "warning" : "danger"
                                      }
                                    >
                                      {sc.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{sc.facilities} facilities</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold text-gray-900">{sc.coverage}%</span>
                                  <span className={`text-xs ml-1 ${
                                    sc.trend.includes('+') ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {sc.trend}
                                  </span>
                                </div>
                              </div>
                              <Progress value={sc.coverage} size="md" color={
                                sc.coverage >= 85 ? "success" :
                                sc.coverage >= 70 ? "warning" : "danger"
                              } />
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>👥 {sc.population} population</span>
                                <span>🏥 {sc.healthWorkers} health workers</span>
                                <span>👶 {sc.children} children</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Target vs Achievement */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary-600" />
                            Target vs Achievement
                          </h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {subCountyStats.map((sc) => (
                                  <motion.div
                                    key={sc.name}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{sc.name}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {sc.coverage}% vs {sc.target}% target
                                      </p>
                                    </div>
                                    <Badge
                                      variant={sc.coverage >= sc.target ? "success" : "warning"}
                                      className="flex items-center gap-1"
                                    >
                                      {sc.coverage >= sc.target ? (
                                        <><CheckCircle className="h-3 w-3" /> On Track</>
                                      ) : (
                                        <><AlertCircle className="h-3 w-3" /> Below Target</>
                                      )}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>

                              {/* Summary Stats */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-xs text-green-700">On Track</p>
                                    <p className="text-lg font-bold text-green-800">2/5</p>
                                  </div>
                                  <div className="p-3 bg-yellow-50 rounded-lg">
                                    <p className="text-xs text-yellow-700">Below Target</p>
                                    <p className="text-lg font-bold text-yellow-800">3/5</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Facilities Tab */}
                  {selectedTab === "facilities" && (
                    <motion.div
                      key="facilities"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary-600" />
                          Facility Performance
                        </h3>
                        <Button variant="outline" size="sm" icon={PlusCircle}>
                          Add Facility
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {facilityStats.map((facility, index) => (
                          <motion.div
                            key={facility.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  facility.status === "excellent" ? "bg-green-100" :
                                  facility.status === "good" ? "bg-blue-100" : "bg-yellow-100"
                                }`}>
                                  <Building2 className={`h-5 w-5 ${
                                    facility.status === "excellent" ? "text-green-600" :
                                    facility.status === "good" ? "text-blue-600" : "text-yellow-600"
                                  }`} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900">{facility.name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant={
                                        facility.status === "excellent" ? "success" :
                                        facility.status === "good" ? "info" : "warning"
                                      }
                                      className="text-xs"
                                    >
                                      {facility.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{facility.type}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-gray-900">{facility.coverage}%</span>
                                <p className="text-xs text-gray-500 mt-0.5">Coverage</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Children</p>
                                <p className="text-sm font-semibold text-gray-900">{facility.children}</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Health Workers</p>
                                <p className="text-sm font-semibold text-gray-900">{facility.healthWorkers}</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Vaccines</p>
                                <p className="text-sm font-semibold text-gray-900">{facility.vaccines}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-500">{facility.contact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-500">Updated {facility.lastUpdated}</span>
                              </div>
                              <div className="flex gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Eye className="h-3 w-3 text-gray-500" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Edit className="h-3 w-3 text-gray-500" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MoreVertical className="h-3 w-3 text-gray-500" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Resources Tab */}
                  {selectedTab === "resources" && (
                    <motion.div
                      key="resources"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {resources.map((resource, index) => (
                          <motion.div
                            key={resource.label}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-primary-50 rounded-xl">
                                <resource.icon className="h-6 w-6 text-primary-600" />
                              </div>
                              <Badge variant="success" className="text-xs">
                                {resource.status}
                              </Badge>
                            </div>
                            <p className="text-3xl font-extrabold text-gray-900">{resource.value}</p>
                            <p className="text-sm text-gray-600 mt-1">{resource.label}</p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Active: {resource.active || resource.value}</span>
                                <span className="text-gray-500">Last: {resource.lastChecked}</span>
                              </div>
                              {resource.capacity && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">Capacity</span>
                                    <span className="text-gray-700">{resource.capacity}</span>
                                  </div>
                                  <Progress value={parseInt(resource.capacity)} size="sm" color="primary" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Resource Distribution Map Placeholder */}
                      <Card>
                        <CardHeader>
                          <CardTitle icon={Map}>Resource Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                              <Map className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Interactive map view coming soon</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Quick Actions and Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle icon={Zap}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" icon={Building2}>
                      Manage Facilities
                    </Button>
                    <Button variant="outline" size="sm" icon={Users}>
                      Health Workers
                    </Button>
                    <Button variant="outline" size="sm" icon={Map}>
                      Geographic Data
                    </Button>
                    <Button variant="outline" size="sm" icon={FileText}>
                      Coverage Reports
                    </Button>
                    <Button variant="outline" size="sm" icon={Calendar}>
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm" icon={ClipboardList}>
                      Inventory
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle icon={Activity}>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg ${
                          activity.alert ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <activity.icon className={`h-3 w-3 ${
                            activity.alert ? 'text-red-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.facility}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle icon={Calendar}>Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="p-1.5 bg-primary-50 rounded-lg">
                          <Baby className="h-3 w-3 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-900">{apt.child}</p>
                            <Badge
                              variant={
                                apt.status === "confirmed" ? "success" :
                                apt.status === "pending" ? "warning" : "danger"
                              }
                              className="text-[10px] px-1 py-0"
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{apt.vaccine} - {apt.facility}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">{apt.time}</span>
                            <span className="text-xs text-gray-400">{apt.parent}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" icon={Calendar} className="mt-3 w-full">
                    View All Appointments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}