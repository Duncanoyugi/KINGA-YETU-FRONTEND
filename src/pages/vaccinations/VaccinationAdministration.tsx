import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUpcomingSchedulesQuery } from '@/features/schedules/schedulesAPI';
import { Spinner } from '@/components/common/Spinner';
import { formatDate } from '@/utils/dateHelpers';

const VaccinationAdministrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: upcomingData, isLoading, isError } = useGetUpcomingSchedulesQuery(14);
  const schedules = upcomingData?.vaccines || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Vaccine Administration</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Record vaccine doses for scheduled appointments and keep immunization records up to date.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select an appointment to record a vaccination.
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center text-rose-600">Unable to load upcoming appointments at the moment.</div>
          ) : schedules.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No upcoming vaccination appointments found.</div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.scheduleId}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm text-gray-500">Child</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{schedule.childName}</p>
                    <p className="text-sm text-gray-500">Vaccine</p>
                    <p className="text-base font-semibold text-primary-600 dark:text-primary-400 truncate">{schedule.vaccineName}</p>
                    <p className="text-sm text-gray-500">Due date</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(schedule.dueDate)}</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Due in {schedule.daysUntilDue >= 0 ? `${schedule.daysUntilDue} day${schedule.daysUntilDue === 1 ? '' : 's'}` : `${Math.abs(schedule.daysUntilDue)} day${schedule.daysUntilDue === -1 ? '' : 's'} overdue`}
                    </span>
                    <button
                      onClick={() => navigate(`/dashboard/health-worker/vaccinations/record/${schedule.scheduleId}`)}
                      className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Record vaccination
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccinationAdministrationPage;
