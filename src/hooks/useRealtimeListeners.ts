
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook pour configurer les écouteurs de mises à jour en temps réel
 */
export function useRealtimeListeners() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Configurer les écouteurs pour les tables importantes
    const contributorsChannel = supabase
      .channel('contributors-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'contributors' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['contributors'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    const expensesChannel = supabase
      .channel('expenses-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    const recurringExpensesChannel = supabase
      .channel('recurring-expenses-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'recurring_expenses' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    const savingsChannel = supabase
      .channel('savings-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'monthly_savings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['savings'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
        }
      )
      .subscribe();

    // Nettoyage lors du démontage du composant
    return () => {
      contributorsChannel.unsubscribe();
      expensesChannel.unsubscribe();
      recurringExpensesChannel.unsubscribe();
      savingsChannel.unsubscribe();
    };
  }, [queryClient]);
}
