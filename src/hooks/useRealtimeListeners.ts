
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook pour configurer tous les écouteurs en temps réel nécessaires pour l'application
 * Centralise la logique des écouteurs pour éviter les duplications
 */
export const useRealtimeListeners = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Ne rien faire si aucun utilisateur n'est connecté
    if (!user) return;
    
    console.log("Configuration des écouteurs en temps réel pour l'utilisateur:", user.id);
    
    // Nettoyer un canal existant si nécessaire
    if (channelRef.current) {
      console.log("Nettoyage du canal existant");
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    // Créer un canal unique avec un timestamp pour éviter les conflits
    const channelId = `realtime-${Date.now()}`;
    
    // Configurer les écouteurs pour les tables pertinentes
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors',
          filter: user ? `profile_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log("Changement détecté sur la table contributors:", payload);
          // Invalider les requêtes pertinentes
          queryClient.invalidateQueries({ queryKey: ['contributors'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recurring_expenses',
          filter: user ? `profile_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log("Changement détecté sur la table recurring_expenses:", payload);
          // Invalider les requêtes pertinentes
          queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monthly_savings',
          filter: user ? `profile_id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log("Changement détecté sur la table monthly_savings:", payload);
          // Invalider les requêtes pertinentes
          queryClient.invalidateQueries({ queryKey: ['monthly-savings'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: user ? `id=eq.${user.id}` : undefined
        },
        (payload) => {
          console.log("Changement détecté sur la table profiles:", payload);
          // Invalider les requêtes pertinentes
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['current-profile'] });
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        }
      )
      .subscribe((status) => {
        console.log(`État du canal ${channelId}:`, status);
      });
    
    // Stocker la référence du canal
    channelRef.current = channel;
    
    // Nettoyer à la désinstallation
    return () => {
      if (channelRef.current) {
        console.log("Nettoyage du canal au démontage");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, queryClient]);
};
