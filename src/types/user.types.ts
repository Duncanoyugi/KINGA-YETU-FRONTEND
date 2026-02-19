import type { UserRole } from './common.types.js';

// User type matching the backend UserResponseDto
export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  parentProfile?: ParentProfile;
  healthWorker?: HealthWorkerProfile;
  adminProfile?: AdminProfile;
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  ward?: string;
  idNumber?: string;
}

export interface ParentProfile {
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface HealthWorkerProfile {
  licenseNumber?: string;
  qualification?: string;
  specialization?: string;
  facility?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface AdminProfile {
  department?: string;
  permissions: string;
}

// User summary for lists
export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

// User creation/update types
export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface UpdateUserData {
  fullName?: string;
  phoneNumber?: string;
  profile?: Partial<UserProfile>;
}

// User filter/pagination types
export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  county?: string;
  subCounty?: string;
  search?: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
