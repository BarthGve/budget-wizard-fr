
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook qui configure un écouteur temps réel pour les mises à jour de la table crédits
 */
export const useCreditsRealtimeListener = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Nettoyer l'ancien canal s'il existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Configurer un nouvel écouteur temps réel
    const channel = supabase
      .channel('credits-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credits'
        },
        (payload) => {
          console.log('Mise à jour crédits en temps réel:', payload);
          
          // Invalider les requêtes associées aux crédits
          queryClient.invalidateQueries({ 
            queryKey: ['credits'],
            exact: true
          });
          queryClient.invalidateQueries({ 
            queryKey: ['credits-monthly-stats'],
            exact: true
          });
        }
      )
      .subscribe(status => {
        console.log('Statut de connexion temps réel crédits:', status);
      });

    channelRef.current = channel;

    // Nettoyage lors du démontage du composant
    return () => {
      if (channelRef.current) {
        console.log('Nettoyage du canal crédits');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);
};
