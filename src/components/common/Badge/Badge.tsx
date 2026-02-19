import React from 'react';
import type { BadgeProps } from './Badge.types';

const variantClasses = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
};

const outlineVariantClasses = {
  primary: 'border border-primary-300 text-primary-700 bg-transparent',
  secondary: 'border border-secondary-300 text-secondary-700 bg-transparent',
  success: 'border border-green-300 text-green-700 bg-transparent',
  warning: 'border border-yellow-300 text-yellow-700 bg-transparent',
  danger: 'border border-red-300 text-red-700 bg-transparent',
  info: 'border border-blue-300 text-blue-700 bg-transparent',
  default: 'border border-gray-300 text-gray-700 bg-transparent',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  outline = false,
  className = '',
}) => {
  const baseClasses = outline ? outlineVariantClasses[variant as keyof typeof outlineVariantClasses] : variantClasses[variant as keyof typeof variantClasses];
  
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${baseClasses}
        ${sizeClasses[size]}
        ${rounded ? 'rounded-full' : 'rounded-md'}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;