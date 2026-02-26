import React from 'react';
import { XMarkIcon, DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  dateOfBirth: string;
  onDownload: () => void;
  onGenerate?: () => void;
  hasCertificate?: boolean;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  childName,
  dateOfBirth,
  onDownload,
  onGenerate,
  hasCertificate = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Digital Certificate</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
              <Card.Body className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-bold text-primary-800">{childName}</h4>
                <p className="text-sm text-primary-600 mt-1">
                  Born: {new Date(dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-xs text-primary-500 mt-2">
                  Certificate of immunization
                </p>
              </Card.Body>
            </Card>

            <div className="text-sm text-gray-600">
              <p>This digital certificate serves as proof of your child's immunization history.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {hasCertificate ? (
              <Button
                variant="primary"
                onClick={onDownload}
                leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              >
                Download Certificate
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onGenerate}
              >
                Generate Certificate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
