import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useGetBatchByIdQuery } from '@/features/vaccines/vaccinesAPI';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Timeline } from '@/components/common/Timeline';
import { formatDate, formatExpiryStatus } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

export const BatchTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isHealthWorker } = useAuth();
  const { data: batch, isLoading, error } = useGetBatchByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Batch not found</p>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.VACCINE_INVENTORY)}
          className="mt-4"
        >
          Back to Inventory
        </Button>
      </div>
    );
  }

  const { status, days } = formatExpiryStatus(batch.expiryDate);
  const usageHistory = batch.usageHistory || [];
  // Use initialQuantity if available, otherwise fall back to quantity
  const initialQty = batch.initialQuantity ?? batch.quantity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Tracking</h1>
            <p className="text-sm text-gray-500">Batch Number: {batch.batchNumber}</p>
          </div>
        </div>
        {isHealthWorker && (
          <Button variant="primary" onClick={() => {/* Handle record usage */}}>
            Record Usage
          </Button>
        )}
      </div>

      {/* Batch Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header title="Batch Information" />
          <Card.Body>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Vaccine</dt>
                <dd className="text-sm text-gray-900">{batch.vaccine?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Batch Number</dt>
                <dd className="text-sm text-gray-900">{batch.batchNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                <dd className="text-sm text-gray-900">{batch.manufacturer}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Supplier</dt>
                <dd className="text-sm text-gray-900">{batch.supplier || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Manufacturing Date</dt>
                <dd className="text-sm text-gray-900">
                  {batch.manufacturingDate ? formatDate(batch.manufacturingDate) : 'N/A'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                <dd className="text-sm">
                  <span className="text-gray-900 mr-2">{formatDate(batch.expiryDate)}</span>
                  <Badge
                    variant={
                      status === 'expired' ? 'danger' :
                      status === 'expiring' ? 'warning' : 'success'
                    }
                    size="sm"
                  >
                    {status === 'expired' ? 'Expired' : `${days} days left`}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="Stock Information" />
          <Card.Body>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Initial Quantity</dt>
                <dd className="text-sm text-gray-900">{initialQty} doses</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Remaining Doses</dt>
                <dd className="text-sm font-medium text-primary-600">
                  {batch.remainingDoses} doses
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Used Doses</dt>
                <dd className="text-sm text-gray-900">
                  {initialQty - batch.remainingDoses} doses
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Usage Rate</dt>
                <dd className="text-sm text-gray-900">
                  {initialQty > 0 ? (((initialQty - batch.remainingDoses) / initialQty) * 100).toFixed(1) : 0}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Storage Location</dt>
                <dd className="text-sm text-gray-900">{batch.storageLocation || 'Main Store'}</dd>
              </div>
            </dl>
          </Card.Body>
        </Card>
      </div>

      {/* Usage Timeline */}
      <Card>
        <Card.Header
          title="Usage History"
          action={
            isAdmin && (
              <Button variant="ghost" size="sm">
                Export Log
              </Button>
            )
          }
        />
        <Card.Body>
          {usageHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No usage records found</p>
          ) : (
            <Timeline
              events={usageHistory.map((record: any) => ({
                id: record.id,
                type: 'usage',
                title: `${record.dosesUsed} doses used`,
                description: `Used by ${record.usedBy}`,
                timestamp: record.usedAt,
                metadata: {
                  purpose: record.purpose,
                  notes: record.notes,
                },
              }))}
            />
          )}
        </Card.Body>
      </Card>

      {/* Quality Control */}
      {batch.qualityControl && (
        <Card>
          <Card.Header title="Quality Control Information" />
          <Card.Body>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Test Date</dt>
                <dd className="text-sm text-gray-900">
                  {formatDate(batch.qualityControl.testDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tested By</dt>
                <dd className="text-sm text-gray-900">{batch.qualityControl.testedBy}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Result</dt>
                <dd>
                  <Badge
                    variant={batch.qualityControl.result === 'passed' ? 'success' : 'danger'}
                  >
                    {batch.qualityControl.result}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Certificate</dt>
                <dd className="text-sm text-gray-900">
                  {batch.qualityControl.certificate || 'N/A'}
                </dd>
              </div>
            </dl>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default BatchTracking;