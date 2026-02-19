import React from 'react';
import type { SwitchProps } from './Switch.types';

const sizeClasses = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3 translate-x-0.5',
    thumbActive: 'translate-x-4.5',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5 translate-x-0.5',
    thumbActive: 'translate-x-5.5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6 translate-x-0.5',
    thumbActive: 'translate-x-7',
  },
};

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  size = 'md',
  label,
  disabled = false,
  className = '',
  id,
}) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const trackClasses = `
    relative inline-flex shrink-0 cursor-pointer rounded-full 
    transition-colors duration-200 ease-in-out focus:outline-none 
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    ${checked ? 'bg-primary-600' : 'bg-gray-200'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${sizeClasses[size].track}
    ${className}
  `;

  const thumbClasses = `
    pointer-events-none inline-block rounded-full bg-white shadow-lg 
    ring-0 transition-transform duration-200 ease-in-out
    ${sizeClasses[size].thumb}
    ${checked ? sizeClasses[size].thumbActive : 'translate-x-0'}
  `;

  return (
    <div className="flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={handleToggle}
        className={trackClasses}
      >
        <span className={thumbClasses} />
      </button>
      {label && (
        <label
          htmlFor={id}
          className={`ml-3 text-sm font-medium text-gray-900 ${disabled ? 'opacity-50' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;
