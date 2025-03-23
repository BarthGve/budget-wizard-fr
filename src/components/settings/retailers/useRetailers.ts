
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useEffect } from "react";

export const useRetailers = () => {
  const { profile } = usePagePermissions();
  const queryClient = useQueryClient();
  
  // Make retailers accessible for all authenticated users
  const canAccessRetailers = !!profile; // If profile exists, user is authenticated

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
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
    },
    enabled: canAccessRetailers // L'appel API ne sera effectué que si l'utilisateur a les permissions
  });

  // Configurer l'écoute des modifications en temps réel sur la table retailers
  useEffect(() => {
    if (!canAccessRetailers) return;

    console.log("⚡ Setting up realtime listener for retailers table");
    
    const channel = supabase
      .channel('retailers-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'retailers'
        },
        (payload) => {
          console.log("🔔 Retailer change detected:", payload);
          // Invalider les requêtes retailers et expenses pour forcer leur rafraîchissement
          queryClient.invalidateQueries({ queryKey: ["retailers"] });
          queryClient.invalidateQueries({ queryKey: ["expenses"] });
        }
      )
      .subscribe();

    return () => {
      console.log("🛑 Removing retailers realtime listener");
      supabase.removeChannel(channel);
    };
  }, [canAccessRetailers, queryClient]);

  return {
    retailers: data || [],
    isLoading,
    isError,
    error,
    refetchRetailers: refetch
  };
};
