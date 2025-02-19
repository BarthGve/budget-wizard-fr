
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: deleteRetailer, isPending: isDeleting } = useMutation({
    mutationFn: async (retailerId: string) => {
      const { error } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      toast.success("Enseigne supprimée avec succès");
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error deleting retailer:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    },
  });

  return {
    deleteRetailer,
    isDeleting,
  };
};
