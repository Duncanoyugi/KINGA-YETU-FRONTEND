import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRecordImmunizationMutation } from '@/features/children/childrenAPI';
import { useGetScheduleByIdQuery } from '@/features/schedules/schedulesAPI';
import { Spinner } from '@/components/common/Spinner';
import { formatDate } from '@/utils/dateHelpers';

const RecordVaccinationPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: scheduleData, isLoading: scheduleLoading, isError } = useGetScheduleByIdQuery(appointmentId || '', {
    skip: !appointmentId,
  });
  const childId = scheduleData?.childId ?? '';
  const [recordImmunization] = useRecordImmunizationMutation();

  const [dateAdministered, setDateAdministered] = useState(() => new Date().toISOString().slice(0, 10));
  const [batchNumber, setBatchNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const schedule = scheduleData as any;
  const vaccineName = schedule?.vaccine?.name || 'Scheduled vaccine';
  const childName = useMemo(() => {
    if (!schedule?.child) return 'Unknown child';
    return `${schedule.child.firstName || ''} ${schedule.child.lastName || ''}`.trim();
  }, [schedule]);
  const dueDate = schedule?.dueDate ? formatDate(schedule.dueDate) : 'N/A';
  const statusText = schedule?.status ? schedule.status.toLowerCase() : 'unknown';

  const facilityId = (user as any)?.healthWorker?.facility?.id || '';
  const healthWorkerId = (user as any)?.healthWorker?.id || user?.id || '';

  const calculateAgeInDays = (dateOfBirth: string, administeredDate: string) => {
    const dob = new Date(dateOfBirth);
    const administered = new Date(administeredDate);
    const diffMs = administered.getTime() - dob.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!schedule || !appointmentId) {
      toast.error('Unable to record vaccination without appointment details.');
      return;
    }

    if (!schedule.childId || !schedule.vaccineId) {
      toast.error('Incomplete appointment data.');
      return;
    }

    const childDateOfBirth = schedule?.child?.dateOfBirth;
    if (!childDateOfBirth) {
      toast.error('Child date of birth is required to record immunization.');
      return;
    }

    if (!childId) {
      toast.error('Unable to identify child for this appointment.');
      return;
    }

    const ageAtDays = calculateAgeInDays(childDateOfBirth, dateAdministered);

    setSubmitting(true);

    try {
      await recordImmunization({
        childId,
        data: {
          vaccineId: schedule.vaccineId,
          dateAdministered: new Date(dateAdministered).toISOString(),
          facilityId,
          healthWorkerId,
          ageAtDays,
          batchNumber: batchNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      }).unwrap();

      toast.success('Vaccination recorded successfully.');
      navigate('/dashboard/health-worker/vaccinations');
    } catch (error: unknown) {
      toast.error('Failed to record vaccination. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Record Vaccination</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Use the form below to record immunization details for this appointment.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/health-worker/vaccinations')}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to Vaccine Administration
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Details</h2>
        </div>

        <div className="p-6 space-y-6">
          {scheduleLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center text-rose-600">Unable to load appointment details.</div>
          ) : !schedule ? (
            <div className="text-center text-gray-500">No appointment data found.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Child</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{childName}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Vaccine: {vaccineName}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Appointment</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{dueDate}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Status: {statusText}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Administered</span>
                  <input
                    type="date"
                    value={dateAdministered}
                    onChange={(event) => setDateAdministered(event.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Batch Number</span>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(event) => setBatchNumber(event.target.value)}
                    placeholder="Enter batch number"
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  placeholder="Optional notes for this immunization"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/health-worker/vaccinations')}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {submitting ? 'Recording...' : 'Record Vaccination'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordVaccinationPage;
