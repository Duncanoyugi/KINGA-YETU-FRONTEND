import type { User, HealthFacility, Gender } from '../auth/authTypes';

// Re-export Gender for convenience
export type { Gender };

// Enum types matching Prisma schema
export type ImmunizationStatus = 'SCHEDULED' | 'PENDING' | 'ADMINISTERED' | 'MISSED' | 'CONTRAINDICATED';

// Child model from Prisma
export interface Child {
  id: string;
  parentId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  birthCertificateNo?: string | null;
  uniqueIdentifier: string;
  birthFacilityId?: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: Parent;
  birthFacility?: HealthFacility | null;
  growthRecords?: GrowthRecord[];
  developmentRecords?: DevelopmentRecord[];
  immunizations?: Immunization[];
  reminders?: Reminder[];
  schedules?: VaccinationSchedule[];
}

// Parent model (simplified from auth types)
export interface Parent {
  id: string;
  userId: string;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  user?: User;
}

// Growth Record model
export interface GrowthRecord {
  id: string;
  childId: string;
  measurementDate: string;
  weight: number;
  height?: number | null;
  recordedById: string;
  createdAt: string;
  updatedAt: string;
  child?: Child;
  recordedBy?: User;
}

// Development Record model
export interface DevelopmentRecord {
  id: string;
  childId: string;
  assessmentDate: string;
  motorSkills?: string | null;
  languageSkills?: string | null;
  socialSkills?: string | null;
  recordedById: string;
  createdAt: string;
  updatedAt: string;
  child?: Child;
  recordedBy?: User;
}

// Immunization model
export interface Immunization {
  id: string;
  childId: string;
  vaccineId: string;
  facilityId: string;
  healthWorkerId: string;
  administeredBy?: string | null;
  dateAdministered: string;
  ageAtDays: number;
  status: ImmunizationStatus;
  batchNumber?: string | null;
  expirationDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  child?: Child;
  facility?: HealthFacility;
  healthWorker?: HealthWorker;
  vaccine?: Vaccine;
}

// Vaccination Schedule model
export interface VaccinationSchedule {
  id: string;
  childId: string;
  vaccineId: string;
  dueDate: string;
  status: ImmunizationStatus;
  createdAt: string;
  updatedAt: string;
  child?: Child;
  vaccine?: Vaccine;
}

// Vaccine model (simplified)
export interface Vaccine {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  recommendedAgeDays: number;
  minAgeDays?: number | null;
  maxAgeDays?: number | null;
  isBirthDose: boolean;
  isBooster: boolean;
  isActive: boolean;
}

// Health Worker model (matching backend API response)
export interface HealthWorker {
  id: string;
  fullName: string;
  licenseNumber?: string | null;
}

// Reminder model
export interface Reminder {
  id: string;
  childId: string;
  parentId: string;
  vaccineId: string;
  type: ReminderType;
  message: string;
  scheduledFor: string;
  status: ReminderStatus;
  metadata?: string | null;
  retryCount: number;
  batchNumber?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ReminderType = 'EMAIL' | 'SMS' | 'PUSH';
export type ReminderStatus = 'PENDING' | 'SENT' | 'FAILED' | 'CANCELLED';

// DTOs for API requests/responses
export interface CreateChildRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  birthCertificateNo?: string;
  birthFacilityId?: string;
}

export interface UpdateChildRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  birthCertificateNo?: string;
  birthFacilityId?: string;
}

export interface ChildResponse {
  child: Child;
  upcomingVaccinations?: VaccinationSchedule[];
  growthSummary?: GrowthSummary;
}

export interface GrowthSummary {
  lastWeight?: number;
  lastHeight?: number;
  weightPercentile?: number;
  heightPercentile?: number;
  growthStatus: 'NORMAL' | 'UNDERWEIGHT' | 'OVERWEIGHT' | 'STUNTED';
}

export interface RecordGrowthRequest {
  measurementDate: string;
  weight: number;
  height?: number;
}

export interface RecordDevelopmentRequest {
  assessmentDate: string;
  motorSkills?: string;
  languageSkills?: string;
  socialSkills?: string;
}

export interface ImmunizationRecord {
  vaccineId: string;
  dateAdministered: string;
  facilityId: string;
  healthWorkerId: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
}

export interface ChildSearchParams {
  search?: string;
  parentId?: string;
  facilityId?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
  gender?: Gender;
  page?: number;
  limit?: number;
}

// State interface
export interface ChildrenState {
  children: Child[];
  currentChild: Child | null;
  selectedChildId: string | null;
  immunizations: Immunization[];
  growthRecords: GrowthRecord[];
  developmentRecords: DevelopmentRecord[];
  schedules: VaccinationSchedule[];
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}