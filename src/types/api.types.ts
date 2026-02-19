// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// API Request params
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

// API Endpoints
export const ApiEndpoints = {
  AUTH: '/auth',
  USERS: '/users',
  CHILDREN: '/children',
  VACCINES: '/vaccines',
  PARENTS: '/parents',
  HEALTH_WORKERS: '/health-workers',
  FACILITIES: '/facilities',
  IMMUNIZATIONS: '/immunizations',
  REMINDERS: '/reminders',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  AUDIT_LOGS: '/audit-logs',
  SYSTEM: '/system',
} as const;

export type ApiEndpoints = typeof ApiEndpoints[keyof typeof ApiEndpoints];

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Health check
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  services: Record<string, 'up' | 'down'>;
}

// File upload
export interface FileUploadResponse {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

// Bulk operation responses
export interface BulkOperationResponse {
  successful: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

// Export formats
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

// API Version
export interface ApiVersion {
  version: string;
  releaseDate: string;
  deprecated: boolean;
  sunset?: string;
}