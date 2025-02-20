
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("🚀 Deleting retailer:", retailerId);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Delete associated expenses first
      const { error: expensesError } = await supabase
        .from("expenses")
        .delete()
        .eq("retailer_id", retailerId)
        .eq("profile_id", user?.id);

      if (expensesError) {
        console.error("❌ Error deleting expenses:", expensesError);
        throw expensesError;
      }

      // Then delete the retailer
      const { error: retailerError } = await supabase
        .from("retailers")
        .delete()
        .eq("id", retailerId)
        .eq("profile_id", user?.id);

      if (retailerError) {
        console.error("❌ Error deleting retailer:", retailerError);
        throw retailerError;
      }

      console.log("✅ Retailer deleted successfully");
      return retailerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      toast.success("Enseigne supprimée avec succès");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("❌ Error in deletion:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });
};
