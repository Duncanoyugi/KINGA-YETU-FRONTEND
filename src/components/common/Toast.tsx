import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
    error: <ExclamationCircleIcon className="w-5 h-5 text-red-400" />,
    info: <InformationCircleIcon className="w-5 h-5 text-blue-400" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${backgrounds[type]}`}>
      {icons[type]}
      <p className="text-sm text-gray-800">{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};