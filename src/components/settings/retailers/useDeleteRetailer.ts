
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteRetailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (retailerId: string) => {
      console.log("🚀 Starting retailer deletion process:", retailerId);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("❌ User error:", userError);
        throw userError;
      }
      
      console.log("✅ User found, proceeding with deletion");
      
      try {
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
  
        console.log("✅ Associated expenses deleted");
  
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
      } catch (error) {
        console.error("❌ Error during deletion process:", error);
        throw error;
      }
    },
    onSuccess: (_, retailerId) => {
      console.log("✅ Mutation completed successfully for retailer:", retailerId);
      
      // Force invalider toutes les requêtes pertinentes immédiatement
      queryClient.invalidateQueries({ 
        queryKey: ["retailers"],
        refetchType: 'all' 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["expenses"],
        refetchType: 'all' 
      });
      
      // Invalider aussi les statistiques qui pourraient utiliser ces données
      queryClient.invalidateQueries({ 
        queryKey: ["all-expenses-for-stats"],
        refetchType: 'all'
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard-data"],
        refetchType: 'all'
      });
      
      toast.success("Enseigne supprimée avec succès");
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });
};
