import React, { useMemo, useState, useRef } from 'react';
import type { LineChartProps, TooltipData, ClosestPoint } from './LineChart.types';

const defaultColors = [
  '#3b82f6', // primary
  '#10b981', // secondary
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export const LineChart: React.FC<LineChartProps> = ({
  series,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showDots = true,
  smooth = false,
  className = '',
  xAxisLabel,
  yAxisLabel,
  yAxisMax,
  yAxisMin,
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ seriesIndex: number; pointIndex: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate dimensions
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800 - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max values for scaling
  const allValues = series.flatMap(s => s.data.map(d => d.value));
  const minValue = yAxisMin ?? Math.min(...allValues, 0);
  const maxValue = yAxisMax ?? Math.max(...allValues, 10);
  const valueRange = maxValue - minValue;

  // Generate points for each series
  const seriesPaths = useMemo(() => {
    return series.map((s, seriesIndex) => {
      const points = s.data.map((point, pointIndex) => {
        const x = (pointIndex / (s.data.length - 1)) * chartWidth;
        const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        return { x, y, point, pointIndex, seriesIndex };
      });

      // Generate path
      if (smooth) {
        // Smooth curve using cubic bezier
        const path = points.reduce((acc, point, i, arr) => {
          if (i === 0) return `M ${point.x},${point.y}`;
          
          const prev = arr[i - 1];
          const next = arr[i + 1];
          
          if (!next) {
            return `${acc} L ${point.x},${point.y}`;
          }
          
          // Calculate control points for smooth curve
          const cp1x = prev.x + (point.x - prev.x) * 0.3;
          const cp1y = prev.y;
          const cp2x = point.x - (point.x - prev.x) * 0.3;
          const cp2y = point.y;
          
          return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
        }, '');
        
        return { points, path, color: s.color || defaultColors[seriesIndex % defaultColors.length] };
      } else {
        // Straight line
        const path = points.map(p => `${p.x},${p.y}`).join(' L ');
        return { points, path: `M ${path}`, color: s.color || defaultColors[seriesIndex % defaultColors.length] };
      }
    });
  }, [series, chartWidth, chartHeight, minValue, valueRange, smooth]);

  // Handle mouse move for tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip || !svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - padding.left;
    
    // Find closest point to mouse X position
    let closestPoint: ClosestPoint | null = null;
    let closestDistance = Infinity;
    
    seriesPaths.forEach(({ points }, seriesIndex) => {
      points.forEach((point, pointIndex) => {
        const distance = Math.abs(mouseX - point.x);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = { seriesIndex, pointIndex, distance };
        }
      });
    });

    if (closestPoint && closestDistance < 50) {
      const { seriesIndex, pointIndex } = closestPoint;
      const point = seriesPaths[seriesIndex].points[pointIndex];
      
      setTooltip({
        seriesName: series[seriesIndex].name,
        value: point.point.value,
        label: point.point.label,
        color: seriesPaths[seriesIndex].color,
        x: point.x + padding.left,
        y: point.y + padding.top,
      });
      setHoveredPoint({ seriesIndex, pointIndex });
    } else {
      setTooltip(null);
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredPoint(null);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow relative ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}

      <div className="relative" style={{ height }}>
        {/* Y-axis grid lines and labels */}
        {showGrid && (
          <div className="absolute inset-0" style={{ left: padding.left, right: padding.right }}>
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = padding.top + (chartHeight * (100 - percent)) / 100;
              const value = minValue + (valueRange * percent) / 100;
              
              return (
                <React.Fragment key={percent}>
                  <div
                    className="absolute border-t border-gray-200 w-full"
                    style={{ top: y }}
                  />
                  <span
                    className="absolute text-xs text-gray-500"
                    style={{ left: 0, top: y - 8 }}
                  >
                    {Math.round(value)}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Y-axis label */}
        {yAxisLabel && (
          <div
            className="absolute text-xs text-gray-500 whitespace-nowrap"
            style={{
              left: 0,
              top: '50%',
              transform: 'rotate(-90deg) translateX(-50%)',
              transformOrigin: '0 0',
            }}
          >
            {yAxisLabel}
          </div>
        )}

        {/* SVG Chart */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${800} ${height}`}
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Draw lines for each series */}
            {seriesPaths.map(({ path, color }, index) => (
              <path
                key={index}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="2"
                className="transition-opacity duration-200"
                style={{
                  opacity: hoveredPoint && hoveredPoint.seriesIndex !== index ? 0.3 : 1,
                }}
              />
            ))}

            {/* Draw dots */}
            {showDots &&
              seriesPaths.map(({ points, color }, seriesIndex) =>
                points.map((point, pointIndex) => (
                  <circle
                    key={`${seriesIndex}-${pointIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r={hoveredPoint?.seriesIndex === seriesIndex && hoveredPoint?.pointIndex === pointIndex ? 6 : 4}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-200 cursor-pointer"
                    style={{
                      opacity: hoveredPoint && hoveredPoint.seriesIndex !== seriesIndex ? 0.3 : 1,
                    }}
                    onMouseEnter={() => setHoveredPoint({ seriesIndex, pointIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))
              )}
          </g>
        </svg>

        {/* X-axis labels */}
        <div
          className="absolute bottom-0 flex justify-between w-full px-2"
          style={{ left: padding.left, right: padding.right, bottom: 5 }}
        >
          {series[0]?.data.map((point, index) => (
            <span key={index} className="text-xs text-gray-500 transform -rotate-45 origin-top-left">
              {point.label}
            </span>
          ))}
        </div>

        {/* X-axis label */}
        {xAxisLabel && (
          <div className="absolute text-xs text-gray-500" style={{ bottom: -20, left: '50%', transform: 'translateX(-50%)' }}>
            {xAxisLabel}
          </div>
        )}

        {/* Tooltip */}
        {showTooltip && tooltip && (
          <div
            ref={tooltipRef}
            className="absolute bg-gray-900 text-white text-sm rounded px-3 py-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
            }}
          >
            <div className="font-medium">{tooltip.seriesName}</div>
            <div className="text-gray-300">{tooltip.label}</div>
            <div className="font-bold" style={{ color: tooltip.color }}>
              Value: {tooltip.value}
            </div>
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -bottom-1 -translate-x-1/2" />
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {series.map((s, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: s.color || defaultColors[index % defaultColors.length] }}
              />
              <span className="text-sm text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LineChart;