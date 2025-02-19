
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate: deleteRetailer, isPending: isDeleting } = useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("🚀 Starting deletion process for retailer:", retailerId);
      
      try {
        // Suppression des dépenses associées d'abord
        console.log("📝 Deleting associated expenses...");
        const { error: expensesError, data: deletedExpenses } = await supabase
          .from("expenses")
          .delete()
          .eq("retailer_id", retailerId)
          .select();

        if (expensesError) {
          console.error("❌ Error deleting expenses:", expensesError);
          throw expensesError;
        }
        console.log("✅ Associated expenses deleted:", deletedExpenses);

        // Puis suppression de l'enseigne
        console.log("🏪 Deleting retailer...");
        const { error: retailerError, data: deletedRetailer } = await supabase
          .from("retailers")
          .delete()
          .eq("id", retailerId)
          .select();

        if (retailerError) {
          console.error("❌ Error deleting retailer:", retailerError);
          throw retailerError;
        }
        console.log("✅ Retailer deleted:", deletedRetailer);

        return retailerId;
      } catch (error) {
        console.error("❌ Unexpected error during deletion:", error);
        throw error;
      }
    },
    onMutate: (retailerId) => {
      console.log("🔄 Mutation starting for retailer:", retailerId);
    },
    onSuccess: (data) => {
      console.log("✨ Deletion successful, retailerId:", data);
      console.log("🔄 Invalidating retailers query cache...");
      
      try {
        // Invalider le cache immédiatement
        queryClient.invalidateQueries({ queryKey: ["retailers"] });
        console.log("✅ Cache invalidated successfully");
        
        toast.success("Enseigne supprimée avec succès");
        
        // Appeler le callback onSuccess si fourni
        if (onSuccess) {
          console.log("📞 Calling onSuccess callback...");
          onSuccess();
          console.log("✅ onSuccess callback completed");
        }
      } catch (error) {
        console.error("❌ Error in onSuccess handler:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("❌ Error in deleteRetailer mutation:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    },
    onSettled: () => {
      console.log("🏁 Mutation settled, final cleanup...");
    }
  });

  return {
    deleteRetailer,
    isDeleting
  };
};
