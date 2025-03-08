
import { useCurrentUser } from "./useCurrentUser";
import { useDashboardQueries } from "./useDashboardQueries";
import { useRealtimeListeners } from "./useRealtimeListeners";
import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useDashboardData = () => {
  // Get the current authenticated user with performance optimization
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const contributorsChannelRef = useRef<any>(null);
  
  // Set up real-time listeners for data changes
  useRealtimeListeners();
  
  // Fetch dashboard data based on the current user
  const { dashboardData, refetchDashboard } = useDashboardQueries(currentUser?.id);

  // Configuration d'un écouteur spécifique pour les contributeurs
  useEffect(() => {
    if (!currentUser?.id) return;
    
    // Nettoyer le canal existant si nécessaire
    if (contributorsChannelRef.current) {
      supabase.removeChannel(contributorsChannelRef.current);
      contributorsChannelRef.current = null;
    }
    
    // Créer un canal dédié pour les contributeurs avec un ID unique
    const channelId = `dashboard-contributors-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'contributors',
          filter: `profile_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log(`Contributeur modifié dans le dashboard:`, payload);
          
          // Force le rechargement immédiat des données du dashboard
          queryClient.invalidateQueries({ 
            queryKey: ["dashboard-data"],
            exact: false 
          });
          
          // Rafraîchir les données immédiatement
          refetchDashboard();
        }
      )
      .subscribe();
    
    // Stocker la référence du canal
    contributorsChannelRef.current = channel;
    
    return () => {
      if (contributorsChannelRef.current) {
        supabase.removeChannel(contributorsChannelRef.current);
        contributorsChannelRef.current = null;
      }
    };
  }, [currentUser?.id, queryClient, refetchDashboard]);

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
