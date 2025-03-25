
import { supabase } from "@/integrations/supabase/client";
import { ExpenseFormData } from "./types";
import { toast } from "sonner";

export const useExpenseForm = (onSuccess?: () => void) => {
  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      const { error } = await supabase.from("expenses").insert({
        retailer_id: data.retailerId,
        amount: parseFloat(data.amount),
        date: data.date,
        comment: data.comment || null
      });

      if (error) {
        console.error("Error adding expense:", error);
        toast.error("Erreur lors de l'ajout de la dépense");
        throw error;
      }

      toast.success("Dépense ajoutée avec succès");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in submit operation:", error);
      throw error;
    }
  };

  return {
    handleSubmit
  };
};
