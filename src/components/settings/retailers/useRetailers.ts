
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export const useRetailers = () => {
  const { profile } = usePagePermissions();
  
  // Make retailers accessible for all authenticated users
  const canAccessRetailers = !!profile; // If profile exists, user is authenticated

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      if (!canAccessRetailers) {
        return [];
      }

      console.log("🔄 Fetching retailers...");
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq('profile_id', user?.id)
        .order("name");

      if (error) {
        console.error("❌ Error fetching retailers:", error);
        toast.error("Erreur lors du chargement des enseignes");
        throw error;
      }

      console.log("✅ Retailers fetched successfully, count:", data?.length);
      return data as Retailer[];
    },
    enabled: canAccessRetailers // L'appel API ne sera effectué que si l'utilisateur a les permissions
  });

  return {
    retailers: data || [],
    isLoading,
    isError,
    error
  };
};
