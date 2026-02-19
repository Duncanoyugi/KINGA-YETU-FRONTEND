import { differenceInDays, differenceInMonths, addDays, isBefore, isAfter } from 'date-fns';
import { VACCINE_CONSTANTS } from './constants';

// Vaccine schedule interface
export interface VaccineSchedule {
  vaccineId: string;
  vaccineName: string;
  recommendedAgeDays: number;
  minAgeDays?: number;
  maxAgeDays?: number;
  intervalDays?: number;
  doseNumber: number;
  totalDoses: number;
  isBirthDose: boolean;
  isBooster: boolean;
}

// Calculate due date based on birth date and recommended age
export const calculateDueDate = (birthDate: Date | string, recommendedAgeDays: number): Date => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  return addDays(birth, recommendedAgeDays);
};

// Check if vaccine is due based on birth date and current date
export const isVaccineDue = (
  vaccine: VaccineSchedule,
  birthDate: Date | string,
  currentDate: Date = new Date()
): boolean => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const dueDate = calculateDueDate(birth, vaccine.recommendedAgeDays);
  
  // Check minimum age
  if (vaccine.minAgeDays) {
    const minDate = addDays(birth, vaccine.minAgeDays);
    if (isBefore(currentDate, minDate)) return false;
  }
  
  // Check maximum age
  if (vaccine.maxAgeDays) {
    const maxDate = addDays(birth, vaccine.maxAgeDays);
    if (isAfter(currentDate, maxDate)) return false;
  }
  
  return !isBefore(currentDate, dueDate);
};

// Calculate age-appropriate vaccines for a child
export const getAgeAppropriateVaccines = (
  vaccines: VaccineSchedule[],
  birthDate: Date | string,
  administeredVaccines: string[] = []
): VaccineSchedule[] => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const ageInDays = differenceInDays(new Date(), birth);
  
  return vaccines.filter(vaccine => {
    // Skip if already administered
    if (administeredVaccines.includes(vaccine.vaccineId)) return false;
    
    // Check if within age range
    const minAge = vaccine.minAgeDays || 0;
    const maxAge = vaccine.maxAgeDays || Infinity;
    
    return ageInDays >= minAge && ageInDays <= maxAge;
  });
};

// Calculate next vaccine due date
export const calculateNextDueDate = (
  lastAdministrationDate: Date | string,
  intervalDays: number
): Date => {
  const lastDate = typeof lastAdministrationDate === 'string' 
    ? new Date(lastAdministrationDate) 
    : lastAdministrationDate;
  return addDays(lastDate, intervalDays);
};

// Get vaccine status based on due date
export const getVaccineStatus = (
  dueDate: Date | string,
  administeredDate?: Date | string | null
): 'completed' | 'upcoming' | 'due' | 'overdue' | 'missed' => {
  if (administeredDate) return 'completed';
  
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  
  const daysUntilDue = differenceInDays(due, now);
  
  if (daysUntilDue > 7) return 'upcoming';
  if (daysUntilDue >= 0 && daysUntilDue <= 7) return 'due';
  if (daysUntilDue < 0 && daysUntilDue >= -30) return 'overdue';
  return 'missed';
};

// Calculate completion rate for a child
export const calculateCompletionRate = (
  totalDoses: number,
  administeredDoses: number
): number => {
  if (totalDoses === 0) return 0;
  return (administeredDoses / totalDoses) * 100;
};

// Calculate timeliness rate (vaccines given within acceptable window)
export const calculateTimelinessRate = (
  administeredDates: Array<{ dueDate: Date; administeredDate: Date }>,
  gracePeriodDays: number = 7
): number => {
  if (administeredDates.length === 0) return 0;
  
  const timelyCount = administeredDates.filter(({ dueDate, administeredDate }) => {
    const daysLate = differenceInDays(administeredDate, dueDate);
    return daysLate <= gracePeriodDays;
  }).length;
  
  return (timelyCount / administeredDates.length) * 100;
};

// Calculate dropout rate between two vaccines
export const calculateDropoutRate = (
  startedCount: number,
  completedCount: number
): number => {
  if (startedCount === 0) return 0;
  return ((startedCount - completedCount) / startedCount) * 100;
};

// Generate reminder schedule for a vaccine
export const generateReminderSchedule = (
  dueDate: Date | string,
  reminderDays: readonly number[] = VACCINE_CONSTANTS.DEFAULT_REMINDER_DAYS
): Date[] => {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  
  return reminderDays
    .map(days => addDays(due, -days))
    .filter(date => isAfter(date, now));
};

// Calculate age in months at administration
export const calculateAgeAtAdministration = (
  birthDate: Date | string,
  administrationDate: Date | string
): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const admin = typeof administrationDate === 'string' ? new Date(administrationDate) : administrationDate;
  
  return differenceInMonths(admin, birth);
};

// Check if vaccine interval is valid
export const isValidVaccineInterval = (
  previousDate: Date | string,
  currentDate: Date | string,
  minIntervalDays: number
): boolean => {
  const prev = typeof previousDate === 'string' ? new Date(previousDate) : previousDate;
  const curr = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;
  
  const daysDifference = differenceInDays(curr, prev);
  return daysDifference >= minIntervalDays;
};

// Calculate stock requirements based on upcoming appointments
export const calculateStockRequirements = (
  upcomingAppointments: Array<{ vaccineId: string; count: number }>,
  safetyStock: number = 1.2 // 20% safety margin
): Record<string, number> => {
  const requirements: Record<string, number> = {};
  
  upcomingAppointments.forEach(({ vaccineId, count }) => {
    requirements[vaccineId] = Math.ceil(count * safetyStock);
  });
  
  return requirements;
};

// Calculate wastage rate
export const calculateWastageRate = (
  dosesReceived: number,
  dosesAdministered: number,
  dosesWasted: number
): number => {
  const totalUnaccounted = dosesReceived - dosesAdministered;
  if (totalUnaccounted === 0) return 0;
  return (dosesWasted / totalUnaccounted) * 100;
};

// Predict vaccine demand based on birth rate and coverage
export const predictVaccineDemand = (
  birthRate: number, // per month
  coverage: number, // percentage
  dosesPerChild: number,
  months: number = 12
): number[] => {
  const demand: number[] = [];
  
  for (let i = 0; i < months; i++) {
    const monthlyDemand = birthRate * (coverage / 100) * dosesPerChild;
    demand.push(Math.ceil(monthlyDemand));
  }
  
  return demand;
};

// Calculate coverage rate for a population
export const calculateCoverageRate = (
  targetPopulation: number,
  immunizedPopulation: number
): number => {
  if (targetPopulation === 0) return 0;
  return (immunizedPopulation / targetPopulation) * 100;
};

// Determine if a child is fully immunized based on age
export const isFullyImmunizedForAge = (
  ageInMonths: number,
  administeredVaccines: string[],
  vaccineSchedule: VaccineSchedule[]
): boolean => {
  // Get required vaccines for this age
  const requiredVaccines = vaccineSchedule.filter(v => 
    v.recommendedAgeDays <= ageInMonths * 30
  );
  
  // Check if all required vaccines are administered
  return requiredVaccines.every(v => 
    administeredVaccines.includes(v.vaccineId)
  );
};

// Calculate optimal vaccine storage temperature range
export const getOptimalTemperatureRange = (vaccineType: string): { min: number; max: number } => {
  const ranges: Record<string, { min: number; max: number }> = {
    'BCG': { min: 2, max: 8 },
    'OPV': { min: -15, max: -25 },
    'IPV': { min: 2, max: 8 },
    'DPT': { min: 2, max: 8 },
    'HEP_B': { min: 2, max: 8 },
    'HIB': { min: 2, max: 8 },
    'PCV': { min: 2, max: 8 },
    'ROTA': { min: 2, max: 8 },
    'MEASLES': { min: -15, max: -25 },
    'MR': { min: 2, max: 8 },
    'MMR': { min: 2, max: 8 },
    'VARICELLA': { min: -15, max: -25 },
    'HPV': { min: 2, max: 8 },
    'YELLOW_FEVER': { min: 2, max: 8 },
    'COVID_19': { min: -60, max: -80 },
  };
  
  return ranges[vaccineType] || { min: 2, max: 8 };
};

// Calculate vaccine efficacy based on storage conditions
export const calculateVaccineEfficacy = (
  storageTemperature: number,
  optimalRange: { min: number; max: number },
  daysInStorage: number
): number => {
  // Simple efficacy model - more sophisticated models would be used in production
  if (storageTemperature >= optimalRange.min && storageTemperature <= optimalRange.max) {
    return Math.max(0, 100 - (daysInStorage * 0.1));
  }
  
  const deviation = Math.abs(storageTemperature - optimalRange.min);
  const efficacyLoss = deviation * 5 * (daysInStorage / 30);
  return Math.max(0, 100 - efficacyLoss);
};

// Group vaccines by age category
export const groupVaccinesByAgeCategory = (
  vaccines: VaccineSchedule[]
): Record<string, VaccineSchedule[]> => {
  const groups: Record<string, VaccineSchedule[]> = {
    'Birth': [],
    '6 Weeks': [],
    '10 Weeks': [],
    '14 Weeks': [],
    '6 Months': [],
    '9 Months': [],
    '12 Months': [],
    '18 Months': [],
    '24 Months': [],
    '5-6 Years': [],
    '10-12 Years': [],
    '15-18 Years': [],
  };
  
  vaccines.forEach(vaccine => {
    if (vaccine.isBirthDose) {
      groups['Birth'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 42) {
      groups['6 Weeks'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 70) {
      groups['10 Weeks'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 98) {
      groups['14 Weeks'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 180) {
      groups['6 Months'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 270) {
      groups['9 Months'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 365) {
      groups['12 Months'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 540) {
      groups['18 Months'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 730) {
      groups['24 Months'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 2190) {
      groups['5-6 Years'].push(vaccine);
    } else if (vaccine.recommendedAgeDays <= 4380) {
      groups['10-12 Years'].push(vaccine);
    } else {
      groups['15-18 Years'].push(vaccine);
    }
  });
  
  return groups;
};

// Calculate vaccine coverage heat map data
export const calculateCoverageHeatMap = (
  facilities: Array<{ id: string; lat: number; lng: number; coverage: number }>
): Array<{ lat: number; lng: number; intensity: number; value: number }> => {
  return facilities.map(facility => ({
    lat: facility.lat,
    lng: facility.lng,
    intensity: facility.coverage / 100,
    value: facility.coverage,
  }));
};