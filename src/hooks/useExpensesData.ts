
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useRef } from "react";

export const useExpensesData = () => {
  const queryClient = useQueryClient();
  const channelsRef = useRef<{ [key: string]: any }>({});

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
      
      console.log("Fetching expenses data...");
      
      const {
        data,
        error
      } = await supabase.from("expenses").select("*").eq("profile_id", user.id);
      
      if (error) {
        console.error("Error fetching expenses:", error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length} expenses successfully`);
      return data;
    },
    staleTime: 1000 * 30, // Réduire à 30 secondes pour des mises à jour plus fréquentes
    refetchOnWindowFocus: true, // Activer le refetch au focus
    refetchOnMount: true,
    refetchOnReconnect: true, // Activer le refetch à la reconnexion
  });

  // Configuration d'écouteurs spécifiques pour les changements dans les tables importantes
  useEffect(() => {
    console.log("Setting up realtime listeners for expenses data");
    
    // Nettoyage des canaux existants
    const cleanupChannels = () => {
      Object.values(channelsRef.current).forEach((channel: any) => {
        if (channel) {
          console.log(`Removing channel: ${channel.topic}`);
          supabase.removeChannel(channel);
        }
      });
      channelsRef.current = {};
    };

    // Créer un canal pour les dépenses
    const expensesChannel = supabase
      .channel(`expenses-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log(`Change detected in expenses:`, payload);
          
          // Forcer le rechargement des données des dépenses
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            refetchType: 'all'
          });
        }
      )
      .subscribe((status) => {
        console.log(`Expenses channel status: ${status}`);
      });
    
    // Créer un canal pour les enseignes
    const retailersChannel = supabase
      .channel(`retailers-expenses-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'retailers'
        },
        (payload) => {
          console.log(`Change detected in retailers:`, payload);
          
          // Forcer le rechargement des données des dépenses quand une enseigne change
          queryClient.invalidateQueries({ 
            queryKey: ["expenses"],
            refetchType: 'all'
          });
        }
      )
      .subscribe((status) => {
        console.log(`Retailers-expenses channel status: ${status}`);
      });
    
    // Stocker les références des canaux pour le nettoyage
    channelsRef.current = {
      expenses: expensesChannel,
      retailers: retailersChannel
    };
    
    return () => {
      console.log("Cleaning up expense data listeners");
      cleanupChannels();
    };
  }, [queryClient]);

  // Fonction de rafraîchissement explicite optimisée avec debounce simple
  const handleExpenseUpdated = useCallback(() => {
    console.log("Manual expense refresh requested");
    queryClient.invalidateQueries({
      queryKey: ["expenses"],
      exact: true
    });
  }, [queryClient]);

  return {
    expenses,
    isLoading,
    handleExpenseUpdated,
    refetchExpenses: refetch
  };
};
