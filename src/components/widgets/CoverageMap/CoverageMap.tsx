import React from 'react';
import type { CoverageMapProps } from './CoverageMap.types';
import { Card } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';

// This is a placeholder component. In a real app, you'd integrate a map library
// like react-leaflet, @react-google-maps/api, or mapbox-gl

export const CoverageMap: React.FC<CoverageMapProps> = ({
  locations,
  title = 'Geographic Coverage',
  height = 400,
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

  return (
    <Card className={className}>
      <Card.Header title={title} />
      <Card.Body>
        <div
          className="bg-gray-100 rounded-lg flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Map Integration</h3>
            <p className="mt-1 text-sm text-gray-500">
              {locations.length} locations tracked
            </p>
            <div className="mt-4 text-left text-xs text-gray-500">
              <p className="font-medium">Sample locations:</p>
              {locations.slice(0, 3).map((loc) => (
                <div key={loc.id} className="mt-1">
                  • {loc.name}: {loc.coverage}% coverage ({loc.children} children)
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CoverageMap;