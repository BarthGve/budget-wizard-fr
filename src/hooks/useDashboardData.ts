import { useCurrentUser } from "./useCurrentUser";
import { useDashboardQueries } from "./useDashboardQueries";
import { useRealtimeListeners } from "./useRealtimeListeners";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDashboardData = () => {
  // Get the current authenticated user with performance optimization
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const contributorsChannelRef = useRef<any>(null);
  const [lastContributorEvent, setLastContributorEvent] = useState<number>(0);
  
  // Set up real-time listeners for data changes
  useRealtimeListeners();
  
  // Fetch dashboard data based on the current user
  const { dashboardData, refetchDashboard } = useDashboardQueries(currentUser?.id);

  // Configuration d'un écouteur spécifique pour les contributeurs avec haute priorité
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
          
          // Stocker le timestamp de l'événement pour éviter les doubles traitements
          setLastContributorEvent(Date.now());
          
          // Force le rechargement immédiat des données du dashboard
          queryClient.invalidateQueries({ 
            queryKey: ["dashboard-data"],
            exact: false,
            refetchType: 'all' // Force un rechargement complet
          });
          
          // Rafraîchir les données immédiatement et avec insistance
          setTimeout(() => {
            refetchDashboard();
          }, 100);
          
          // Notification visuelle pour informer l'utilisateur
          if (payload.eventType === 'INSERT') {
            toast.success("Contributeur ajouté avec succès");
          } else if (payload.eventType === 'UPDATE') {
            toast.success("Contributeur mis à jour");
          } else if (payload.eventType === 'DELETE') {
            toast.success("Contributeur supprimé");
          }
        }
      )
      .subscribe((status) => {
        console.log(`Canal contributeurs ${channelId} status:`, status);
      });
    
    // Stocker la référence du canal
    contributorsChannelRef.current = channel;
    
    return () => {
      if (contributorsChannelRef.current) {
        supabase.removeChannel(contributorsChannelRef.current);
        contributorsChannelRef.current = null;
      }
    };
  }, [currentUser?.id, queryClient, refetchDashboard]);

  // Forcer un rafraîchissement périodique si nécessaire
  useEffect(() => {
    if (!currentUser?.id) return;

    // Si nous avons eu un événement de contributeur dans les 5 dernières secondes, 
    // forcer un rafraîchissement pour s'assurer que tout est à jour
    if (lastContributorEvent > 0 && Date.now() - lastContributorEvent < 5000) {
      const timeoutId = setTimeout(() => {
        console.log("Rafraîchissement forcé après événement contributeur");
        refetchDashboard();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentUser?.id, lastContributorEvent, refetchDashboard]);

  // Wrapped in useCallback to prevent recreation on each render
  const refetch = useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]);

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    savingsProjects: dashboardData?.savingsProjects || [],
    refetch,
  };
};
