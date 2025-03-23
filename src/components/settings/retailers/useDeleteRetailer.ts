
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
      
      // Envelopper le tout dans une transaction manuelle pour s'assurer que tout est supprimé correctement
      try {
        // D'abord suppression des dépenses associées
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
  
        // Puis suppression de l'enseigne elle-même
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
      
      // Invalider immédiatement toutes les requêtes pertinentes
      // Ordre important: d'abord les données qui dépendent des retailers
      queryClient.invalidateQueries({ 
        queryKey: ["expenses"],
        exact: false,
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["all-expenses-for-stats"],
        exact: false,
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard-data"],
        exact: false,
      });
      
      // Puis les données des retailers elles-mêmes
      queryClient.invalidateQueries({ 
        queryKey: ["retailers"],
        exact: false,
      });
      
      // Notification de succès
      toast.success("Enseigne supprimée avec succès");
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });
};
