import React from 'react';
import type { AlertsWidgetProps } from './AlertsWidget.types';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { formatRelativeTime } from '@/utils/dateHelpers';

const alertIcons = {
  success: (
    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  warning: (
    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  danger: (
    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  info: (
    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    </div>
  ),
};

export const AlertsWidget: React.FC<AlertsWidgetProps> = ({
  alerts,
  title = 'Alerts & Notifications',
  maxHeight = 400,
  onMarkAsRead,
  onViewAll,
  className = '',
  loading = false,
}) => {
  const unreadCount = alerts.filter(a => !a.read).length;

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  if (loading) {
    return (
      <Card className={className}>
        <Card.Header title={title} />
        <Card.Body>
          <div className="flex justify-center items-center" style={{ height: maxHeight }}>
            <Spinner />
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Card.Header
        title={title}
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : undefined}
        action={
          onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </button>
          )
        }
      />
      <Card.Body>
        <div className="space-y-4" style={{ maxHeight, overflowY: 'auto' }}>
          {alerts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No alerts to display</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`
                  flex items-start space-x-3 p-3 rounded-lg
                  ${!alert.read ? 'bg-gray-50' : ''}
                  hover:bg-gray-100 transition-colors duration-150
                `}
              >
                {alertIcons[alert.type]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{alert.message}</p>
                  {alert.actionable && alert.actionLabel && (
                    <button
                      onClick={alert.onAction}
                      className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      {alert.actionLabel}
                    </button>
                  )}
                </div>
                {!alert.read && onMarkAsRead && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AlertsWidget;