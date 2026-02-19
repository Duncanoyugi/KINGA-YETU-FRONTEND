// Schedule types for the frontend
export type ScheduleStatus = 'PENDING' | 'COMPLETED' | 'MISSED' | 'SKIPPED' | 'RESCHEDULED';

export interface Schedule {
  id: string;
  childId: string;
  vaccineId: string;
  scheduledDate: string;
  status: ScheduleStatus;
  administeredDate?: string;
  administeredBy?: string;
  facilityId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  childId: string;
  vaccineId: string;
  scheduledDate: string;
  notes?: string;
}

export interface UpdateScheduleRequest {
  scheduledDate?: string;
  status?: ScheduleStatus;
  administeredDate?: string;
  administeredBy?: string;
  facilityId?: string;
  notes?: string;
}

export interface ScheduleFilter {
  childId?: string;
  status?: ScheduleStatus;
  startDate?: string;
  endDate?: string;
  facilityId?: string;
}

export interface UpcomingSchedule {
  schedule: Schedule;
  childName: string;
  vaccineName: string;
  daysUntilDue: number;
}
