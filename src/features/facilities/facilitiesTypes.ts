// Facility types for the frontend
export interface Facility {
  id: string;
  name: string;
  code: string;
  type: FacilityType;
  address?: string | null;
  county: string;
  subCounty: string;
  ward?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
  mflCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type FacilityType =
  | 'HOSPITAL'
  | 'HEALTH_CENTER'
  | 'DISPENSARY'
  | 'CLINIC'
  | 'MOBILE_CLINIC'
  | 'PRIVATE_PRACTICE'
  | 'MATERNITY'
  | 'NURSING_HOME'
  | 'Maternity';

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
  type: 'HOSPITAL' | 'HEALTH_CENTER' | 'DISPENSARY' | 'CLINIC' | 'MOBILE_CLINIC' | 'PRIVATE_PRACTICE' | 'MATERNITY' | 'NURSING_HOME';
  mflCode?: string;
  county: string;
  subCounty: string;
  ward?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateFacilityRequest {
  name?: string;
  code?: string;
  type?: FacilityType;
  mflCode?: string;
  county?: string;
  subCounty?: string;
  ward?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface FacilityFilter {
  county?: string;
  subCounty?: string;
  type?: FacilityType;
  status?: FacilityStatus;
  search?: string;
}
