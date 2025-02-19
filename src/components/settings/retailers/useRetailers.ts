
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Retailer } from "./types";

export const useRetailers = () => {
  const { data: retailers, isLoading } = useQuery({
    queryKey: ["retailers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .order("name");

      if (error) {
        toast.error("Erreur lors du chargement des enseignes");
        throw error;
      }

      return data as Retailer[];
    }
  });

  return {
    retailers: retailers || [],
    isLoading
  };
};
