
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useEffect, useCallback, useRef, useState } from "react";

export const useRetailers = () => {
  const { profile } = usePagePermissions();
  const queryClient = useQueryClient();
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [lastRefetchTimestamp, setLastRefetchTimestamp] = useState(0);
  
  // Vérifier si l'utilisateur est authentifié
  const canAccessRetailers = !!profile;

  const fetchRetailers = useCallback(async () => {
    if (!canAccessRetailers) {
      return [];
    }

    console.log("🔄 Fetching retailers...");
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from("retailers")
      .select("*")
      .eq('profile_id', user?.id)
      .order("name");

    if (error) {
      console.error("❌ Error fetching retailers:", error);
      toast.error("Erreur lors du chargement des enseignes");
      throw error;
    }

    console.log("✅ Retailers fetched successfully, count:", data?.length);
    return data as Retailer[];
  }, [canAccessRetailers]);

  // Configuration optimisée de la requête avec des données stables
  const queryResult = useQuery({
    queryKey: ["retailers"],
    queryFn: fetchRetailers,
    enabled: canAccessRetailers,
    staleTime: 5000, // 5 secondes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  
  const { data, isLoading, isError, error } = queryResult;

  // Configuration d'un écouteur spécifique pour les modifications en temps réel
  useEffect(() => {
    if (!canAccessRetailers) return;

    console.log("⚡ Setting up realtime listener for retailers table");
    
    // Nettoyage des écouteurs précédents si nécessaires
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    
    // Nouvel écouteur avec un identifiant unique basé sur le timestamp
    const channelId = `retailers-changes-${Date.now()}`;
    const retailersChannel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'retailers'
        },
        (payload) => {
          // Correction ici: Vérification de type appropriée pour les objets new et old
          const newId = payload.new && typeof payload.new === 'object' && 'id' in payload.new ? payload.new.id : undefined;
          const oldId = payload.old && typeof payload.old === 'object' && 'id' in payload.old ? payload.old.id : undefined;
          
          console.log("🔔 Retailer change detected:", payload.eventType, newId || oldId || 'unknown');
          
          // Temporiser pour laisser la transaction se terminer complètement
          setTimeout(() => {
            // Actualiser les données des retailers
            queryClient.invalidateQueries({ 
              queryKey: ["retailers"],
              exact: false,
              refetchType: 'all'
            });
            
            // Puis actualiser les données qui en dépendent
            setTimeout(() => {
              queryClient.invalidateQueries({ 
                queryKey: ["expenses"],
                exact: false,
                refetchType: 'all'
              });
              
              queryClient.invalidateQueries({ 
                queryKey: ["dashboard-data"],
                exact: false,
                refetchType: 'all'
              });
            }, 100);
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log(`Retailers channel status: ${status}`);
      });
    
    // Stocker la référence pour le nettoyage
    realtimeChannelRef.current = retailersChannel;
    
    return () => {
      console.log("🛑 Removing retailers realtime listener");
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [canAccessRetailers, queryClient]);

  // Fonction de rafraîchissement avec anti-rebond pour éviter les appels multiples trop rapides
  const refetchRetailers = useCallback(async () => {
    const now = Date.now();
    // Éviter les rafraîchissements multiples dans un court laps de temps (300ms)
    if (now - lastRefetchTimestamp < 300) {
      console.log("⏱️ Skipping refetch, too soon after last refetch");
      return;
    }
    
    setLastRefetchTimestamp(now);
    console.log("🔄 Manually refreshing retailers data");
    
    try {
      // Forcer une invalidation avec refetchType: 'all' pour garantir un rechargement complet
      await queryClient.invalidateQueries({ 
        queryKey: ["retailers"],
        exact: false,
        refetchType: 'all'
      });
      
      // Forcer un refetch explicite après l'invalidation
      await queryClient.refetchQueries({
        queryKey: ["retailers"],
        exact: false,
        type: 'all'
      });
      
      console.log("✅ Retailers data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing retailers data:", error);
    }
  }, [queryClient, lastRefetchTimestamp]);

  return {
    retailers: data || [],
    isLoading,
    isError,
    error,
    refetchRetailers
  };
};
