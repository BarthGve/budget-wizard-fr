
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      console.log("Starting onSuccess callback...");
      
      // Force invalidate the cache
      await queryClient.invalidateQueries({ queryKey: ["retailers"] });
      
      // Force refetch
      await queryClient.refetchQueries({ queryKey: ["retailers"] });
      
      console.log("Queries invalidated and refetched");
      
      toast.success("Enseigne supprimée avec succès");
      
      if (onSuccess) {
        console.log("Calling onSuccess callback...");
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
