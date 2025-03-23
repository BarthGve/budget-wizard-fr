
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useEffect, useCallback, useRef } from "react";

export const useRetailers = () => {
  const { profile } = usePagePermissions();
  const queryClient = useQueryClient();
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  
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

  // Configuration optimisée de la requête
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["retailers"],
    queryFn: fetchRetailers,
    enabled: canAccessRetailers,
    staleTime: 1000 * 10, // Réduit à 10 secondes pour des mises à jour plus fréquentes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Configuration d'un écouteur spécifique pour les modifications en temps réel
  useEffect(() => {
    if (!canAccessRetailers) return;

    console.log("⚡ Setting up realtime listener for retailers table");
    
    // Nettoyage des écouteurs précédents si nécessaire
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
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
          console.log("🔔 Retailer change detected:", payload);
          
          // Forcer l'invalidation et le rechargement immédiat
          // Temporiser légèrement pour laisser la transaction se terminer complètement
          setTimeout(() => {
            queryClient.invalidateQueries({ 
              queryKey: ["retailers"],
              exact: false,
              refetchType: 'active'
            });
            
            // Invalider également les requêtes expenses qui peuvent dépendre des retailers
            queryClient.invalidateQueries({ 
              queryKey: ["expenses"],
              exact: false,
              refetchType: 'active'
            });
          }, 200);
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

  // Fonction de rafraîchissement explicite pour forcer un rechargement complet
  const refetchRetailers = useCallback(async () => {
    console.log("🔄 Manually refreshing retailers data");
    
    try {
      // Forcer un rechargement complet avec refetchType: 'all'
      await queryClient.invalidateQueries({ 
        queryKey: ["retailers"],
        exact: false,
        refetchType: 'all'
      });
      
      // Puis forcer un nouveau fetch explicite
      await refetch();
      
      console.log("✅ Retailers data refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing retailers data:", error);
    }
  }, [refetch, queryClient]);

  return {
    retailers: data || [],
    isLoading,
    isError,
    error,
    refetchRetailers
  };
};
