// Dashboard Metrics
export interface DashboardMetrics {
  // Overview
  totalChildren: number;
  activeChildren: number;
  newChildrenToday: number;
  newChildrenThisWeek: number;
  newChildrenThisMonth: number;
  
  // Vaccinations
  totalVaccinations: number;
  todayVaccinations: number;
  thisWeekVaccinations: number;
  thisMonthVaccinations: number;
  
  // Appointments
  upcomingAppointments: number;
  todayAppointments: number;
  missedAppointments: number;
  completedAppointments: number;
  
  // Coverage
  overallCoverage: number;
  fullyImmunized: number;
  partiallyImmunized: number;
  notImmunized: number;
  
  // Performance
  timelinessRate: number;
  dropoutRate: number;
  wastageRate: number;
  
  // Facilities
  totalFacilities: number;
  activeFacilities: number;
  facilitiesWithStockouts: number;
  
  // Staff
  totalHealthWorkers: number;
  activeHealthWorkers: number;
  
  // Parents
  totalParents: number;
  activeParents: number;
  
  // Alerts
  pendingAlerts: number;
  criticalAlerts: number;
  
  lastUpdated: string;
}

// Coverage Analytics
export interface CoverageAnalytics {
  summary: {
    total: number;
    covered: number;
    partiallyCovered: number;
    uncovered: number;
    coverageRate: number;
    target: number;
    gap: number;
  };
  
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    targetPopulation: number;
    administered: number;
    coverage: number;
    trend: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
  }>;
  
  byAgeGroup: Array<{
    ageGroup: string;
    population: number;
    covered: number;
    coverage: number;
    target: number;
  }>;
  
  byRegion: Array<{
    region: string;
    county?: string;
    subCounty?: string;
    coverage: number;
    population: number;
    facilities: number;
    trend: 'up' | 'down' | 'stable';
    rank: number;
  }>;
  
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    facilityType: string;
    coverage: number;
    children: number;
    performance: 'above' | 'meeting' | 'below' | 'critical';
  }>;
  
  timeline: Array<{
    date: string;
    coverage: number;
    target: number;
    cumulative: number;
  }>;
  
  comparisons: {
    vsNational: number;
    vsCounty: number;
    vsTarget: number;
    vsLastMonth: number;
    vsLastYear: number;
  };
  
  projections: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
    confidence: number;
  };
}

// Dropout Analytics
export interface DropoutAnalytics {
  summary: {
    overallRate: number;
    totalDropouts: number;
    totalEnrolled: number;
    targetRate: number;
    dropoutGap: number;
  };
  
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    dropoutRate: number;
    droppedCount: number;
    totalCount: number;
    comparison: {
      vsNational: number;
      vsTarget: number;
    };
    trend: 'improving' | 'worsening' | 'stable';
  }>;
  
  byAgeGroup: Array<{
    ageGroup: string;
    dropoutRate: number;
    droppedCount: number;
    totalCount: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  
  byRegion: Array<{
    region: string;
    dropoutRate: number;
    droppedCount: number;
    totalCount: number;
    rank: number;
    trend: 'improving' | 'worsening' | 'stable';
  }>;
  
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    dropoutRate: number;
    droppedCount: number;
    totalCount: number;
    performance: 'good' | 'average' | 'poor';
    interventions?: string[];
  }>;
  
  reasons: Array<{
    reason: string;
    count: number;
    percentage: number;
    category: 'access' | 'awareness' | 'attitude' | 'system' | 'other';
    recommendations?: string[];
  }>;
  
  riskFactors: Array<{
    factor: string;
    correlation: number;
    significance: number;
    affectedPopulation: number;
    mitigation?: string;
  }>;
  
  timeline: Array<{
    period: string;
    dropoutRate: number;
    target: number;
  }>;
}

// Performance Analytics
export interface PerformanceMetrics {
  summary: {
    overallScore: number;
    rank: number;
    percentile: number;
    peerComparison: number;
  };
  
  facilityPerformance: Array<{
    facilityId: string;
    facilityName: string;
    facilityType: string;
    metrics: {
      coverage: number;
      timeliness: number;
      dropout: number;
      wastage: number;
      productivity: number;
      efficiency: number;
      satisfaction: number;
    };
    scores: {
      overall: number;
      byCategory: Record<string, number>;
    };
    rank: number;
    trend: 'improving' | 'stable' | 'declining';
    benchmark: {
      peerAverage: number;
      percentile: number;
      gap: number;
    };
  }>;
  
  healthWorkerPerformance: Array<{
    workerId: string;
    workerName: string;
    facilityId: string;
    facilityName: string;
    metrics: {
      vaccinations: number;
      childrenServed: number;
      averagePerDay: number;
      accuracy: number;
      timeliness: number;
      satisfaction: number;
    };
    rank: number;
    percentile: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  
  comparativeAnalysis: {
    topPerformers: Array<{
      id: string;
      name: string;
      score: number;
      strengths: string[];
    }>;
    needsImprovement: Array<{
      id: string;
      name: string;
      score: number;
      weaknesses: string[];
      recommendations: string[];
    }>;
    averages: Record<string, number>;
    benchmarks: Record<string, number>;
    distributions: Record<string, DistributionData>;
  };
  
  efficiencyMetrics: {
    averageTimePerVaccination: number;
    averageWaitingTime: number;
    staffUtilization: number;
    resourceUtilization: number;
    costPerVaccination: number;
  };
  
  qualityMetrics: {
    documentationCompleteness: number;
    dataAccuracy: number;
    adverseEventReporting: number;
    followUpRate: number;
  };
}

export interface DistributionData {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  quartiles: [number, number, number];
  histogram: Array<{
    range: string;
    count: number;
  }>;
}

// Trend Analytics
export interface TrendAnalytics {
  vaccinationTrends: Array<{
    period: string;
    actual: number;
    target: number;
    cumulative: number;
    projected: number;
    variance: number;
    growthRate: number;
  }>;
  
  coverageTrends: Array<{
    period: string;
    rate: number;
    movingAverage: number;
    seasonallyAdjusted: number;
    trend: number;
  }>;
  
  dropoutTrends: Array<{
    period: string;
    rate: number;
    movingAverage: number;
    change: number;
  }>;
  
  seasonalPatterns: Array<{
    month: string;
    average: number;
    median: number;
    peak: number;
    low: number;
    seasonality: number;
    pattern: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
  }>;
  
  growthPatterns: Array<{
    childId: string;
    age: number;
    weight: number;
    height: number;
    percentiles: {
      weight: number;
      height: number;
      bmi: number;
      headCircumference?: number;
    };
    zScores: {
      weightForAge: number;
      heightForAge: number;
      weightForHeight: number;
      bmiForAge: number;
    };
    trend: 'normal' | 'faltering' | 'accelerated' | 'concerning';
  }>;
  
  correlations: Array<{
    variable1: string;
    variable2: string;
    correlation: number;
    significance: number;
    description: string;
  }>;
  
  anomalyDetection: Array<{
    date: string;
    metric: string;
    expected: number;
    actual: number;
    deviation: number;
    severity: 'minor' | 'moderate' | 'severe';
    possibleCauses?: string[];
    alertGenerated: boolean;
  }>;
}

// Predictive Analytics
export interface PredictiveAnalytics {
  coveragePredictions: {
    nextMonth: Prediction;
    nextQuarter: Prediction;
    nextYear: Prediction;
    fiveYear: Prediction;
  };
  
  dropoutPredictions: {
    nextMonth: Prediction;
    nextQuarter: Prediction;
    nextYear: Prediction;
  };
  
  demandPredictions: {
    byVaccine: Array<{
      vaccineId: string;
      vaccineName: string;
      predictions: Prediction[];
      confidence: number;
    }>;
    total: Prediction[];
  };
  
  riskPredictions: {
    highRiskZones: Array<{
      region: string;
      risk: 'high' | 'medium' | 'low';
      probability: number;
      factors: string[];
      population: number;
      recommendedActions: string[];
    }>;
    
    outbreakRisk: {
      probability: number;
      estimatedCases: number;
      timeline: string;
      vulnerablePopulation: number;
      readinessScore: number;
    };
  };
  
  resourcePredictions: {
    vaccineDemand: Array<{
      vaccineId: string;
      vaccineName: string;
      monthlyDemand: Prediction[];
      recommendedStock: number;
      reorderPoint: number;
    }>;
    
    staffingNeeds: Array<{
      facilityId: string;
      facilityName: string;
      currentStaff: number;
      requiredStaff: number;
      gap: number;
      byRole: Record<string, number>;
    }>;
  };
}

export interface Prediction {
  value: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  factors: Array<{
    name: string;
    impact: number;
    direction: 'positive' | 'negative';
  }>;
}

// Geographic Analytics
export interface GeographicAnalytics {
  heatmap: Array<{
    latitude: number;
    longitude: number;
    intensity: number;
    value: number;
    label?: string;
  }>;
  
  coverageByCounty: Array<{
    county: string;
    coverage: number;
    target: number;
    children: number;
    facilities: number;
    healthWorkers: number;
    rank: number;
    coordinates: {
      center: [number, number];
      bounds: [[number, number], [number, number]];
    };
  }>;
  
  coverageBySubCounty: Array<{
    county: string;
    subCounty: string;
    coverage: number;
    children: number;
    facilities: number;
    distanceToFacility: number;
  }>;
  
  underservedAreas: Array<{
    area: string;
    county: string;
    subCounty: string;
    population: number;
    children: number;
    facilities: number;
    distanceToNearestFacility: number; // in km
    coverage: number;
    priority: 'high' | 'medium' | 'low';
    recommendedIntervention: string;
  }>;
  
  accessibilityAnalysis: Array<{
    region: string;
    populationWithin5km: number;
    populationWithin10km: number;
    populationWithin20km: number;
    populationBeyond20km: number;
    averageDistance: number;
    roadNetwork?: string;
    publicTransport?: boolean;
  }>;
  
  clusterAnalysis: Array<{
    clusterId: string;
    center: [number, number];
    radius: number;
    population: number;
    coverage: number;
    facilities: number[];
    children: number[];
    recommendations: string[];
  }>;
}

// Demographic Analytics
export interface DemographicsAnalytics {
  ageDistribution: Array<{
    ageRange: string;
    male: number;
    female: number;
    total: number;
    percentage: number;
    immunizationRate: number;
  }>;
  
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    malePercentage: number;
    femalePercentage: number;
    otherPercentage: number;
    coverageByGender: {
      male: number;
      female: number;
      other: number;
    };
  };
  
  socioeconomic: Array<{
    indicator: string;
    value: number;
    correlation: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
    trend: 'improving' | 'worsening' | 'stable';
  }>;
  
  geographicDistribution: Array<{
    region: string;
    urban: number;
    rural: number;
    urbanCoverage: number;
    ruralCoverage: number;
    gap: number;
  }>;
  
  birthRate: Array<{
    year: number;
    month?: number;
    births: number;
    registered: number;
    registrationRate: number;
    projectedBirths: number;
  }>;
  
  householdCharacteristics: {
    averageSize: number;
    withUnder5: number;
    singleParent: number;
    employed: number;
    educationLevels: Record<string, number>;
    incomeLevels: Record<string, number>;
    housingTypes: Record<string, number>;
  };
  
  populationPyramid: Array<{
    ageGroup: string;
    male: number;
    female: number;
    malePercentage: number;
    femalePercentage: number;
  }>;
}

// Inventory Analytics
export interface InventoryAnalytics {
  summary: {
    totalDoses: number;
    totalValue: number;
    facilitiesWithStock: number;
    facilitiesWithStockouts: number;
    facilitiesWithLowStock: number;
    wastageRate: number;
    turnoverRate: number;
  };
  
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    totalDoses: number;
    availableDoses: number;
    reservedDoses: number;
    monthlyConsumption: number;
    daysOfStock: number;
    stockouts: number;
    facilities: {
      withStock: number;
      lowStock: number;
      outOfStock: number;
    };
    wastage: {
      doses: number;
      rate: number;
      byReason: Record<string, number>;
    };
    status: 'healthy' | 'low' | 'critical' | 'out';
    reorderRecommendation: {
      doses: number;
      urgency: 'immediate' | 'soon' | 'routine';
      suggestedDate: string;
    };
  }>;
  
  expiringStock: Array<{
    vaccineId: string;
    vaccineName: string;
    batchNumber: string;
    facilityId: string;
    facilityName: string;
    quantity: number;
    expiryDate: string;
    daysToExpiry: number;
    action: 'use_now' | 'transfer' | 'donate' | 'prepare_for_wastage';
    recommendedAction?: string;
  }>;
  
  stockoutRisk: Array<{
    vaccineId: string;
    vaccineName: string;
    facilityId: string;
    facilityName: string;
    currentStock: number;
    dailyConsumption: number;
    daysRemaining: number;
    risk: 'low' | 'medium' | 'high' | 'critical';
    expectedDelivery?: string;
    recommendedOrder: number;
  }>;
  
  wastageAnalysis: Array<{
    vaccineId: string;
    vaccineName: string;
    totalWastage: number;
    wastageRate: number;
    byType: Record<string, number>;
    byReason: Record<string, number>;
    cost: number;
    trend: 'improving' | 'worsening' | 'stable';
    recommendations: string[];
  }>;
  
  supplyChain: Array<{
    vaccineId: string;
    vaccineName: string;
    leadTime: number; // in days
    reliability: number; // percentage
    suppliers: Array<{
      name: string;
      reliability: number;
      leadTime: number;
      costPerDose: number;
    }>;
    performance: {
      onTimeDelivery: number;
      orderFulfillment: number;
      qualityIncidents: number;
    };
  }>;
}

// Financial Analytics
export interface FinancialAnalytics {
  summary: {
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    variance: number;
    costPerChild: number;
    costPerVaccination: number;
  };
  
  byCategory: Array<{
    category: string;
    budgeted: number;
    spent: number;
    variance: number;
    percentage: number;
  }>;
  
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    budgeted: number;
    spent: number;
    variance: number;
    efficiency: number;
    costPerVaccination: number;
  }>;
  
  costAnalysis: {
    vaccineCosts: Array<{
      vaccineId: string;
      vaccineName: string;
      unitCost: number;
      dosesUsed: number;
      totalCost: number;
      wastageCost: number;
    }>;
    operationalCosts: Record<string, number>;
    personnelCosts: Record<string, number>;
  };
  
  roi: {
    financial: number;
    social: number;
    health: number;
    breakevenPeriod: number; // in months
    projections: Array<{
      year: number;
      investment: number;
      returns: number;
      net: number;
    }>;
  };
  
  fundingGap: {
    currentGap: number;
    projectedGap: number;
    byQuarter: Array<{
      quarter: string;
      required: number;
      available: number;
      gap: number;
    }>;
    recommendations: string[];
  };
}

// Alert Analytics
export interface AlertAnalytics {
  summary: {
    total: number;
    active: number;
    resolved: number;
    critical: number;
    warning: number;
    info: number;
  };
  
  byType: Array<{
    type: string;
    count: number;
    severity: 'critical' | 'warning' | 'info';
    trend: 'increasing' | 'decreasing' | 'stable';
    averageResolutionTime: number; // in hours
  }>;
  
  bySeverity: Record<string, {
    count: number;
    active: number;
    resolved: number;
    averageResolutionTime: number;
  }>;
  
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    total: number;
    active: number;
    critical: number;
    warning: number;
    info: number;
    responseRate: number;
  }>;
  
  timeline: Array<{
    date: string;
    critical: number;
    warning: number;
    info: number;
    resolved: number;
  }>;
  
  responseMetrics: {
    averageResponseTime: number; // in minutes
    averageResolutionTime: number; // in hours
    escalationRate: number;
    autoResolvedRate: number;
    slaCompliance: number;
  };
  
  commonCauses: Array<{
    cause: string;
    count: number;
    percentage: number;
    recommendation: string;
  }>;
}

// Real-time Analytics
export interface RealTimeAnalytics {
  activeUsers: number;
  activeSessions: number;
  currentVaccinations: number;
  queueLength: number;
  averageWaitTime: number;
  todayStats: {
    vaccinations: number;
    registrations: number;
    appointments: number;
    completed: number;
  };
  recentActivity: Array<{
    timestamp: string;
    type: string;
    description: string;
    userId?: string;
    facilityId?: string;
  }>;
  systemStatus: {
    apiLatency: number;
    databaseLatency: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    activeConnections: number;
  };
  alerts: Array<{
    id: string;
    severity: string;
    message: string;
    timestamp: string;
    acknowledged: boolean;
  }>;
}

// Export Types
export type AnalyticsTimeframe = 
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'lastQuarter'
  | 'thisYear'
  | 'lastYear'
  | 'custom';

export type AnalyticsGroupBy = 
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'vaccine'
  | 'facility'
  | 'county'
  | 'subCounty'
  | 'ageGroup'
  | 'gender';

export type AnalyticsMetric = 
  | 'coverage'
  | 'dropout'
  | 'timeliness'
  | 'wastage'
  | 'productivity'
  | 'efficiency'
  | 'satisfaction'
  | 'cost'
  | 'utilization';

export type ChartType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'tree'
  | 'treemap'
  | 'sunburst'
  | 'sankey'
  | 'radar'
  | 'gauge'
  | 'funnel'
  | 'table';

// Request/Response
export interface AnalyticsRequest {
  timeframe: AnalyticsTimeframe;
  startDate?: string;
  endDate?: string;
  groupBy?: AnalyticsGroupBy;
  metrics?: AnalyticsMetric[];
  filters?: {
    facilityIds?: string[];
    counties?: string[];
    subCounties?: string[];
    vaccineIds?: string[];
    ageGroups?: string[];
    genders?: string[];
  };
  compareWith?: {
    timeframe: AnalyticsTimeframe;
    startDate?: string;
    endDate?: string;
  };
  chartType?: ChartType;
  includeRawData?: boolean;
  includeMetadata?: boolean;
}

export interface AnalyticsResponse<T> {
  data: T;
  metadata: {
    generatedAt: string;
    timeframe: AnalyticsTimeframe;
    period: {
      start: string;
      end: string;
    };
    filters: AnalyticsRequest['filters'];
    comparison?: {
      data: any;
      percentageChange: number;
      absoluteChange: number;
    };
    summary: {
      totalRecords: number;
      dataQuality: number;
      confidence: number;
    };
  };
}

// Widget Configuration
export interface AnalyticsWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'list' | 'heatmap';
  metric?: AnalyticsMetric;
  chartType?: ChartType;
  size: 'small' | 'medium' | 'large' | 'full';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: {
    timeframe?: AnalyticsTimeframe;
    groupBy?: AnalyticsGroupBy;
    filters?: AnalyticsRequest['filters'];
    comparison?: boolean;
    refreshInterval?: number; // in seconds
    thresholds?: {
      warning?: number;
      critical?: number;
    };
  };
}

// Dashboard Configuration
export interface AnalyticsDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: AnalyticsWidget[];
  layout: 'grid' | 'free';
  defaultTimeframe: AnalyticsTimeframe;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Export Options
export interface AnalyticsExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'image';
  includeCharts: boolean;
  includeMetadata: boolean;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  filename?: string;
}