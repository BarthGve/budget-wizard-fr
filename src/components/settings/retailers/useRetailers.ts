
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";

export const useRetailers = () => {
  const { data: retailers, isLoading, refetch } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      console.log("Fetching retailers...");
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching retailers:", error);
        toast.error("Erreur lors du chargement des enseignes");
        throw error;
      }

      console.log("Retailers fetched:", data);
      return data as Retailer[];
    },
    staleTime: 0, // Les données sont toujours considérées comme périmées
    gcTime: 0, // Pas de mise en cache (anciennement cacheTime)
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return {
    retailers: retailers || [],
    isLoading,
    refetchRetailers: refetch
  };
};
