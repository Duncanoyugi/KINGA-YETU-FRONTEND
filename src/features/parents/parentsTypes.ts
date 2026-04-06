import type { User } from '../auth/authTypes';

// Parent model from Prisma
export interface Parent {
  id: string;
  userId: string;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  children?: Child[];
  reminders?: Reminder[];
  // Location fields from user profile
  county?: string | null;
  subCounty?: string | null;
  address?: string | null;
}

// Child model (simplified)
export interface Child {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  birthCertificateNo?: string | null;
  uniqueIdentifier: string;
  isPrimary?: boolean;
}

// Reminder model (simplified)
export interface Reminder {
  id: string;
  childId: string;
  childName?: string;
  vaccineId: string;
  vaccineName?: string;
  type: string;
  message: string;
  scheduledFor: string;
  status: string;
}

// Parent-Child linking
export interface ParentChildLink {
  parentId: string;
  childId: string;
  relationship: 'MOTHER' | 'FATHER' | 'GUARDIAN' | 'OTHER';
  isPrimary: boolean;
}

// DTOs for API requests/responses
export interface CreateParentRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  dateOfBirth?: string;
  gender?: string;
  idNumber?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  ward?: string;
}

export interface UpdateParentRequest {
  fullName?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  ward?: string;
}

export interface LinkChildRequest {
  childId: string;
  relationship: 'MOTHER' | 'FATHER' | 'GUARDIAN' | 'OTHER';
  isPrimary?: boolean;
}

export interface ParentSearchParams {
  search?: string;
  county?: string;
  subCounty?: string;
  hasChildren?: boolean;
  page?: number;
  limit?: number;
}

export interface ParentDashboard {
  parent: {
    id: string;
    fullName: string;
    email: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  children: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    completedVaccinations: number;
    upcomingVaccinations: number;
  }[];
  upcomingReminders: {
    id: string;
    childName: string;
    vaccineName?: string;
    scheduledFor: string;
    status: string;
  }[];
  stats: {
    totalChildren: number;
    completedVaccinations: number;
    upcomingVaccinations: number;
    missedVaccinations: number;
    completionRate: number;
  };
}

// State interface
export interface ParentsState {
  parents: Parent[];
  currentParent: Parent | null;
  linkedChildren: Child[];
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