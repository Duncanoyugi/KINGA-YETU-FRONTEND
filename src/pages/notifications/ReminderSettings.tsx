import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  ArrowLeftIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { useNotificationPreferences } from '@/features/notifications/notificationsHooks';
import { useGetNotificationPreferencesQuery } from '@/features/notifications/notificationsAPI';
import type { NotificationPreferences } from '@/features/notifications/notificationsTypes';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';

interface ReminderSettingsForm {
  email: {
    enabled: boolean;
    immediate: boolean;
    types: string[];
  };
  sms: {
    enabled: boolean;
    immediate: boolean;
    types: string[];
  };
  push: {
    enabled: boolean;
    immediate: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    immediate: boolean;
    types: string[];
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
    allowEmergency: boolean;
  };
  reminderSettings: {
    enabled: boolean;
    advanceDays: number[];
    reminderTimes: string[];
    maxReminders: number;
    requireConfirmation: boolean;
  };
  digestSettings: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
    dayOfWeek: number;
    includeTypes: string[];
  };
}

const notificationTypes = [
  { id: 'VACCINE_REMINDER', label: 'Vaccine Reminders' },
  { id: 'APPOINTMENT_CONFIRMATION', label: 'Appointment Confirmations' },
  { id: 'APPOINTMENT_REMINDER', label: 'Appointment Reminders' },
  { id: 'VACCINE_DUE', label: 'Vaccine Due Alerts' },
  { id: 'VACCINE_OVERDUE', label: 'Vaccine Overdue Alerts' },
  { id: 'REPORT_READY', label: 'Report Ready' },
  { id: 'SYSTEM_ALERT', label: 'System Alerts' },
  { id: 'SECURITY_ALERT', label: 'Security Alerts' },
];

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const ReminderSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('channels');
  const [isSaving, setIsSaving] = useState(false);

  // Transform NotificationPreferences to ReminderSettingsForm format
  const transformPreferencesToFormDefaults = (
    prefs: NotificationPreferences | null | undefined
  ): ReminderSettingsForm => {
    if (!prefs) {
      return {
        email: { enabled: true, immediate: true, types: [] },
        sms: { enabled: true, immediate: true, types: [] },
        push: { enabled: true, immediate: true, types: [] },
        inApp: { enabled: true, immediate: true, types: [] },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '06:00',
          timezone: 'Africa/Nairobi',
          allowEmergency: true,
        },
        reminderSettings: {
          enabled: true,
          advanceDays: [7, 3, 1],
          reminderTimes: ['09:00'],
          maxReminders: 3,
          requireConfirmation: false,
        },
        digestSettings: {
          enabled: false,
          frequency: 'daily',
          time: '18:00',
          dayOfWeek: 1,
          includeTypes: [],
        },
      };
    }

    return {
      email: { enabled: !!prefs.email, immediate: true, types: [] },
      sms: { enabled: !!prefs.sms, immediate: true, types: [] },
      push: { enabled: !!prefs.push, immediate: true, types: [] },
      inApp: { enabled: true, immediate: true, types: [] },
      quietHours: {
        enabled: !!(prefs.quietHoursStart && prefs.quietHoursEnd),
        start: prefs.quietHoursStart || '22:00',
        end: prefs.quietHoursEnd || '06:00',
        timezone: 'Africa/Nairobi',
        allowEmergency: true,
      },
      reminderSettings: {
        enabled: true,
        advanceDays: prefs.reminderDays || [7, 3, 1],
        reminderTimes: ['09:00'],
        maxReminders: 3,
        requireConfirmation: false,
      },
      digestSettings: {
        enabled: false,
        frequency: 'daily',
        time: '18:00',
        dayOfWeek: 1,
        includeTypes: [],
      },
    };
  };
  const { isLoading } = useGetNotificationPreferencesQuery(
    user?.id!,
    { skip: !user }
  );

  const {
    preferences,
    updatePreferences,
    refetch,
  } = useNotificationPreferences();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<ReminderSettingsForm>({
    defaultValues: transformPreferencesToFormDefaults(preferences),
  });

  const tabs = [
    { id: 'channels', label: 'Notification Channels' },
    { id: 'types', label: 'Notification Types' },
    { id: 'timing', label: 'Timing & Quiet Hours' },
    { id: 'digest', label: 'Digest Settings' },
  ];

  const watchQuietHours = watch('quietHours');

  const onSubmit = async (data: ReminderSettingsForm) => {
    setIsSaving(true);
    try {
      // Transform form data to NotificationPreferences format
      // Convert string array from select to number array for advanceDays
      const advanceDays = Array.isArray(data.reminderSettings.advanceDays)
        ? data.reminderSettings.advanceDays.map(Number)
        : [data.reminderSettings.advanceDays].map(Number);
      
      const transformedData: Partial<NotificationPreferences> = {
        email: data.email.enabled,
        sms: data.sms.enabled,
        push: data.push.enabled,
        reminderDays: advanceDays,
        quietHoursStart: data.quietHours.enabled ? data.quietHours.start : undefined,
        quietHoursEnd: data.quietHours.enabled ? data.quietHours.end : undefined,
      };
      await updatePreferences(transformedData);
      showToast({
        type: 'success',
        message: 'Reminder settings updated successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to update settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    refetch();
    showToast({
      type: 'info',
      message: 'Settings reset to last saved state',
    });
  };

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
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Card.Body>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6 space-y-6">
              {/* Channels Tab */}
              {activeTab === 'channels' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Settings */}
                    <Card>
                      <Card.Header
                        title={
                          <div className="flex items-center space-x-2">
                            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                            <span>Email Notifications</span>
                          </div>
                        }
                      />
                      <Card.Body>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('email.enabled')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('email.immediate')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Send immediately</span>
                          </label>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* SMS Settings */}
                    <Card>
                      <Card.Header
                        title={
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="h-5 w-5 text-gray-500" />
                            <span>SMS Notifications</span>
                          </div>
                        }
                      />
                      <Card.Body>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('sms.enabled')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable SMS notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('sms.immediate')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Send immediately</span>
                          </label>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Push Notifications */}
                    <Card>
                      <Card.Header
                        title={
                          <div className="flex items-center space-x-2">
                            <ComputerDesktopIcon className="h-5 w-5 text-gray-500" />
                            <span>Push Notifications</span>
                          </div>
                        }
                      />
                      <Card.Body>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('push.enabled')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable push notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('push.immediate')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Send immediately</span>
                          </label>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* In-App Notifications */}
                    <Card>
                      <Card.Header
                        title={
                          <div className="flex items-center space-x-2">
                            <BellIcon className="h-5 w-5 text-gray-500" />
                            <span>In-App Notifications</span>
                          </div>
                        }
                      />
                      <Card.Body>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('inApp.enabled')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable in-app notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              {...register('inApp.immediate')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Show immediately</span>
                          </label>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              )}

              {/* Notification Types Tab */}
              {activeTab === 'types' && (
                <div className="space-y-6">
                  <Card>
                    <Card.Header title="Select Notification Types by Channel" />
                    <Card.Body>
                      <div className="space-y-6">
                        {['email', 'sms', 'push', 'inApp'].map((channel) => (
                          <div key={channel}>
                            <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                              {channel} Notifications
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {notificationTypes.map((type) => (
                                <label key={type.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    {...register(`${channel}.types` as any)}
                                    value={type.id}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-600">{type.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Timing & Quiet Hours Tab */}
              {activeTab === 'timing' && (
                <div className="space-y-6">
                  {/* Reminder Timing */}
                  <Card>
                    <Card.Header title="Reminder Timing" />
                    <Card.Body>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Advance Days
                            </label>
                            <select
                              {...register('reminderSettings.advanceDays')}
                              multiple
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="1">1 day before</option>
                              <option value="2">2 days before</option>
                              <option value="3">3 days before</option>
                              <option value="5">5 days before</option>
                              <option value="7">7 days before</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Reminder Times
                            </label>
                            <select
                              {...register('reminderSettings.reminderTimes')}
                              multiple
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="09:00">9:00 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="15:00">3:00 PM</option>
                              <option value="18:00">6:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Maximum Reminders"
                            type="number"
                            {...register('reminderSettings.maxReminders', { valueAsNumber: true })}
                          />
                          <div className="flex items-center">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                {...register('reminderSettings.requireConfirmation')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Require confirmation
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Quiet Hours */}
                  <Card>
                    <Card.Header title="Quiet Hours" />
                    <Card.Body>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('quietHours.enabled')}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Enable quiet hours (no notifications during this period)
                          </span>
                        </label>

                        {watchQuietHours.enabled && (
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <Input
                              label="Start Time"
                              type="time"
                              {...register('quietHours.start')}
                            />
                            <Input
                              label="End Time"
                              type="time"
                              {...register('quietHours.end')}
                            />
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timezone
                              </label>
                              <select
                                {...register('quietHours.timezone')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              >
                                <option value="Africa/Nairobi">Nairobi (EAT)</option>
                                <option value="Africa/Kampala">Kampala (EAT)</option>
                                <option value="Africa/Dar_es_Salaam">Dar es Salaam (EAT)</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  {...register('quietHours.allowEmergency')}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Allow emergency alerts during quiet hours
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Digest Settings Tab */}
              {activeTab === 'digest' && (
                <div className="space-y-6">
                  <Card>
                    <Card.Header title="Email Digest Settings" />
                    <Card.Body>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            {...register('digestSettings.enabled')}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Enable email digest
                          </span>
                        </label>

                        {watch('digestSettings.enabled') && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Frequency
                                </label>
                                <select
                                  {...register('digestSettings.frequency')}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                </select>
                              </div>

                              {watch('digestSettings.frequency') === 'weekly' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Day of Week
                                  </label>
                                  <select
                                    {...register('digestSettings.dayOfWeek', { valueAsNumber: true })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                  >
                                    {daysOfWeek.map(day => (
                                      <option key={day.value} value={day.value}>
                                        {day.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>

                            <Input
                              label="Digest Time"
                              type="time"
                              {...register('digestSettings.time')}
                            />

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Include Notification Types
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {notificationTypes.map((type) => (
                                  <label key={type.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      {...register('digestSettings.includeTypes')}
                                      value={type.id}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{type.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!isDirty || isSaving}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSaving}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </form>
    </div>
  );
};

export default ReminderSettings;