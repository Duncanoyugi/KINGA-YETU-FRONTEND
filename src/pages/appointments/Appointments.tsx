import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  PlusIcon, 
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock data for appointments
const mockAppointments = [
  { id: '1', childName: 'John Doe', vaccine: 'Polio', date: '2024-02-20', time: '09:00', status: 'SCHEDULED' },
  { id: '2', childName: 'Jane Smith', vaccine: 'MMR', date: '2024-02-21', time: '10:30', status: 'PENDING' },
  { id: '3', childName: 'Bob Johnson', vaccine: 'Hepatitis B', date: '2024-02-19', time: '11:00', status: 'COMPLETED' },
  { id: '4', childName: 'Alice Brown', vaccine: 'DTP', date: '2024-02-22', time: '14:00', status: 'CANCELLED' },
];

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
};

const statusIcons: Record<string, React.ReactNode> = {
  SCHEDULED: <ClockIcon className="h-4 w-4" />,
  COMPLETED: <CheckCircleIcon className="h-4 w-4" />,
  CANCELLED: <XCircleIcon className="h-4 w-4" />,
  PENDING: <ClockIcon className="h-4 w-4" />,
};

export const Appointments: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage vaccination appointments
          </p>
        </div>
        <Button
          onClick={() => navigate('/appointments/new')}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold">{mockAppointments.length}</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-bold">
              {mockAppointments.filter(a => a.status === 'COMPLETED').length}
            </p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold">
              {mockAppointments.filter(a => a.status === 'PENDING').length}
            </p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-xl font-bold">
              {mockAppointments.filter(a => a.status === 'CANCELLED').length}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/appointments/${appointment.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.childName}</p>
                  <p className="text-sm text-gray-500">{appointment.vaccine}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                  <p className="text-sm text-gray-500">{appointment.time}</p>
                </div>
                <Badge className={statusColors[appointment.status]}>
                  <span className="flex items-center gap-1">
                    {statusIcons[appointment.status]}
                    {appointment.status}
                  </span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Appointments;
