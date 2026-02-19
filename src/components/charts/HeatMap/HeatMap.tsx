import React, { useMemo, useState } from 'react';
import type { HeatMapProps, HeatMapCell } from './HeatMap.types';

const defaultColorScale = [
  '#f7fbff', // lightest
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#08519c',
  '#08306b', // darkest
];

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  title,
  width = 800,
  height = 500,
  showLegend = true,
  showTooltip = true,
  showValues = false,
  colorScale = defaultColorScale,
  xAxisLabel,
  yAxisLabel,
  className = '',
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatMapCell | null>(null);

  // Process data to create grid
  const { grid, xLabels, yLabels, minValue, maxValue } = useMemo(() => {
    const xSet = new Set<string>();
    const ySet = new Set<string>();
    let min = Infinity;
    let max = -Infinity;

    data.forEach(point => {
      xSet.add(point.x);
      ySet.add(point.y);
      min = Math.min(min, point.value);
      max = Math.max(max, point.value);
    });

    const xLabels = Array.from(xSet);
    const yLabels = Array.from(ySet);
    const valueRange = max - min;

    // Create grid with proper coloring
    const grid: HeatMapCell[][] = yLabels.map((y, yIndex) =>
      xLabels.map((x, xIndex) => {
        const point = data.find(p => p.x === x && p.y === y);
        const value = point?.value || 0;
        
        // Calculate color index based on value
        const normalizedValue = valueRange !== 0 ? (value - min) / valueRange : 0;
        const colorIndex = Math.min(
          Math.floor(normalizedValue * (colorScale.length - 1)),
          colorScale.length - 1
        );
        
        return {
          x,
          y,
          value,
          color: point?.color || colorScale[colorIndex],
          xIndex,
          yIndex,
        };
      })
    );

    return { grid, xLabels, yLabels, minValue: min, maxValue: max };
  }, [data, colorScale]);

  // Calculate cell dimensions
  const cellWidth = (width - 100) / xLabels.length; // 100px for labels
  const cellHeight = (height - 100) / yLabels.length;

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      )}

      <div className="relative" style={{ width, height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-12 bottom-12 flex flex-col justify-around">
          {yLabels.map((label, index) => (
            <div
              key={index}
              className="text-sm text-gray-600 whitespace-nowrap pr-4"
              style={{ height: cellHeight, display: 'flex', alignItems: 'center' }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Y-axis label */}
        {yAxisLabel && (
          <div
            className="absolute text-sm text-gray-500 whitespace-nowrap"
            style={{
              left: -30,
              top: '50%',
              transform: 'rotate(-90deg) translateX(-50%)',
              transformOrigin: '0 0',
            }}
          >
            {yAxisLabel}
          </div>
        )}

        {/* Heat map grid */}
        <div
          className="absolute"
          style={{ left: 100, top: 12, right: 0, bottom: 40 }}
        >
          {grid.map((row, yIndex) => (
            <div key={yIndex} className="flex" style={{ height: cellHeight }}>
              {row.map((cell, xIndex) => (
                <div
                  key={`${xIndex}-${yIndex}`}
                  className="relative border border-white cursor-pointer transition-all duration-200"
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    backgroundColor: cell.color,
                    opacity: hoveredCell ? 
                      (hoveredCell.xIndex === xIndex && hoveredCell.yIndex === yIndex ? 1 : 0.8) : 1,
                    transform: hoveredCell?.xIndex === xIndex && hoveredCell?.yIndex === yIndex 
                      ? 'scale(1.02)' : 'scale(1)',
                    zIndex: hoveredCell?.xIndex === xIndex && hoveredCell?.yIndex === yIndex ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {showValues && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow-lg">
                        {cell.value}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* X-axis labels */}
          <div className="flex mt-2" style={{ marginLeft: 0 }}>
            {xLabels.map((label, index) => (
              <div
                key={index}
                className="text-sm text-gray-600 text-center transform -rotate-45 origin-top-left"
                style={{
                  width: cellWidth,
                  marginLeft: index === 0 ? 0 : -15, // Adjust for rotation
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* X-axis label */}
        {xAxisLabel && (
          <div
            className="absolute text-sm text-gray-500"
            style={{ bottom: -20, left: '50%', transform: 'translateX(-50%)' }}
          >
            {xAxisLabel}
          </div>
        )}

        {/* Tooltip */}
        {showTooltip && hoveredCell && (
          <div
            className="absolute bg-gray-900 text-white text-sm rounded px-3 py-2 pointer-events-none z-20"
            style={{
              left: 100 + hoveredCell.xIndex * cellWidth + cellWidth / 2,
              top: 12 + hoveredCell.yIndex * cellHeight,
              transform: 'translate(-50%, -110%)',
            }}
          >
            <div className="font-medium">
              {hoveredCell.x} - {hoveredCell.y}
            </div>
            <div className="text-gray-300">Value: {hoveredCell.value}</div>
            <div
              className="absolute w-2 h-2 transform rotate-45 left-1/2 -bottom-1 -translate-x-1/2"
              style={{ backgroundColor: hoveredCell.color }}
            />
          </div>
        )}
      </div>

      {/* Color scale legend */}
      {showLegend && (
        <div className="mt-6 flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-500">Low</span>
          <div className="flex">
            {colorScale.map((color, index) => (
              <div
                key={index}
                className="w-6 h-4"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">High</span>
          <div className="ml-4 text-sm text-gray-600">
            Range: {minValue} - {maxValue}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMap;