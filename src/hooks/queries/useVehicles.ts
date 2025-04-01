
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useVehicles = () => {
  const { currentUser } = useCurrentUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("profile_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des véhicules");
        throw error;
      }

      return data as Vehicle[];
    },
    enabled: !!currentUser
  });

  return {
    data,
    isLoading,
    error
  };
};
