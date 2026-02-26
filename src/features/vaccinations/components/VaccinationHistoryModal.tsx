import React from 'react';
import { XMarkIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import type { Immunization, ImmunizationStatus } from '@/features/children/childrenTypes';
import { formatDate } from '@/utils/dateHelpers';

interface VaccinationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId?: string;
  childName?: string;
  immunizations?: Immunization[];
  onRecordVaccination?: (vaccinationData: any) => Promise<any>;
  onUpdateVaccination?: (vaccinationId: string, request: any) => Promise<any>;
  onDeleteVaccination?: (vaccinationId: string) => Promise<any>;
}

const statusConfig: Record<ImmunizationStatus, { color: string; icon: React.ReactNode; label: string }> = {
  SCHEDULED: { color: 'text-blue-600 bg-blue-100', icon: <ClockIcon className="h-4 w-4" />, label: 'Scheduled' },
  PENDING: { color: 'text-yellow-600 bg-yellow-100', icon: <ClockIcon className="h-4 w-4" />, label: 'Pending' },
  ADMINISTERED: { color: 'text-green-600 bg-green-100', icon: <CheckCircleIcon className="h-4 w-4" />, label: 'Administered' },
  MISSED: { color: 'text-red-600 bg-red-100', icon: <ExclamationCircleIcon className="h-4 w-4" />, label: 'Missed' },
  CONTRAINDICATED: { color: 'text-gray-600 bg-gray-100', icon: <ExclamationCircleIcon className="h-4 w-4" />, label: 'Contraindicated' },
};

export const VaccinationHistoryModal: React.FC<VaccinationHistoryModalProps> = ({
  isOpen,
  onClose,
  immunizations,
  childName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Vaccination History</h3>
              <p className="text-sm text-gray-500">{childName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {(!immunizations || immunizations.length === 0) ? (
              <p className="text-center text-gray-500 py-8">No vaccination records found</p>
            ) : (
              immunizations.map((immunization) => {
                const status = statusConfig[immunization.status] || statusConfig.SCHEDULED;
                return (
                  <Card key={immunization.id} className="hover:shadow-md transition-shadow">
                    <Card.Body className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {immunization.vaccine?.name || 'Vaccine'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {formatDate(immunization.dateAdministered)}
                        </p>
                        {immunization.batchNumber && (
                          <p className="text-xs text-gray-400">
                            Batch: {immunization.batchNumber}
                          </p>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                        {status.icon}
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
