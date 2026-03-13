import React from 'react';
import { useChildren } from '@/features/children/childrenHooks';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { formatDate } from '@/utils/dateHelpers';

const VaccinationsPage: React.FC = () => {
  const { children, isLoading: childrenLoading } = useChildren();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Vaccinations</h1>
      <p className="mb-6 text-gray-700">View your children's vaccination schedules and immunization records.</p>
      {childrenLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        children.length === 0 ? (
          <div className="text-center text-gray-500">No children found. Please add a child to view vaccinations.</div>
        ) : (
          children.map((child) => (
            <Card key={child.id} className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full p-4 border-b">
                <div>
                  <div className="font-semibold text-lg text-blue-700">{child.firstName} {child.middleName} {child.lastName}</div>
                  <div className="text-sm text-gray-500">DOB: {formatDate(child.dateOfBirth)}</div>
                </div>
                <div className="mt-2 md:mt-0">
                  <Badge variant="primary">{child.gender}</Badge>
                </div>
              </div>
              <Card.Body>
                {child.schedules && child.schedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vaccine</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {child.schedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td className="px-4 py-2 whitespace-nowrap">{schedule.vaccine?.name || schedule.vaccineId}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{formatDate(schedule.dueDate)}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <Badge variant={
                                schedule.status === 'ADMINISTERED' ? 'success' :
                                schedule.status === 'MISSED' ? 'danger' :
                                schedule.status === 'SCHEDULED' ? 'warning' : 'default'
                              }>
                                {schedule.status.charAt(0) + schedule.status.slice(1).toLowerCase()}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500">No vaccination schedule found for this child.</div>
                )}
              </Card.Body>
            </Card>
          ))
        )
      )}
    </div>
  );
};

export default VaccinationsPage;
