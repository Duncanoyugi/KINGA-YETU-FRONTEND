import type { User } from './user.types.js';
import type { UserRole, Permission } from './common.types.js';

// Re-export from common.types for backward compatibility
export type { UserRole, Permission };

// Authentication credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role?: UserRole;
  termsAccepted: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Token management
export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// Password management
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Email/Phone verification
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyPhoneRequest {
  code: string;
  phoneNumber: string;
}

export interface ResendVerificationRequest {
  type: 'email' | 'phone';
  userId?: string;
}

// 2FA
export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorDisableRequest {
  password: string;
  code?: string;
}

// Session management
export interface Session {
  id: string;
  userId: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastActive: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export interface RevokeSessionRequest {
  sessionId: string;
  password?: string;
}

// OAuth providers
export type OAuthProvider = 'google' | 'facebook' | 'twitter' | 'microsoft';

export interface OAuthLoginRequest {
  provider: OAuthProvider;
  token: string;
}

export interface OAuthUserInfo {
  provider: OAuthProvider;
  id: string;
  email: string;
  name: string;
  picture?: string;
}


export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Login history
export interface LoginHistory {
  id: string;
  userId: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  location?: string;
  success: boolean;
  failureReason?: string;
}

// Security settings
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  deviceManagement: boolean;
  sessionTimeout: number;
  ipWhitelist?: string[];
  lastPasswordChange?: string;
  passwordExpiryDays?: number;
}