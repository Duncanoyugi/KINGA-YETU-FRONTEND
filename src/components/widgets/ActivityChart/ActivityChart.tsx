import React from 'react';
import type { ActivityChartProps } from './ActivityChart.types';
import LineChart from '@/components/charts/LineChart';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  title = 'Activity Overview',
  height = 300,
  showLegend = true,
  className = '',
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <Card.Header title={title} />
        <Card.Body>
          <div className="flex justify-center items-center" style={{ height }}>
            <Spinner />
          </div>
        </Card.Body>
      </Card>
    );
  }

  const series = [
    {
      name: 'Vaccinations',
      data: data.map(d => ({ label: d.date, value: d.vaccinations })),
      color: '#3b82f6',
    },
    {
      name: 'Registrations',
      data: data.map(d => ({ label: d.date, value: d.registrations })),
      color: '#10b981',
    },
    {
      name: 'Appointments',
      data: data.map(d => ({ label: d.date, value: d.appointments })),
      color: '#f59e0b',
    },
  ];

  return (
    <Card className={className}>
      <Card.Header title={title} />
      <Card.Body>
        <LineChart
          series={series}
          height={height}
          showLegend={showLegend}
          showGrid
          smooth
        />
      </Card.Body>
    </Card>
  );
};

export default ActivityChart;