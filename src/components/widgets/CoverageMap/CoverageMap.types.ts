export interface CoverageLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  coverage: number;
  children: number;
  facility?: string;
}

export interface CoverageMapProps {
  locations: CoverageLocation[];
  title?: string;
  height?: number;
  zoom?: number;
  center?: [number, number];
  onLocationClick?: (location: CoverageLocation) => void;
  className?: string;
  loading?: boolean;
}