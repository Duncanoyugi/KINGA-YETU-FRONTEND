import React, { forwardRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

export interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  error?: string;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ 
    label, 
    value, 
    onChange, 
    error, 
    helperText, 
    minDate, 
    maxDate, 
    disabled, 
    required,
    placeholder = 'Select date',
    className = '' 
  }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      if (onChange) {
        onChange(dateValue);
      }
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="date"
            value={value || ''}
            onChange={handleChange}
            min={minDate}
            max={maxDate}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-primary-500 focus:ring-primary-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              pl-10
            `}
          />
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
