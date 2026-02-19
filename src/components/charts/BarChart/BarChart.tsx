import React, { useMemo } from 'react';
import type { BarChartProps } from './BarChart.types';

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  showGrid = true,
  showValues = true,
  className = '',
}) => {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  const chartHeight = height - 40; // Space for labels

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}
      <div className="relative" style={{ height }}>
        {/* Y-axis grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="border-t border-gray-200 w-full"
                style={{ top: `${percent}%` }}
              />
            ))}
          </div>
        )}

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around px-4">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            
            return (
              <div key={index} className="flex flex-col items-center w-16">
                <div
                  className="w-10 bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                  style={{ height: barHeight }}
                >
                  {showValues && barHeight > 20 && (
                    <span className="block text-xs text-white text-center pt-1">
                      {item.value}
                    </span>
                  )}
                </div>
                <span className="mt-2 text-xs text-gray-600 truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;