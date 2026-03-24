import React, { useState, useEffect } from 'react';
import { useNotificationPreferences } from '@/features/notifications/notificationsHooks';
import { Card } from '@/components/common/Card';
import { Switch } from '@/components/common/Switch/Switch';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';

const ReminderSettings: React.FC = () => {
  const { preferences, updatePreferences, refetch } = useNotificationPreferences();
  
  // Local state for immediate UI feedback while saving
  const [localPrefs, setLocalPrefs] = useState({
    email: false,
    sms: false,
    push: false,
  });
  
  const [isSaving, setIsSaving] = useState(false);

  // Sync local state when preferences load
  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        email: preferences.email,
        sms: preferences.sms,
        push: preferences.push,
      });
    }
  }, [preferences]);

  const handleToggle = async (key: 'email' | 'sms' | 'push', newValue: boolean) => {
    // Update local state immediately for UI feedback
    setLocalPrefs(prev => ({ ...prev, [key]: newValue }));
    
    setIsSaving(true);
    try {
      // Call the API to update preferences
      await updatePreferences({
        [key]: newValue,
      });
    } catch (error) {
      // Revert on error
      setLocalPrefs(prev => ({ ...prev, [key]: !newValue }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-4">Reminder Settings</h1>
        <div className="text-center text-gray-500 py-8">
          <Spinner size="md" />
          <p className="mt-2">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Reminder Settings</h1>
      <p className="mb-6 text-gray-700">
        Manage how you receive vaccination reminders and health alerts for your children.
      </p>

      <Card>
        <Card.Body>
          <h2 className="text-lg font-semibold mb-6">Notification Channels</h2>
          
          <div className="space-y-6">
            {/* Email Reminders */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">Email Reminders</h3>
                <p className="text-sm text-gray-500">
                  Receive vaccination reminders via email
                </p>
              </div>
              <Switch
                id="email-switch"
                checked={localPrefs.email}
                onChange={(checked) => handleToggle('email', checked)}
                disabled={isSaving}
              />
            </div>

            {/* SMS Reminders */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">SMS Reminders</h3>
                <p className="text-sm text-gray-500">
                  Receive vaccination reminders via text message
                </p>
              </div>
              <Switch
                id="sms-switch"
                checked={localPrefs.sms}
                onChange={(checked) => handleToggle('sms', checked)}
                disabled={isSaving}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive instant notifications in your browser
                </p>
              </div>
              <Switch
                id="push-switch"
                checked={localPrefs.push}
                onChange={(checked) => handleToggle('push', checked)}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Quiet Hours Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Quiet Hours</h2>
            <p className="text-sm text-gray-500 mb-4">
              Set hours when you don't want to receive notifications
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  defaultValue={preferences.quietHoursStart || '22:00'}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  defaultValue={preferences.quietHoursEnd || '07:00'}
                />
              </div>
            </div>
          </div>

          {/* Reminder Days Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Reminder Timing</h2>
            <p className="text-sm text-gray-500 mb-4">
              How many days before the appointment should we remind you?
            </p>
            
            <div className="flex gap-4">
              {[7, 3, 1].map((days) => (
                <label key={days} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={preferences.reminderDays?.includes(days) ?? true}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{days} day{days > 1 ? 's' : ''} before</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mr-3"
            >
              Refresh
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <Card.Body>
          <h3 className="font-semibold text-blue-900 mb-2">Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>Enable multiple channels to ensure you never miss a reminder</li>
            <li>Set quiet hours to prevent notifications during sleep</li>
            <li>More reminder days = more chances to prepare for appointments</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReminderSettings;
