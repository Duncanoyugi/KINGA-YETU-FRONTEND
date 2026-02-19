// Vaccine model from Prisma
export interface Vaccine {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  administrationRoute?: string | null;
  administrationSite?: string | null;
  dosage?: string | null;
  dosesRequired?: number | null;
  sideEffects?: string | null;
  manufacturer?: string | null;
  contraindications?: string | null;
  vaccineType?: string | null;
  storageRequirements?: string | null;
  diseasePrevented?: string | null;
  recommendedAgeDays: number;
  minAgeDays?: number | null;
  maxAgeDays?: number | null;
  isBirthDose: boolean;
  isBooster: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vaccine Inventory model
export interface VaccineInventory {
  id: string;
  vaccineId: string;
  facilityId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufacturer?: string | null;
  receivedDate: string;
  notes?: string | null;
  vaccine?: Vaccine;
  facility?: HealthFacility;
}

// Vaccine Batch model
export interface VaccineBatch {
  id: string;
  vaccineId: string;
  batchNumber: string;
  manufacturer: string;
  manufacturingDate?: string | null;
  expiryDate: string;
  quantity: number;
  remainingDoses: number;
  notes?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields used in UI but not in database
  initialQuantity?: number;
  supplier?: string | null;
  storageLocation?: string | null;
  vaccine?: Vaccine;
  qualityControl?: QualityControlRecord;
  usageHistory?: UsageRecord[];
}

// Quality Control Record
export interface QualityControlRecord {
  testDate: string;
  testedBy: string;
  result: 'passed' | 'failed' | 'pending';
  certificate?: string | null;
}

// Usage Record for batch tracking
export interface UsageRecord {
  id: string;
  dosesUsed: number;
  usedBy: string;
  usedAt: string;
  purpose?: string | null;
  notes?: string | null;
}

// Vaccine Schedule template
export interface VaccineScheduleTemplate {
  id: string;
  vaccineId: string;
  doseNumber: number;
  recommendedAgeDays: number;
  minAgeDays?: number | null;
  maxAgeDays?: number | null;
  intervalDays?: number | null;
  notes?: string | null;
  vaccine?: Vaccine;
}

// Vaccine Administration Record
export interface VaccineAdministration {
  id: string;
  immunizationId: string;
  batchNumber: string;
  doseNumber: number;
  administrationDate: string;
  nextDueDate?: string | null;
  adverseReaction?: string | null;
  notes?: string | null;
}

// Health Facility (reused from auth types)
export interface HealthFacility {
  id: string;
  name: string;
  type: string;
  code: string;
  mflCode?: string | null;
  county: string;
  subCounty: string;
  ward?: string | null;
}

// DTOs for API requests/responses
export interface CreateVaccineRequest {
  code: string;
  name: string;
  description?: string;
  administrationRoute?: string;
  administrationSite?: string;
  dosage?: string;
  dosesRequired?: number;
  sideEffects?: string;
  manufacturer?: string;
  contraindications?: string;
  vaccineType?: string;
  storageRequirements?: string;
  diseasePrevented?: string;
  recommendedAgeDays: number;
  minAgeDays?: number;
  maxAgeDays?: number;
  isBirthDose?: boolean;
  isBooster?: boolean;
}

export interface UpdateVaccineRequest {
  name?: string;
  description?: string;
  administrationRoute?: string;
  administrationSite?: string;
  dosage?: string;
  dosesRequired?: number;
  sideEffects?: string;
  manufacturer?: string;
  contraindications?: string;
  vaccineType?: string;
  storageRequirements?: string;
  diseasePrevented?: string;
  recommendedAgeDays?: number;
  minAgeDays?: number;
  maxAgeDays?: number;
  isBirthDose?: boolean;
  isBooster?: boolean;
  isActive?: boolean;
}

export interface AddInventoryRequest {
  vaccineId: string;
  facilityId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  manufacturer?: string;
  notes?: string;
}

export interface UpdateInventoryRequest {
  quantity?: number;
  notes?: string;
}

export interface VaccineSearchParams {
  search?: string;
  isActive?: boolean;
  isBirthDose?: boolean;
  isBooster?: boolean;
  vaccineType?: string;
  page?: number;
  limit?: number;
}

export interface InventorySearchParams {
  facilityId?: string;
  vaccineId?: string;
  expiryBefore?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface StockAlert {
  vaccineId: string;
  vaccineName: string;
  batchNumber: string;
  currentQuantity: number;
  expiryDate: string;
  status: 'LOW_STOCK' | 'EXPIRING_SOON' | 'EXPIRED';
  daysUntilExpiry?: number;
}

// State interface
export interface VaccinesState {
  vaccines: Vaccine[];
  currentVaccine: Vaccine | null;
  inventory: VaccineInventory[];
  batches: VaccineBatch[];
  alerts: StockAlert[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}