
import { useCurrentUser } from "./useCurrentUser";
import { useDashboardQueries } from "./useDashboardQueries";
import { useRealtimeListeners } from "./useRealtimeListeners";
import { useCallback } from "react";

export const useDashboardData = () => {
  // Get the current authenticated user with performance optimization
  const { currentUser } = useCurrentUser();
  
  // Set up real-time listeners for data changes
  useRealtimeListeners();
  
  // Fetch dashboard data based on the current user
  const { dashboardData, refetchDashboard } = useDashboardQueries(currentUser?.id);

  // Wrapped in useCallback to prevent recreation on each render
  const refetch = useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    refetch,
  };
};
