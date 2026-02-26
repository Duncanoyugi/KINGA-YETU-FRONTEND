import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useAuth } from '../auth/authHooks';
import {
  useGetDashboardMetricsQuery,
  useGetCoverageAnalyticsQuery,
  useGetDropoutAnalyticsQuery,
  useGetPerformanceMetricsQuery,
  useGetTrendAnalyticsQuery,
  useGetGeographicAnalyticsQuery,
  useGetDemographicsAnalyticsQuery,
  useGetPredictionsQuery,
  useGetComparativeAnalyticsQuery,
  useGetRealTimeStatsQuery,
  useGetAlertAnalyticsQuery,
  useExportAnalyticsMutation,
} from './analyticsAPI';
import {
  setDashboardMetrics,
  setCoverageAnalytics,
  setDropoutAnalytics,
  setPerformanceMetrics,
  setTrendAnalytics,
  setGeographicAnalytics,
  setDemographicsAnalytics,
} from './analyticsSlice';
import type { 
  AnalyticsRequest, 
  CoverageAnalytics, 
  DropoutAnalytics,
  PerformanceMetrics,
  TrendAnalytics,
  GeographicAnalytics,
  DemographicsAnalytics
} from './analyticsTypes';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';

// Main hook for analytics dashboard
export const useAnalyticsDashboard = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { dashboard, isLoading, error, lastUpdated } = useAppSelector((state) => state.analytics);

  // Fetch dashboard metrics
  const { data: metricsData, refetch: refetchMetrics } = useGetDashboardMetricsQuery(params, {
    skip: !user || !params,
    pollingInterval: 300000, // Poll every 5 minutes for real-time updates
  });

  useEffect(() => {
    if (metricsData) {
      dispatch(setDashboardMetrics(metricsData));
    }
  }, [metricsData, dispatch]);

  // Fetch real-time stats
  const { data: realtimeData } = useGetRealTimeStatsQuery(undefined, {
    skip: !user,
    pollingInterval: 60000, // Poll every minute
  });

  // Fetch alert analytics
  const { data: alertData } = useGetAlertAnalyticsQuery(params, {
    skip: !user || !params,
    pollingInterval: 120000, // Poll every 2 minutes
  });

  // Combine all dashboard data
  const dashboardData = useMemo(() => {
    if (!dashboard) return null;
    
    return {
      ...dashboard,
      realtime: realtimeData,
      alerts: alertData,
      lastUpdated,
    };
  }, [dashboard, realtimeData, alertData, lastUpdated]);

  // Key performance indicators
  const kpis = useMemo(() => {
    if (!dashboard) return null;
    
    // Add default values to prevent undefined errors
    const coverageRate = dashboard.coverageRate ?? 0;
    const dropoutRate = dashboard.dropoutRate ?? 0;
    const timelinessRate = dashboard.timelinessRate ?? 0;
    const totalChildren = dashboard.totalChildren ?? 0;
    const activeChildren = dashboard.activeChildren ?? 0;
    
    return {
      coverage: {
        value: coverageRate,
        target: 90,
        status: coverageRate >= 90 ? 'excellent' : 
                coverageRate >= 75 ? 'good' : 
                coverageRate >= 50 ? 'fair' : 'poor',
      },
      dropout: {
        value: dropoutRate,
        target: 10,
        status: dropoutRate <= 10 ? 'excellent' :
                dropoutRate <= 20 ? 'good' :
                dropoutRate <= 30 ? 'fair' : 'poor',
      },
      timeliness: {
        value: timelinessRate,
        target: 85,
        status: timelinessRate >= 85 ? 'excellent' :
                timelinessRate >= 70 ? 'good' :
                timelinessRate >= 50 ? 'fair' : 'poor',
      },
      children: {
        total: totalChildren,
        active: activeChildren,
        ratio: totalChildren > 0 ? (activeChildren / totalChildren) * 100 : 0,
      },
    };
  }, [dashboard]);

  return {
    dashboard: dashboardData,
    kpis,
    isLoading,
    error,
    lastUpdated,
    refetch: refetchMetrics,
  };
};

// Hook for coverage analytics
export const useCoverageAnalytics = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { coverage } = useAppSelector((state) => state.analytics);

  const { data, isLoading, refetch } = useGetCoverageAnalyticsQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setCoverageAnalytics(data.data));
    }
  }, [data, dispatch]);

  const coverageSummary = useMemo(() => {
    if (!coverage) return null;
    
    // Calculate uncovered (total - covered)
    const uncovered = coverage.overall.total - coverage.overall.covered;
    
    return {
      ...coverage,
      overall: {
        ...coverage.overall,
        partiallyCovered: 0, // Backend doesn't provide this; set to 0 for now
        uncovered,
      },
      gap: uncovered,
      underperformingVaccines: coverage.byVaccine
        .filter((v: CoverageAnalytics['byVaccine'][number]) => v.coverage < 80)
        .sort((a: CoverageAnalytics['byVaccine'][number], b: CoverageAnalytics['byVaccine'][number]) => a.coverage - b.coverage),
      topRegions: coverage.byRegion
        .filter((r: CoverageAnalytics['byRegion'][number]) => r.coverage > 80)
        .sort((a: CoverageAnalytics['byRegion'][number], b: CoverageAnalytics['byRegion'][number]) => b.coverage - a.coverage),
      trend: coverage.timeline.length > 0 ? {
        direction: coverage.timeline[coverage.timeline.length - 1].coverage > coverage.timeline[0].coverage ? 'up' : 'down',
        change: coverage.timeline[coverage.timeline.length - 1].coverage - coverage.timeline[0].coverage,
      } : null,
    };
  }, [coverage]);

  return {
    coverage: coverageSummary,
    isLoading,
    refetch,
  };
};

// Hook for dropout analytics
export const useDropoutAnalytics = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { dropout } = useAppSelector((state) => state.analytics);

  const { data, isLoading, refetch } = useGetDropoutAnalyticsQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setDropoutAnalytics(data.data));
    }
  }, [data, dispatch]);

  const dropoutSummary = useMemo(() => {
    if (!dropout) return null;
    
    return {
      ...dropout,
      criticalFacilities: dropout.byFacility
        .filter((f: DropoutAnalytics['byFacility'][number]) => f.dropoutRate > 30)
        .sort((a: DropoutAnalytics['byFacility'][number], b: DropoutAnalytics['byFacility'][number]) => b.dropoutRate - a.dropoutRate),
      mainReasons: dropout.reasons
        .sort((a: DropoutAnalytics['reasons'][number], b: DropoutAnalytics['reasons'][number]) => b.count - a.count)
        .slice(0, 5),
      improvementNeeded: dropout.byVaccine
        .filter((v: DropoutAnalytics['byVaccine'][number]) => v.dropoutRate > 20)
        .map((v: DropoutAnalytics['byVaccine'][number]) => v.vaccineName),
    };
  }, [dropout]);

  return {
    dropout: dropoutSummary,
    isLoading,
    refetch,
  };
};

// Hook for performance metrics
export const usePerformanceMetrics = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { performance } = useAppSelector((state) => state.analytics);

  const { data, isLoading, refetch } = useGetPerformanceMetricsQuery(params, {
    skip: !params,
  });

  const { data: comparativeData } = useGetComparativeAnalyticsQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setPerformanceMetrics(data.data));
    }
  }, [data, dispatch]);

  const leaderboard = useMemo(() => {
    if (!performance) return null;
    
    return {
      topFacilities: performance.facilityPerformance
        .sort((a: PerformanceMetrics['facilityPerformance'][number], b: PerformanceMetrics['facilityPerformance'][number]) => b.metrics.vaccinations - a.metrics.vaccinations)
        .slice(0, 5),
      topWorkers: performance.healthWorkerPerformance
        .sort((a: PerformanceMetrics['healthWorkerPerformance'][number], b: PerformanceMetrics['healthWorkerPerformance'][number]) => b.metrics.vaccinations - a.metrics.vaccinations)
        .slice(0, 5),
      benchmarks: comparativeData?.benchmarks,
    };
  }, [performance, comparativeData]);

  return {
    performance,
    leaderboard,
    isLoading,
    refetch,
  };
};

// Hook for trend analytics
export const useTrendAnalytics = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { trends } = useAppSelector((state) => state.analytics);

  const { data, isLoading, refetch } = useGetTrendAnalyticsQuery(params, {
    skip: !params,
  });

  // Fetch predictions
  const { data: predictionsData } = useGetPredictionsQuery({
    ...params,
    metric: 'coverage',
    horizon: 6,
  }, {
    skip: !params,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setTrendAnalytics(data.data));
    }
  }, [data, dispatch]);

  const trendAnalysis = useMemo(() => {
    if (!trends) return null;
    
    return {
      ...trends,
      predictions: predictionsData,
      growth: {
        monthly: trends.vaccinationTrends.map((t: TrendAnalytics['vaccinationTrends'][number]) => t.count),
        cumulative: trends.vaccinationTrends.map((t: TrendAnalytics['vaccinationTrends'][number]) => t.cumulative),
        projected: trends.vaccinationTrends.map((t: TrendAnalytics['vaccinationTrends'][number]) => t.projected),
      },
      seasonal: {
        peakMonths: trends.seasonalPatterns
          .filter((p: TrendAnalytics['seasonalPatterns'][number]) => p.average > p.peak * 0.8)
          .map((p: TrendAnalytics['seasonalPatterns'][number]) => p.month),
        lowMonths: trends.seasonalPatterns
          .filter((p: TrendAnalytics['seasonalPatterns'][number]) => p.average < p.low * 1.2)
          .map((p: TrendAnalytics['seasonalPatterns'][number]) => p.month),
      },
    };
  }, [trends, predictionsData]);

  return {
    trends: trendAnalysis,
    isLoading,
    refetch,
  };
};

// Hook for geographic analytics
export const useGeographicAnalytics = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { geographic } = useAppSelector((state) => state.analytics);

  const { data, isLoading, refetch } = useGetGeographicAnalyticsQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setGeographicAnalytics(data.data));
    }
  }, [data, dispatch]);

  const mapData = useMemo(() => {
    if (!geographic) return null;
    
    return {
      heatmap: geographic.heatmap,
      coverage: geographic.coverageByCounty,
      underserved: geographic.underservedAreas
        .sort((a: GeographicAnalytics['underservedAreas'][number], b: GeographicAnalytics['underservedAreas'][number]) => b.population - a.population)
        .slice(0, 10),
    };
  }, [geographic]);

  return {
    geographic,
    mapData,
    isLoading,
    refetch,
  };
};

// Hook for demographics analytics
export const useDemographicsAnalytics = (params: AnalyticsRequest) => {
  const dispatch = useAppDispatch();
  const { demographics } = useAppSelector((state) => state.analytics);

  const { data, isLoading, refetch } = useGetDemographicsAnalyticsQuery(params, {
    skip: !params,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setDemographicsAnalytics(data.data));
    }
  }, [data, dispatch]);

  const demographicSummary = useMemo(() => {
    if (!demographics) return null;
    
    return {
      ...demographics,
      ageGroups: demographics.ageDistribution.map((g: DemographicsAnalytics['ageDistribution'][number]) => ({
        range: g.ageRange,
        total: g.total,
        male: g.male,
        female: g.female,
        ratio: g.male / g.female,
      })),
      genderBreakdown: {
        male: demographics.genderDistribution.male,
        female: demographics.genderDistribution.female,
        other: demographics.genderDistribution.other,
        malePercentage: (demographics.genderDistribution.male / 
          (demographics.genderDistribution.male + demographics.genderDistribution.female + demographics.genderDistribution.other)) * 100,
        femalePercentage: (demographics.genderDistribution.female / 
          (demographics.genderDistribution.male + demographics.genderDistribution.female + demographics.genderDistribution.other)) * 100,
      },
      birthTrend: demographics.birthRate.map((b: DemographicsAnalytics['birthRate'][number]) => ({
        month: b.month,
        births: b.births,
        registered: b.registered,
        registrationRate: (b.registered / b.births) * 100,
      })),
    };
  }, [demographics]);

  return {
    demographics: demographicSummary,
    isLoading,
    refetch,
  };
};

// Hook for analytics export
export const useAnalyticsExport = () => {
  const [exportAnalytics] = useExportAnalyticsMutation();

  const exportData = useCallback(async (
    type: string,
    params: AnalyticsRequest,
    format: 'csv' | 'excel' | 'pdf'
  ) => {
    try {
      const blob = await exportAnalytics({ type, params, format }).unwrap();
      
      const filename = `analytics-${type}-${new Date().toISOString().split('T')[0]}.${format}`;
      saveAs(blob, filename);
      
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics');
      throw error;
    }
  }, [exportAnalytics]);

  return { exportData };
};

// Hook for real-time monitoring
export const useRealTimeMonitoring = () => {
  const { data: realtimeStats, refetch } = useGetRealTimeStatsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });

  const { data: alertStats } = useGetAlertAnalyticsQuery({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0],
  }, {
    pollingInterval: 60000, // Poll every minute
  });

  const alerts = useMemo(() => {
    if (!alertStats) return [];
    
    return Object.entries(alertStats.bySeverity).map(([severity, count]) => ({
      severity,
      count,
      critical: severity === 'high' && count > 0,
    }));
  }, [alertStats]);

  return {
    stats: realtimeStats,
    alerts,
    refetch,
  };
};

// Hook for predictive analytics
export const usePredictiveAnalytics = (params: { metric: string; horizon: number }) => {
  const { data, isLoading, refetch } = useGetPredictionsQuery({
    ...params,
  } as any, {
    skip: !params.metric || !params.horizon,
  });

  const predictions = useMemo(() => {
    if (!data) return null;
    
    return {
      values: data.predictions,
      confidence: data.confidence,
      factors: data.factors,
      trend: data.predictions.length > 1 ? 
        data.predictions[data.predictions.length - 1] - data.predictions[0] : 0,
    };
  }, [data]);

  return {
    predictions,
    isLoading,
    refetch,
  };
};