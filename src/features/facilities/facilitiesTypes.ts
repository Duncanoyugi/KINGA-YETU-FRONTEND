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
  createdAt: string;
  updatedAt: string;
}

export type FacilityType = 'HOSPITAL' | 'HEALTH_CENTER' | 'DISPENSARY' | 'CLINIC';

export type FacilityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

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
