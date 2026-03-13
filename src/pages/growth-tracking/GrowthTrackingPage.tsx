import React from 'react';
import { useChildren } from '@/features/children/childrenHooks';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { formatDate } from '@/utils/dateHelpers';

const GrowthTrackingPage: React.FC = () => {
  const { children, isLoading: childrenLoading } = useChildren();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Growth Tracking</h1>
      <p className="mb-6 text-gray-700">Monitor your children's growth records and trends.</p>
      {childrenLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        children.length === 0 ? (
          <div className="text-center text-gray-500">No children found. Please add a child to view growth records.</div>
        ) : (
          children.map((child) => (
            <Card key={child.id} className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full p-4 border-b">
                <div>
                  <div className="font-semibold text-lg text-blue-700">{child.firstName} {child.middleName} {child.lastName}</div>
                  <div className="text-sm text-gray-500">DOB: {formatDate(child.dateOfBirth)}</div>
                </div>
              </div>
              <Card.Body>
                {child.growthRecords && child.growthRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight (kg)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Height (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {child.growthRecords.map((record) => (
                          <tr key={record.id}>
                            <td className="px-4 py-2 whitespace-nowrap">{formatDate(record.measurementDate)}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{record.weight}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{record.height ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500">No growth records found for this child.</div>
                )}
              </Card.Body>
            </Card>
          ))
        )
      )}
    </div>
  );
};

export default GrowthTrackingPage;
