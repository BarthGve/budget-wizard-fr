
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./useCurrentUser";

/**
 * Hook optimisé pour la gestion des canaux temps réel
 * Un seul canal par utilisateur pour éviter la surcharge
 */
export const useRealtimeOptimized = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    // Nettoyer le canal existant
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    console.log("🔄 Configuration du canal temps réel optimisé");

    // Canal unique pour toutes les modifications utilisateur
    const channel = supabase
      .channel(`user-updates-${currentUser.id}`)
      // Contributors
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'contributors', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => {
          console.log("👥 Contributeur modifié:", payload.eventType);
          // Invalidation ciblée
          queryClient.invalidateQueries({ 
            queryKey: ["optimized-dashboard"],
            exact: false 
          });
        }
      )
      // Expenses
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'expenses', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => {
          console.log("💰 Dépense modifiée:", payload.eventType);
          queryClient.invalidateQueries({ 
            queryKey: ["paginated-expenses"],
            exact: false 
          });
          queryClient.invalidateQueries({ 
            queryKey: ["optimized-dashboard"],
            exact: false 
          });
        }
      )
      // Recurring expenses
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'recurring_expenses', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => {
          console.log("🔄 Charge récurrente modifiée:", payload.eventType);
          queryClient.invalidateQueries({ 
            queryKey: ["optimized-dashboard"],
            exact: false 
          });
        }
      )
      // Credits
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'credits', 
          filter: `profile_id=eq.${currentUser.id}` 
        },
        (payload) => {
          console.log("🏦 Crédit modifié:", payload.eventType);
          queryClient.invalidateQueries({ 
            queryKey: ["credits"],
            exact: false 
          });
          queryClient.invalidateQueries({ 
            queryKey: ["optimized-dashboard"],
            exact: false 
          });
        }
      )
      .subscribe((status) => {
        console.log(`Canal temps réel: ${status}`);
      });

    channelRef.current = channel;

    return () => {
      console.log("🛑 Fermeture du canal temps réel");
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUser?.id, queryClient]);

  return {
    isConnected: !!channelRef.current
  };
};
