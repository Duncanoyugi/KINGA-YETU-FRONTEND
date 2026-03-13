import React from 'react';
import { useChildren } from '@/features/children/childrenHooks';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { formatDate } from '@/utils/dateHelpers';

const CertificatesPage: React.FC = () => {
  const { children, isLoading: childrenLoading } = useChildren();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Certificates</h1>
      <p className="mb-6 text-gray-700">Download immunization certificates for your children.</p>
      {childrenLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        children.length === 0 ? (
          <div className="text-center text-gray-500">No children found. Please add a child to view certificates.</div>
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
                {child.immunizations && child.immunizations.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-gray-700 mb-2">Immunization Certificate:</div>
                    <a
                      href={`/api/certificates/${child.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Download Certificate
                    </a>
                  </div>
                ) : (
                  <div className="text-gray-500">No immunization records found for this child.</div>
                )}
              </Card.Body>
            </Card>
          ))
        )
      )}
    </div>
  );
};

export default CertificatesPage;
