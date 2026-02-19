import React, { useMemo, useState } from 'react';
import type { PieChartProps, PieSlice } from './PieChart.types';

const defaultColors = [
  '#3b82f6', // primary
  '#10b981', // secondary
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6b7280', // gray
  '#6366f1', // indigo
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 300,
  innerRadius = 0,
  showLegend = true,
  showTooltip = true,
  showPercentages = true,
  className = '',
  donut = false,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Calculate total and prepare slices
  const { slices, total } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    const slices: PieSlice[] = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const endAngle = startAngle + angle;
      
      // Calculate SVG path for slice
      const radius = size / 2;
      const centerX = radius;
      const centerY = radius;
      
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // For donut charts, create a ring instead of full pie
      let path;
      if (donut && innerRadius > 0) {
        const innerRadiusVal = radius * (innerRadius / 100);
        const ix1 = centerX + innerRadiusVal * Math.cos(startRad);
        const iy1 = centerY + innerRadiusVal * Math.sin(startRad);
        const ix2 = centerX + innerRadiusVal * Math.cos(endRad);
        const iy2 = centerY + innerRadiusVal * Math.sin(endRad);
        
        path = `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${ix2} ${iy2}
          A ${innerRadiusVal} ${innerRadiusVal} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
          Z
        `;
      } else {
        path = `
          M ${centerX} ${centerY}
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          Z
        `;
      }
      
      const slice: PieSlice = {
        label: item.label,
        value: item.value,
        color: item.color || defaultColors[index % defaultColors.length],
        percentage,
        startAngle,
        endAngle,
        path,
      };
      
      startAngle = endAngle;
      return slice;
    });
    
    return { slices, total };
  }, [data, size, innerRadius, donut]);

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center">
        {/* Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.path}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
                style={{
                  opacity: hoveredSlice === null || hoveredSlice === index ? 1 : 0.6,
                  transform: hoveredSlice === index ? 'scale(1.02)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            ))}
            
            {/* Center text for donut chart */}
            {donut && innerRadius > 0 && (
              <text
                x={size / 2}
                y={size / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-900"
              >
                {hoveredSlice !== null
                  ? `${slices[hoveredSlice].percentage.toFixed(1)}%`
                  : `${total}`}
              </text>
            )}
          </svg>

          {/* Tooltip */}
          {showTooltip && hoveredSlice !== null && (
            <div
              className="absolute bg-gray-900 text-white text-sm rounded px-3 py-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{
                left: size / 2,
                top: size / 2,
              }}
            >
              <div className="font-medium">{slices[hoveredSlice].label}</div>
              <div className="text-gray-300">
                Value: {slices[hoveredSlice].value}
              </div>
              <div className="text-gray-300">
                {slices[hoveredSlice].percentage.toFixed(1)}%
              </div>
              <div
                className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -bottom-1 -translate-x-1/2"
                style={{ backgroundColor: slices[hoveredSlice].color }}
              />
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 md:mt-0 md:ml-8 space-y-2">
            {slices.map((slice, index) => (
              <div
                key={index}
                className="flex items-center cursor-pointer"
                onMouseEnter={() => setHoveredSlice(index)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-sm text-gray-600">{slice.label}</span>
                {showPercentages && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({slice.percentage.toFixed(1)}%)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;