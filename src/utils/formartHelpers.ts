// Format currency
export const formatCurrency = (
  amount: number,
  currency: string = 'KES',
  locale: string = 'en-KE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'compact';
  }
): string => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2, notation = 'standard' } = options || {};
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(value);
};

// Format percentage
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  includeSymbol: boolean = true
): string => {
  const formatted = value.toFixed(decimals);
  return includeSymbol ? `${formatted}%` : formatted;
};

// Format phone number (Kenyan format)
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Kenyan numbers
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    const withoutZero = cleaned.slice(1);
    return `+254 ${withoutZero.slice(0, 3)} ${withoutZero.slice(3, 6)} ${withoutZero.slice(6)}`;
  }
  
  return phone;
};

// Format name (capitalize properly)
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Format duration (seconds to human readable)
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

// Format address
export const formatAddress = (address: {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  county?: string;
  postalCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state || address.county,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Format vaccine dose
export const formatVaccineDose = (doseNumber: number, totalDoses: number): string => {
  if (doseNumber === 0) return 'Birth Dose';
  if (doseNumber === totalDoses) return `Dose ${doseNumber} (Final)`;
  return `Dose ${doseNumber} of ${totalDoses}`;
};

// Format batch number
export const formatBatchNumber = (batch: string): string => {
  return batch.toUpperCase().replace(/\s+/g, '');
};

// Format temperature
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${temp.toFixed(1)}°${unit}`;
};

// Format weight
export const formatWeight = (weight: number, unit: 'kg' | 'g' = 'kg'): string => {
  if (unit === 'g') {
    return `${weight.toFixed(0)}g`;
  }
  return `${weight.toFixed(2)} kg`;
};

// Format height
export const formatHeight = (height: number, unit: 'cm' | 'm' = 'cm'): string => {
  if (unit === 'm') {
    return `${(height / 100).toFixed(2)} m`;
  }
  return `${height.toFixed(1)} cm`;
};

// Format gender
export const formatGender = (gender: string): string => {
  const genders: Record<string, string> = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  };
  return genders[gender] || gender;
};

// Format relation
export const formatRelation = (relation: string): string => {
  const relations: Record<string, string> = {
    MOTHER: 'Mother',
    FATHER: 'Father',
    GUARDIAN: 'Guardian',
    GRANDPARENT: 'Grandparent',
    AUNT: 'Aunt',
    UNCLE: 'Uncle',
    SIBLING: 'Sibling',
    OTHER: 'Other',
  };
  return relations[relation] || relation;
};

// Format boolean as Yes/No
export const formatBoolean = (value: boolean): string => {
  return value ? 'Yes' : 'No';
};

// Format list with commas and 'and'
export const formatList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(', ');
  return `${rest}, and ${last}`;
};

// Trim text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

// Format ID number (mask middle digits)
export const maskId = (id: string, visibleChars: number = 4): string => {
  if (id.length <= visibleChars) return id;
  const visible = id.slice(-visibleChars);
  const masked = '*'.repeat(id.length - visibleChars);
  return masked + visible;
};

// Format phone number for display (masked)
export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return phone;
  
  const last4 = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  return masked + last4;
};

// Format email for display (masked)
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  if (local.length <= 2) return email;
  
  const visible = local.slice(0, 2);
  const masked = '*'.repeat(local.length - 2);
  return `${visible}${masked}@${domain}`;
};