// Facility types for the frontend
export interface Facility {
  id: string;
  name: string;
  code: string;
  type: FacilityType;
  address: string;
  county: string;
  subCounty: string;
  ward: string;
  phone: string;
  email: string;
  inCharge: string;
  inChargePhone: string;
  status: FacilityStatus;
  services: string[];
  operatingHours: OperatingHours;
  // Additional properties used in FacilityManagement
  mflCode?: string | null;
  staffCount?: number | null;
  bedCapacity?: number | null;
  level?: FacilityLevel | null;
  createdAt: string;
  updatedAt: string;
}

export type FacilityType = 'HOSPITAL' | 'HEALTH_CENTER' | 'DISPENSARY' | 'CLINIC' | 'MOBILE_CLINIC' | 'PRIVATE_PRACTICE' | 'MATERNITY' | 'NURSING_HOME';

export type FacilityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'OPERATIONAL' | 'NON_OPERATIONAL' | 'UNDER_CONSTRUCTION' | 'CLOSED' | 'TEMPORARILY_CLOSED';

export type FacilityLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5' | 'LEVEL_6';

export interface OperatingHours {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange;
  sunday: TimeRange;
}

export interface TimeRange {
  open: string;
  close: string;
  closed: boolean;
}

export interface CreateFacilityRequest {
  name: string;
  code: string;
  type: FacilityType;
  address: string;
  county: string;
  subCounty: string;
  ward: string;
  phone: string;
  email: string;
  inCharge: string;
  inChargePhone: string;
  services: string[];
  operatingHours: OperatingHours;
}

export interface UpdateFacilityRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  inCharge?: string;
  inChargePhone?: string;
  status?: FacilityStatus;
  services?: string[];
  operatingHours?: OperatingHours;
}

export interface FacilityFilter {
  county?: string;
  subCounty?: string;
  type?: FacilityType;
  status?: FacilityStatus;
  search?: string;
}
