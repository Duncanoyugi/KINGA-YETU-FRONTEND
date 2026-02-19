import React from 'react';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex space-x-2 ${className}`} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={t.id === activeTab}
          onClick={() => onTabChange(t.id)}
          className={`px-3 py-1 rounded-md text-sm ${t.id === activeTab ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
