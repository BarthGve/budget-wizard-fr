
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteRetailer, isPending: isDeleting } = useMutation({
    mutationFn: async (retailerId: string) => {
      // Suppression des dépenses associées d'abord
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("retailer_id", retailerId);

      if (expensesError) {
        throw expensesError;
      }

      // Puis suppression de l'enseigne
      const { error: retailerError } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (retailerError) {
        throw retailerError;
      }

      return retailerId;
    },
    onSuccess: () => {
      toast.success("Enseigne supprimée avec succès");
      // Forcer un rafraîchissement de la query retailers
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });

  return {
    deleteRetailer,
    isDeleting
  };
};
