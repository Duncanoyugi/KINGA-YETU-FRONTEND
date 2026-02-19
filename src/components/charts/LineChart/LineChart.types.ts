export type LineChartDataPoint = {
  label: string;
  value: number;
  date?: string;
}

export type LineChartSeries = {
  name: string;
  data: LineChartDataPoint[];
  color?: string;
}

export type LineChartProps = {
  series: LineChartSeries[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showDots?: boolean;
  smooth?: boolean;
  className?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisMax?: number;
  yAxisMin?: number;
}

export type ClosestPoint = {
  seriesIndex: number;
  pointIndex: number;
  distance: number;
};

export type TooltipData = {
  seriesName: string;
  value: number;
  label: string;
  color: string;
  x: number;
  y: number;
}