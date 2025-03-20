
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
    profiles: any | null;
    expenses: any | null;
    vehicleExpenses: any | null;
  }>({
    contributors: null,
    monthlySavings: null,
    projects: null,
    recurringExpenses: null,
    profiles: null,
    expenses: null,
    vehicleExpenses: null
  });

  // Fonction d'invalidation optimisée pour cibler uniquement les données nécessaires
  const invalidateDashboardData = () => {
    console.log("Invalidation forcée des données du dashboard");
    
    // Invalider toutes les données du dashboard avec une priorité élevée
    queryClient.invalidateQueries({ 
      queryKey: ["dashboard-data"],
      refetchType: 'all', // Forcer un rechargement complet
      exact: false
    });
    
    // Forcer le rafraîchissement immédiat pour la mise à jour globale
    setTimeout(() => {
      queryClient.refetchQueries({ 
        queryKey: ["dashboard-data"],
        exact: false,
        type: 'all'
      });
      
      // Invalider également d'autres requêtes potentiellement affectées
      queryClient.invalidateQueries({ 
        queryKey: ["contributors"],
        exact: false, 
        refetchType: 'all'
      });
      
      // Ajouter l'invalidation pour les credits qui affectent le solde global
      queryClient.invalidateQueries({ 
        queryKey: ["credits"],
        exact: false, 
        refetchType: 'all'
      });
    }, 100);
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
          
          // Invalidation forcée des données pour tous les événements
          if (tableName !== 'vehicle_expenses') {
            invalidateDashboardData();
          }
          
          // Invalidations supplémentaires si spécifiées
          if (additionalInvalidations) {
            additionalInvalidations.forEach(key => {
              queryClient.invalidateQueries({ 
                queryKey: [key],
                exact: false, 
                refetchType: 'all' // Forcer le rechargement
              });
            });
          }
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal ${tableName}:`, status);
      });
    
    // Stocker la référence du canal
    channelsRef.current[channelKey] = channel;
  };

  // Configuration des écouteurs pour les contributeurs avec priorité maximale
  useEffect(() => {
    setupChannel('contributors', 'contributors');
    
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
    // Utiliser les invalidations de credits pour mettre à jour le solde global
    setupChannel('recurring_expenses', 'recurringExpenses', ['credits', 'dashboard-data']);
    
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

  // Écouteur spécifique pour les dépenses
  useEffect(() => {
    // Configuration de l'écouteur avec invalidation des requêtes liées aux dépenses
    setupChannel('expenses', 'expenses', ['expenses', 'retailer-expenses', 'dashboard-data']);
    
    return () => {
      if (channelsRef.current.expenses) {
        supabase.removeChannel(channelsRef.current.expenses);
        channelsRef.current.expenses = null;
      }
    };
  }, [queryClient]);

  // Configuration spécifique et optimisée des écouteurs pour les dépenses de véhicules
  useEffect(() => {
    // Nettoyer le canal existant si nécessaire
    if (channelsRef.current.vehicleExpenses) {
      supabase.removeChannel(channelsRef.current.vehicleExpenses);
      channelsRef.current.vehicleExpenses = null;
    }

    // Créer un ID de canal unique
    const vehicleExpenseChannelId = `vehicle-expenses-channel-${Date.now()}`;
    
    // Configurer un canal spécifique pour les dépenses de véhicules
    const channel = supabase
      .channel(vehicleExpenseChannelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'vehicle_expenses'
        },
        (payload) => {
          console.log(`vehicle_expenses changed:`, payload.eventType, payload);
          
          // Invalidation immédiate ciblée des dépenses de véhicules
          queryClient.invalidateQueries({ 
            queryKey: ["vehicle-expenses"],
            exact: false,
            refetchType: 'all' // Forcer le rechargement complet
          });
          
          // Si un vehicleId est disponible dans la charge utile, invalider spécifiquement ce véhicule
          if (payload.new && payload.new.vehicle_id) {
            queryClient.invalidateQueries({ 
              queryKey: ["vehicle-expenses", payload.new.vehicle_id],
              exact: true,
              refetchType: 'all'
            });
          }
          
          // Si un ancien vehicleId est disponible (lors d'une suppression), invalider également
          if (payload.old && payload.old.vehicle_id) {
            queryClient.invalidateQueries({ 
              queryKey: ["vehicle-expenses", payload.old.vehicle_id],
              exact: true,
              refetchType: 'all'
            });
          }
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal vehicle_expenses:`, status);
      });
    
    // Stocker la référence du canal
    channelsRef.current.vehicleExpenses = channel;
    
    return () => {
      if (channelsRef.current.vehicleExpenses) {
        supabase.removeChannel(channelsRef.current.vehicleExpenses);
        channelsRef.current.vehicleExpenses = null;
      }
    };
  }, [queryClient]);
};
