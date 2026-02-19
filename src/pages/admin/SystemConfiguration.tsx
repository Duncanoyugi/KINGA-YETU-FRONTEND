import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Tabs } from '@/components/common/Tabs';
import { Alert } from '@/components/common/Alert';
import { Switch } from '@/components/common/Switch';
import { Modal } from '@/components/common/Modal';

interface SystemConfig {
  general: {
    siteName: string;
    siteUrl: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    maintenanceMode: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    reminderDays: number[];
    maxReminders: number;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  security: {
    passwordMinLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    twoFactorRequired: boolean;
    ipWhitelistEnabled: boolean;
  };
  data: {
    retentionPeriod: number;
    backupEnabled: boolean;
    backupFrequency: string;
    backupTime: string;
    autoExportEnabled: boolean;
    exportFormat: string;
    dataEncryption: boolean;
  };
  api: {
    rateLimit: number;
    rateWindow: number;
    apiTimeout: number;
    maxUploadSize: number;
    allowedFileTypes: string[];
    apiVersion: string;
  };
}

const mockConfig: SystemConfig = {
  general: {
    siteName: 'ImmuniTrack Kenya',
    siteUrl: 'https://immunitrack.ke',
    supportEmail: 'support@immunitrack.ke',
    supportPhone: '+254700123456',
    timezone: 'Africa/Nairobi',
    dateFormat: 'MMM dd, yyyy',
    timeFormat: 'HH:mm',
    maintenanceMode: false,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    reminderDays: [7, 3, 1],
    maxReminders: 3,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
  },
  security: {
    passwordMinLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    twoFactorRequired: false,
    ipWhitelistEnabled: false,
  },
  data: {
    retentionPeriod: 365,
    backupEnabled: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    autoExportEnabled: false,
    exportFormat: 'csv',
    dataEncryption: true,
  },
  api: {
    rateLimit: 100,
    rateWindow: 60,
    apiTimeout: 30,
    maxUploadSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'csv'],
    apiVersion: 'v1',
  },
};

const timezones = [
  'Africa/Nairobi',
  'Africa/Kampala',
  'Africa/Dar_es_Salaam',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Europe/London',
  'UTC',
];

const backupFrequencies = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const exportFormats = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'json', label: 'JSON' },
  { value: 'pdf', label: 'PDF' },
];

export const SystemConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { can } = usePermissions();
  const { showToast } = useToast();
  
  const [config, setConfig] = useState<SystemConfig>(mockConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Cog6ToothIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'data', label: 'Data Management', icon: CircleStackIcon },
    { id: 'api', label: 'API Settings', icon: ServerIcon },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast({
        type: 'success',
        message: 'Configuration saved successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to save configuration',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(mockConfig);
    showToast({
      type: 'info',
      message: 'Configuration reset to default values',
    });
  };

  const handleBackup = async () => {
    try {
      showToast({
        type: 'info',
        message: 'Creating system backup...',
      });
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast({
        type: 'success',
        message: 'Backup created successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to create backup',
      });
    }
  };

  const handleRestore = async () => {
    setShowRestoreModal(false);
    try {
      showToast({
        type: 'info',
        message: 'Restoring from backup...',
      });
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast({
        type: 'success',
        message: 'System restored successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Failed to restore system',
      });
    }
  };

  if (!isSuperAdmin && !can('system:configure')) {
    return (
      <Alert
        variant="danger"
        message="You don't have permission to access this page"
      />
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
          >
            Reset to Default
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <Card>
        <Card.Body className="space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Site Name"
                  value={config.general.siteName}
                  onChange={(e) => setConfig({
                    ...config,
                    general: { ...config.general, siteName: e.target.value }
                  })}
                />
                <Input
                  label="Site URL"
                  value={config.general.siteUrl}
                  onChange={(e) => setConfig({
                    ...config,
                    general: { ...config.general, siteUrl: e.target.value }
                  })}
                />
                <Input
                  label="Support Email"
                  type="email"
                  value={config.general.supportEmail}
                  onChange={(e) => setConfig({
                    ...config,
                    general: { ...config.general, supportEmail: e.target.value }
                  })}
                />
                <Input
                  label="Support Phone"
                  value={config.general.supportPhone}
                  onChange={(e) => setConfig({
                    ...config,
                    general: { ...config.general, supportPhone: e.target.value }
                  })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={config.general.timezone}
                    onChange={(e) => setConfig({
                      ...config,
                      general: { ...config.general, timezone: e.target.value }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={config.general.dateFormat}
                    onChange={(e) => setConfig({
                      ...config,
                      general: { ...config.general, dateFormat: e.target.value }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="MMM dd, yyyy">Jan 01, 2024</option>
                    <option value="dd/MM/yyyy">01/01/2024</option>
                    <option value="yyyy-MM-dd">2024-01-01</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">
                    Enable maintenance mode to restrict access during updates
                  </p>
                </div>
                <Switch
                  checked={config.general.maintenanceMode}
                  onChange={(checked: boolean) => setConfig({
                    ...config,
                    general: { ...config.general, maintenanceMode: checked }
                  })}
                />
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email Notifications</span>
                      <Switch
                        checked={config.notifications.emailEnabled}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          notifications: { ...config.notifications, emailEnabled: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SMS Notifications</span>
                      <Switch
                        checked={config.notifications.smsEnabled}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          notifications: { ...config.notifications, smsEnabled: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Push Notifications</span>
                      <Switch
                        checked={config.notifications.pushEnabled}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          notifications: { ...config.notifications, pushEnabled: checked }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Reminder Settings</h4>
                  <Input
                    label="Reminder Days (comma-separated)"
                    value={config.notifications.reminderDays.join(',')}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: {
                        ...config.notifications,
                        reminderDays: e.target.value.split(',').map(Number)
                      }
                    })}
                  />
                  <Input
                    label="Max Reminders"
                    type="number"
                    value={config.notifications.maxReminders}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: {
                        ...config.notifications,
                        maxReminders: parseInt(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Start Time"
                    type="time"
                    value={config.notifications.quietHoursStart}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, quietHoursStart: e.target.value }
                    })}
                  />
                  <Input
                    label="End Time"
                    type="time"
                    value={config.notifications.quietHoursEnd}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, quietHoursEnd: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Password Policy</h4>
                  <Input
                    label="Minimum Length"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, passwordMinLength: parseInt(e.target.value) }
                    })}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require Uppercase</span>
                      <Switch
                        checked={config.security.requireUppercase}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          security: { ...config.security, requireUppercase: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require Lowercase</span>
                      <Switch
                        checked={config.security.requireLowercase}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          security: { ...config.security, requireLowercase: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require Numbers</span>
                      <Switch
                        checked={config.security.requireNumbers}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          security: { ...config.security, requireNumbers: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Require Special Characters</span>
                      <Switch
                        checked={config.security.requireSpecialChars}
                        onChange={(checked: boolean) => setConfig({
                          ...config,
                          security: { ...config.security, requireSpecialChars: checked }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Login Security</h4>
                  <Input
                    label="Max Login Attempts"
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                  />
                  <Input
                    label="Lockout Duration (minutes)"
                    type="number"
                    value={config.security.lockoutDuration}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, lockoutDuration: parseInt(e.target.value) }
                    })}
                  />
                  <Input
                    label="Session Timeout (minutes)"
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">
                      Require 2FA for all admin users
                    </p>
                  </div>
                  <Switch
                    checked={config.security.twoFactorRequired}
                    onChange={(checked: boolean) => setConfig({
                      ...config,
                      security: { ...config.security, twoFactorRequired: checked }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Retention & Backup</h4>
                  <Input
                    label="Data Retention Period (days)"
                    type="number"
                    value={config.data.retentionPeriod}
                    onChange={(e) => setConfig({
                      ...config,
                      data: { ...config.data, retentionPeriod: parseInt(e.target.value) }
                    })}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Automatic Backup</span>
                    <Switch
                      checked={config.data.backupEnabled}
                      onChange={(checked: boolean) => setConfig({
                        ...config,
                        data: { ...config.data, backupEnabled: checked }
                      })}
                    />
                  </div>
                  {config.data.backupEnabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Backup Frequency
                        </label>
                        <select
                          value={config.data.backupFrequency}
                          onChange={(e) => setConfig({
                            ...config,
                            data: { ...config.data, backupFrequency: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          {backupFrequencies.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        label="Backup Time"
                        type="time"
                        value={config.data.backupTime}
                        onChange={(e) => setConfig({
                          ...config,
                          data: { ...config.data, backupTime: e.target.value }
                        })}
                      />
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Export Settings</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto Export</span>
                    <Switch
                      checked={config.data.autoExportEnabled}
                      onChange={(checked: boolean) => setConfig({
                        ...config,
                        data: { ...config.data, autoExportEnabled: checked }
                      })}
                    />
                  </div>
                  {config.data.autoExportEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Export Format
                      </label>
                      <select
                        value={config.data.exportFormat}
                        onChange={(e) => setConfig({
                          ...config,
                          data: { ...config.data, exportFormat: e.target.value }
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        {exportFormats.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Data Encryption</h4>
                    <p className="text-sm text-gray-500">
                      Encrypt sensitive data at rest
                    </p>
                  </div>
                  <Switch
                    checked={config.data.dataEncryption}
                    onChange={(checked: boolean) => setConfig({
                      ...config,
                      data: { ...config.data, dataEncryption: checked }
                    })}
                  />
                </div>
              </div>

              {/* Backup Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Backup Actions</h4>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    leftIcon={<CloudArrowUpIcon className="h-5 w-5" />}
                    onClick={handleBackup}
                  >
                    Create Backup Now
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<CircleStackIcon className="h-5 w-5" />}
                    onClick={() => setShowRestoreModal(true)}
                  >
                    Restore from Backup
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Rate Limit (requests)"
                  type="number"
                  value={config.api.rateLimit}
                  onChange={(e) => setConfig({
                    ...config,
                    api: { ...config.api, rateLimit: parseInt(e.target.value) }
                  })}
                />
                <Input
                  label="Rate Window (seconds)"
                  type="number"
                  value={config.api.rateWindow}
                  onChange={(e) => setConfig({
                    ...config,
                    api: { ...config.api, rateWindow: parseInt(e.target.value) }
                  })}
                />
                <Input
                  label="API Timeout (seconds)"
                  type="number"
                  value={config.api.apiTimeout}
                  onChange={(e) => setConfig({
                    ...config,
                    api: { ...config.api, apiTimeout: parseInt(e.target.value) }
                  })}
                />
                <Input
                  label="Max Upload Size (MB)"
                  type="number"
                  value={config.api.maxUploadSize}
                  onChange={(e) => setConfig({
                    ...config,
                    api: { ...config.api, maxUploadSize: parseInt(e.target.value) }
                  })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Version
                  </label>
                  <select
                    value={config.api.apiVersion}
                    onChange={(e) => setConfig({
                      ...config,
                      api: { ...config.api, apiVersion: e.target.value }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="v1">v1</option>
                    <option value="v2">v2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed File Types
                  </label>
                  <select
                    multiple
                    value={config.api.allowedFileTypes}
                    onChange={(e) => setConfig({
                      ...config,
                      api: {
                        ...config.api,
                        allowedFileTypes: Array.from(e.target.selectedOptions, opt => opt.value)
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel</option>
                    <option value="docx">Word</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        title="Restore from Backup"
        size="sm"
      >
        <Modal.Body>
          <p className="text-gray-600">
            Are you sure you want to restore the system from backup? This will overwrite current data and cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowRestoreModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRestore}
            >
              Restore System
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SystemConfiguration;