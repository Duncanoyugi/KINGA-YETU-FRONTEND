import { type Coordinates } from './common.types.js';
import type { User } from './user.types.js';

// Forward declarations to avoid circular dependencies
// These will be properly imported where needed
interface Child {}
interface Immunization {}
interface Vaccine {}

// Core Health Facility model
export interface HealthFacility {
  id: string;
  name: string;
  type: HealthFacilityType;
  code: string;
  mflCode?: string | null; // Master Facility List code
  registrationNumber?: string | null;
  
  // Location
  county: string;
  subCounty: string;
  ward?: string | null;
  location?: string | null;
  address?: string | null;
  coordinates?: Coordinates | null;
  
  // Contact
  phone?: string | null;
  alternativePhone?: string | null;
  email?: string | null;
  website?: string | null;
  
  // Management
  owner: FacilityOwner;
  level: FacilityLevel;
  status: FacilityStatus;
  operationalStatus: OperationalStatus;
  
  // Capacity
  bedCapacity?: number | null;
  staffCount?: number | null;
  
  // Services
  services: FacilityService[];
  specializedServices?: string[] | null;
  
  // Schedule
  operatingHours?: OperatingHours | null;
  emergencyServices: boolean;
  maternityServices: boolean;
  immunizationServices: boolean;
  
  // Accreditation
  accredited: boolean;
  accreditationNumber?: string | null;
  accreditationExpiry?: string | null;
  
  // Meta
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations (optional)
  healthWorkers?: HealthWorker[];
  inventory?: VaccineInventory[];
  children?: Child[];
  immunizations?: Immunization[];
}

// Health worker (extended from User)
export interface HealthWorker {
  id: string;
  userId: string;
  facilityId: string;
  licenseNumber?: string | null;
  qualification?: string | null;
  specialization?: string | null;
  designation: string;
  employmentType: EmploymentType;
  dateJoined: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  user?: User;
  facility?: HealthFacility;
}

// Vaccine inventory
export interface VaccineInventory {
  id: string;
  facilityId: string;
  vaccineId: string;
  batchNumber: string;
  quantity: number;
  initialQuantity: number;
  expiryDate: string;
  manufacturer?: string | null;
  supplier?: string | null;
  receivedDate: string;
  lastUpdated: string;
  notes?: string | null;
  
  facility?: HealthFacility;
  vaccine?: Vaccine;
}

// Operating hours
export interface OperatingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  publicHolidays?: DayHours;
  notes?: string;
}

export interface DayHours {
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed: boolean;
  breaks?: TimeBreak[];
}

export interface TimeBreak {
  start: string;
  end: string;
}

// Facility services
export interface FacilityService {
  id: string;
  name: string;
  category: ServiceCategory;
  available: boolean;
  requiresAppointment: boolean;
  daysAvailable?: string[]; // Days of week
  notes?: string;
}

// Enums
export type HealthFacilityType = 
  | 'HOSPITAL' 
  | 'HEALTH_CENTER' 
  | 'DISPENSARY' 
  | 'CLINIC' 
  | 'MOBILE_CLINIC' 
  | 'PRIVATE_PRACTICE'
  | 'MATERNITY'
  | 'NURSING_HOME';

export type FacilityOwner = 
  | 'GOVERNMENT' 
  | 'PRIVATE' 
  | 'MISSION' 
  | 'NGO' 
  | 'COMMUNITY' 
  | 'OTHER';

export type FacilityLevel = 
  | 'LEVEL_1' // Dispensary/Clinic
  | 'LEVEL_2' // Health Center
  | 'LEVEL_3' // Sub-County Hospital
  | 'LEVEL_4' // County Hospital
  | 'LEVEL_5' // Regional Hospital
  | 'LEVEL_6'; // National Hospital

export type FacilityStatus = 
  | 'OPERATIONAL' 
  | 'NON_OPERATIONAL' 
  | 'UNDER_CONSTRUCTION' 
  | 'CLOSED' 
  | 'TEMPORARILY_CLOSED';

export type OperationalStatus = 
  | 'FULLY_FUNCTIONAL' 
  | 'PARTIALLY_FUNCTIONAL' 
  | 'NON_FUNCTIONAL';

export type EmploymentType = 
  | 'PERMANENT' 
  | 'CONTRACT' 
  | 'TEMPORARY' 
  | 'VOLUNTEER' 
  | 'INTERN' 
  | 'LOCUM';

export type ServiceCategory = 
  | 'MATERNAL' 
  | 'CHILD' 
  | 'IMMUNIZATION' 
  | 'FAMILY_PLANNING' 
  | 'HIV' 
  | 'TB' 
  | 'MALARIA' 
  | 'NCD' 
  | 'NUTRITION' 
  | 'MENTAL_HEALTH' 
  | 'DENTAL' 
  | 'OPHTHALMOLOGY' 
  | 'LABORATORY' 
  | 'PHARMACY' 
  | 'RADIOLOGY' 
  | 'EMERGENCY';

// DTOs for requests
export interface CreateFacilityRequest {
  name: string;
  type: HealthFacilityType;
  code: string;
  mflCode?: string;
  county: string;
  subCounty: string;
  ward?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  owner: FacilityOwner;
  level: FacilityLevel;
  emergencyServices: boolean;
  maternityServices: boolean;
  immunizationServices: boolean;
  operatingHours?: OperatingHours;
}

export interface UpdateFacilityRequest {
  name?: string;
  type?: HealthFacilityType;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  coordinates?: Coordinates;
  owner?: FacilityOwner;
  level?: FacilityLevel;
  status?: FacilityStatus;
  operationalStatus?: OperationalStatus;
  bedCapacity?: number;
  operatingHours?: OperatingHours;
  emergencyServices?: boolean;
  maternityServices?: boolean;
  immunizationServices?: boolean;
  accredited?: boolean;
  accreditationNumber?: string;
  accreditationExpiry?: string;
  isActive?: boolean;
}

export interface AddHealthWorkerRequest {
  userId: string;
  licenseNumber?: string;
  qualification?: string;
  specialization?: string;
  designation: string;
  employmentType: EmploymentType;
  dateJoined: string;
}

export interface UpdateHealthWorkerRequest {
  licenseNumber?: string;
  qualification?: string;
  specialization?: string;
  designation?: string;
  employmentType?: EmploymentType;
  isActive?: boolean;
}

export interface AddInventoryRequest {
  vaccineId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufacturer?: string;
  supplier?: string;
  receivedDate: string;
  notes?: string;
}

export interface UpdateInventoryRequest {
  quantity?: number;
  notes?: string;
}

export interface TransferInventoryRequest {
  inventoryId: string;
  targetFacilityId: string;
  quantity: number;
  transferDate: string;
  reason?: string;
}

// Facility statistics
export interface FacilityStats {
  facilityId: string;
  facilityName: string;
  period: {
    start: string;
    end: string;
  };
  children: {
    total: number;
    active: number;
    registeredThisPeriod: number;
  };
  immunizations: {
    total: number;
    byVaccine: Record<string, number>;
    byAge: Record<string, number>;
    scheduled: number;
    completed: number;
    missed: number;
  };
  inventory: {
    totalItems: number;
    lowStock: number;
    expiringSoon: number;
    expired: number;
    wastage: number;
  };
  staff: {
    total: number;
    byRole: Record<string, number>;
    active: number;
  };
  performance: {
    coverageRate: number;
    timelinessRate: number;
    dropoutRate: number;
    averageWaitTime?: number;
  };
}

// Facility summary
export interface FacilitySummary {
  id: string;
  name: string;
  type: HealthFacilityType;
  code: string;
  mflCode?: string;
  county: string;
  subCounty: string;
  status: FacilityStatus;
  healthWorkers: number;
  children: number;
  immunizations: number;
  lastUpdated: string;
}