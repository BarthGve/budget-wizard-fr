
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseDeleteRetailerProps {
  onSuccess: () => void;
}

export const useDeleteRetailer = ({ onSuccess }: UseDeleteRetailerProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRetailer = async (retailerId: string) => {
    try {
      setIsDeleting(true);

      // Vérifier si l'enseigne a des dépenses associées
      const { data: hasExpenses, error: checkError } = await supabase
        .rpc('retailer_has_expenses', { p_retailer_id: retailerId });

      if (checkError) throw checkError;

      if (hasExpenses) {
        toast.error("Impossible de supprimer cette enseigne car elle a des dépenses associées");
        return;
      }

      const { error } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (error) throw error;

      toast.success("Enseigne supprimée avec succès");
      onSuccess();
    } catch (error) {
      console.error("Error deleting retailer:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteRetailer,
    isDeleting
  };
};
