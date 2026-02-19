import type { Gender } from './common.types.js';
import type { User } from './user.types.js';
import type { HealthFacility } from './facility.types.js';
import type { Vaccine } from './vaccine.types.js';

// Forward declaration to avoid circular dependency
interface Reminder {}

// Core Child model
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
  birthWeight?: number | null;
  birthHeight?: number | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations (optional)
  parent?: Parent;
  birthFacility?: HealthFacility;
  growthRecords?: GrowthRecord[];
  developmentRecords?: DevelopmentRecord[];
  immunizations?: Immunization[];
  reminders?: Reminder[];
  schedules?: VaccinationSchedule[];
  allergies?: Allergy[];
  medicalHistory?: MedicalHistory[];
}

// Parent (simplified)
export interface Parent {
  id: string;
  userId: string;
  user?: User;
}

// Growth tracking
export interface GrowthRecord {
  id: string;
  childId: string;
  measurementDate: string;
  weight: number; // in kg
  height?: number | null; // in cm
  headCircumference?: number | null; // in cm
  muac?: number | null; // Mid-Upper Arm Circumference in cm
  bmi?: number | null;
  weightForAgeZ?: number | null;
  heightForAgeZ?: number | null;
  weightForHeightZ?: number | null;
  recordedById: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  recordedBy?: User;
}

// Development tracking
export interface DevelopmentRecord {
  id: string;
  childId: string;
  assessmentDate: string;
  ageAtAssessment: number; // in months
  
  // Motor skills
  motorMilestones?: string | null;
  grossMotor?: string | null;
  fineMotor?: string | null;
  
  // Language skills
  languageMilestones?: string | null;
  receptiveLanguage?: string | null;
  expressiveLanguage?: string | null;
  
  // Social skills
  socialMilestones?: string | null;
  socialInteraction?: string | null;
  emotionalRegulation?: string | null;
  
  // Cognitive skills
  cognitiveMilestones?: string | null;
  problemSolving?: string | null;
  
  // Screening tools
  asqScore?: number | null;
  mchatScore?: number | null;
  
  recordedById: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  recordedBy?: User;
}

// Immunization record
export interface Immunization {
  id: string;
  childId: string;
  vaccineId: string;
  facilityId: string;
  healthWorkerId: string;
  administeredBy?: string | null;
  dateAdministered: string;
  ageAtDays: number;
  doseNumber: number;
  status: ImmunizationStatus;
  batchNumber?: string | null;
  expirationDate?: string | null;
  administrationSite?: string | null;
  administrationRoute?: string | null;
  reaction?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  child?: Child;
  facility?: HealthFacility;
  healthWorker?: User;
  vaccine?: Vaccine;
}

// Vaccination schedule
export interface VaccinationSchedule {
  id: string;
  childId: string;
  vaccineId: string;
  dueDate: string;
  status: ImmunizationStatus;
  doseNumber: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  child?: Child;
  vaccine?: Vaccine;
}

// Medical history
export interface MedicalHistory {
  id: string;
  childId: string;
  condition: string;
  diagnosisDate?: string | null;
  isOngoing: boolean;
  resolvedDate?: string | null;
  treatment?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Allergies
export interface Allergy {
  id: string;
  childId: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Enums
export type ImmunizationStatus = 
  | 'SCHEDULED'
  | 'PENDING'
  | 'ADMINISTERED'
  | 'MISSED'
  | 'CONTRAINDICATED'
  | 'REFUSED';

// DTOs for requests
export interface CreateChildRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  birthCertificateNo?: string;
  birthFacilityId?: string;
  birthWeight?: number;
  birthHeight?: number;
  notes?: string;
}

export interface UpdateChildRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  birthCertificateNo?: string;
  birthFacilityId?: string;
  birthWeight?: number;
  birthHeight?: number;
  notes?: string;
  isActive?: boolean;
}

export interface AddGrowthRecordRequest {
  measurementDate: string;
  weight: number;
  height?: number;
  headCircumference?: number;
  muac?: number;
  notes?: string;
}

export interface AddDevelopmentRecordRequest {
  assessmentDate: string;
  motorMilestones?: string;
  grossMotor?: string;
  fineMotor?: string;
  languageMilestones?: string;
  receptiveLanguage?: string;
  expressiveLanguage?: string;
  socialMilestones?: string;
  socialInteraction?: string;
  emotionalRegulation?: string;
  cognitiveMilestones?: string;
  problemSolving?: string;
  asqScore?: number;
  mchatScore?: number;
  notes?: string;
}

export interface RecordImmunizationRequest {
  vaccineId: string;
  facilityId: string;
  healthWorkerId: string;
  dateAdministered: string;
  doseNumber: number;
  batchNumber?: string;
  expirationDate?: string;
  administrationSite?: string;
  administrationRoute?: string;
  reaction?: string;
  notes?: string;
}

export interface AddMedicalHistoryRequest {
  condition: string;
  diagnosisDate?: string;
  isOngoing: boolean;
  resolvedDate?: string;
  treatment?: string;
  notes?: string;
}

export interface AddAllergyRequest {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate?: string;
  notes?: string;
}

// Statistics and summaries
export interface ChildSummary {
  id: string;
  fullName: string;
  age: {
    years: number;
    months: number;
    days: number;
  };
  gender: Gender;
  immunizationStatus: {
    completed: number;
    pending: number;
    missed: number;
    total: number;
  };
  lastVisit?: string;
  nextDue?: string;
}

export interface GrowthSummary {
  lastRecord?: GrowthRecord;
  trend: 'normal' | 'faltering' | 'accelerated';
  percentiles: {
    weight: number;
    height: number;
    bmi: number;
  };
  zScores: {
    weightForAge: number;
    heightForAge: number;
    weightForHeight: number;
  };
}

export interface ImmunizationSummary {
  completed: number;
  pending: number;
  missed: number;
  contraindicated: number;
  refused: number;
  completionRate: number;
  timelinessRate: number;
  nextDue?: string;
  overdueCount: number;
}