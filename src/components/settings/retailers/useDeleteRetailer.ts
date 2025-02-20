
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: deleteRetailer, isPending: isDeleting } = useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("🚀 Starting deletion process for retailer:", retailerId);
      
      // Suppression des dépenses associées d'abord
      console.log("📝 Deleting associated expenses...");
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("retailer_id", retailerId);

      if (expensesError) {
        console.error("❌ Error deleting expenses:", expensesError);
        throw expensesError;
      }
      console.log("✅ Associated expenses deleted");

      // Puis suppression de l'enseigne
      console.log("🏪 Deleting retailer...");
      const { error: retailerError } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (retailerError) {
        console.error("❌ Error deleting retailer:", retailerError);
        throw retailerError;
      }
      console.log("✅ Retailer deleted");

      return retailerId;
    },
    onSuccess: (deletedRetailerId) => {
      console.log("✨ Deletion successful, updating cache...");
      
      // Mettre à jour le cache en filtrant le retailer supprimé
      queryClient.setQueryData<any[]>(["retailers"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(retailer => retailer.id !== deletedRetailerId);
      });

      toast.success("Enseigne supprimée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("❌ Error in deleteRetailer mutation:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });

  return {
    deleteRetailer,
    isDeleting
  };
};
