
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExpenseFormData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

export function useExpenseForm(onExpenseAdded: () => void) {
  const queryClient = useQueryClient();

  const handleSubmit = async (values: ExpenseFormData) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Vous devez être connecté pour ajouter une dépense");
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .insert({
          retailer_id: values.retailerId,
          amount: Number(values.amount),
          date: values.date,
          comment: values.comment,
          profile_id: session.session.user.id,
        });

      if (error) throw error;

      toast.success("La dépense a été ajoutée");
      
      // Invalidation de toutes les requêtes liées aux dépenses
      queryClient.invalidateQueries({ 
        queryKey: ["expenses"],
        exact: false
      });
      
      // Invalidation des requêtes spécifiques au détaillant
      queryClient.invalidateQueries({ 
        queryKey: ["retailer-expenses", values.retailerId],
        exact: false
      });
      
      // Invalidation des statistiques globales des dépenses
      queryClient.invalidateQueries({ 
        queryKey: ["expenses-stats"],
        exact: false
      });
      
      onExpenseAdded();
      return true;
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Impossible d'ajouter la dépense");
      return false;
    }
  };

  return {
    handleSubmit,
  };
}
