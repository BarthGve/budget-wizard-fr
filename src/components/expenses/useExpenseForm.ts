
import { supabase } from "@/integrations/supabase/client";
import { ExpenseFormData } from "./types";
import { toast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useExpenseForm = (onSuccess?: () => void) => {
  const { currentUser } = useCurrentUser();

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      if (!currentUser) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une dépense",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from("expenses").insert({
        retailer_id: data.retailerId,
        amount: parseFloat(data.amount),
        date: data.date,
        comment: data.comment || null,
        profile_id: currentUser.id // Ajout de l'ID du profil utilisateur
      });

      if (error) {
        console.error("Error adding expense:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de l'ajout de la dépense",
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Succès",
        description: "Dépense ajoutée avec succès"
      });
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
