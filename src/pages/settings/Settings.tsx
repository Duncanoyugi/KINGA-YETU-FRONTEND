import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Switch } from '@/components/common/Switch';
import { 
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    appointmentReminders: true,
    vaccineAlerts: true,
    weeklyDigest: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    activityTracking: true,
    dataSharing: false,
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <UserCircleIcon className="h-6 w-6 text-gray-400" />
          <h2 className="text-lg font-semibold">Profile Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              defaultValue="Health Worker"
              onChange={() => {}}
            />
            <Input
              label="Email"
              type="email"
              defaultValue="healthworker@example.com"
              onChange={() => {}}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="tel"
              defaultValue="+254 712 345 678"
              onChange={() => {}}
            />
            <Input
              label="Facility"
              defaultValue="Kenyatta National Hospital"
              onChange={() => {}}
              disabled
            />
          </div>
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <BellIcon className="h-6 w-6 text-gray-400" />
          <h2 className="text-lg font-semibold">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={notifications.sms}
              onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive push notifications on mobile</p>
            </div>
            <Switch
              checked={notifications.push}
              onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Appointment Reminders</p>
              <p className="text-sm text-gray-500">Get reminders for upcoming appointments</p>
            </div>
            <Switch
              checked={notifications.appointmentReminders}
              onChange={() => setNotifications({ ...notifications, appointmentReminders: !notifications.appointmentReminders })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Vaccine Alerts</p>
              <p className="text-sm text-gray-500">Alerts for new vaccines and updates</p>
            </div>
            <Switch
              checked={notifications.vaccineAlerts}
              onChange={() => setNotifications({ ...notifications, vaccineAlerts: !notifications.vaccineAlerts })}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Weekly Digest</p>
              <p className="text-sm text-gray-500">Receive weekly summary of activities</p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onChange={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
            />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
          <h2 className="text-lg font-semibold">Privacy & Security</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-500">Allow others to view your profile</p>
            </div>
            <Switch
              checked={privacy.profileVisibility}
              onChange={() => setPrivacy({ ...privacy, profileVisibility: !privacy.profileVisibility })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Activity Tracking</p>
              <p className="text-sm text-gray-500">Allow tracking of your activities</p>
            </div>
            <Switch
              checked={privacy.activityTracking}
              onChange={() => setPrivacy({ ...privacy, activityTracking: !privacy.activityTracking })}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-500">Share data with third parties</p>
            </div>
            <Switch
              checked={privacy.dataSharing}
              onChange={() => setPrivacy({ ...privacy, dataSharing: !privacy.dataSharing })}
            />
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <PaintBrushIcon className="h-6 w-6 text-gray-400" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch between light and dark theme</p>
            </div>
            <Switch onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Language Settings */}
      <Card>
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <GlobeAltIcon className="h-6 w-6 text-gray-400" />
          <h2 className="text-lg font-semibold">Language & Region</h2>
        </div>
        <div className="p-6">
          <div className="max-w-xs">
            <Input
              label="Language"
              defaultValue="English"
              onChange={() => {}}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
