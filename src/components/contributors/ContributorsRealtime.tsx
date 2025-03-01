
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ContributorsRealtime = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Configuration d'un écouteur Supabase unique avec cleanup approprié
  useEffect(() => {
    // Nettoyer le channel précédent s'il existe
    if (channelRef.current) {
      console.log('Removing existing contributors channel');
      supabase.removeChannel(channelRef.current);
    }
    
    const channelId = `contributors-realtime-${Date.now()}`;
    console.log(`Setting up realtime subscription with channel ID: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'contributors'
        },
        () => {
          // Invalider uniquement la requête des contributeurs sans recharger toute la page
          queryClient.invalidateQueries({ queryKey: ["contributors"] });
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime status for contributors: ${status}`);
      });

    // Stocker la référence du channel
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log(`Cleaning up channel: ${channelId}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  return null;
};
