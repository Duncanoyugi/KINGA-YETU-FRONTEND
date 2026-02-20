import React from 'react';
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/app/providers/ThemeProvider';

const themes = [
  { value: 'light', label: 'Light', icon: <SunIcon className="h-5 w-5" /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon className="h-5 w-5" /> },
  { value: 'system', label: 'System', icon: <ComputerDesktopIcon className="h-5 w-5" /> },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value as any)}
          className={`p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500
            ${theme === t.value ? 'bg-accent-600 text-white border-accent-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-accent-100 dark:hover:bg-accent-700'}
          `}
          aria-label={`Switch to ${t.label} mode`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
