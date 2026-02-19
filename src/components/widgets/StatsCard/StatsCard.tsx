import React from 'react';
import type { StatsCardProps } from './StatsCard.types';
import { Spinner } from '@/components/common/Spinner';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';

const colorClasses = {
  primary: 'bg-primary-50 text-primary-700',
  secondary: 'bg-secondary-50 text-secondary-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
};

const iconColorClasses = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-blue-600',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  loading = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          {loading ? (
            <div className="mt-2">
              <Spinner size="sm" />
            </div>
          ) : (
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <div className={`h-6 w-6 ${iconColorClasses[color]}`}>{icon}</div>
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <div
            className={`
              flex items-center text-sm
              ${trend.direction === 'up' ? 'text-green-600' : ''}
              ${trend.direction === 'down' ? 'text-red-600' : ''}
              ${trend.direction === 'neutral' ? 'text-gray-600' : ''}
            `}
          >
            {trend.direction === 'up' && <ArrowUpIcon className="h-4 w-4 mr-1" />}
            {trend.direction === 'down' && <ArrowDownIcon className="h-4 w-4 mr-1" />}
            {trend.direction === 'neutral' && <MinusIcon className="h-4 w-4 mr-1" />}
            <span className="font-medium">{trend.value}%</span>
          </div>
          {trend.label && (
            <span className="ml-2 text-sm text-gray-500">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;