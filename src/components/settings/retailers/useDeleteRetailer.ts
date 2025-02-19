
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: deleteRetailer, isPending: isDeleting } = useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("Deleting retailer:", retailerId);
      
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

      return retailerId;
    },
    onSuccess: (data) => {
      console.log("Retailer deleted successfully:", data);
      toast.success("Enseigne supprimée avec succès");
      // Forcer un rafraîchissement de la query retailers
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      // Appeler le callback onSuccess si fourni
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error in deleteRetailer mutation:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });

  return {
    deleteRetailer,
    isDeleting
  };
};
