import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  ScaleIcon,
  BeakerIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useChildDashboard, useChildGrowth, useChildImmunizations } from '@/features/children/childrenHooks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { formatDate, formatAge, getDueStatus, getDueStatusColor } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const ChildProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isHealthWorker } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddGrowthModalOpen, setIsAddGrowthModalOpen] = useState(false);
  const [growthForm, setGrowthForm] = useState({
    measurementDate: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { dashboard, isLoading: dashboardLoading } = useChildDashboard(id!);
  const { growthRecords, addGrowth } = useChildGrowth(id!);
  const { immunizations, schedules, getUpcomingVaccinations } = useChildImmunizations(id!);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'vaccinations', label: 'Vaccinations', icon: <BeakerIcon className="h-4 w-4" /> },
    { id: 'growth', label: 'Growth Tracking', icon: <ScaleIcon className="h-4 w-4" /> },
    { id: 'history', label: 'Medical History', icon: <DocumentTextIcon className="h-4 w-4" /> },
  ];

  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Child not found</p>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.CHILDREN_LIST)}
          className="mt-4"
        >
          Back to Children
        </Button>
      </div>
    );
  }

  const { child, summary } = dashboard as any;
  const upcomingVaccinations = getUpcomingVaccinations();

  const handleAddGrowth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!growthForm.weight || !growthForm.measurementDate) return;
    
    setIsSubmitting(true);
    try {
      await addGrowth({
        measurementDate: growthForm.measurementDate,
        weight: parseFloat(growthForm.weight),
        height: growthForm.height ? parseFloat(growthForm.height) : undefined,
      });
      setIsAddGrowthModalOpen(false);
      setGrowthForm({
        measurementDate: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
      });
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGrowthStatusBadge = (_record: any) => {
    // In a real app, this would calculate based on WHO growth standards
    // For now, we'll show a default status
    return <Badge variant="success">Normal</Badge>;
  };

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
            <h1 className="text-2xl font-bold text-gray-900">
              {child.firstName} {child.middleName} {child.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              {formatAge(child.dateOfBirth)} • {child.gender} • ID: {child.uniqueIdentifier}
            </p>
          </div>
        </div>
        {isHealthWorker && (
          <Link to={ROUTES.EDIT_CHILD.replace(':id', child.id)}>
            <Button variant="outline" leftIcon={<PencilIcon className="h-4 w-4" />}>
              Edit Details
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {summary?.completionRate || 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {upcomingVaccinations.length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {immunizations.filter((i: any) => i.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {immunizations.length}
            </div>
            <div className="text-sm text-gray-600">Total Doses</div>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Upcoming Vaccinations */}
            <Card>
              <Card.Header
                title="Upcoming Vaccinations"
                action={
                  <Link to={ROUTES.VACCINE_SCHEDULE}>
                    <Button variant="ghost" size="sm">
                      View Schedule
                    </Button>
                  </Link>
                }
              />
              <Card.Body>
                {upcomingVaccinations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No upcoming vaccinations scheduled
                  </p>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {upcomingVaccinations.slice(0, 3).map((schedule: any) => {
                      const status = getDueStatus(schedule.dueDate);
                      const statusColor = getDueStatusColor(status);
                      
                      return (
                        <div key={schedule.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {schedule.vaccine?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Due: {formatDate(schedule.dueDate)}
                            </p>
                          </div>
                          <Badge variant={statusColor}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Recent Growth Records */}
            <Card>
              <Card.Header
                title="Recent Growth Records"
                action={
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                }
              />
              <Card.Body>
                {growthRecords.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No growth records available
                  </p>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {growthRecords.slice(0, 3).map((record: any) => (
                      <div key={record.id} className="py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(record.measurementDate)}
                        </p>
                        <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Weight:</span>{' '}
                            <span className="font-medium">{record.weight} kg</span>
                          </div>
                          {record.height && (
                            <div>
                              <span className="text-gray-500">Height:</span>{' '}
                              <span className="font-medium">{record.height} cm</span>
                            </div>
                          )}
                          {record.bmi && (
                            <div>
                              <span className="text-gray-500">BMI:</span>{' '}
                              <span className="font-medium">{record.bmi.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        )}

        {activeTab === 'vaccinations' && (
          <Card>
            <Card.Header title="Vaccination History" />
            <Card.Body>
              <div className="space-y-4">
                {schedules.map((schedule: any) => {
                  const immunization = immunizations.find(
                    (i: any) => i.vaccineId === schedule.vaccineId
                  );
                  
                  return (
                    <div
                      key={schedule.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {schedule.vaccine?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Due: {formatDate(schedule.dueDate)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            immunization?.status === 'ADMINISTERED'
                              ? 'success'
                              : schedule.status === 'SCHEDULED'
                              ? getDueStatusColor(getDueStatus(schedule.dueDate))
                              : 'default'
                          }
                        >
                          {immunization?.status || schedule.status}
                        </Badge>
                      </div>
                      {immunization && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Administered: {formatDate(immunization.dateAdministered)}</p>
                          <p>Batch: {immunization.batchNumber}</p>
                          {immunization.notes && (
                            <p className="mt-1 text-gray-500">{immunization.notes}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        )}

        {activeTab === 'growth' && (
          <Card>
            <Card.Header
              title="Growth Tracking"
              action={
                isHealthWorker && (
                  <Button variant="primary" size="sm" onClick={() => setIsAddGrowthModalOpen(true)}>
                    Add Record
                  </Button>
                )
              }
            />
            <Card.Body>
              <div className="space-y-4">
                {growthRecords.map((record: any) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(record.measurementDate)}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Weight:</span>
                            <p className="font-medium">{record.weight} kg</p>
                          </div>
                          {record.height && (
                            <div>
                              <span className="text-sm text-gray-500">Height:</span>
                              <p className="font-medium">{record.height} cm</p>
                            </div>
                          )}
                          {record.headCircumference && (
                            <div>
                              <span className="text-sm text-gray-500">Head Circ.:</span>
                              <p className="font-medium">{record.headCircumference} cm</p>
                            </div>
                          )}
                          {record.muac && (
                            <div>
                              <span className="text-sm text-gray-500">MUAC:</span>
                              <p className="font-medium">{record.muac} cm</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {getGrowthStatusBadge(record)}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Add Growth Record Modal */}
      <Modal isOpen={isAddGrowthModalOpen} onClose={() => setIsAddGrowthModalOpen(false)}>
        <Modal.Header title="Add Growth Record" onClose={() => setIsAddGrowthModalOpen(false)} />
        <form onSubmit={handleAddGrowth}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Measurement Date
                </label>
                <Input
                  type="date"
                  value={growthForm.measurementDate}
                  onChange={(e) => setGrowthForm({ ...growthForm, measurementDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={growthForm.weight}
                  onChange={(e) => setGrowthForm({ ...growthForm, weight: e.target.value })}
                  placeholder="Enter weight in kg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={growthForm.height}
                  onChange={(e) => setGrowthForm({ ...growthForm, height: e.target.value })}
                  placeholder="Enter height in cm (optional)"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddGrowthModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Add Record
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default ChildProfile;