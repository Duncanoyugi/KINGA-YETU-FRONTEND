import type { User } from './user.types.js';
import type { Child } from './child.types.js';
import type { Reminder } from './reminder.types.js';

// Core Parent model
export interface Parent {
  id: string;
  userId: string;
  
  // Emergency contact
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  emergencyRelationship?: string | null;
  
  // Preferences
  preferredLanguage?: string | null;
  communicationPreferences: CommunicationPreferences;
  
  // Consent
  consentGiven: boolean;
  consentDate?: string | null;
  consentVersion?: string | null;
  
  // Meta
  isActive: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user?: User;
  children?: ParentChild[];
  reminders?: Reminder[];
  consentLogs?: ConsentLog[];
}

// Parent-Child relationship
export interface ParentChild {
  id: string;
  parentId: string;
  childId: string;
  relationship: ParentChildRelationship;
  isPrimary: boolean;
  hasCustody: boolean;
  canReceiveUpdates: boolean;
  canMakeDecisions: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  parent?: Parent;
  child?: Child;
}

// Communication preferences
export interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  whatsapp: boolean;
  
  reminderTiming: ReminderTiming[];
  quietHours?: QuietHours;
  
  language: string;
  frequency: 'immediate' | 'daily' | 'weekly';
  
  subscribedTopics: CommunicationTopic[];
}

export interface ReminderTiming {
  daysBefore: number; // e.g., 7, 3, 1
  timeOfDay: string; // HH:mm format
  channel: 'email' | 'sms' | 'push' | 'whatsapp';
}

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:mm
  end: string; // HH:mm
  timezone: string;
}

export type CommunicationTopic = 
  | 'APPOINTMENTS'
  | 'VACCINE_REMINDERS'
  | 'GROWTH_UPDATES'
  | 'HEALTH_TIPS'
  | 'FACILITY_NEWS'
  | 'EMERGENCY_ALERTS'
  | 'FEEDBACK'
  | 'PROMOTIONS';

// Consent management
export interface ConsentLog {
  id: string;
  parentId: string;
  consentType: ConsentType;
  action: 'GRANTED' | 'REVOKED' | 'UPDATED';
  version: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  notes?: string;
}

export type ConsentType = 
  | 'DATA_PROCESSING'
  | 'COMMUNICATION'
  | 'DATA_SHARING'
  | 'RESEARCH'
  | 'MARKETING';

// Parent demographics
export interface ParentDemographics {
  id: string;
  parentId: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  educationLevel?: EducationLevel;
  incomeLevel?: IncomeLevel;
  numberOfChildren: number;
  householdSize: number;
  housingType?: HousingType;
  hasRunningWater?: boolean;
  hasElectricity?: boolean;
  updatedAt: string;
}

export type MaritalStatus = 
  | 'SINGLE' 
  | 'MARRIED' 
  | 'DIVORCED' 
  | 'WIDOWED' 
  | 'SEPARATED' 
  | 'COHABITING';

export type EducationLevel = 
  | 'NONE' 
  | 'PRIMARY' 
  | 'SECONDARY' 
  | 'VOCATIONAL' 
  | 'COLLEGE' 
  | 'UNIVERSITY';

export type IncomeLevel = 
  | 'LOW' 
  | 'LOWER_MIDDLE' 
  | 'MIDDLE' 
  | 'UPPER_MIDDLE' 
  | 'HIGH';

export type HousingType = 
  | 'OWNED' 
  | 'RENTED' 
  | 'SUBSIDIZED' 
  | 'INFORMAL' 
  | 'OTHER';

// DTOs for requests
export interface CreateParentRequest {
  // User details
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  
  // Personal details
  dateOfBirth?: string;
  gender?: string;
  idNumber?: string;
  
  // Address
  address?: string;
  county?: string;
  subCounty?: string;
  ward?: string;
  
  // Emergency contact
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  
  // Preferences
  preferredLanguage?: string;
  communicationPreferences?: Partial<CommunicationPreferences>;
  
  // Consent
  consentGiven: boolean;
  consentVersion?: string;
}

export interface UpdateParentRequest {
  fullName?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  preferredLanguage?: string;
  communicationPreferences?: Partial<CommunicationPreferences>;
  isActive?: boolean;
  notes?: string;
}

export interface LinkChildRequest {
  childId: string;
  relationship: ParentChildRelationship;
  isPrimary?: boolean;
  hasCustody?: boolean;
  canReceiveUpdates?: boolean;
  canMakeDecisions?: boolean;
  notes?: string;
}

export type ParentChildRelationship = 
  | 'MOTHER' 
  | 'FATHER' 
  | 'GUARDIAN' 
  | 'GRANDPARENT' 
  | 'AUNT' 
  | 'UNCLE' 
  | 'SIBLING' 
  | 'OTHER';

export interface UpdateLinkRequest {
  relationship?: ParentChildRelationship;
  isPrimary?: boolean;
  hasCustody?: boolean;
  canReceiveUpdates?: boolean;
  canMakeDecisions?: boolean;
  notes?: string;
}

export interface UpdateCommunicationPreferencesRequest {
  preferences: Partial<CommunicationPreferences>;
}

export interface RecordConsentRequest {
  consentType: ConsentType;
  action: 'GRANTED' | 'REVOKED';
  version: string;
  notes?: string;
}

// Parent dashboard data
export interface ParentDashboard {
  parent: Parent;
  children: ChildSummary[];
  reminders: ParentReminder[];
  statistics: ParentStatistics;
  recentActivity: ParentActivity[];
}

export interface ChildSummary {
  id: string;
  fullName: string;
  age: number; // in months
  gender: string;
  relationship: string;
  immunizationStatus: {
    completed: number;
    pending: number;
    nextDue?: string;
    overdue: number;
  };
  lastVisit?: string;
  nextAppointment?: string;
}

export interface ParentReminder {
  id: string;
  childId: string;
  childName: string;
  type: string;
  title: string;
  message: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'read' | 'actioned';
  priority: 'low' | 'medium' | 'high';
}

export interface ParentStatistics {
  totalChildren: number;
  upcomingAppointments: number;
  missedAppointments: number;
  completedVaccinations: number;
  pendingVaccinations: number;
  coverageRate: number;
  lastUpdated: string;
}

export interface ParentActivity {
  id: string;
  type: 'child_registered' | 'vaccination' | 'appointment' | 'reminder' | 'profile_update';
  description: string;
  timestamp: string;
  childId?: string;
  childName?: string;
  metadata?: Record<string, any>;
}

// Parent search
export interface ParentSearchParams {
  search?: string;
  county?: string;
  subCounty?: string;
  hasChildren?: boolean;
  isActive?: boolean;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ParentSearchResult {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  childrenCount: number;
  registrationDate: string;
  lastActive?: string;
}