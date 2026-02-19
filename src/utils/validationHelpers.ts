import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './constants';

// Email validation
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.EMAIL.test(email);
};

// Phone number validation (E.164 format)
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION_PATTERNS.PHONE.test(phone);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
};

// Name validation
export const isValidName = (name: string): boolean => {
  return VALIDATION_PATTERNS.NAME.test(name) && name.length >= 2;
};

// Number validation
export const isValidNumber = (value: any): boolean => {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return VALIDATION_PATTERNS.NUMBER.test(value);
  return false;
};

// Decimal validation
export const isValidDecimal = (value: any, decimals: number = 2): boolean => {
  if (!VALIDATION_PATTERNS.DECIMAL.test(String(value))) return false;
  
  const decimalStr = String(value).split('.')[1];
  if (!decimalStr) return true;
  
  return decimalStr.length <= decimals;
};

// Birth certificate validation
export const isValidBirthCertificate = (certificate: string): boolean => {
  return VALIDATION_PATTERNS.BIRTH_CERTIFICATE.test(certificate);
};

// MFL code validation (Kenya Master Facility List)
export const isValidMFLCode = (code: string): boolean => {
  // MFL codes are 5-7 digits
  const mflPattern = /^\d{5,7}$/;
  return mflPattern.test(code);
};

// Date validation
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// Future date validation
export const isFutureDate = (date: any, allowToday: boolean = true): boolean => {
  if (!isValidDate(date)) return false;
  
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  
  if (allowToday) {
    return inputDate >= today;
  }
  return inputDate > today;
};

// Past date validation
export const isPastDate = (date: any, allowToday: boolean = true): boolean => {
  if (!isValidDate(date)) return false;
  
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  
  if (allowToday) {
    return inputDate <= today;
  }
  return inputDate < today;
};

// Age validation (in years)
export const isValidAge = (birthDate: any, minAge: number = 0, maxAge: number = 150): boolean => {
  if (!isValidDate(birthDate)) return false;
  
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  
  return age >= minAge && age <= maxAge;
};

// Weight validation (in kg)
export const isValidWeight = (weight: number, ageInMonths?: number): boolean => {
  if (weight <= 0 || weight > 200) return false;
  
  // Age-specific validation if age provided
  if (ageInMonths !== undefined) {
    if (ageInMonths < 1 && weight > 10) return false; // Newborns under 10kg
    if (ageInMonths < 12 && weight > 30) return false; // Infants under 30kg
  }
  
  return true;
};

// Height validation (in cm)
export const isValidHeight = (height: number, ageInMonths?: number): boolean => {
  if (height <= 0 || height > 250) return false;
  
  // Age-specific validation if age provided
  if (ageInMonths !== undefined) {
    if (ageInMonths < 1 && height > 100) return false; // Newborns under 100cm
    if (ageInMonths < 12 && height > 150) return false; // Infants under 150cm
  }
  
  return true;
};

// Range validation
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Length validation
export const isValidLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
};

// File validation
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes;
};

// Image dimensions validation
export const isValidImageDimensions = (
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      if (minWidth && img.width < minWidth) resolve(false);
      if (minHeight && img.height < minHeight) resolve(false);
      if (maxWidth && img.width > maxWidth) resolve(false);
      if (maxHeight && img.height > maxHeight) resolve(false);
      
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

// Password match validation
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// Batch number validation
export const isValidBatchNumber = (batchNumber: string): boolean => {
  // Common batch number patterns: alphanumeric, may include hyphens
  const batchPattern = /^[A-Z0-9][A-Z0-9\-]*[A-Z0-9]$/i;
  return batchPattern.test(batchNumber) && batchNumber.length >= 3 && batchNumber.length <= 20;
};

// Temperature validation (celsius)
export const isValidTemperature = (temp: number, min: number = -80, max: number = 30): boolean => {
  return temp >= min && temp <= max;
};

// Percentage validation
export const isValidPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

// Form validation helpers
export const validateRequired = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (!email) return ERROR_MESSAGES.REQUIRED;
  if (!isValidEmail(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
  if (!phone) return ERROR_MESSAGES.REQUIRED;
  if (!isValidPhone(phone)) return ERROR_MESSAGES.INVALID_PHONE;
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return ERROR_MESSAGES.REQUIRED;
  if (!isValidPassword(password)) return ERROR_MESSAGES.INVALID_PASSWORD;
  return undefined;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | undefined => {
  if (!doPasswordsMatch(password, confirmPassword)) {
    return ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
  }
  return undefined;
};

export const validateDate = (date: any): string | undefined => {
  if (!date) return ERROR_MESSAGES.REQUIRED;
  if (!isValidDate(date)) return ERROR_MESSAGES.INVALID_DATE;
  return undefined;
};

export const validateNumber = (value: any, min?: number, max?: number): string | undefined => {
  if (value === undefined || value === '') return ERROR_MESSAGES.REQUIRED;
  
  const num = Number(value);
  if (isNaN(num)) return 'Please enter a valid number';
  
  if (min !== undefined && num < min) return ERROR_MESSAGES.MIN_VALUE(min);
  if (max !== undefined && num > max) return ERROR_MESSAGES.MAX_VALUE(max);
  
  return undefined;
};

export const validateWeight = (weight: number, ageInMonths?: number): string | undefined => {
  if (!weight) return ERROR_MESSAGES.REQUIRED;
  if (!isValidWeight(weight, ageInMonths)) {
    return 'Please enter a valid weight';
  }
  return undefined;
};

export const validateHeight = (height: number, ageInMonths?: number): string | undefined => {
  if (!height) return ERROR_MESSAGES.REQUIRED;
  if (!isValidHeight(height, ageInMonths)) {
    return 'Please enter a valid height';
  }
  return undefined;
};

export const validateBatchNumber = (batchNumber: string): string | undefined => {
  if (!batchNumber) return ERROR_MESSAGES.REQUIRED;
  if (!isValidBatchNumber(batchNumber)) {
    return 'Please enter a valid batch number';
  }
  return undefined;
};

export const validateMFLCode = (code: string): string | undefined => {
  if (!code) return ERROR_MESSAGES.REQUIRED;
  if (!isValidMFLCode(code)) {
    return 'Please enter a valid MFL code (5-7 digits)';
  }
  return undefined;
};

// Create validation schema for forms
export const createValidationSchema = (validations: Record<string, (value: any) => string | undefined>) => {
  return (values: Record<string, any>) => {
    const errors: Record<string, string> = {};
    
    Object.keys(validations).forEach(field => {
      const error = validations[field](values[field]);
      if (error) {
        errors[field] = error;
      }
    });
    
    return errors;
  };
};

// Check if form is valid
export const isFormValid = (errors: Record<string, any>): boolean => {
  return Object.keys(errors).length === 0;
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim();
};

// Validate Kenyan ID number
export const isValidKenyanID = (id: string): boolean => {
  // Kenyan ID is 7-8 digits
  const idPattern = /^\d{7,8}$/;
  return idPattern.test(id);
};

// Validate Kenyan passport number
export const isValidKenyanPassport = (passport: string): boolean => {
  // Kenyan passport: A followed by 8 digits (e.g., A12345678)
  const passportPattern = /^[A-Z]\d{8}$/;
  return passportPattern.test(passport);
};

// Validate KEPI vaccine code
export const isValidKEPICode = (code: string): boolean => {
  // KEPI codes: 2 letters followed by 2-3 digits (e.g., BCG01, OPV02)
  const kepiPattern = /^[A-Z]{2}\d{2,3}$/i;
  return kepiPattern.test(code);
};