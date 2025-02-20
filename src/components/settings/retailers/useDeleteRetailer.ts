
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("🚀 Deleting retailer:", retailerId);
      
      // Delete associated expenses first
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("retailer_id", retailerId);

      if (expensesError) {
        console.error("❌ Error deleting expenses:", expensesError);
        throw expensesError;
      }

      // Then delete the retailer
      const { error: retailerError } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (retailerError) {
        console.error("❌ Error deleting retailer:", retailerError);
        throw retailerError;
      }

      return retailerId;
    },
    onSuccess: (_, retailerId) => {
      // Invalider le cache pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      
      toast.success("Enseigne supprimée avec succès");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("❌ Error in deletion:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });
};
