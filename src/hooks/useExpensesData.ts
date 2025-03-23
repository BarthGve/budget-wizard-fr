
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useRef } from "react";

export const useExpensesData = () => {
  const queryClient = useQueryClient();
  const channelsRef = useRef<{ [key: string]: any }>({});
  const pendingRefreshRef = useRef<any>(null);

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
    staleTime: 5000, // 5 secondes au lieu de 10
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  // Fonction utilitaire pour éviter les actualisations multiples rapprochées
  const debouncedInvalidation = useCallback((queryKey: string) => {
    // Annuler tout rafraîchissement en attente
    if (pendingRefreshRef.current) {
      clearTimeout(pendingRefreshRef.current);
    }
    
    // Programmer un nouveau rafraîchissement
    pendingRefreshRef.current = setTimeout(() => {
      console.log(`Invalidating ${queryKey} after debounce`);
      queryClient.invalidateQueries({ 
        queryKey: [queryKey],
        exact: false,
        refetchType: 'all'
      });
      pendingRefreshRef.current = null;
    }, 200);
  }, [queryClient]);

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

    // Création d'identifiants uniques basés sur le timestamp
    const expensesChannelId = `expenses-realtime-${Date.now()}`;
    const retailersChannelId = `retailers-expenses-${Date.now()}`;

    // Créer un canal pour les dépenses
    const expensesChannel = supabase
      .channel(expensesChannelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log(`Change detected in expenses:`, payload.eventType);
          debouncedInvalidation("expenses");
        }
      )
      .subscribe((status) => {
        console.log(`Expenses channel status: ${status}`);
      });
    
    // Créer un canal pour les enseignes
    const retailersChannel = supabase
      .channel(retailersChannelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'retailers'
        },
        (payload) => {
          console.log(`Change detected in retailers:`, payload.eventType);
          
          // Délai pour s'assurer que les dépendances sont mises à jour correctement
          setTimeout(() => {
            debouncedInvalidation("expenses");
          }, 300);
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
      
      // Nettoyer également tout rafraîchissement en attente
      if (pendingRefreshRef.current) {
        clearTimeout(pendingRefreshRef.current);
        pendingRefreshRef.current = null;
      }
    };
  }, [queryClient, debouncedInvalidation]);

  // Fonction de rafraîchissement explicite avec force refetch
  const handleExpenseUpdated = useCallback(() => {
    console.log("Manual expense refresh requested");
    // Annuler tout rafraîchissement en attente
    if (pendingRefreshRef.current) {
      clearTimeout(pendingRefreshRef.current);
    }
    
    // Forcer un rafraîchissement complet
    queryClient.invalidateQueries({
      queryKey: ["expenses"],
      exact: false,
      refetchType: 'all'
    });
  }, [queryClient]);

  // Fonction de rafraîchissement plus directive
  const forceRefetchExpenses = useCallback(async () => {
    console.log("Force refetching expenses data");
    try {
      await refetch();
      console.log("Expenses refetched successfully");
    } catch (error) {
      console.error("Error during forced expenses refetch:", error);
    }
  }, [refetch]);

  return {
    expenses,
    isLoading,
    handleExpenseUpdated,
    refetchExpenses: forceRefetchExpenses
  };
};
