export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  showValues?: boolean;
  className?: string;
}