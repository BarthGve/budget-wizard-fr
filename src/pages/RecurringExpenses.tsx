
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import StyledLoader from "@/components/ui/StyledLoader";
import { RecurringExpensesContainer } from "@/components/recurring-expenses/RecurringExpensesContainer";
import { RecurringExpense } from "@/components/recurring-expenses/types";
import { RecurringExpensesHeader } from "@/components/recurring-expenses/RecurringExpensesHeader";
import { motion } from "framer-motion";

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
    return <StyledLoader />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="page-container" 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      <RecurringExpensesHeader />
      <div className="section-container">
        <RecurringExpensesContainer 
          recurringExpenses={recurringExpenses || []} 
          onDeleteExpense={handleDeleteExpense} 
        />
      </div>
    </motion.div>
  );
});

export default RecurringExpenses;
