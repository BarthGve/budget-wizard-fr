
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook pour la gestion des mises à jour en temps réel
export const useRealtimeUpdates = (refetch: () => void) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (channelRef.current) {
      console.log('Suppression du canal existant dans DashboardLayout');
      supabase.removeChannel(channelRef.current);
    }
    
    const channel = supabase
      .channel('dashboard-layout-' + Date.now())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributeurs modifiés depuis DashboardLayout, invalidation des requêtes');
          queryClient.invalidateQueries({ 
            queryKey: ['dashboard-data'],
            refetchType: 'active'
          });
          
          queryClient.invalidateQueries({ 
            queryKey: ['contributors'],
            refetchType: 'active'
          });

          // Utiliser un délai légèrement plus long pour assurer que les requêtes soient invalidées
          setTimeout(() => {
            refetch();
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log('État du canal DashboardLayout:', status);
      });
      
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log('Nettoyage du canal dans DashboardLayout démontage');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient, refetch]);
};
