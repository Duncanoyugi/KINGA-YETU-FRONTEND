import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getDueStatus, getDueStatusColor } from '@/utils/dateHelpers';
import { Badge } from '@/components/common/Badge';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface Vaccination {
  id: string;
  childName: string;
  vaccineName: string;
  dueDate: string;
  status: 'upcoming' | 'due' | 'overdue';
}

interface UpcomingVaccinationsProps {
  vaccinations: Vaccination[];
  loading?: boolean;
}

export const UpcomingVaccinations: React.FC<UpcomingVaccinationsProps> = ({
  vaccinations,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Vaccinations</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Vaccinations</h3>
          <Link
            to="/appointments"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {vaccinations.length === 0 ? (
          <p className="p-6 text-sm text-gray-500 text-center">
            No upcoming vaccinations scheduled
          </p>
        ) : (
          vaccinations.map((vaccination) => {
            const status = getDueStatus(vaccination.dueDate);
            const statusColor = getDueStatusColor(status);
            
            return (
              <div key={vaccination.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vaccination.childName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vaccination.vaccineName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(vaccination.dueDate)}
                    </span>
                    <Badge variant={statusColor}>
                      {status === 'due' ? 'Due Soon' : status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingVaccinations;