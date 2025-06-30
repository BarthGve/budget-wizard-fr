
import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";

/**
 * Gestionnaire centralisé des canaux temps réel
 * Un seul canal par utilisateur pour éviter la surcharge
 */
export const useRealtimeManager = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  // Fonction d'invalidation intelligente
  const smartInvalidate = useCallback((table: string, eventType: string) => {
    console.log(`🔄 Invalidation intelligente: ${table} - ${eventType}`);
    
    switch (table) {
      case 'contributors':
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-optimized"],
          exact: false 
        });
        break;
        
      case 'expenses':
        queryClient.invalidateQueries({ 
          queryKey: ["expenses-optimized"],
          exact: false 
        });
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-optimized"],
          exact: false 
        });
        break;
        
      case 'recurring_expenses':
      case 'monthly_savings':
      case 'credits':
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-optimized"],
          exact: false 
        });
        break;
        
      default:
        // Invalidation générale pour les tables non spécifiées
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-optimized"],
          exact: false 
        });
    }
  }, [queryClient]);

  useEffect(() => {
    if (!currentUser?.id) return;

    // Nettoyer le canal existant
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    console.log("🔄 Configuration du gestionnaire temps réel optimisé");

    // Canal unique consolidé pour toutes les modifications utilisateur
    const channel = supabase
      .channel(`realtime-manager-${currentUser.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'contributors', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => smartInvalidate('contributors', payload.eventType)
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'expenses', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => smartInvalidate('expenses', payload.eventType)
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'recurring_expenses', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => smartInvalidate('recurring_expenses', payload.eventType)
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'monthly_savings', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => smartInvalidate('monthly_savings', payload.eventType)
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'credits', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => smartInvalidate('credits', payload.eventType)
      )
      .subscribe((status) => {
        console.log(`Gestionnaire temps réel: ${status}`);
      });

    channelRef.current = channel;

    return () => {
      console.log("🛑 Fermeture du gestionnaire temps réel");
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUser?.id, smartInvalidate]);

  return {
    isConnected: !!channelRef.current
  };
};
