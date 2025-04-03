
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/vehicle";

interface UseVehicleOptions {
  enabled?: boolean;
}

export const useVehicle = (vehicleId: string, options: UseVehicleOptions = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;
      
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error) {
        throw error;
      }

      return data as Vehicle;
    },
    enabled: enabled && !!vehicleId
  });
};
