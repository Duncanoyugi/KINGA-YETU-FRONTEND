import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  CalendarIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/features/children/childrenHooks';
import { useVaccineInventory, useVaccineAlerts } from '@/features/vaccines/vaccinesHooks';
import type { StockAlert } from '@/features/vaccines/vaccinesTypes';
import { useNotifications } from '@/features/notifications/notificationsHooks';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { StatsCard } from '@/components/widgets/StatsCard';
import { AlertsWidget } from '@/components/widgets/AlertsWidget';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { formatDate, formatAge } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

export const HealthWorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children, isLoading: childrenLoading } = useChildren();
  const { getLowStockItems } = useVaccineInventory(user?.healthWorker?.facility?.id);
  useNotifications(user?.id);
  const { getWarningAlerts } = useVaccineAlerts(user?.healthWorker?.facility?.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'today' | 'upcoming' | 'all'>('today');

  const lowStockItems = getLowStockItems(10);

  // Mock data for today's appointments
  const todayAppointments = [
    {
      id: '1',
      childName: 'Baby John',
      age: '6 months',
      vaccine: 'BCG',
      time: '09:00 AM',
      status: 'checked-in',
    },
    {
      id: '2',
      childName: 'Baby Mary',
      age: '10 weeks',
      vaccine: 'OPV',
      time: '10:30 AM',
      status: 'waiting',
    },
    {
      id: '3',
      childName: 'Baby Peter',
      age: '14 weeks',
      vaccine: 'DPT',
      time: '11:45 AM',
      status: 'scheduled',
    },
  ];

  if (childrenLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.healthWorker?.facility?.name} • {formatDate(new Date().toISOString(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ClipboardDocumentListIcon className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.VACCINE_INVENTORY)}
          >
            Inventory
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusCircleIcon className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.ADD_CHILD)}
          >
            Register Child
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={<CalendarIcon className="h-6 w-6" />}
          color="primary"
        />
        <StatsCard
          title="Children Seen"
          value="24"
          icon={<UserGroupIcon className="h-6 w-6" />}
          color="success"
          trend={{
            value: 12,
            direction: 'up',
            label: 'vs yesterday',
          }}
        />
        <StatsCard
          title="Vaccinations Today"
          value="18"
          icon={<BeakerIcon className="h-6 w-6" />}
          color="info"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={<ExclamationCircleIcon className="h-6 w-6" />}
          color="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Tabs */}
          <Card>
            <Card.Body>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search patients by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTab('today')}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedTab === 'today'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setSelectedTab('upcoming')}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedTab === 'upcoming'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedTab === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    All
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Appointments List */}
          <Card>
            <Card.Header title="Today's Schedule" />
            <Card.Body>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate(ROUTES.CHILD_PROFILE.replace(':id', '1'))}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {appointment.childName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.childName}</h4>
                        <p className="text-sm text-gray-500">
                          {appointment.age} • {appointment.vaccine}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{appointment.time}</span>
                      <Badge
                        variant={
                          appointment.status === 'checked-in' ? 'success' :
                          appointment.status === 'waiting' ? 'warning' : 'default'
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(ROUTES.RECORD_VACCINATION.replace(':appointmentId', appointment.id));
                        }}
                      >
                        Record
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Recent Children */}
          <Card>
            <Card.Header
              title="Recent Children"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.CHILDREN_LIST)}
                >
                  View All
                </Button>
              }
            />
            <Card.Body>
              <Table
                data={children?.slice(0, 5) || []}
                columns={[
                  {
                    header: 'Child',
                    accessor: (row) => (
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">
                            {row.firstName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {row.firstName} {row.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {row.uniqueIdentifier}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: 'Age',
                    accessor: (row) => formatAge(row.dateOfBirth),
                  },
                  {
                    header: 'Last Visit',
                    accessor: (row) => {
                      // Calculate last visit from immunizations
                      if (!row.immunizations || row.immunizations.length === 0) {
                        return 'Never';
                      }
                      const dates = row.immunizations
                        .map((imm) => new Date(imm.dateAdministered).getTime())
                        .filter((date) => !isNaN(date));
                      if (dates.length === 0) return 'Never';
                      const lastDate = new Date(Math.max(...dates));
                      return formatDate(lastDate.toISOString());
                    },
                  },
                  {
                    header: 'Actions',
                    accessor: (row) => (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(ROUTES.CHILD_PROFILE.replace(':id', row.id));
                        }}
                      >
                        View
                      </Button>
                    ),
                  },
                ]}
              />
            </Card.Body>
          </Card>
        </div>

        {/* Right Column - Alerts and Inventory */}
        <div className="lg:col-span-1 space-y-6">
          {/* Alerts */}
          <AlertsWidget
            alerts={getWarningAlerts().slice(0, 5).map((alert: StockAlert) => ({
              id: alert.vaccineId,
              type: alert.status === 'LOW_STOCK' ? 'warning' as const : 'warning' as const,
              title: alert.status === 'LOW_STOCK' ? 'Low Stock Alert' : 'Expiring Soon',
              message: alert.status === 'LOW_STOCK' 
                ? `${alert.vaccineName} - Only ${alert.currentQuantity} doses remaining`
                : `${alert.vaccineName} - Batch ${alert.batchNumber} expires in ${alert.daysUntilExpiry} days`,
              timestamp: alert.expiryDate,
              actionable: true,
              actionLabel: 'View',
              onAction: () => navigate(ROUTES.VACCINE_INVENTORY),
            }))}
            onViewAll={() => navigate(ROUTES.NOTIFICATIONS)}
          />

          {/* Quick Stats */}
          <Card>
            <Card.Header title="Today's Summary" />
            <Card.Body>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Checked-in</span>
                  <span className="font-medium text-gray-900">4 patients</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Waiting</span>
                  <span className="font-medium text-gray-900">3 patients</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-gray-900">12 patients</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">No-shows</span>
                  <span className="font-medium text-gray-900">1 patient</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Vaccine Stock Summary */}
          <Card>
            <Card.Header title="Vaccine Stock" />
            <Card.Body>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">BCG</span>
                  <span className="font-medium text-gray-900">45 doses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">OPV</span>
                  <span className="font-medium text-gray-900">128 doses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">DPT</span>
                  <span className="font-medium text-yellow-600">23 doses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Measles</span>
                  <span className="font-medium text-red-600">8 doses</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthWorkerDashboard;