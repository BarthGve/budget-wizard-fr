
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (retailerId: string) => {
      // Suppression des dépenses d'abord
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("retailer_id", retailerId);

      if (expensesError) throw expensesError;

      // Puis suppression de l'enseigne
      const { error: retailerError } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (retailerError) throw retailerError;

      return retailerId;
    },
    onSuccess: () => {
      // Force un refetch immédiat
      queryClient.refetchQueries({
        queryKey: ["retailers"],
        exact: true,
        type: 'all'
      });
      
      toast.success("Enseigne supprimée avec succès");
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });
};
