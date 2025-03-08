
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

export const useRealtimeListeners = () => {
  const queryClient = useQueryClient();
  
  // Utiliser des refs pour stocker les références des canaux
  const channelsRef = useRef<{
    contributors: any | null;
    monthlySavings: any | null;
    projects: any | null;
    recurringExpenses: any | null;
    profiles: any | null; // Ajout d'un canal pour les profils
  }>({
    contributors: null,
    monthlySavings: null,
    projects: null,
    recurringExpenses: null,
    profiles: null // Initialisation du nouveau canal
  });

  // Fonction d'invalidation optimisée pour cibler uniquement les données nécessaires
  const invalidateDashboardData = () => {
    queryClient.invalidateQueries({ 
      queryKey: ["dashboard-data"],
      exact: false,
      refetchType: 'all' // Refetch toutes les requêtes, pas seulement les actives
    });
  };

  // Fonction réutilisable pour configurer un canal avec gestion optimisée
  const setupChannel = (tableName: string, channelKey: keyof typeof channelsRef.current, additionalInvalidations?: string[]) => {
    // Nettoyer le canal existant si nécessaire
    if (channelsRef.current[channelKey]) {
      supabase.removeChannel(channelsRef.current[channelKey]);
      channelsRef.current[channelKey] = null;
    }

    // Créer un nouvel ID de canal unique
    const channelId = `${tableName}-channel-${Date.now()}`;
    
    // Configurer le nouveau canal
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log(`${tableName} changed:`, payload.eventType);
          
          // Invalidation ciblée des données
          invalidateDashboardData();
          
          // Invalidations supplémentaires si spécifiées
          if (additionalInvalidations) {
            additionalInvalidations.forEach(key => {
              queryClient.invalidateQueries({ 
                queryKey: [key],
                exact: false, 
                refetchType: 'all' // Refetch toutes les requêtes
              });
            });
          }
        }
      )
      .subscribe();
    
    // Stocker la référence du canal
    channelsRef.current[channelKey] = channel;
  };

  // Configuration des écouteurs pour les contributeurs
  useEffect(() => {
    setupChannel('contributors', 'contributors', ['contributors']);
    
    return () => {
      if (channelsRef.current.contributors) {
        supabase.removeChannel(channelsRef.current.contributors);
        channelsRef.current.contributors = null;
      }
    };
  }, [queryClient]); // queryClient est stable

  // Configuration des écouteurs pour les épargnes mensuelles
  useEffect(() => {
    setupChannel('monthly_savings', 'monthlySavings', ['savings-projects']);
    
    return () => {
      if (channelsRef.current.monthlySavings) {
        supabase.removeChannel(channelsRef.current.monthlySavings);
        channelsRef.current.monthlySavings = null;
      }
    };
  }, [queryClient]);

  // Configuration des écouteurs pour les projets d'épargne
  useEffect(() => {
    setupChannel('projets_epargne', 'projects', ['savings-projects']);
    
    return () => {
      if (channelsRef.current.projects) {
        supabase.removeChannel(channelsRef.current.projects);
        channelsRef.current.projects = null;
      }
    };
  }, [queryClient]);

  // Configuration des écouteurs pour les dépenses récurrentes
  useEffect(() => {
    setupChannel('recurring_expenses', 'recurringExpenses');
    
    return () => {
      if (channelsRef.current.recurringExpenses) {
        supabase.removeChannel(channelsRef.current.recurringExpenses);
        channelsRef.current.recurringExpenses = null;
      }
    };
  }, [queryClient]);

  // Écouteur pour les mises à jour des profils
  useEffect(() => {
    setupChannel('profiles', 'profiles', ['profile']);
    
    return () => {
      if (channelsRef.current.profiles) {
        supabase.removeChannel(channelsRef.current.profiles);
        channelsRef.current.profiles = null;
      }
    };
  }, [queryClient]);
};
