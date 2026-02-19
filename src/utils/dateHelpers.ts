import { format, formatDistance, differenceInDays, differenceInMonths, differenceInYears, addDays, isBefore, isAfter, isValid, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Format date for display
export const formatDate = (
  date: Date | string | null | undefined,
  formatStr: string = DATE_FORMATS.DISPLAY
): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr);
};

// Format date with time
export const formatDateTime = (date: Date | string | null | undefined): string => {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
};

// Format time only
export const formatTime = (date: Date | string | null | undefined, use24Hour: boolean = true): string => {
  return formatDate(date, use24Hour ? DATE_FORMATS.TIME : DATE_FORMATS.TIME_12H);
};

// Format relative time (e.g., "2 days ago", "in 3 months")
export const formatRelativeTime = (date: Date | string | null | undefined, baseDate: Date = new Date()): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return formatDistance(dateObj, baseDate, { addSuffix: true });
};

// Format age from birthdate
export const formatAge = (birthDate: Date | string | null | undefined): string => {
  if (!birthDate) return '';
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(birth)) return '';
  
  const now = new Date();
  const years = differenceInYears(now, birth);
  
  if (years > 0) {
    const months = differenceInMonths(now, birth) % 12;
    return months > 0 ? `${years}y ${months}m` : `${years}y`;
  }
  
  const months = differenceInMonths(now, birth);
  if (months > 0) {
    const days = differenceInDays(now, birth) % 30;
    return days > 0 ? `${months}m ${days}d` : `${months}m`;
  }
  
  const days = differenceInDays(now, birth);
  return `${days}d`;
};

// Get age in months
export const getAgeInMonths = (birthDate: Date | string | null | undefined): number => {
  if (!birthDate) return 0;
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(birth)) return 0;
  return differenceInMonths(new Date(), birth);
};

// Get age in days
export const getAgeInDays = (birthDate: Date | string | null | undefined): number => {
  if (!birthDate) return 0;
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  if (!isValid(birth)) return 0;
  return differenceInDays(new Date(), birth);
};

// Check if date is within range
export const isWithinRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const startObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(dateObj) || !isValid(startObj) || !isValid(endObj)) return false;
  
  return !isBefore(dateObj, startObj) && !isAfter(dateObj, endObj);
};

// Get date range for period
export const getDateRangeForPeriod = (period: 'today' | 'week' | 'month' | 'year' | 'custom', customStart?: Date, customEnd?: Date): { start: Date; end: Date } => {
  const now = new Date();
  
  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case 'year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };
    case 'custom':
      return {
        start: customStart || startOfMonth(now),
        end: customEnd || endOfMonth(now),
      };
    default:
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
  }
};

// Get due status for vaccinations
export const getDueStatus = (dueDate: Date | string): 'upcoming' | 'due' | 'overdue' | 'past' => {
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  if (!isValid(due)) return 'past';
  
  const now = new Date();
  const daysUntilDue = differenceInDays(due, now);
  
  if (daysUntilDue > 7) return 'upcoming';
  if (daysUntilDue >= 0 && daysUntilDue <= 7) return 'due';
  if (daysUntilDue < 0 && daysUntilDue >= -30) return 'overdue';
  return 'past';
};

// Get color for due status
export const getDueStatusColor = (status: 'upcoming' | 'due' | 'overdue' | 'past'): string => {
  switch (status) {
    case 'upcoming':
      return 'info';
    case 'due':
      return 'warning';
    case 'overdue':
      return 'danger';
    case 'past':
      return 'secondary';
    default:
      return 'default';
  }
};

// Calculate next due date based on interval
export const calculateNextDueDate = (
  administrationDate: Date | string,
  intervalDays: number
): Date => {
  const admin = typeof administrationDate === 'string' ? parseISO(administrationDate) : administrationDate;
  return addDays(admin, intervalDays);
};

// Format date range
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} - ${end}`;
};

// Check if date is a weekend
export const isWeekend = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const day = dateObj.getDay();
  return day === 0 || day === 6;
};

// Get business days between dates
export const getBusinessDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  let count = 0;
  const curDate = new Date(start.getTime());
  
  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  
  return count;
};

// Sort dates
export const sortDates = (dates: (Date | string)[], ascending: boolean = true): (Date | string)[] => {
  return [...dates].sort((a, b) => {
    const dateA = typeof a === 'string' ? new Date(a) : a;
    const dateB = typeof b === 'string' ? new Date(b) : b;
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};

// Get months between dates
export const getMonthsBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInMonths(end, start);
};

// Get years between dates
export const getYearsBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInYears(end, start);
};

// Check if date is expired
export const isExpired = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
};

// Get days until expiry
export const getDaysUntilExpiry = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date());
};

// Format expiry status
export const formatExpiryStatus = (date: Date | string): { status: 'valid' | 'expiring' | 'expired'; days: number } => {
  const daysUntil = getDaysUntilExpiry(date);
  
  if (daysUntil < 0) {
    return { status: 'expired', days: Math.abs(daysUntil) };
  }
  if (daysUntil <= 30) {
    return { status: 'expiring', days: daysUntil };
  }
  return { status: 'valid', days: daysUntil };
};

// Parse date safely
export const safeParseDate = (date: any): Date | null => {
  if (!date) return null;
  
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

// Get fiscal year
export const getFiscalYear = (date: Date | string = new Date()): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  
  // Fiscal year starts in July (month 6)
  return month >= 6 ? year + 1 : year;
};

// Format fiscal year
export const formatFiscalYear = (year: number): string => {
  return `FY${year - 1}-${year.toString().slice(2)}`;
};