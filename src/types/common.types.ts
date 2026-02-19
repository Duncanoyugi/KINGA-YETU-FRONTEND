// Common enums used across the application
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type YesNo = 'YES' | 'NO';
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ARCHIVED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

// User roles
export type UserRole = 
  | 'PARENT'
  | 'HEALTH_WORKER'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'COUNTY_ADMIN'
  | 'FACILITY_ADMIN';

// User permissions
export type Permission = 
  | 'user:create'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  | 'child:create'
  | 'child:read'
  | 'child:update'
  | 'child:delete'
  | 'vaccine:create'
  | 'vaccine:read'
  | 'vaccine:update'
  | 'vaccine:delete'
  | 'report:generate'
  | 'report:read'
  | 'report:export'
  | 'facility:manage'
  | 'system:configure'
  | 'audit:view';

// Date and time
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface MonthYear {
  month: number; // 1-12
  year: number;
}

// Address
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  county: string;
  subCounty: string;
  ward?: string;
  postalCode?: string;
  country: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Contact information
export interface ContactInfo {
  email?: string;
  phoneNumber?: string;
  alternativePhone?: string;
  fax?: string;
  website?: string;
}

// Person
export interface Person {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationality?: string;
  idNumber?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search
export interface SearchParams {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  limit?: number;
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'between';
  value: any;
  value2?: any; // for between operator
}

export interface FilterGroup {
  operator: 'AND' | 'OR';
  conditions: (FilterOption | FilterGroup)[];
}

// File handling
export interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  multiple?: boolean;
}

// Audit
export interface AuditInfo {
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
  deletedAt?: string;
}

// Metadata
export interface Metadata {
  [key: string]: string | number | boolean | null | Metadata | Metadata[];
}

// Select options
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

// Chart data
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface SeriesDataPoint {
  name: string;
  data: ChartDataPoint[];
}

// Statistics
export interface Statistic {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: number;
  unit?: string;
  icon?: string;
  color?: string;
}

// Notification
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// Confirmation dialog
export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

// Breadcrumb
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

// Tab
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  count?: number;
}

// Sort
export interface SortOption {
  field: string;
  label: string;
  direction?: 'asc' | 'desc';
}

// Export
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  filename?: string;
  includeHeaders?: boolean;
  includeMetadata?: boolean;
}