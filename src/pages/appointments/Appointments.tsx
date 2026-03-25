import React from 'react';
import { useGetChildrenByParentQuery } from '@/features/children/childrenAPI';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { formatDate } from '@/utils/dateHelpers';

const Appointments: React.FC = () => {
  // Use getChildrenByParent which returns children WITH schedules
  const { data: children, isLoading: childrenLoading } = useGetChildrenByParentQuery();

  // Helper to get upcoming schedules (future dates with SCHEDULED status)
  const getUpcomingAppointments = (child: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (child.schedules || [])
      .filter((schedule: any) => {
        const dueDate = new Date(schedule.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today && schedule.status === 'SCHEDULED';
      })
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  // Helper to get past appointments (past dates or already administered)
  const getPastAppointments = (child: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (child.schedules || [])
      .filter((schedule: any) => {
        const dueDate = new Date(schedule.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today || schedule.status === 'ADMINISTERED' || schedule.status === 'MISSED';
      })
      .sort((a: any, b: any) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  };

  if (childrenLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!children || children.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>
        <p className="mb-6 text-gray-700">View upcoming and past vaccination appointments for your children.</p>
        <div className="text-center text-gray-500 py-8">
          No children found. Please add a child to view appointments.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <p className="mb-6 text-gray-700">View upcoming and past vaccination appointments for your children.</p>

      {children.map((child) => {
        const upcomingAppointments = getUpcomingAppointments(child);
        const pastAppointments = getPastAppointments(child);

        return (
          <Card key={child.id} className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full p-4 border-b bg-gray-50">
              <div>
                <div className="font-semibold text-lg text-blue-700">
                  {child.firstName} {child.middleName} {child.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  DOB: {formatDate(child.dateOfBirth)}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex gap-2">
                <Badge variant="primary">{child.gender}</Badge>
                <Badge variant="info">{upcomingAppointments.length} upcoming</Badge>
              </div>
            </div>

            <Card.Body>
              {/* Upcoming Appointments Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
                  <span>📅</span> Upcoming Appointments
                </h3>
                {upcomingAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vaccine</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingAppointments.map((schedule: any) => (
                          <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium">
                              {schedule.vaccine?.name || schedule.vaccineName || 'Unknown Vaccine'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {formatDate(schedule.dueDate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge variant="warning">Scheduled</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 py-4 text-center bg-gray-50 rounded">
                    No upcoming appointments
                  </div>
                )}
              </div>

              {/* Past Appointments Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
                  <span>✅</span> Vaccination History
                </h3>
                {pastAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vaccine</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pastAppointments.map((schedule: any) => (
                          <tr key={schedule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium">
                              {schedule.vaccine?.name || schedule.vaccineName || 'Unknown Vaccine'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {formatDate(schedule.dueDate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {schedule.status === 'ADMINISTERED' ? (
                                <Badge variant="success">Administered</Badge>
                              ) : schedule.status === 'MISSED' ? (
                                <Badge variant="danger">Missed</Badge>
                              ) : (
                                <Badge variant="default">{schedule.status}</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 py-4 text-center bg-gray-50 rounded">
                    No past appointments
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default Appointments;
