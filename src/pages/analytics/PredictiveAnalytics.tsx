import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { usePredictiveAnalytics } from '@/features/analytics/analyticsHooks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Alert } from '@/components/common/Alert';
import { Badge } from '@/components/common/Badge';
import { LineChart } from '@/components/charts/LineChart';
import { Tabs } from '@/components/common/Tabs';

const horizons = [
  { value: '3', label: 'Next 3 Months' },
  { value: '6', label: 'Next 6 Months' },
  { value: '12', label: 'Next 12 Months' },
];

export const PredictiveAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('coverage');
  const [horizon, setHorizon] = useState('6');

  const { predictions, isLoading } = usePredictiveAnalytics({
    metric: activeTab === 'coverage' ? 'coverage' : 
            activeTab === 'dropout' ? 'dropout' : 'demand',
    horizon: parseInt(horizon),
  });

  const tabs = [
    { id: 'coverage', label: 'Coverage Forecast' },
    { id: 'dropout', label: 'Dropout Prediction' },
    { id: 'demand', label: 'Vaccine Demand' },
    { id: 'risk', label: 'Risk Assessment' },
  ];

  const handleExport = () => {
    showToast({
      type: 'info',
      message: 'Exporting predictive analytics...',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics</h1>
        </div>
        <Button
          variant="outline"
          leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </div>

      {/* Horizon Selector */}
      <Card>
        <Card.Body>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Prediction Horizon:</span>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {horizons.map(h => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {/* Coverage Forecast */}
        {activeTab === 'coverage' && predictions && (
          <div className="space-y-6">
            <Card>
              <Card.Header title="Coverage Rate Forecast" />
              <Card.Body>
                <LineChart
                  series={[
                    {
                      name: 'Predicted Coverage',
                      data: predictions.values.map((v: number, i: number) => ({
                        label: `Month ${i + 1}`,
                        value: v,
                      })),
                      color: '#3b82f6',
                    },
                  ]}
                  height={400}
                  showLegend
                  showGrid
                  smooth
                  xAxisLabel="Time"
                  yAxisLabel="Coverage (%)"
                />
              </Card.Body>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <Card.Body className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {predictions.confidence}%
                  </div>
                  <div className="text-sm text-gray-600">Confidence Level</div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {predictions.trend > 0 ? '+' : ''}{(predictions.trend ?? 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Projected Change</div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {predictions.factors.length}
                  </div>
                  <div className="text-sm text-gray-600">Key Factors</div>
                </Card.Body>
              </Card>
            </div>

            <Card>
              <Card.Header title="Key Influencing Factors" />
              <Card.Body>
                <div className="space-y-4">
                  {predictions.factors.map((factor: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{factor}</span>
                        <Badge variant="info">Impact Factor</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Dropout Prediction */}
        {activeTab === 'dropout' && predictions && (
          <div className="space-y-6">
            <Card>
              <Card.Header title="Dropout Rate Prediction" />
              <Card.Body>
                <LineChart
                  series={[
                    {
                      name: 'Predicted Dropout Rate',
                      data: predictions.values.map((v: number, i: number) => ({
                        label: `Month ${i + 1}`,
                        value: v,
                      })),
                      color: '#ef4444',
                    },
                  ]}
                  height={400}
                  showLegend
                  showGrid
                  smooth
                  xAxisLabel="Time"
                  yAxisLabel="Dropout Rate (%)"
                />
              </Card.Body>
            </Card>

            <Alert
              variant="warning"
              title="Risk Warning"
              message="Predicted dropout rate may exceed target threshold in 3 months. Consider preventive interventions."
            />
          </div>
        )}

        {/* Vaccine Demand */}
        {activeTab === 'demand' && predictions && (
          <div className="space-y-6">
            <Card>
              <Card.Header title="Vaccine Demand Forecast" />
              <Card.Body>
                <LineChart
                  series={[
                    {
                      name: 'Predicted Demand',
                      data: predictions.values.map((v: number, i: number) => ({
                        label: `Month ${i + 1}`,
                        value: v,
                      })),
                      color: '#10b981',
                    },
                  ]}
                  height={400}
                  showLegend
                  showGrid
                  smooth
                  xAxisLabel="Time"
                  yAxisLabel="Doses Required"
                />
              </Card.Body>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <Card.Header title="Recommended Stock Levels" />
                <Card.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">BCG</span>
                      <span className="font-medium">2,500 doses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">OPV</span>
                      <span className="font-medium">3,800 doses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DPT</span>
                      <span className="font-medium">4,200 doses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Measles</span>
                      <span className="font-medium">2,900 doses</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Reorder Recommendations" />
                <Card.Body>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-yellow-800">BCG</span>
                        <span className="text-yellow-600">Reorder in 2 weeks</span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-green-800">OPV</span>
                        <span className="text-green-600">Stock sufficient</span>
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-red-800">DPT</span>
                        <span className="text-red-600">Reorder immediately</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* Risk Assessment */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            <Card>
              <Card.Header title="High-Risk Zones" />
              <Card.Body>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-800">North Eastern Region</h4>
                        <p className="text-sm text-red-600 mt-1">
                          High probability of coverage drop due to access issues
                        </p>
                      </div>
                      <Badge variant="danger">High Risk</Badge>
                    </div>
                    <div className="mt-3 text-sm text-red-700">
                      <span className="font-medium">Recommended Action:</span> Deploy mobile clinics and community health workers
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-yellow-800">Coastal Region</h4>
                        <p className="text-sm text-yellow-600 mt-1">
                          Seasonal population movement affecting coverage
                        </p>
                      </div>
                      <Badge variant="warning">Medium Risk</Badge>
                    </div>
                    <div className="mt-3 text-sm text-yellow-700">
                      <span className="font-medium">Recommended Action:</span> Adjust scheduling for tourist season
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-orange-800">Western Region</h4>
                        <p className="text-sm text-orange-600 mt-1">
                          Vaccine stockouts predicted in 2 months
                        </p>
                      </div>
                      <Badge variant="warning">Supply Risk</Badge>
                    </div>
                    <div className="mt-3 text-sm text-orange-700">
                      <span className="font-medium">Recommended Action:</span> Increase inventory levels by 30%
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Outbreak Risk Assessment" />
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center p-6">
                      <div className="text-4xl font-bold text-red-600 mb-2">65%</div>
                      <p className="text-gray-600">Probability of Measles Outbreak</p>
                      <p className="text-sm text-gray-500 mt-2">in the next 6 months</p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">Low coverage in under-5 population</span>
                      </div>
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-700">Seasonal increase in cases</span>
                      </div>
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-700">Cross-border movement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Resource Planning" />
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">+25%</div>
                    <div className="text-sm text-gray-600">Staff Required</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">+40%</div>
                    <div className="text-sm text-gray-600">Vaccine Stock Needed</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">+15</div>
                    <div className="text-sm text-gray-600">Mobile Clinics Needed</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalytics;