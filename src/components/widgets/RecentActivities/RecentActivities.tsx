import React from 'react';
import type { RecentActivitiesProps } from './RecentActivities.types';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { formatRelativeTime } from '@/utils/dateHelpers';

const activityIcons = {
  vaccination: (
    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  registration: (
    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
      </svg>
    </div>
  ),
  appointment: (
    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  reminder: (
    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    </div>
  ),
  report: (
    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
      <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    </div>
  ),
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  title = 'Recent Activities',
  maxItems = 5,
  onViewAll,
  className = '',
  loading = false,
}) => {
  const displayActivities = activities.slice(0, maxItems);

  if (loading) {
    return (
      <Card className={className}>
        <Card.Header title={title} />
        <Card.Body>
          <div className="flex justify-center items-center py-8">
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
        <div className="flow-root">
          <ul className="-mb-8">
            {displayActivities.length === 0 ? (
              <li className="text-center text-gray-500 py-4">
                No recent activities
              </li>
            ) : (
              displayActivities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index < displayActivities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>{activityIcons[activity.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <p className="text-sm text-gray-900">
                            {activity.title}
                          </p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <time dateTime={activity.timestamp}>
                            {formatRelativeTime(activity.timestamp)}
                          </time>
                          {activity.user && (
                            <>
                              <span className="mx-1">•</span>
                              <span>by {activity.user}</span>
                            </>
                          )}
                          {activity.child && (
                            <>
                              <span className="mx-1">•</span>
                              <span>for {activity.child}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecentActivities;