
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook pour vérifier si des feedbacks sont en attente
 * @returns Le nombre de feedbacks en attente
 */
export const usePendingFeedbacks = () => {
  const { data: pendingCount = 0, isLoading } = useQuery({
    queryKey: ["pending-feedbacks-count"],
    queryFn: async () => {
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
  });

  return {
    pendingCount,
    isLoading
  };
};
