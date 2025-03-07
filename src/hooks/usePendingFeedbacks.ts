
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook pour vérifier si des feedbacks sont en attente
 * @returns Le nombre de feedbacks en attente
 */
export const usePendingFeedbacks = (isAdmin: boolean) => {
  const { data: pendingCount = 0, isLoading } = useQuery({
    queryKey: ["pending-feedbacks-count"],
    queryFn: async () => {
      if (!isAdmin) return 0;
      
      const { count, error } = await supabase
        .from("feedbacks")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      
      if (error) {
        console.error("Erreur lors du comptage des feedbacks en attente:", error);
        return 0;
      }
      
      return count || 0;
    },
    // Vérifier toutes les 5 minutes
    refetchInterval: 1000 * 60 * 5,
    // Désactiver la requête si l'utilisateur n'est pas admin
    enabled: isAdmin,
  });

  return {
    pendingCount,
    isLoading
  };
};
