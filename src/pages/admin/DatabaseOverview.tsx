import React, { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { apiService } from '@/services/api/all';

const DatabaseOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await apiService.system.getStats();
        setStats((response as any).data);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Database Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><Card.Body><p className="text-sm text-gray-500">Total Users</p><p className="text-xl font-semibold text-gray-900">{stats?.totalUsers ?? 0}</p></Card.Body></Card>
        <Card><Card.Body><p className="text-sm text-gray-500">Total Children</p><p className="text-xl font-semibold text-gray-900">{stats?.totalChildren ?? 0}</p></Card.Body></Card>
        <Card><Card.Body><p className="text-sm text-gray-500">Total Facilities</p><p className="text-xl font-semibold text-gray-900">{stats?.totalFacilities ?? 0}</p></Card.Body></Card>
        <Card><Card.Body><p className="text-sm text-gray-500">Total Immunizations</p><p className="text-xl font-semibold text-gray-900">{stats?.totalImmunizations ?? 0}</p></Card.Body></Card>
      </div>
    </div>
  );
};

export default DatabaseOverview;
