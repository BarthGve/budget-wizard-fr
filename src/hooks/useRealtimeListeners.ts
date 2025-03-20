import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRealtimeListeners = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for changes in the contributors table
    const contributorsChannel = supabase
      .channel('contributors')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributeurs modifiés, invalidation des requêtes');
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
          queryClient.invalidateQueries({ queryKey: ['contributors'] });
          toast.success("Les contributeurs ont été mis à jour en temps réel !");
        }
      )
      .subscribe();

    // Listen for changes in the monthly_savings table
    const savingsChannel = supabase
      .channel('monthly_savings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monthly_savings'
        },
        (payload) => {
          console.log('Épargnes mensuelles modifiées, invalidation des requêtes');
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
          queryClient.invalidateQueries({ queryKey: ['monthly_savings'] });
          toast.success("L'épargne mensuelle a été mise à jour en temps réel !");
        }
      )
      .subscribe();

    // Listen for changes in the recurring_expenses table
    const expensesChannel = supabase
      .channel('recurring_expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recurring_expenses'
        },
        (payload) => {
          console.log('Dépenses récurrentes modifiées, invalidation des requêtes');
          queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
          queryClient.invalidateQueries({ queryKey: ['recurring_expenses'] });
          toast.success("Les dépenses récurrentes ont été mises à jour en temps réel !");
        }
      )
      .subscribe();
      
    // Listen for changes in the expenses table
    const expensesTableChannel = supabase
      .channel('expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log('Dépenses modifiées, invalidation des requêtes');
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          
          // Dans l'event handler des dépenses
          queryClient.invalidateQueries({ 
            queryKey: ["all-expenses-for-stats"],
            exact: false, 
            refetchType: 'all'
          });
          
          // Pour les dépenses de véhicules, mettre à jour pour inclure les périodes
          queryClient.invalidateQueries({ 
            queryKey: ["period-fuel-expenses"],
            exact: false, 
            refetchType: 'all'
          });
          
          toast.success("Les dépenses ont été mises à jour en temps réel !");
        }
      )
      .subscribe();

    // Listen for changes in the vehicle_expenses table
    const vehicleExpensesChannel = supabase
      .channel('vehicle_expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_expenses'
        },
        (payload) => {
          console.log('Dépenses de véhicules modifiées, invalidation des requêtes');
          queryClient.invalidateQueries({ queryKey: ['vehicle_expenses'] });
          toast.success("Les dépenses de véhicules ont été mises à jour en temps réel !");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(contributorsChannel);
      supabase.removeChannel(savingsChannel);
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(expensesTableChannel);
      supabase.removeChannel(vehicleExpensesChannel);
    };
  }, [queryClient]);
};
