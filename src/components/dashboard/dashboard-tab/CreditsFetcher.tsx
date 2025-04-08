
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";
import { useAuthContext } from "@/context/AuthProvider";

/**
 * Hook qui récupère les crédits depuis Supabase
 */
export const useCreditsFetcher = () => {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      if (!user) {
        console.log("useCreditsFetcher: Utilisateur non authentifié");
        return [];
      }
      
      console.log("useCreditsFetcher: Récupération des crédits pour", user.id);
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des crédits:", error);
        return [];
      }

      console.log("useCreditsFetcher: Données récupérées", data?.length || 0, "crédits");
      return data as Credit[];
    },
    staleTime: 1000 * 15, // Réduit à 15 secondes pour plus de réactivité
    refetchOnWindowFocus: true, // Activer le rechargement lors du focus
    refetchOnReconnect: true, // Activer le rechargement lors de la reconnexion
    enabled: !!user, // N'exécuter que si l'utilisateur est authentifié
  });
};
