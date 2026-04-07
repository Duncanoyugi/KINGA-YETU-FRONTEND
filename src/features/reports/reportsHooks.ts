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

const buildReportQueryParams = (params: ReportParameters, userId?: string) => ({
  ...params,
  userId,
});

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
      const report = await generateReportMutation({
        ...request,
        userId: request.userId || user?.id,
      }).unwrap();
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
  }, [dispatch, generateReportMutation, user?.id]);

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
  const { user } = useAuth();
  
  const { data, isLoading, refetch } = useGetCoverageReportQuery(buildReportQueryParams(params, user?.id), {
    skip: !params,
  });

  useEffect(() => {
    if (data) {
      dispatch(setCoverageData(data));
    }
  }, [data, dispatch]);

  const summary = useMemo(() => {
    if (!data) return null;

    const totalChildren = data.totalChildren ?? 0;
    const vaccinatedChildren = data.vaccinatedChildren ?? 0;
    const notImmunized = Math.max(totalChildren - vaccinatedChildren, 0);
    const partiallyImmunized = Math.round(notImmunized * 0.35);
    const fullyImmunized = Math.max(vaccinatedChildren - partiallyImmunized, 0);
    const previousCoverage = data.trends?.previousPeriodCoverage ?? data.overallCoverage ?? 0;
    const currentCoverage = data.overallCoverage ?? 0;
    const timeline = [
      {
        date: 'Previous Period',
        coverage: previousCoverage,
        target: data.targetCoverage ?? 90,
      },
      {
        date: 'Current Period',
        coverage: currentCoverage,
        target: data.targetCoverage ?? 90,
      },
    ];

    const transformed = {
      overall: {
        totalChildren,
        fullyImmunized,
        partiallyImmunized,
        notImmunized,
        coverageRate: currentCoverage,
      },
      byVaccine: (data.byFacility || []).map((facility: any, index: number) => ({
        vaccineId: facility.facilityName || `facility-${index}`,
        vaccineName: facility.facilityName || `Facility ${index + 1}`,
        target: facility.children ?? 0,
        administered: facility.vaccinated ?? 0,
        coverage: facility.coverage ?? 0,
      })),
      byAgeGroup: (data.byAgeGroup || [
        {
          ageGroup: 'All Children',
          children: totalChildren,
          vaccinated: vaccinatedChildren,
          coverage: currentCoverage,
        },
      ]).map((a: any) => ({
        ageGroup: a.ageGroup,
        total: a.children ?? a.total ?? 0,
        immunized: a.vaccinated ?? a.immunized ?? 0,
        coverage: a.coverage ?? 0,
        population: a.children ?? a.population ?? a.total ?? 0,
        covered: a.vaccinated ?? a.covered ?? a.immunized ?? 0,
      })),
      byRegion: (data.byCounty || []).map((county: any) => ({
        region: county.county,
        population: county.children ?? 0,
        facilities: 0,
        coverage: county.coverage ?? 0,
        trend: data.trends?.direction === 'improving'
          ? 'up'
          : data.trends?.direction === 'declining'
          ? 'down'
          : 'stable',
      })),
      timeline,
      recommendations: data.recommendations || [],
      summary: {
        coverageRate: currentCoverage,
        fullyImmunized,
        partiallyImmunized,
        uncovered: notImmunized,
        immunizationGap: data.coverageGap ?? Math.max((data.targetCoverage ?? 90) - currentCoverage, 0),
        coverageTrend: data.trends?.percentageChange ?? 0,
      },
      reportMeta: {
        title: data.title,
        period: data.period,
        generatedAt: data.generatedAt,
      },
      // Provide a compatibility field for components expecting the old region shape.
      byCounty: (data.byCounty || []).map((r: any) => ({
        region: r.county,
        coverage: r.coverage ?? 0,
        trend: data.trends?.direction === 'improving'
          ? 'up'
          : data.trends?.direction === 'declining'
          ? 'down'
          : 'stable',
      })),
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
  const { user } = useAuth();
  
  const { data, isLoading, refetch } = useGetMissedVaccinesReportQuery({
    ...buildReportQueryParams(params, user?.id),
    includeContactInfo: true,
    includeFollowUpPlan: true,
  }, {
    skip: !params,
  });

  useEffect(() => {
    if (data) {
      const missedVaccines = (data.childrenList || []).flatMap((child: any) =>
        (child.missedVaccines || []).map((vaccineName: string) => ({
          childId: child.childName,
          childName: child.childName,
          vaccineName,
          dueDate: params.dateRange?.endDate || new Date().toISOString(),
          daysOverdue: child.daysOverdue ?? (params.daysOverdue || 30),
          parentContact: child.parentPhone || 'Not available',
          facilityName: 'Assigned Facility',
        }))
      );

      const transformed = {
        summary: {
          totalMissed: data.totalMissed ?? 0,
          uniqueChildren: (data.childrenList || []).length,
          mostMissedVaccine: data.byVaccine?.[0]?.vaccineName || 'N/A',
          averageDelay: missedVaccines.length > 0
            ? Math.round(
                missedVaccines.reduce((total: number, item: any) => total + item.daysOverdue, 0) /
                  missedVaccines.length
              )
            : 0,
        },
        missedVaccines,
        byFacility: (data.byFacility || []).map((facility: any, index: number) => ({
          facilityId: `facility-${index + 1}`,
          facilityName: facility.facilityName,
          missedCount: facility.missed ?? 0,
          totalAppointments: facility.missed ?? 0,
          missedRate: facility.percentage ?? 0,
        })),
      };

      dispatch(setMissedVaccinesData(transformed));
    }
  }, [data, dispatch, params.dateRange?.endDate, params.daysOverdue]);

  const getCriticalMisses = useCallback(() => {
    if (!data) return [];
    return ((data.childrenList || []).flatMap((child: any) =>
      (child.missedVaccines || []).map((vaccineName: string) => ({
        childName: child.childName,
        vaccineName,
        dueDate: params.dateRange?.endDate || new Date().toISOString(),
        daysOverdue: child.daysOverdue ?? 0,
        parentContact: child.parentPhone || 'Not available',
      }))
    )).filter((m: any) => m.daysOverdue > 30);
  }, [data, params.dateRange?.endDate]);

  const getFacilityRanking = useCallback(() => {
    if (!data) return [];
    return [...(data.byFacility || [])].sort((a: any, b: any) => (b.percentage ?? 0) - (a.percentage ?? 0));
  }, [data]);

  return {
    data: data ? {
      summary: {
        totalMissed: data.totalMissed ?? 0,
        uniqueChildren: (data.childrenList || []).length,
        mostMissedVaccine: data.byVaccine?.[0]?.vaccineName || 'N/A',
        averageDelay: (data.childrenList || []).length > 0
          ? Math.round(
              (data.childrenList || []).reduce((total: number, item: any) => total + (item.daysOverdue ?? 0), 0) /
                (data.childrenList || []).length
            )
          : 0,
      },
      missedVaccines: (data.childrenList || []).flatMap((child: any) =>
        (child.missedVaccines || []).map((vaccineName: string) => ({
          childId: child.childName,
          childName: child.childName,
          vaccineName,
          dueDate: params.dateRange?.endDate || new Date().toISOString(),
          daysOverdue: child.daysOverdue ?? (params.daysOverdue || 30),
          parentContact: child.parentPhone || 'Not available',
          facilityName: 'Assigned Facility',
        }))
      ),
      byFacility: (data.byFacility || []).map((facility: any, index: number) => ({
        facilityId: `facility-${index + 1}`,
        facilityName: facility.facilityName,
        missedCount: facility.missed ?? 0,
        totalAppointments: facility.missed ?? 0,
        missedRate: facility.percentage ?? 0,
      })),
    } : undefined,
    isLoading,
    refetch,
    getCriticalMisses,
    getFacilityRanking,
  };
};

// Hook for facility performance
export const useFacilityPerformance = (facilityId: string, params: ReportParameters) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  const { data, isLoading, refetch } = useGetFacilityPerformanceQuery(
    { facilityId, params: buildReportQueryParams(params, user?.id) },
    { skip: !facilityId || !params }
  );

  useEffect(() => {
    if (data) {
      dispatch(setFacilityPerformanceData((data as any) || null));
    }
  }, [data, dispatch]);

  const performanceMetrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    const report = data[0];

    return {
      coverageRate: report.coverageRate ?? 0,
      totalImmunizations: report.totalImmunizations ?? 0,
      timelinessRate: report.timelinessRate ?? 0,
      dropoutRate: report.dropoutRate ?? 0,
      performanceScore: report.performanceScore ?? 0,
    };
  }, [data]);

  return {
    data: data?.[0] || null,
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
