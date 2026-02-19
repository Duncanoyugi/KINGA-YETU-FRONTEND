export interface Activity {
  id: string;
  type: 'vaccination' | 'registration' | 'appointment' | 'reminder' | 'report';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  child?: string;
  childName?: string;
  metadata?: Record<string, any>;
}

export interface RecentActivitiesProps {
  activities: Activity[];
  title?: string;
  maxItems?: number;
  onViewAll?: () => void;
  className?: string;
  loading?: boolean;
}