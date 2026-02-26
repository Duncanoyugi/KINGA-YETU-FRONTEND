import type { ReactNode } from 'react';

export interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}
