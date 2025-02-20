
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";

export const useRetailers = () => {
  return useQuery({
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
    staleTime: 0, // Toujours considérer les données comme périmées
    refetchOnMount: true, // Recharger à chaque montage
    refetchOnWindowFocus: true // Recharger quand la fenêtre reprend le focus
  });
};
