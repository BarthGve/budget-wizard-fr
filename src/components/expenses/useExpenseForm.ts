
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExpenseFormData } from "./types";

export function useExpenseForm(onExpenseAdded: () => void) {
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
