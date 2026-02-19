export interface PieChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
  innerRadius?: number; // For donut charts
  showLegend?: boolean;
  showTooltip?: boolean;
  showPercentages?: boolean;
  className?: string;
  donut?: boolean;
}

export interface PieSlice {
  label: string;
  value: number;
  color: string;
  percentage: number;
  startAngle: number;
  endAngle: number;
  path: string;
}