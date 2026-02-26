import React from 'react';
import { XMarkIcon, BeakerIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface VaccineDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaccine: {
    id: string;
    name: string;
    code: string;
    description?: string;
    recommendedAgeDays: number;
    minAgeDays?: number;
    maxAgeDays?: number;
    isBirthDose: boolean;
    isBooster: boolean;
  } | null;
  scheduleStatus?: 'SCHEDULED' | 'PENDING' | 'ADMINISTERED' | 'MISSED';
  dueDate?: string;
  onReschedule?: (days: number) => Promise<void>;
  onMarkDone?: () => Promise<void>;
}

export const VaccineDetailsModal: React.FC<VaccineDetailsModalProps> = ({
  isOpen,
  onClose,
  vaccine,
  scheduleStatus,
  dueDate,
}) => {
  if (!isOpen || !vaccine) return null;

  const formatAge = (days: number) => {
    if (days === 0) return 'At birth';
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (months === 0) return `${remainingDays} days`;
    if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} days`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BeakerIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-900">Vaccine Details</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-200">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <BeakerIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">{vaccine.name}</h4>
              <p className="text-sm text-gray-500">Code: {vaccine.code}</p>
            </div>

            {vaccine.description && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <InformationCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{vaccine.description}</p>
              </div>
            )}

            <Card className="bg-gray-50">
              <Card.Body className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Recommended Age:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatAge(vaccine.recommendedAgeDays)}
                  </span>
                </div>
                
                {vaccine.minAgeDays !== undefined && vaccine.minAgeDays > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Minimum Age:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatAge(vaccine.minAgeDays)}
                    </span>
                  </div>
                )}

                {vaccine.maxAgeDays !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Maximum Age:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatAge(vaccine.maxAgeDays)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {vaccine.isBirthDose ? 'Birth Dose' : vaccine.isBooster ? 'Booster' : 'Standard'}
                  </span>
                </div>
              </Card.Body>
            </Card>

            {scheduleStatus && (
              <Card className={scheduleStatus === 'ADMINISTERED' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
                <Card.Body className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {scheduleStatus === 'ADMINISTERED' ? 'Administered' : 
                       scheduleStatus === 'SCHEDULED' ? 'Scheduled' : 
                       scheduleStatus === 'MISSED' ? 'Missed' : 'Pending'}
                    </span>
                  </div>
                  {dueDate && (
                    <span className="text-sm text-gray-600">
                      Due: {new Date(dueDate).toLocaleDateString()}
                    </span>
                  )}
                </Card.Body>
              </Card>
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
