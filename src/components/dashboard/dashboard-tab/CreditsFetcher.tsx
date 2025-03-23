
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Credit } from "@/components/credits/types";

/**
 * Hook qui récupère les crédits depuis Supabase
 */
export const useCreditsFetcher = () => {
  return useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data as Credit[];
    },
    staleTime: 1000 * 30, // Réduit à 30 secondes pour plus de réactivité
    refetchOnWindowFocus: true, // Activer le rechargement lors du focus
    refetchOnReconnect: true, // Activer le rechargement lors de la reconnexion
  });
};
