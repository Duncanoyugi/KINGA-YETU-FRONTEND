import React, { useState } from 'react';
import { useNotifications, useNotificationWebSocket } from '@/features/notifications/notificationsHooks';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { formatRelativeTime } from '@/utils/dateHelpers';
import type { Notification } from '@/features/notifications/notificationsTypes';

export const NotificationsCenter: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const {
    notifications,
    unreadCount,
    unreadNotifications,
    isLoading,
  } = useNotifications(user?.id);

  // Connect to WebSocket for real-time notifications
  useNotificationWebSocket();

  const tabs = [
    { id: 'all', label: 'All', count: Array.isArray(notifications) ? notifications.length : 0 },
    { id: 'unread', label: 'Unread', count: unreadCount || 0 },
    { id: 'reminders', label: 'Reminders' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'system', label: 'System' },
  ];

  const getFilteredNotifications = (): Notification[] => {
    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    
    switch (activeTab) {
      case 'unread':
        return Array.isArray(unreadNotifications) ? unreadNotifications : [];
      case 'reminders':
        return safeNotifications.filter((n: Notification) => n.type.includes('REMINDER'));
      case 'alerts':
        return safeNotifications.filter((n: Notification) => n.type.includes('ALERT'));
      case 'system':
        return safeNotifications.filter((n: Notification) => n.type.includes('SYSTEM'));
      default:
        return safeNotifications;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        getFilteredNotifications().length === 0 ? (
          <div className="text-center text-gray-500">No notifications found.</div>
        ) : (
          <div className="space-y-4">
            {getFilteredNotifications().map((notification) => (
              <div key={notification.id} className="mb-2 border rounded shadow-sm bg-white p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-blue-700">{notification.title}</div>
                  <div className="text-gray-600 text-sm">{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.createdAt)}</div>
                </div>
                {notification.isRead === false && (
                  <Badge variant="warning">Unread</Badge>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default NotificationsCenter;