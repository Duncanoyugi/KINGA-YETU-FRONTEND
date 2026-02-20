// Enum types matching Prisma schema
export type UserRole = 'PARENT' | 'HEALTH_WORKER' | 'ADMIN' | 'SUPER_ADMIN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type OtpType = 'REGISTRATION' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION' | 'TWO_FACTOR';

// User model from Prisma
export interface User {
  id: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile | null;
  parentProfile?: Parent | null;
  healthWorker?: HealthWorker | null;
  adminProfile?: AdminProfile | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  profilePicture?: string | null;
  address?: string | null;
  county?: string | null;
  subCounty?: string | null;
  ward?: string | null;
  idNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Parent {
  id: string;
  userId: string;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthWorker {
  id: string;
  userId: string;
  licenseNumber?: string | null;
  qualification?: string | null;
  specialization?: string | null;
  facilityId?: string | null;
  createdAt: string;
  updatedAt: string;
  facility?: HealthFacility | null;
}

export interface AdminProfile {
  id: string;
  userId: string;
  department?: string | null;
  permissions: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  type: HealthFacilityType;
  code: string;
  mflCode?: string | null;
  county: string;
  subCounty: string;
  ward?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HealthFacilityType = 
  | 'HOSPITAL' 
  | 'HEALTH_CENTER' 
  | 'DISPENSARY' 
  | 'CLINIC' 
  | 'MOBILE_CLINIC' 
  | 'PRIVATE_PRACTICE';

// DTOs for API requests/responses
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role?: UserRole;
  dateOfBirth?: string;
  gender?: Gender;
  idNumber?: string;
  county?: string;
  subCounty?: string;
  // For health workers
  licenseNumber?: string;
  qualification?: string;
  facilityId?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  message?: string;
}

export interface OtpRequest {
  email?: string;
  phone?: string;
  type: OtpType;
}

export interface OtpVerification {
  email?: string;
  phone?: string;
  code: string;
  type: OtpType;
}

export interface PasswordResetRequest {
  otpCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// State interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}