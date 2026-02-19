import React from 'react';

interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
}

interface TimelineProps {
  items?: TimelineItem[];
  // legacy prop name used in some pages
  events?: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items, events }) => {
  const list = items ?? events ?? [];
  return (
    <ul className="space-y-4">
      {list.map(item => (
        <li key={item.id} className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-gray-400 mt-1" />
          <div>
            <div className="text-sm font-medium text-gray-900">{item.title}</div>
            {item.subtitle && <div className="text-sm text-gray-500">{item.subtitle}</div>}
            {item.date && <div className="text-xs text-gray-400">{item.date}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Timeline;
