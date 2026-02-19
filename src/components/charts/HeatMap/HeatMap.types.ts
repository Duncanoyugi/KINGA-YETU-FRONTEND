export interface HeatMapDataPoint {
  x: string; // X-axis label (e.g., facility name)
  y: string; // Y-axis label (e.g., vaccine name)
  value: number;
  color?: string;
}

export interface HeatMapSeries {
  name: string;
  data: HeatMapDataPoint[];
}

export interface HeatMapProps {
  data: HeatMapDataPoint[];
  title?: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showValues?: boolean;
  colorScale?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

export interface HeatMapCell {
  x: string;
  y: string;
  value: number;
  color: string;
  xIndex: number;
  yIndex: number;
}