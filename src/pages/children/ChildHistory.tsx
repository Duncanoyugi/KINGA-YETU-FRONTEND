import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useChildImmunizations, useChildGrowth } from '@/features/children/childrenHooks';
import type { GrowthRecord, Immunization } from '@/features/children/childrenTypes';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Timeline } from '@/components/common/Timeline';
import { Tabs } from '@/components/common/Tabs';
import { Spinner } from '@/components/common/Spinner';

interface TabItem {
  id: string;
  label: string;
}

interface TimelineEvent {
  id: string;
  type: 'vaccination' | 'growth';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const ChildHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const childId = id ?? '';
  const { immunizations, isLoading: immunizationsLoading } = useChildImmunizations(childId);
  const { growthRecords } = useChildGrowth(childId);

  const tabs: TabItem[] = [
    { id: 'all', label: 'All Activity' },
    { id: 'vaccinations', label: 'Vaccinations' },
    { id: 'growth', label: 'Growth Records' },
    { id: 'appointments', label: 'Appointments' },
  ];

  if (immunizationsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Combine and sort all events
  const allEvents = useMemo<TimelineEvent[]>(() => {
    const immunizationEvents: TimelineEvent[] = immunizations.map((i: Immunization) => ({
      id: i.id,
      type: 'vaccination' as const,
      title: `${i.vaccine?.name} Vaccination`,
      description: `Administered by ${i.healthWorker?.fullName || i.administeredBy || 'Unknown'}`,
      timestamp: i.dateAdministered ?? '',
      metadata: {
        batchNumber: i.batchNumber,
        facility: i.facility?.name,
        notes: i.notes,
      },
    }));

    const growthEvents: TimelineEvent[] = growthRecords.map((g: GrowthRecord) => ({
      id: g.id,
      type: 'growth' as const,
      title: 'Growth Measurement',
      description: `Weight: ${g.weight}kg${g.height ? `, Height: ${g.height}cm` : ''}`,
      timestamp: g.measurementDate ?? '',
      metadata: {
        weight: g.weight,
        height: g.height,
      },
    }));

    return [...immunizationEvents, ...growthEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [immunizations, growthRecords]);

  const filteredEvents = allEvents.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'vaccinations') return event.type === 'vaccination';
    if (activeTab === 'growth') return event.type === 'growth';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Medical History Timeline</h1>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Timeline */}
      <Card>
        <Card.Body>
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history records found</p>
          ) : (
            <Timeline events={filteredEvents} />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChildHistory;