export interface ActivityDataPoint {
  date: string;
  vaccinations: number;
  registrations: number;
  appointments: number;
}

export interface ActivityChartProps {
  data: ActivityDataPoint[];
  title?: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
  loading?: boolean;
}