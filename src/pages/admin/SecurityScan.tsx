import React, { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { apiService } from '@/services/api/all';

const SecurityScan: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await apiService.system.getConfig();
        setConfig((response as any).data);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Security Scan</h1>
      <Card>
        <Card.Header title="Current Security Configuration" />
        <Card.Body className="space-y-4">
          <div className="flex justify-between"><span>Password minimum length</span><span className="font-medium">{config?.security?.passwordMinLength}</span></div>
          <div className="flex justify-between"><span>Two-factor required</span><span className="font-medium">{config?.security?.twoFactorRequired ? 'Yes' : 'No'}</span></div>
          <div className="flex justify-between"><span>Max login attempts</span><span className="font-medium">{config?.security?.maxLoginAttempts}</span></div>
          <div className="flex justify-between"><span>Session timeout</span><span className="font-medium">{config?.security?.sessionTimeout} minutes</span></div>
          <div className="flex justify-between"><span>IP whitelist enabled</span><span className="font-medium">{config?.security?.ipWhitelistEnabled ? 'Yes' : 'No'}</span></div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SecurityScan;
