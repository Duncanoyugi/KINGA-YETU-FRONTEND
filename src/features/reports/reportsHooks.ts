import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useAuth } from '../auth/authHooks';
import {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGenerateReportMutation,
  useDeleteReportMutation,
  useGetCoverageReportQuery,
  useGetMissedVaccinesReportQuery,
  useGetFacilityPerformanceQuery,
  useGetDemographicReportQuery,
  useGetTimelinessReportQuery,
  useDownloadReportMutation,
  useGetScheduledReportsQuery,
  useScheduleReportMutation,
  useDeleteScheduledReportMutation,
} from './reportsAPI';
import {
  setReports,
  setCurrentReport,
  addReport,
  removeReport,
  removeScheduledReport,
  setCoverageData,
  setMissedVaccinesData,
  setFacilityPerformanceData,
  setDemographicData,
  setTimelinessData,
  setScheduledReports,
  setGenerating,
  setError,
} from './reportsSlice';
import type { GenerateReportRequest, ReportParameters, ReportType, ReportFormat, Report, ScheduledReport, ReportFrequency } from './reportsTypes';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';

// Main hook for report management
export const useReports = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { reports, currentReport, isLoading, error, pagination } = 
    useAppSelector((state) => state.reports);

  // RTK Query hooks
  const { data: reportsData, refetch: refetchReports } = useGetReportsQuery(
    { page: pagination.page, limit: pagination.limit },
    { skip: !user }
  );

  const [generateReportMutation] = useGenerateReportMutation();
  const [deleteReportMutation] = useDeleteReportMutation();
  const [downloadReportMutation] = useDownloadReportMutation();

  // Update reports from query
  useEffect(() => {
    if (reportsData?.data) {
      dispatch(setReports(reportsData.data));
    }
  }, [reportsData, dispatch]);

  // Load report details when selected
  const { data: reportDetails, refetch: refetchReport } = useGetReportByIdQuery(
    currentReport?.id!,
    { skip: !currentReport?.id }
  );

  useEffect(() => {
    if (reportDetails) {
      dispatch(setCurrentReport(reportDetails));
    }
  }, [reportDetails, dispatch]);

  // Generate report
  const generateReport = useCallback(async (request: GenerateReportRequest) => {
    dispatch(setGenerating(true));
    try {
      const report = await generateReportMutation(request).unwrap();
      dispatch(addReport(report));
      toast.success('Report generated successfully');
      return report;
    } catch (error: any) {
      const message = error.data?.message || 'Failed to generate report';
      dispatch(setError(message));
      toast.error(message);
      throw error;
    } finally {
      dispatch(setGenerating(false));
    }
  }, [dispatch, generateReportMutation]);

  // Delete report
  const deleteReport = useCallback(async (id: string) => {
    try {
      await deleteReportMutation(id).unwrap();
      dispatch(removeReport(id));
      toast.success('Report deleted successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete report');
      throw error;
    }
  }, [dispatch, deleteReportMutation]);

  // Download report
  const downloadReport = useCallback(async (reportId: string, format: ReportFormat) => {
    try {
      const blob = await downloadReportMutation({ reportId, format }).unwrap();
      saveAs(blob, `report-${reportId}.${format.toLowerCase()}`);
      toast.success('Report downloaded successfully');
    } catch (error: any) {
      toast.error('Failed to download report');
      throw error;
    }
  }, [downloadReportMutation]);

  // Select report
  const selectReport = useCallback((report: Report | null) => {
    dispatch(setCurrentReport(report));
  }, [dispatch]);

  // Get reports by type
  const getReportsByType = useCallback((type: ReportType) => {
    return reports.filter((r: Report) => r.type === type);
  }, [reports]);

  // Get recent reports
  const getRecentReports = useCallback((limit: number = 5) => {
    return [...reports]
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, limit);
  }, [reports]);

  return {
    reports,
    currentReport,
    isLoading,
    isGenerating: useAppSelector((state) => state.reports.isGenerating),
    error,
    pagination,
    generateReport,
    deleteReport,
    downloadReport,
    selectReport,
    refetchReports,
    refetchReport,
    getReportsByType,
    getRecentReports,
  };
};

// Hook for coverage reports
export const useCoverageReport = (params: ReportParameters) => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, refetch } = useGetCoverageReportQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data) {
      dispatch(setCoverageData(data));
    }
  }, [data, dispatch]);

  const summary = useMemo(() => {
    if (!data) return null;

    // Build a UI-friendly shaped object expected by CoverageReports
    const immunizationGap = data.overall.totalChildren - data.overall.fullyImmunized;
    const coverageTrend = data.timeline.length > 0
      ? data.timeline[data.timeline.length - 1].coverage - data.timeline[0].coverage
      : 0;

    const transformed = {
      // keep original overall and lists
      overall: data.overall,
      byVaccine: data.byVaccine.map((v: any) => ({
        vaccineId: v.vaccineId,
        vaccineName: v.vaccineName,
        target: v.target ?? 0,
        administered: v.administered ?? 0,
        coverage: v.coverage ?? 0,
      })),
      byAgeGroup: data.byAgeGroup.map((a: any) => ({
        ageGroup: a.ageGroup,
        total: a.total ?? 0,
        immunized: a.immunized ?? 0,
        coverage: a.coverage ?? 0,
        population: a.population ?? a.total ?? 0,
        covered: a.covered ?? a.immunized ?? 0,
      })),
      byRegion: data.byRegion.map((r: any) => ({
        region: r.region,
        coverage: r.coverage ?? 0,
        trend: r.trend ?? 'stable',
        population: r.population ?? 0,
        facilities: r.facilities ?? 0,
      })),
      timeline: data.timeline.map((t: any) => ({
        date: t.date,
        coverage: t.coverage ?? 0,
        target: t.target ?? 0,
      })),
      // summary used by the component
      summary: {
        coverageRate: data.overall.coverageRate,
        fullyImmunized: data.overall.fullyImmunized,
        partiallyImmunized: data.overall.partiallyImmunized,
        uncovered: data.overall.notImmunized,
        immunizationGap,
        coverageTrend,
      },
    };

    return transformed;
  }, [data]);

  return {
    data: summary,
    isLoading,
    refetch,
  };
};

// Hook for missed vaccines report
export const useMissedVaccinesReport = (params: ReportParameters) => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, refetch } = useGetMissedVaccinesReportQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data) {
      dispatch(setMissedVaccinesData(data));
    }
  }, [data, dispatch]);

  const getCriticalMisses = useCallback(() => {
    if (!data) return [];
    return data.missedVaccines.filter(m => m.daysOverdue > 30);
  }, [data]);

  const getFacilityRanking = useCallback(() => {
    if (!data) return [];
    return [...data.byFacility].sort((a, b) => b.missedRate - a.missedRate);
  }, [data]);

  return {
    data,
    isLoading,
    refetch,
    getCriticalMisses,
    getFacilityRanking,
  };
};

// Hook for facility performance
export const useFacilityPerformance = (facilityId: string, params: ReportParameters) => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, refetch } = useGetFacilityPerformanceQuery(
    { facilityId, params },
    { skip: !facilityId || !params }
  );

  useEffect(() => {
    if (data) {
      dispatch(setFacilityPerformanceData(data));
    }
  }, [data, dispatch]);

  const performanceMetrics = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data.summary,
      achievementRate: data.monthly.reduce((acc, curr) => acc + curr.achievement, 0) / data.monthly.length,
      topPerformer: data.staff.reduce((best, curr) => 
        curr.vaccinations > (best?.vaccinations || 0) ? curr : best, data.staff[0]),
    };
  }, [data]);

  return {
    data,
    performanceMetrics,
    isLoading,
    refetch,
  };
};

// Hook for demographic reports
export const useDemographicReport = (params: ReportParameters) => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, refetch } = useGetDemographicReportQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data) {
      dispatch(setDemographicData(data));
    }
  }, [data, dispatch]);

  const getAgeGroupWithLowestCoverage = useCallback(() => {
    if (!data) return null;
    return data.ageDistribution.reduce((lowest, curr) => {
      const currCoverage = (curr.total / data.geographicDistribution[0]?.population) * 100;
      const lowestCoverage = (lowest.total / data.geographicDistribution[0]?.population) * 100;
      return currCoverage < lowestCoverage ? curr : lowest;
    }, data.ageDistribution[0]);
  }, [data]);

  return {
    data,
    isLoading,
    refetch,
    getAgeGroupWithLowestCoverage,
  };
};

// Hook for timeliness reports
export const useTimelinessReport = (params: ReportParameters) => {
  const dispatch = useAppDispatch();
  
  const { data, isLoading, refetch } = useGetTimelinessReportQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data) {
      dispatch(setTimelinessData(data));
    }
  }, [data, dispatch]);

  const timelinessScore = useMemo(() => {
    if (!data) return 0;
    return (data.overall.onTime / (data.overall.onTime + data.overall.delayed)) * 100;
  }, [data]);

  const vaccinesNeedingImprovement = useMemo(() => {
    if (!data) return [];
    return data.byVaccine
      .map(v => ({
        ...v,
        timelinessRate: (v.onTime / (v.onTime + v.delayed)) * 100,
      }))
      .filter(v => v.timelinessRate < 80)
      .sort((a, b) => a.timelinessRate - b.timelinessRate);
  }, [data]);

  return {
    data,
    timelinessScore,
    vaccinesNeedingImprovement,
    isLoading,
    refetch,
  };
};

// Hook for scheduled reports
export const useScheduledReports = () => {
  const dispatch = useAppDispatch();
  const { scheduledReports } = useAppSelector((state) => state.reports);

  const { data, refetch } = useGetScheduledReportsQuery();
  const [scheduleReportMutation] = useScheduleReportMutation();
  const [deleteScheduledMutation] = useDeleteScheduledReportMutation();

  useEffect(() => {
    if (data) {
      dispatch(setScheduledReports(data));
    }
  }, [data, dispatch]);

  const scheduleReport = useCallback(async (
    reportId: string,
    frequency: ReportFrequency,
    recipients: string[],
    startDate: string
  ) => {
    try {
      await scheduleReportMutation({ reportId, frequency, recipients, startDate }).unwrap();
      toast.success('Report scheduled successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to schedule report');
      throw error;
    }
  }, [scheduleReportMutation, refetch]);

  const deleteScheduledReport = useCallback(async (id: string) => {
    try {
      await deleteScheduledMutation(id).unwrap();
      dispatch(removeScheduledReport(id));
      toast.success('Scheduled report deleted');
    } catch (error: any) {
      toast.error('Failed to delete scheduled report');
      throw error;
    }
  }, [dispatch, deleteScheduledMutation]);

  const getActiveSchedules = useCallback(() => {
    return scheduledReports.filter((s: ScheduledReport) => s.isActive);
  }, [scheduledReports]);

  const getSchedulesByFrequency = useCallback((frequency: ReportFrequency) => {
    return scheduledReports.filter((s: ScheduledReport) => s.frequency === frequency);
  }, [scheduledReports]);

  return {
    scheduledReports,
    scheduleReport,
    deleteScheduledReport,
    refetch,
    getActiveSchedules,
    getSchedulesByFrequency,
  };
};

// Hook for report export
export const useReportExport = () => {
  const [downloadReportMutation] = useDownloadReportMutation();

  const exportReport = useCallback(async (reportId: string, format: ReportFormat) => {
    try {
      const blob = await downloadReportMutation({ reportId, format }).unwrap();
      
      // Determine file extension
      const extension = format.toLowerCase();
      const filename = `report-${reportId}.${extension}`;
      
      // Save file
      saveAs(blob, filename);
      
      toast.success(`Report exported as ${format}`);
    } catch (error) {
      toast.error('Failed to export report');
      throw error;
    }
  }, [downloadReportMutation]);

  const printReport = useCallback((reportData: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>ImmuniTrack Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>ImmuniTrack Report</h1>
            <pre>${JSON.stringify(reportData, null, 2)}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, []);

  return {
    exportReport,
    printReport,
  };
};