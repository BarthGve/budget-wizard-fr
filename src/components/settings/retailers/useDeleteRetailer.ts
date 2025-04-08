import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/useToastWrapper";

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
      
      // Transaction manuelle dans un ordre précis
      try {
        // 1. D'abord suppression des dépenses associées
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
  
        // 2. Puis suppression de l'enseigne elle-même
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
        
        // Retourner l'ID pour usage dans onSuccess
        return retailerId;
      } catch (error) {
        console.error("❌ Error during deletion process:", error);
        throw error;
      }
    },
    onSuccess: (_, retailerId) => {
      console.log("✅ Mutation completed successfully for retailer:", retailerId);
      
      // Invalider les requêtes dans un ordre précis avec de petits délais
      // pour éviter les conditions de course
      
      // 1. D'abord les données des retailers
      queryClient.invalidateQueries({ 
        queryKey: ["retailers"],
        exact: false,
        refetchType: 'all'
      });
      
      // 2. Attendre un court instant puis invalider les données qui dépendent des retailers
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          queryKey: ["expenses"],
          exact: false,
          refetchType: 'all'
        });
        
        queryClient.invalidateQueries({ 
          queryKey: ["all-expenses-for-stats"],
          exact: false,
          refetchType: 'all'
        });
        
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-data"],
          exact: false,
          refetchType: 'all'
        });
        
        // Forcer un rerender complet dans React Query v5
        queryClient.refetchQueries({ 
          queryKey: ["retailers"], 
          exact: false,
          type: 'all'
        });
      }, 100);
      
      // Notification de succès supprimée
      toast.success("Enseigne supprimée avec succès");
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      toast.error("Erreur lors de la suppression de l'enseigne");
    }
  });
};
