import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useNotifications, useNotificationWebSocket } from '@/features/notifications/notificationsHooks';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { formatRelativeTime } from '@/utils/dateHelpers';
import { ROUTES } from '@/routing/routes';
import type { Notification } from '@/features/notifications/notificationsTypes';

export const NotificationsCenter: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const {
    notifications,
    unreadCount,
    unreadNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    refetch,
  } = useNotifications(user?.id);

  // Connect to WebSocket for real-time notifications
  useNotificationWebSocket();

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'reminders', label: 'Reminders' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'system', label: 'System' },
  ];

  const getFilteredNotifications = (): Notification[] => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications;
      case 'reminders':
        return notifications.filter((n: Notification) => n.type.includes('REMINDER'));
      case 'alerts':
        return notifications.filter((n: Notification) => n.type.includes('ALERT'));
      case 'system':
        return notifications.filter((n: Notification) => n.type.includes('SYSTEM'));
      default:
        return notifications;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    showToast({
      type: 'success',
      message: 'All notifications marked as read',
    });
  };

  const handleBulkMarkAsRead = async () => {
    for (const id of selectedNotifications) {
      await markAsRead(id);
    }
    setSelectedNotifications([]);
    showToast({
      type: 'success',
      message: `${selectedNotifications.length} notifications marked as read`,
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const getNotificationIcon = (type: string) => {
    if (type.includes('EMAIL')) return <EnvelopeIcon className="h-5 w-5" />;
    if (type.includes('SMS')) return <PhoneIcon className="h-5 w-5" />;
    if (type.includes('PUSH')) return <ComputerDesktopIcon className="h-5 w-5" />;
    return <BellIcon className="h-5 w-5" />;
  };

  const getNotificationVariant = (type: string): 'info' | 'warning' | 'success' | 'danger' => {
    if (type.includes('ALERT')) return 'danger';
    if (type.includes('REMINDER')) return 'warning';
    if (type.includes('SUCCESS')) return 'success';
    return 'info';
  };

  const filteredNotifications = getFilteredNotifications();

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
          <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your notifications and alerts
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-primary-600">{notifications.length}</div>
            <div className="text-sm text-gray-600">Total Notifications</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter((n: Notification) => n.type.includes('REMINDER')).length}
            </div>
            <div className="text-sm text-gray-600">Reminders</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter((n: Notification) => n.type.includes('ALERT')).length}
            </div>
            <div className="text-sm text-gray-600">Alerts</div>
          </Card.Body>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-primary-700">
            {selectedNotifications.length} notification(s) selected
          </span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedNotifications([])}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<CheckIcon className="h-4 w-4" />}
              onClick={handleBulkMarkAsRead}
            >
              Mark as Read
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Notifications List */}
      <Card>
        <Card.Body>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-2 text-sm text-gray-500">
                You're all caught up! Check back later for new notifications.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Select All Header */}
              <div className="py-2 flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-500">Select All</span>
              </div>

              {/* Notification Items */}
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    py-4 flex items-start space-x-4 hover:bg-gray-50 transition-colors
                    ${!notification.isRead ? 'bg-primary-50' : ''}
                  `}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex-shrink-0">
                    <div className={`
                      p-2 rounded-full
                      ${!notification.isRead ? 'bg-primary-100' : 'bg-gray-100'}
                    `}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={getNotificationVariant(notification.type)}
                          size="sm"
                        >
                          {notification.type.split('_').join(' ')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(notification.sentAt)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    {notification.data && (() => {
                      try {
                        const parsedData = typeof notification.data === 'string' 
                          ? JSON.parse(notification.data) 
                          : notification.data;
                        return Object.entries(parsedData).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </span>
                        ));
                      } catch {
                        return null;
                      }
                    })()}
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-primary-600 hover:text-primary-800"
                      title="Mark as read"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Settings Link */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.REMINDER_SETTINGS)}
        >
          Configure Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationsCenter;