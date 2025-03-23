
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useEffect, useCallback } from "react";

export const useRetailers = () => {
  const { profile } = usePagePermissions();
  const queryClient = useQueryClient();
  
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
    staleTime: 1000 * 30, // Réduit à 30 secondes pour des mises à jour plus fréquentes
    refetchOnWindowFocus: true, // Activer le refetch automatique au focus
  });

  // Configuration d'un écouteur spécifique pour les modifications en temps réel
  useEffect(() => {
    if (!canAccessRetailers) return;

    console.log("⚡ Setting up realtime listener for retailers table");
    
    const retailersChannel = supabase
      .channel(`retailers-changes-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'retailers'
        },
        (payload) => {
          console.log("🔔 Retailer change detected:", payload);
          
          // Force invalidation et rechargement immédiat des requêtes pertinentes
          queryClient.invalidateQueries({ 
            queryKey: ["retailers"],
            refetchType: 'all'
          });
          
          // Invalider également les requêtes expenses qui peuvent dépendre des retailers
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            refetchType: 'all'
          });
        }
      )
      .subscribe((status) => {
        console.log(`Retailers channel status: ${status}`);
      });
    
    return () => {
      console.log("🛑 Removing retailers realtime listener");
      supabase.removeChannel(retailersChannel);
    };
  }, [canAccessRetailers, queryClient]);

  // Fonction de rafraîchissement explicite à exposer au composant
  const refetchRetailers = useCallback(async () => {
    console.log("🔄 Manually refreshing retailers data");
    
    try {
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
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
