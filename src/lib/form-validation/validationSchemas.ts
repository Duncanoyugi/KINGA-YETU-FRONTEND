import * as z from 'zod';
import { VALIDATION_PATTERNS } from '@/utils/constants';

// Common validation messages
const messages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character',
  passwordMatch: 'Passwords do not match',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  minValue: (min: number) => `Value must be at least ${min}`,
  maxValue: (max: number) => `Value must not exceed ${max}`,
  date: 'Please enter a valid date',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
  number: 'Please enter a valid number',
  integer: 'Please enter a whole number',
  positive: 'Value must be positive',
  url: 'Please enter a valid URL',
  uuid: 'Please enter a valid UUID',
  birthCertificate: 'Please enter a valid birth certificate number',
  mflCode: 'Please enter a valid MFL code',
  batchNumber: 'Please enter a valid batch number',
  temperature: 'Please enter a valid temperature',
  weight: 'Please enter a valid weight',
  height: 'Please enter a valid height',
};

// Auth schemas
export const loginSchema = z.object({
  email: z.string().min(1, messages.required).email(messages.email),
  password: z.string().min(1, messages.required),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().min(1, messages.required).email(messages.email),
  password: z.string().min(8, messages.minLength(8)).regex(
    VALIDATION_PATTERNS.PASSWORD,
    messages.password
  ),
  confirmPassword: z.string().min(1, messages.required),
  fullName: z.string().min(2, messages.minLength(2)).max(100, messages.maxLength(100)),
  phoneNumber: z.string().regex(VALIDATION_PATTERNS.PHONE, messages.phone).optional(),
  role: z.enum(['PARENT', 'HEALTH_WORKER']),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: messages.passwordMatch,
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, messages.required).email(messages.email),
});

export const resetPasswordSchema = z.object({
  otpCode: z.string().min(6, 'OTP must be at least 6 digits'),
  newPassword: z.string().min(8, messages.minLength(8)).regex(
    VALIDATION_PATTERNS.PASSWORD,
    messages.password
  ),
  confirmPassword: z.string().min(1, messages.required),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: messages.passwordMatch,
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, messages.required),
  newPassword: z.string().min(8, messages.minLength(8)).regex(
    VALIDATION_PATTERNS.PASSWORD,
    messages.password
  ),
  confirmPassword: z.string().min(1, messages.required),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: messages.passwordMatch,
  path: ['confirmPassword'],
});

export const verifyOTPSchema = z.object({
  email: z.string().email(messages.email).optional(),
  phone: z.string().regex(VALIDATION_PATTERNS.PHONE, messages.phone).optional(),
  code: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone is required',
  path: ['email', 'phone'],
});

// Child schemas
export const createChildSchema = z.object({
  firstName: z.string().min(2, messages.minLength(2)).max(50, messages.maxLength(50)),
  middleName: z.string().max(50, messages.maxLength(50)).optional(),
  lastName: z.string().min(2, messages.minLength(2)).max(50, messages.maxLength(50)),
  dateOfBirth: z.string().min(1, messages.required).refine(
    date => !isNaN(Date.parse(date)),
    messages.date
  ).refine(
    date => new Date(date) <= new Date(),
    'Date of birth cannot be in the future'
  ),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  birthCertificateNo: z.string().regex(
    VALIDATION_PATTERNS.BIRTH_CERTIFICATE,
    messages.birthCertificate
  ).optional(),
  birthFacilityId: z.string().uuid(messages.uuid).optional(),
  birthWeight: z.number().positive(messages.positive).max(10, messages.maxValue(10)).optional(),
  birthHeight: z.number().positive(messages.positive).max(100, messages.maxValue(100)).optional(),
  notes: z.string().max(500, messages.maxLength(500)).optional(),
});

export const updateChildSchema = createChildSchema.partial();

export const addGrowthRecordSchema = z.object({
  measurementDate: z.string().min(1, messages.required).refine(
    date => !isNaN(Date.parse(date)),
    messages.date
  ).refine(
    date => new Date(date) <= new Date(),
    'Measurement date cannot be in the future'
  ),
  weight: z.number().positive(messages.positive).max(200, messages.maxValue(200)),
  height: z.number().positive(messages.positive).max(250, messages.maxValue(250)).optional(),
  headCircumference: z.number().positive(messages.positive).max(100, messages.maxValue(100)).optional(),
  muac: z.number().positive(messages.positive).max(50, messages.maxValue(50)).optional(),
  notes: z.string().max(500, messages.maxLength(500)).optional(),
});

export const recordImmunizationSchema = z.object({
  vaccineId: z.string().uuid(messages.uuid),
  facilityId: z.string().uuid(messages.uuid),
  healthWorkerId: z.string().uuid(messages.uuid),
  dateAdministered: z.string().min(1, messages.required).refine(
    date => !isNaN(Date.parse(date)),
    messages.date
  ).refine(
    date => new Date(date) <= new Date(),
    'Administration date cannot be in the future'
  ),
  doseNumber: z.number().int().positive(messages.positive),
  batchNumber: z.string().regex(VALIDATION_PATTERNS.BATCH_NUMBER, messages.batchNumber),
  expirationDate: z.string().refine(
    date => !isNaN(Date.parse(date)),
    messages.date
  ).optional(),
  administrationSite: z.string().max(50, messages.maxLength(50)).optional(),
  administrationRoute: z.string().max(50, messages.maxLength(50)).optional(),
  reaction: z.string().max(500, messages.maxLength(500)).optional(),
  notes: z.string().max(500, messages.maxLength(500)).optional(),
});

// Vaccine schemas
export const createVaccineSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  administrationRoute: z.string().max(50).optional(),
  administrationSite: z.string().max(50).optional(),
  dosage: z.string().max(50).optional(),
  dosesRequired: z.number().int().positive(),
  recommendedAgeDays: z.number().int().positive(),
  minAgeDays: z.number().int().positive().optional(),
  maxAgeDays: z.number().int().positive().optional(),
  intervalDays: z.number().int().positive().optional(),
  vaccineType: z.string(),
  category: z.string(),
  isBirthDose: z.boolean(),
  isBooster: z.boolean(),
  isMandatory: z.boolean(),
  diseasePrevented: z.string().optional(),
  contraindications: z.string().optional(),
  sideEffects: z.string().optional(),
  precautions: z.string().optional(),
  storageRequirements: z.string().optional(),
  temperatureMin: z.number().optional(),
  temperatureMax: z.number().optional(),
  shelfLifeDays: z.number().int().positive().optional(),
  manufacturer: z.string().optional(),
});

export const addBatchSchema = z.object({
  vaccineId: z.string().uuid(messages.uuid),
  batchNumber: z.string().regex(VALIDATION_PATTERNS.BATCH_NUMBER, messages.batchNumber),
  manufacturer: z.string().min(2).max(100),
  supplier: z.string().optional(),
  manufacturingDate: z.string().refine(date => !isNaN(Date.parse(date))).optional(),
  expiryDate: z.string().refine(date => !isNaN(Date.parse(date))),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive().optional(),
  storageLocation: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const addInventorySchema = z.object({
  facilityId: z.string().uuid(messages.uuid),
  vaccineId: z.string().uuid(messages.uuid),
  batchId: z.string().uuid(messages.uuid),
  quantity: z.number().int().positive(),
  location: z.string().optional(),
  minimumStock: z.number().int().positive(),
  maximumStock: z.number().int().positive().optional(),
  reorderPoint: z.number().int().positive(),
  notes: z.string().max(500).optional(),
});

// Parent schemas
export const linkChildSchema = z.object({
  childId: z.string().uuid(messages.uuid),
  relationship: z.enum(['MOTHER', 'FATHER', 'GUARDIAN', 'GRANDPARENT', 'AUNT', 'UNCLE', 'SIBLING', 'OTHER']),
  isPrimary: z.boolean().default(false),
  hasCustody: z.boolean().default(true),
  canReceiveUpdates: z.boolean().default(true),
  canMakeDecisions: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

// Facility schemas
export const createFacilitySchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(['HOSPITAL', 'HEALTH_CENTER', 'DISPENSARY', 'CLINIC', 'MOBILE_CLINIC', 'PRIVATE_PRACTICE']),
  code: z.string().min(2).max(20),
  mflCode: z.string().regex(VALIDATION_PATTERNS.MFL_CODE, messages.mflCode).optional(),
  county: z.string().min(2).max(50),
  subCounty: z.string().min(2).max(50),
  ward: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().regex(VALIDATION_PATTERNS.PHONE, messages.phone).optional(),
  email: z.string().email(messages.email).optional(),
  owner: z.enum(['GOVERNMENT', 'PRIVATE', 'MISSION', 'NGO', 'COMMUNITY', 'OTHER']),
  level: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'LEVEL_6']),
  emergencyServices: z.boolean().default(false),
  maternityServices: z.boolean().default(false),
  immunizationServices: z.boolean().default(true),
});

// Report schemas
export const generateReportSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.enum(['COVERAGE', 'MISSED_VACCINES', 'FACILITY_PERFORMANCE', 'DEMOGRAPHIC', 'TIMELINESS', 'CUSTOM']),
  description: z.string().max(500).optional(),
  parameters: z.object({
    dateRange: z.object({
      startDate: z.string().refine(date => !isNaN(Date.parse(date))),
      endDate: z.string().refine(date => !isNaN(Date.parse(date))),
    }).optional(),
    facilityIds: z.array(z.string().uuid()).optional(),
    counties: z.array(z.string()).optional(),
    subCounties: z.array(z.string()).optional(),
    vaccineIds: z.array(z.string().uuid()).optional(),
    ageGroups: z.array(z.string()).optional(),
    groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional(),
    includeCharts: z.boolean().default(true),
  }),
  format: z.enum(['PDF', 'CSV', 'EXCEL', 'JSON']).default('PDF'),
  frequency: z.enum(['ON_DEMAND', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('ON_DEMAND'),
});

// Export all schemas
export const schemas = {
  // Auth
  login: loginSchema,
  register: registerSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  changePassword: changePasswordSchema,
  verifyOTP: verifyOTPSchema,
  
  // Child
  createChild: createChildSchema,
  updateChild: updateChildSchema,
  addGrowthRecord: addGrowthRecordSchema,
  recordImmunization: recordImmunizationSchema,
  
  // Vaccine
  createVaccine: createVaccineSchema,
  addBatch: addBatchSchema,
  addInventory: addInventorySchema,
  
  // Parent
  linkChild: linkChildSchema,
  
  // Facility
  createFacility: createFacilitySchema,
  
  // Report
  generateReport: generateReportSchema,
};

// Type inference helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type CreateChildFormData = z.infer<typeof createChildSchema>;
export type UpdateChildFormData = z.infer<typeof updateChildSchema>;
export type AddGrowthRecordFormData = z.infer<typeof addGrowthRecordSchema>;
export type RecordImmunizationFormData = z.infer<typeof recordImmunizationSchema>;
export type CreateVaccineFormData = z.infer<typeof createVaccineSchema>;
export type AddBatchFormData = z.infer<typeof addBatchSchema>;
export type AddInventoryFormData = z.infer<typeof addInventorySchema>;
export type LinkChildFormData = z.infer<typeof linkChildSchema>;
export type CreateFacilityFormData = z.infer<typeof createFacilitySchema>;
export type GenerateReportFormData = z.infer<typeof generateReportSchema>;