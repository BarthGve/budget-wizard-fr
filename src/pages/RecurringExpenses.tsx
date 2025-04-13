
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { RecurringExpensesContainer } from "@/components/recurring-expenses/RecurringExpensesContainer";
import { RecurringExpense } from "@/components/recurring-expenses/types";
import { RecurringExpensesSkeleton } from "@/components/recurring-expenses/skeletons/RecurringExpensesSkeleton";

// Utilisation de memo pour éviter les re-renders inutiles
const RecurringExpenses = memo(function RecurringExpenses() {
  const queryClient = useQueryClient();
  
  // Configuration optimisée de la requête
  const {
    data: recurringExpenses,
    isLoading
  } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos charges récurrentes");
        throw new Error("Not authenticated");
      }
      const {
        data,
        error
      } = await supabase.from("recurring_expenses").select("*").order("created_at", {
        ascending: true
      });
      if (error) {
        console.error("Error fetching recurring expenses:", error);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw error;
      }
      return data as RecurringExpense[];
    },
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes to prevent unnecessary refetches
    refetchOnWindowFocus: false, // Disable refetching when window gains focus
    refetchOnReconnect: false, // Désactiver le refetch à la reconnexion
    retry: 1 // Only retry once on failure
  });

  // Optimiser avec useCallback pour éviter les recréations de fonctions
  const handleDeleteExpense = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("recurring_expenses").delete().eq("id", id);
      if (error) throw error;
      
      // Invalidation ciblée
      queryClient.invalidateQueries({
        queryKey: ["recurring-expenses"],
        exact: true
      });
      
      toast.success("Dépense supprimée avec succès");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  }, [queryClient]);

  if (isLoading) {
    return <RecurringExpensesSkeleton />;
  }

  return (
    <div className="w-full max-w-full px-0 sm:px-2">
      <RecurringExpensesContainer 
        recurringExpenses={recurringExpenses || []} 
        onDeleteExpense={handleDeleteExpense} 
      />
    </div>
  );
});

export default RecurringExpenses;
