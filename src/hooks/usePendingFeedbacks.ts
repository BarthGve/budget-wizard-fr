
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

/**
 * Hook pour vérifier si des feedbacks sont en attente
 * @returns Le nombre de feedbacks en attente
 */
export const usePendingFeedbacks = (isAdmin: boolean) => {
  const queryClient = useQueryClient();

  // Configuration d'un écouteur en temps réel pour les changements de feedbacks
  useEffect(() => {
    if (!isAdmin) return;

    // Création d'un canal pour écouter les changements dans la table feedbacks
    const channel = supabase
      .channel("feedbacks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",  // Écouter tous les types d'événements (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "feedbacks",
        },
        () => {
          // Invalider la requête pour forcer un rechargement des données
          queryClient.invalidateQueries({ queryKey: ["pending-feedbacks-count"] });
        }
      )
      .subscribe();

    // Nettoyage de l'écouteur à la destruction du composant
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, queryClient]);

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
