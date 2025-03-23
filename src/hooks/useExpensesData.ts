
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect } from "react";

export const useExpensesData = () => {
  const queryClient = useQueryClient();

  // Configuration optimisée de la requête
  const {
    data: expenses,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      const {
        data,
        error
      } = await supabase.from("expenses").select("*").eq("profile_id", user.id);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Garder les données fraîches pendant 5 minutes
    refetchOnWindowFocus: false, // Désactiver le refetch au focus de la fenêtre
    refetchOnMount: true,
    refetchOnReconnect: false, // Désactiver le refetch à la reconnexion
  });

  // Configuration d'un écouteur spécifique pour les changements dans la table des dépenses
  useEffect(() => {
    console.log("Mise en place de l'écouteur pour les dépenses sur la page expenses");
    
    const channel = supabase
      .channel(`expenses-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log(`Changement détecté dans les dépenses:`, payload);
          
          // Forcer le rechargement des données des dépenses
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            exact: false,
            refetchType: 'all' // Forcer le rechargement
          });
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal expenses-realtime:`, status);
      });
    
    // Configurer également l'écoute pour les enseignes qui affectent les dépenses
    const retailersChannel = supabase
      .channel(`retailers-expenses-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'retailers'
        },
        (payload) => {
          console.log(`Changement détecté dans les enseignes:`, payload);
          
          // Forcer le rechargement des données des dépenses quand une enseigne change
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            exact: false,
            refetchType: 'all' // Forcer le rechargement
          });
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal retailers-expenses:`, status);
      });
    
    return () => {
      console.log("Nettoyage des écouteurs expenses-realtime et retailers-expenses");
      supabase.removeChannel(channel);
      supabase.removeChannel(retailersChannel);
    };
  }, [queryClient]);

  // Optimiser avec useCallback pour éviter les recréations de fonctions
  const handleExpenseUpdated = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["expenses"],
      exact: true // Invalidation ciblée uniquement
    });
  }, [queryClient]);

  return {
    expenses,
    isLoading,
    handleExpenseUpdated,
    refetchExpenses: refetch
  };
};
