
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";

export const useRetailers = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
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
    }
  });

  return {
    retailers: data || [],
    isLoading,
    isError,
    error
  };
};
