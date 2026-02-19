import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useVaccines, useVaccineSchedule } from '@/features/vaccines/vaccinesHooks';
import type { Vaccine } from '@/features/vaccines/vaccinesTypes';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { ROUTES } from '@/routing/routes';

interface AgeGroup {
  id: string;
  name: string;
  minDays: number;
  maxDays: number;
}

const ageGroups: AgeGroup[] = [
  { id: 'birth', name: 'Birth', minDays: 0, maxDays: 0 },
  { id: '6weeks', name: '6 Weeks', minDays: 42, maxDays: 42 },
  { id: '10weeks', name: '10 Weeks', minDays: 70, maxDays: 70 },
  { id: '14weeks', name: '14 Weeks', minDays: 98, maxDays: 98 },
  { id: '6months', name: '6 Months', minDays: 180, maxDays: 180 },
  { id: '9months', name: '9 Months', minDays: 270, maxDays: 270 },
  { id: '12months', name: '12 Months', minDays: 365, maxDays: 365 },
  { id: '18months', name: '18 Months', minDays: 540, maxDays: 540 },
  { id: '24months', name: '24 Months', minDays: 730, maxDays: 730 },
  { id: '5years', name: '5-6 Years', minDays: 1825, maxDays: 2190 },
  { id: '10years', name: '10-12 Years', minDays: 3650, maxDays: 4380 },
];

export const VaccineSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { isHealthWorker, isAdmin } = useAuth();
  const { vaccines, isLoading } = useVaccines();
  const { groupVaccinesByAgeCategory } = useVaccineSchedule();
  
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');

  const tabs = [
    { id: 'schedule', label: 'Schedule' },
    { id: 'by-age', label: 'By Age Group' },
    { id: 'catch-up', label: 'Catch-up Schedule' },
  ];

  // Group vaccines by age
  const groupedVaccines = groupVaccinesByAgeCategory(vaccines);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vaccination Schedule</h1>
          <p className="mt-2 text-sm text-gray-700">
            Kenya Expanded Programme on Immunization (KEPI) schedule
          </p>
        </div>
        {(isHealthWorker || isAdmin) && (
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADD_VACCINE)}
          >
            Add New Vaccine
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Schedule View */}
      {activeTab === 'schedule' && (
        <Card>
          <Card.Body>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vaccine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Disease Prevented
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vaccines.map((vaccine: Vaccine) => (
                    <tr
                      key={vaccine.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(ROUTES.VACCINE_DETAILS.replace(':id', vaccine.id))}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{vaccine.name}</div>
                        <div className="text-sm text-gray-500">{vaccine.code}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {vaccine.diseasePrevented}
                      </td>
                      <td className="px-6 py-4">
                        {vaccine.isBirthDose ? (
                          <Badge variant="primary">Birth</Badge>
                        ) : (
                          `${vaccine.recommendedAgeDays} days`
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {vaccine.dosesRequired || '1'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {vaccine.administrationRoute || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {vaccine.administrationSite || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* By Age Group View */}
      {activeTab === 'by-age' && (
        <div className="space-y-6">
          {/* Age Group Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedAgeGroup('all')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${selectedAgeGroup === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              All Ages
            </button>
            {ageGroups.map((group: AgeGroup) => (
              <button
                key={group.id}
                onClick={() => setSelectedAgeGroup(group.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  ${selectedAgeGroup === group.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* Vaccine Groups */}
          {Object.entries(groupedVaccines).map(([ageGroup, groupVaccines]: [string, Vaccine[]]) => {
            if (selectedAgeGroup !== 'all' && selectedAgeGroup !== ageGroup.toLowerCase().replace(' ', '')) {
              return null;
            }

            return (
              <Card key={ageGroup}>
                <Card.Header title={ageGroup} />
                <Card.Body>
                  <div className="space-y-4">
                    {groupVaccines.map((vaccine: Vaccine) => (
                      <div
                        key={vaccine.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(ROUTES.VACCINE_DETAILS.replace(':id', vaccine.id))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{vaccine.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {vaccine.description}
                            </p>
                          </div>
                          <Badge variant="primary">
                            {vaccine.dosesRequired ? `Doses required: ${vaccine.dosesRequired}` : 'Single dose'}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Route:</span>{' '}
                            <span className="font-medium">{vaccine.administrationRoute || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Site:</span>{' '}
                            <span className="font-medium">{vaccine.administrationSite || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Storage:</span>{' '}
                            <span className="font-medium">{vaccine.storageRequirements || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      {/* Catch-up Schedule */}
      {activeTab === 'catch-up' && (
        <Card>
          <Card.Header title="Catch-up Vaccination Schedule" />
          <Card.Body>
            <div className="prose max-w-none">
              <p className="text-gray-600">
                For children who have missed one or more vaccinations, follow the catch-up schedule below:
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Important:</strong> There is no need to restart any vaccine series. 
                        Continue from where the schedule was interrupted.
                      </p>
                    </div>
                  </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Vaccine
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Minimum Interval
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Catch-up Guidelines
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-medium">BCG</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Can be given up to 5 years of age. After 5 years, only give if at high risk.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">OPV</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Minimum interval between doses is 4 weeks. Fourth dose not needed if third dose given after 4 years.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">IPV</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Can be given until 5 years of age.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">DPT-HepB-Hib</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Minimum interval between doses is 4 weeks. Booster doses not needed if primary series completed after 1 year.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">PCV</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        For children 12-24 months: 2 doses, 8 weeks apart. For children {'>'}24 months: 1 dose.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Rotavirus</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        First dose must be given by 15 weeks. Maximum age for last dose is 32 weeks.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Measles-Rubella</td>
                      <td className="px-6 py-4">4 weeks</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Can be given at any age. Two doses needed with minimum 4 weeks interval.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default VaccineSchedule;