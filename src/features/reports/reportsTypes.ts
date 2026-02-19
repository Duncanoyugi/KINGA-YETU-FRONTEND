// Report model from Prisma
import type { User } from '../auth/authTypes';
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  description?: string | null;
  parameters: string; // JSON string
  data: string; // JSON string
  format: ReportFormat;
  frequency: ReportFrequency;
  isPublic: boolean;
  scheduledFor?: string | null;
  generatedById: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
  generatedBy?: User;
}

export type ReportType = 
  | 'COVERAGE'
  | 'MISSED_VACCINES'
  | 'FACILITY_PERFORMANCE'
  | 'DEMOGRAPHIC'
  | 'TIMELINESS'
  | 'CUSTOM';

export type ReportFormat = 'PDF' | 'CSV' | 'EXCEL' | 'JSON' | 'HTML';
export type ReportFrequency = 'ON_DEMAND' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

// Coverage report specific types
export interface CoverageReportData {
  overall: {
    totalChildren: number;
    fullyImmunized: number;
    partiallyImmunized: number;
    notImmunized: number;
    coverageRate: number;
  };
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    target: number;
    administered: number;
    coverage: number;
  }>;
  byAgeGroup: Array<{
    ageGroup: string;
    total: number;
    immunized: number;
    coverage: number;
  }>;
  byRegion: Array<{
    region: string;
    coverage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  timeline: Array<{
    date: string;
    coverage: number;
  }>;
}

// Missed vaccines report
export interface MissedVaccinesData {
  summary: {
    totalMissed: number;
    uniqueChildren: number;
    mostMissedVaccine: string;
    averageDelay: number;
  };
  missedVaccines: Array<{
    childId: string;
    childName: string;
    vaccineName: string;
    dueDate: string;
    daysOverdue: number;
    parentContact: string;
    facilityName: string;
  }>;
  byFacility: Array<{
    facilityId: string;
    facilityName: string;
    missedCount: number;
    totalAppointments: number;
    missedRate: number;
  }>;
}

// Facility performance report
export interface FacilityPerformanceData {
  facility: {
    id: string;
    name: string;
    type: string;
    mflCode: string;
  };
  summary: {
    totalVaccinations: number;
    uniqueChildren: number;
    coverageRate: number;
    dropoutRate: number;
    wastageRate: number;
  };
  monthly: Array<{
    month: string;
    vaccinations: number;
    target: number;
    achievement: number;
  }>;
  vaccineStock: Array<{
    vaccineName: string;
    openingStock: number;
    received: number;
    administered: number;
    wastage: number;
    closingStock: number;
  }>;
  staff: Array<{
    name: string;
    role: string;
    vaccinations: number;
    averagePerDay: number;
  }>;
  rankings: {
    withinCounty: number;
    withinRegion: number;
    nationally: number;
  };
}

// Demographic report
export interface DemographicData {
  ageDistribution: Array<{
    ageGroup: string;
    male: number;
    female: number;
    total: number;
  }>;
  geographicDistribution: Array<{
    region: string;
    population: number;
    registered: number;
    coverage: number;
  }>;
  socioeconomic: Array<{
    indicator: string;
    value: number;
    immunizationRate: number;
  }>;
}

// Timeliness report
export interface TimelinessData {
  overall: {
    onTime: number;
    delayed: number;
    averageDelay: number;
    timelinessRate: number;
  };
  byVaccine: Array<{
    vaccineId: string;
    vaccineName: string;
    onTime: number;
    delayed: number;
    averageDelay: number;
    timelinessRate: number;
  }>;
  delayDistribution: Array<{
    delayDays: string;
    count: number;
    percentage: number;
  }>;
}

// DTOs for API requests/responses
export interface GenerateReportRequest {
  title: string;
  type: ReportType;
  description?: string;
  parameters: ReportParameters;
  format?: ReportFormat;
  frequency?: ReportFrequency;
  scheduledFor?: string;
}

export interface ReportParameters {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  facilityIds?: string[];
  counties?: string[];
  subCounties?: string[];
  vaccineIds?: string[];
  ageGroups?: string[];
  includeCharts?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  [key: string]: any;
}

export interface ReportSearchParams {
  type?: ReportType;
  generatedById?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  frequency: ReportFrequency;
  nextRun: string;
  lastRun?: string;
  recipients: string[];
  isActive: boolean;
}

// State interface
export interface ReportsState {
  reports: Report[];
  currentReport: Report | null;
  scheduledReports: ScheduledReport[];
  generatedData: any | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}