import type { HealthFacility } from './facility.types.js';

// Core Vaccine model
export interface Vaccine {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  
  // Administration
  administrationRoute?: string | null;
  administrationSite?: string | null;
  dosage?: string | null;
  dosesRequired: number;
  
  // Schedule
  recommendedAgeDays: number;
  minAgeDays?: number | null;
  maxAgeDays?: number | null;
  intervalDays?: number | null;
  boosterIntervalDays?: number | null;
  
  // Properties
  vaccineType: VaccineType;
  category: VaccineCategory;
  isBirthDose: boolean;
  isBooster: boolean;
  isSeasonal: boolean;
  isMandatory: boolean;
  
  // Medical
  diseasePrevented?: string | null;
  contraindications?: string | null;
  sideEffects?: string | null;
  precautions?: string | null;
  
  // Storage
  storageRequirements?: string | null;
  temperatureMin?: number | null; // in celsius
  temperatureMax?: number | null; // in celsius
  shelfLifeDays?: number | null;
  
  // Manufacturer
  manufacturer?: string | null;
  country?: string | null;
  
  // Status
  isActive: boolean;
  isAvailable: boolean;
  
  // Meta
  createdAt: string;
  updatedAt: string;
}

// Vaccine batch
export interface VaccineBatch {
  id: string;
  vaccineId: string;
  
  batchNumber: string;
  manufacturer: string;
  supplier?: string | null;
  
  manufacturingDate?: string | null;
  expiryDate: string;
  
  quantity: number;
  remainingDoses: number;
  unitPrice?: number | null;
  
  storageLocation?: string | null;
  storageTemperature?: number | null;
  
  status: BatchStatus;
  qualityControl?: QualityControl | null;
  
  notes?: string | null;
  
  createdAt: string;
  updatedAt: string;
  
  vaccine?: Vaccine;
}

export interface QualityControl {
  tested: boolean;
  testDate?: string;
  testedBy?: string;
  result?: 'passed' | 'failed' | 'pending';
  certificate?: string;
  notes?: string;
}

// Vaccine inventory
export interface VaccineInventory {
  id: string;
  facilityId: string;
  vaccineId: string;
  batchId: string;
  
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  
  location?: string | null;
  lastCountDate?: string | null;
  
  minimumStock: number;
  maximumStock?: number | null;
  reorderPoint: number;
  
  status: InventoryStatus;
  
  notes?: string | null;
  
  createdAt: string;
  updatedAt: string;
  
  facility?: HealthFacility;
  vaccine?: Vaccine;
  batch?: VaccineBatch;
}

// Vaccine stock movement
export interface StockMovement {
  id: string;
  inventoryId: string;
  
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  
  reason: string;
  reference?: string | null; // e.g., immunization ID, transfer ID
  
  performedBy: string;
  performedAt: string;
  
  notes?: string | null;
  
  createdAt: string;
}

// Vaccine wastage
export interface VaccineWastage {
  id: string;
  inventoryId: string;
  batchId: string;
  
  dosesWasted: number;
  wastageType: WastageType;
  reason: string;
  
  reportedBy: string;
  reportedAt: string;
  
  authorizedBy?: string | null;
  authorizedAt?: string | null;
  
  notes?: string | null;
  
  createdAt: string;
}

// Vaccine order
export interface VaccineOrder {
  id: string;
  facilityId: string;
  
  orderNumber: string;
  status: OrderStatus;
  
  items: OrderItem[];
  
  totalDoses: number;
  totalCost?: number | null;
  
  requestedBy: string;
  requestedAt: string;
  
  approvedBy?: string | null;
  approvedAt?: string | null;
  
  supplier?: string | null;
  expectedDelivery?: string | null;
  deliveredAt?: string | null;
  
  notes?: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  vaccineId: string;
  vaccineName: string;
  dosesOrdered: number;
  dosesReceived?: number;
  unitPrice?: number;
  totalPrice?: number;
  batchNumber?: string;
  expiryDate?: string;
}

// Vaccine schedule template
export interface VaccineScheduleTemplate {
  id: string;
  vaccineId: string;
  
  doseNumber: number;
  recommendedAgeDays: number;
  minAgeDays?: number | null;
  maxAgeDays?: number | null;
  
  intervalDays?: number | null;
  intervalWeeks?: number | null;
  intervalMonths?: number | null;
  
  notes?: string | null;
  
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
  
  vaccine?: Vaccine;
}

// Enums
export type VaccineType = 
  | 'BCG'
  | 'OPV'
  | 'IPV'
  | 'DPT'
  | 'HEP_B'
  | 'HIB'
  | 'PCV'
  | 'ROTA'
  | 'MEASLES'
  | 'MR'
  | 'MMR'
  | 'VARICELLA'
  | 'HPV'
  | 'YELLOW_FEVER'
  | 'MENINGOCOCCAL'
  | 'TYPHOID'
  | 'CHOLERA'
  | 'COVID_19'
  | 'INFLUENZA'
  | 'OTHER';

export type VaccineCategory = 
  | 'CHILDHOOD_IMMUNIZATION'
  | 'BOOSTER'
  | 'SCHOOL_AGE'
  | 'ADOLESCENT'
  | 'ADULT'
  | 'TRAVEL'
  | 'SEASONAL'
  | 'EMERGENCY';

export type BatchStatus = 
  | 'AVAILABLE'
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'DEPLETED'
  | 'QUARANTINED'
  | 'RECALLED';

export type InventoryStatus = 
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'OVER_STOCK'
  | 'DISCONTINUED';

export type MovementType = 
  | 'RECEIVED'
  | 'ADMINISTERED'
  | 'TRANSFERRED_OUT'
  | 'TRANSFERRED_IN'
  | 'ADJUSTMENT'
  | 'WASTAGE'
  | 'RETURNED';

export type WastageType = 
  | 'EXPIRED'
  | 'DAMAGED'
  | 'OPENED_NOT_USED'
  | 'TEMPERATURE_EXCURSION'
  | 'CONTAMINATED'
  | 'OTHER';

export type OrderStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED';

// DTOs for requests
export interface CreateVaccineRequest {
  code: string;
  name: string;
  description?: string;
  administrationRoute?: string;
  administrationSite?: string;
  dosage?: string;
  dosesRequired: number;
  recommendedAgeDays: number;
  minAgeDays?: number;
  maxAgeDays?: number;
  intervalDays?: number;
  vaccineType: VaccineType;
  category: VaccineCategory;
  isBirthDose?: boolean;
  isBooster?: boolean;
  isMandatory?: boolean;
  diseasePrevented?: string;
  contraindications?: string;
  sideEffects?: string;
  storageRequirements?: string;
  temperatureMin?: number;
  temperatureMax?: number;
  shelfLifeDays?: number;
  manufacturer?: string;
}

export interface UpdateVaccineRequest {
  name?: string;
  description?: string;
  administrationRoute?: string;
  administrationSite?: string;
  dosage?: string;
  dosesRequired?: number;
  recommendedAgeDays?: number;
  minAgeDays?: number;
  maxAgeDays?: number;
  intervalDays?: number;
  vaccineType?: VaccineType;
  category?: VaccineCategory;
  isBirthDose?: boolean;
  isBooster?: boolean;
  isMandatory?: boolean;
  isActive?: boolean;
  isAvailable?: boolean;
  diseasePrevented?: string;
  contraindications?: string;
  sideEffects?: string;
  storageRequirements?: string;
  temperatureMin?: number;
  temperatureMax?: number;
  shelfLifeDays?: number;
  manufacturer?: string;
}

export interface AddBatchRequest {
  vaccineId: string;
  batchNumber: string;
  manufacturer: string;
  supplier?: string;
  manufacturingDate?: string;
  expiryDate: string;
  quantity: number;
  unitPrice?: number;
  storageLocation?: string;
  notes?: string;
}

export interface UpdateBatchRequest {
  quantity?: number;
  expiryDate?: string;
  status?: BatchStatus;
  storageLocation?: string;
  qualityControl?: QualityControl;
  notes?: string;
}

export interface AddInventoryRequest {
  facilityId: string;
  vaccineId: string;
  batchId: string;
  quantity: number;
  location?: string;
  minimumStock: number;
  maximumStock?: number;
  reorderPoint: number;
  notes?: string;
}

export interface RecordMovementRequest {
  inventoryId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
}

export interface RecordWastageRequest {
  inventoryId: string;
  batchId: string;
  dosesWasted: number;
  wastageType: WastageType;
  reason: string;
  notes?: string;
}

export interface CreateOrderRequest {
  facilityId: string;
  items: Array<{
    vaccineId: string;
    dosesOrdered: number;
  }>;
  supplier?: string;
  expectedDelivery?: string;
  notes?: string;
}

// Vaccine statistics
export interface VaccineStats {
  vaccineId: string;
  vaccineName: string;
  
  inventory: {
    totalDoses: number;
    availableDoses: number;
    reservedDoses: number;
    facilities: number;
    lowStockFacilities: number;
    outOfStockFacilities: number;
  };
  
  usage: {
    administered: number;
    wastage: number;
    wastageRate: number;
    coverage: number;
    timeliness: number;
  };
  
  demographics: {
    byAge: Record<string, number>;
    byGender: Record<string, number>;
    byRegion: Record<string, number>;
  };
  
  projections: {
    monthlyDemand: number;
    recommendedOrder: number;
    stockoutRisk: 'low' | 'medium' | 'high';
    nextReorder?: string;
  };
}

// Cold chain monitoring
export interface ColdChainMonitor {
  id: string;
  facilityId: string;
  deviceId: string;
  deviceType: 'refrigerator' | 'freezer' | 'cold_box' | 'vaccine_carrier';
  
  temperature: number;
  humidity?: number;
  status: 'normal' | 'warning' | 'alarm';
  
  readings: TemperatureReading[];
  
  lastReading: string;
  lastMaintenance?: string;
  
  alerts: ColdChainAlert[];
}

export interface TemperatureReading {
  timestamp: string;
  temperature: number;
  humidity?: number;
  status: 'normal' | 'warning' | 'alarm';
}

export interface ColdChainAlert {
  id: string;
  monitorId: string;
  type: 'high_temp' | 'low_temp' | 'power_outage' | 'door_open' | 'maintenance_due';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolvedAt?: string;
}