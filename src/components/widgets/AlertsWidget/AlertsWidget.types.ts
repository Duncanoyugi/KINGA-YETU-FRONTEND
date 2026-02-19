export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface AlertsWidgetProps {
  alerts: Alert[];
  title?: string;
  maxHeight?: number;
  onMarkAsRead?: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
  loading?: boolean;
}