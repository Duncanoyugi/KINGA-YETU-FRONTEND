// Analytics data types
export interface DashboardMetrics {
  totalChildren: number;
  activeChildren: number;
  totalVaccinations: number;
  upcomingVaccinations: number;
  missedVaccinations: number;
  coverageRate: number;
  dropoutRate: number;
  timelinessRate: number;
  facilities: number;
  healthWorkers: number;
  parents: number;
}

export interface CoverageAnalytics {
  overall: {
    total: number;
    covered: number;
    partiallyCovered: number;
    uncovered: number;
    rate: number;
  };
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    target: number;
    administered: number;
    coverage: number;
    trend: number;
  }>;
  byAgeGroup: Array<{
    ageGroup: string;
    population: number;
    covered: number;
    rate: number;
  }>;
  byRegion: Array<{
    region: string;
    coverage: number;
    trend: 'up' | 'down' | 'stable';
    children: number;
  }>;
  timeline: Array<{
    date: string;
    coverage: number;
    target: number;
  }>;
}

export interface DropoutAnalytics {
  overall: {
    rate: number;
    totalDropouts: number;
    totalEnrolled: number;
  };
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    dropoutRate: number;
    droppedCount: number;
    totalCount: number;
    trend: 'improving' | 'worsening' | 'stable';
  }>;
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    dropoutRate: number;
    trend: 'improving' | 'worsening' | 'stable';
  }>;
  reasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

export interface PerformanceMetrics {
  facilityPerformance: Array<{
    facilityId: string;
    facilityName: string;
    metrics: {
      vaccinations: number;
      coverage: number;
      timeliness: number;
      wastage: number;
      efficiency: number;
    };
    rank: number;
  }>;
  healthWorkerPerformance: Array<{
    workerId: string;
    workerName: string;
    facilityName: string;
    metrics: {
      vaccinations: number;
      averagePerDay: number;
      accuracy: number;
      satisfaction: number;
    };
  }>;
  comparativeAnalysis: {
    topPerformers: string[];
    needsImprovement: string[];
    averages: Record<string, number>;
  };
}

export interface TrendAnalytics {
  vaccinationTrends: Array<{
    period: string;
    count: number;
    cumulative: number;
    projected: number;
  }>;
  seasonalPatterns: Array<{
    month: string;
    average: number;
    peak: number;
    low: number;
  }>;
  growthTrends: Array<{
    childId: string;
    age: number;
    weight: number;
    height: number;
    percentiles: {
      weight: number;
      height: number;
      bmi: number;
    };
  }>;
  predictions: {
    nextMonthVaccinations: number;
    projectedCoverage: number;
    riskZones: Array<{
      region: string;
      risk: 'high' | 'medium' | 'low';
      factors: string[];
    }>;
  };
}

export interface GeographicAnalytics {
  heatmap: Array<{
    lat: number;
    lng: number;
    intensity: number;
    count: number;
  }>;
  coverageByCounty: Array<{
    county: string;
    coverage: number;
    children: number;
    facilities: number;
  }>;
  underservedAreas: Array<{
    area: string;
    population: number;
    distanceToFacility: number;
    coverage: number;
  }>;
}

export interface DemographicsAnalytics {
  ageDistribution: Array<{
    ageRange: string;
    male: number;
    female: number;
    total: number;
  }>;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  socioeconomic: Array<{
    indicator: string;
    value: number;
    correlation: number;
  }>;
  birthRate: Array<{
    month: string;
    births: number;
    registered: number;
  }>;
}

// Request/Response types
export interface AnalyticsRequest {
  facilityId?: string;
  county?: string;
  subCounty?: string;
  startDate: string;
  endDate: string;
  timeframe?: 'today' | 'week' | 'month' | 'quarter' | 'year';
  groupBy?: 'day' | 'week' | 'month' | 'quarter';
  compareWith?: 'previous' | 'lastYear' | 'target';
}

export interface PredictionRequest {
  metric: 'coverage' | 'dropout' | 'demand';
  horizon: number; // months
  includeFactors?: boolean;
}

export interface AnalyticsResponse<T> {
  data: T;
  metadata: {
    generatedAt: string;
    period: {
      start: string;
      end: string;
    };
    filters: AnalyticsRequest;
  };
}

// State interface
export interface AnalyticsState {
  dashboard: DashboardMetrics | null;
  coverage: CoverageAnalytics | null;
  dropout: DropoutAnalytics | null;
  performance: PerformanceMetrics | null;
  trends: TrendAnalytics | null;
  geographic: GeographicAnalytics | null;
  demographics: DemographicsAnalytics | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  lastUpdated: string | null;
}