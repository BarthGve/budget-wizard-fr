
import { useCurrentUser } from "./useCurrentUser";
import { useDashboardQueries } from "./useDashboardQueries";
import { useRealtimeListeners } from "./useRealtimeListeners";

export const useDashboardData = () => {
  // Get the current authenticated user
  const { currentUser } = useCurrentUser();
  
  // Set up real-time listeners for data changes
  useRealtimeListeners();
  
  // Fetch dashboard data based on the current user
  const { dashboardData, refetchDashboard } = useDashboardQueries(currentUser?.id);

  const refetch = () => {
    refetchDashboard();
  };

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    refetch,
  };
};
