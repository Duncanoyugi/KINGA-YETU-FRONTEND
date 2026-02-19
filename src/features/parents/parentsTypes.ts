import type { User } from '../auth/authTypes';
import type { Activity } from '@/components/widgets/RecentActivities/RecentActivities.types';

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
  parent: Parent;
  children: Child[];
  upcomingReminders: Reminder[];
  missedVaccinations: number;
  completedVaccinations: number;
  childrenCount: number;
  recentActivity: Activity[];
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