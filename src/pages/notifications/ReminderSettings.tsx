import React from 'react';
import { useNotificationPreferences } from '@/features/notifications/notificationsHooks';
import { Card } from '@/components/common/Card';

const ReminderSettings: React.FC = () => {
  const { preferences } = useNotificationPreferences();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <p className="mb-6 text-gray-700">Manage your reminder preferences for vaccination appointments and health alerts.</p>
      {!preferences ? (
        <div className="text-center text-gray-500">No reminder preferences found.</div>
      ) : (
        <Card>
          <Card.Body>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Email Reminders:</span> {preferences.email ? 'Enabled' : 'Disabled'}
              </div>
              <div>
                <span className="font-semibold">SMS Reminders:</span> {preferences.sms ? 'Enabled' : 'Disabled'}
              </div>
              <div>
                <span className="font-semibold">Push Notifications:</span> {preferences.push ? 'Enabled' : 'Disabled'}
              </div>
              <div>
                <span className="font-semibold">Quiet Hours End:</span> {preferences.quietHoursEnd || 'Not set'}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ReminderSettings;