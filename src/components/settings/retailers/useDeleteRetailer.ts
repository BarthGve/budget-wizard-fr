
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Retailer } from "./types";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: deleteRetailer, isPending: isDeleting } = useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("Starting deletion of retailer:", retailerId);
      
      // Suppression des dépenses associées d'abord
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("retailer_id", retailerId);

      if (expensesError) {
        console.error("Error deleting expenses:", expensesError);
        throw expensesError;
      }

      // Puis suppression de l'enseigne
      const { error: retailerError } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (retailerError) {
        console.error("Error deleting retailer:", retailerError);
        throw retailerError;
      }

      console.log("Retailer deleted successfully:", retailerId);
      return retailerId;
    },
    onSuccess: async (deletedRetailerId) => {
      // Forcer une revalidation complète immédiatement
      await queryClient.invalidateQueries({ 
        queryKey: ["retailers"],
        refetchType: "all",
        exact: true
      });
      
      toast.success("Enseigne supprimée avec succès");
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    },
  });

  return {
    deleteRetailer,
    isDeleting,
  };
};
