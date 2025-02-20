
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";

export const useRetailers = () => {
  const query = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      console.log("🔄 Fetching retailers...");
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .order("name");

      if (error) {
        console.error("❌ Error fetching retailers:", error);
        toast.error("Erreur lors du chargement des enseignes");
        throw error;
      }

      console.log("✅ Retailers fetched successfully, count:", data?.length);
      return data as Retailer[];
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    retailers: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error
  };
};
