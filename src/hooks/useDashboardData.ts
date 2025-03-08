
import { useCurrentUser } from "./useCurrentUser";
import { useDashboardQueries } from "./useDashboardQueries";
import { useRealtimeListeners } from "./useRealtimeListeners";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardData = () => {
  // Get the current authenticated user with performance optimization
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  
  // Set up real-time listeners for data changes
  useRealtimeListeners();
  
  // Fetch dashboard data based on the current user
  const { dashboardData, refetchDashboard } = useDashboardQueries(currentUser?.id);

  // Écouter les modifications de contributeurs
  useEffect(() => {
    // Fonction pour écouter les changements sur la table contributors
    const setupContributorsListener = async () => {
      const channelId = `contributors-dashboard-${Date.now()}`;
      
      const channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contributors'
          },
          () => {
            console.log('Contributors data changed, invalidating dashboard queries');
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            refetchDashboard();
          }
        )
        .subscribe();
      
      return channel;
    };
    
    const channel = setupContributorsListener();
    
    // Cleanup
    return () => {
      channel.then(ch => {
        if (ch) supabase.removeChannel(ch);
      });
    };
  }, [queryClient, refetchDashboard]);

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
