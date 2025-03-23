
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

export const useVehicleDetail = (vehicleId: string) => {
  const { data: vehicle, isLoading, error, refetch } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error) {
        console.error("Error fetching vehicle:", error);
        toast.error("Erreur lors du chargement du véhicule");
        throw error;
      }

      return data as Vehicle;
    },
    enabled: !!vehicleId
  });

  return {
    vehicle,
    isLoading,
    error,
    refetch
  };
};
