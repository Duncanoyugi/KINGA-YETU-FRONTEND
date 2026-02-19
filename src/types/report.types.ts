import type { User } from './user.types.js';

// Core Report model
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  description?: string | null;
  
  parameters: ReportParameters;
  data: any; // JSON data
  summary?: ReportSummary | null;
  
  format: ReportFormat;
  frequency: ReportFrequency;
  
  isPublic: boolean;
  isArchived: boolean;
  
  generatedById: string;
  generatedAt: string;
  
  scheduledFor?: string | null;
  expiresAt?: string | null;
  
  downloadUrl?: string | null;
  fileSize?: number | null;
  
  tags?: string[] | null;
  
  createdAt: string;
  updatedAt: string;
  
  generatedBy?: User;
}

// Report parameters
export interface ReportParameters {
  // Date range
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  
  // Filters
  facilityIds?: string[];
  counties?: string[];
  subCounties?: string[];
  wards?: string[];
  
  // Demographics
  ageGroups?: AgeGroup[];
  genders?: string[];
  
  // Vaccines
  vaccineIds?: string[];
  vaccineCategories?: string[];
  
  // Options
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  includeCharts?: boolean;
  includeRawData?: boolean;
  chartTypes?: ChartType[];
  
  // Comparison
  compareWith?: 'previous_period' | 'same_period_last_year' | 'target';
  comparisonPeriod?: {
    startDate: string;
    endDate: string;
  };
  
  // Thresholds
  thresholds?: {
    coverage?: number;
    dropout?: number;
    timeliness?: number;
  };
  
  // Custom
  customFilters?: Record<string, any>;
}

export interface ReportSummary {
  totalRecords: number;
  dateGenerated: string;
  period: {
    start: string;
    end: string;
  };
  keyFindings: string[];
  recommendations?: string[];
  alerts?: ReportAlert[];
}

export interface ReportAlert {
  type: 'info' | 'warning' | 'critical';
  message: string;
  metric?: string;
  value?: number;
  threshold?: number;
}

// Report templates
export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  description?: string;
  
  defaultParameters: Partial<ReportParameters>;
  availableFormats: ReportFormat[];
  
  isSystem: boolean;
  isActive: boolean;
  
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

// Scheduled reports
export interface ScheduledReport {
  id: string;
  reportId: string;
  name: string;
  
  frequency: ReportFrequency;
  parameters: ReportParameters;
  formats: ReportFormat[];
  
  recipients: string[]; // Email addresses
  includeAttachments: boolean;
  
  nextRun: string;
  lastRun?: string;
  lastRunStatus?: 'success' | 'failed';
  
  isActive: boolean;
  
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// Report exports
export interface ReportExport {
  id: string;
  reportId: string;
  format: ReportFormat;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: number;
  expiresAt?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// Enums
export type ReportType = 
  | 'COVERAGE'
  | 'MISSED_VACCINES'
  | 'FACILITY_PERFORMANCE'
  | 'DEMOGRAPHIC'
  | 'TIMELINESS'
  | 'DROPOUT'
  | 'INVENTORY'
  | 'STAFF_PERFORMANCE'
  | 'COMPARATIVE'
  | 'TREND'
  | 'FORECAST'
  | 'AUDIT'
  | 'CUSTOM';

export type ReportFormat = 
  | 'PDF'
  | 'CSV'
  | 'EXCEL'
  | 'JSON'
  | 'HTML'
  | 'XML';

export type ReportFrequency = 
  | 'ON_DEMAND'
  | 'DAILY'
  | 'WEEKLY'
  | 'BI_WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'YEARLY';

export type ChartType = 
  | 'bar'
  | 'line'
  | 'pie'
  | 'donut'
  | 'area'
  | 'scatter'
  | 'heatmap'
  | 'radar'
  | 'gauge';

export type AgeGroup = 
  | '0-11m'
  | '12-23m'
  | '24-35m'
  | '36-47m'
  | '48-59m'
  | '5-9y'
  | '10-14y'
  | '15-19y'
  | '20+';

// DTOs for requests
export interface GenerateReportRequest {
  title: string;
  type: ReportType;
  description?: string;
  parameters: ReportParameters;
  format?: ReportFormat;
  frequency?: ReportFrequency;
  scheduledFor?: string;
  isPublic?: boolean;
}

export interface ScheduleReportRequest {
  reportId: string;
  frequency: ReportFrequency;
  parameters: ReportParameters;
  formats: ReportFormat[];
  recipients: string[];
  includeAttachments: boolean;
  startDate: string;
  endDate?: string;
}

export interface ReportSearchParams {
  type?: ReportType;
  generatedById?: string;
  isPublic?: boolean;
  isArchived?: boolean;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Report data structures
export interface CoverageReportData {
  summary: {
    totalChildren: number;
    fullyImmunized: number;
    partiallyImmunized: number;
    notImmunized: number;
    coverageRate: number;
    dropoutRate: number;
  };
  
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    target: number;
    administered: number;
    coverage: number;
    dropout: number;
  }>;
  
  byAgeGroup: Array<{
    ageGroup: string;
    population: number;
    immunized: number;
    coverage: number;
  }>;
  
  byRegion: Array<{
    region: string;
    coverage: number;
    children: number;
    facilities: number;
  }>;
  
  timeline: Array<{
    period: string;
    coverage: number;
    target: number;
  }>;
  
  comparisons: {
    previousPeriod: number;
    samePeriodLastYear: number;
    nationalAverage?: number;
    countyAverage?: number;
  };
}

export interface FacilityPerformanceData {
  facility: {
    id: string;
    name: string;
    type: string;
    mflCode: string;
    county: string;
    subCounty: string;
  };
  
  summary: {
    totalVaccinations: number;
    uniqueChildren: number;
    coverageRate: number;
    timelinessRate: number;
    dropoutRate: number;
    wastageRate: number;
    staffProductivity: number;
  };
  
  monthly: Array<{
    month: string;
    vaccinations: number;
    target: number;
    achievement: number;
    children: number;
  }>;
  
  vaccines: Array<{
    vaccineId: string;
    vaccineName: string;
    administered: number;
    wastage: number;
    stockouts: number;
  }>;
  
  staff: Array<{
    workerId: string;
    workerName: string;
    vaccinations: number;
    children: number;
    productivity: number;
  }>;
  
  rankings: {
    withinCounty: number;
    withinRegion: number;
    nationally: number;
  };
}

export interface DemographicReportData {
  ageDistribution: Array<{
    ageGroup: string;
    male: number;
    female: number;
    total: number;
    percentage: number;
  }>;
  
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    malePercentage: number;
    femalePercentage: number;
  };
  
  geographicDistribution: Array<{
    region: string;
    population: number;
    registered: number;
    coverage: number;
    facilities: number;
  }>;
  
  socioeconomic: Array<{
    indicator: string;
    value: number;
    correlation: number;
    significance: number;
  }>;
  
  trends: Array<{
    year: number;
    births: number;
    registrations: number;
    coverage: number;
  }>;
}

export interface TimelinessReportData {
  summary: {
    total: number;
    onTime: number;
    delayed: number;
    early: number;
    timelinessRate: number;
    averageDelay: number;
    medianDelay: number;
  };
  
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    onTime: number;
    delayed: number;
    timelinessRate: number;
    averageDelay: number;
  }>;
  
  delayDistribution: Array<{
    range: string; // e.g., "1-7 days", "8-30 days", ">30 days"
    count: number;
    percentage: number;
  }>;
  
  byAgeGroup: Array<{
    ageGroup: string;
    timelinessRate: number;
    averageDelay: number;
  }>;
  
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    timelinessRate: number;
    averageDelay: number;
  }>;
  
  reasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}