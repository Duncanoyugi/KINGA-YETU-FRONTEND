import React, { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { apiService } from '@/services/api/all';

const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [healthResponse, statsResponse] = await Promise.all([
          apiService.system.getHealth(),
          apiService.system.getStats(),
        ]);
        setHealth((healthResponse as any).data);
        setStats((statsResponse as any).data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-xl font-semibold text-gray-900">{health?.status || 'Unknown'}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Last Backup</p>
            <p className="text-xl font-semibold text-gray-900">{health?.lastBackup ? new Date(health.lastBackup).toLocaleString() : 'Unknown'}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">System Uptime</p>
            <p className="text-xl font-semibold text-gray-900">{stats?.systemUptime ? `${stats.systemUptime}%` : 'N/A'}</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;
