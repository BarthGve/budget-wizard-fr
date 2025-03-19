
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useVehicles = () => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  // Récupérer la liste des véhicules
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Vehicle[];
    },
    enabled: !!user
  });

  // Ajouter un véhicule
  const { mutate: addVehicle, isPending: isAdding } = useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">) => {
      if (!user) throw new Error("User not authenticated");

      const vehicleWithProfileId = {
        ...vehicle,
        profile_id: user.id
      };

      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehicleWithProfileId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Véhicule ajouté avec succès");
    },
    onError: (error: any) => {
      console.error("Error adding vehicle:", error);
      toast.error(`Erreur lors de l'ajout du véhicule: ${error.message}`);
    }
  });

  // Mettre à jour un véhicule
  const { mutate: updateVehicle, isPending: isUpdating } = useMutation({
    mutationFn: async (vehicle: Partial<Vehicle> & { id: string }) => {
      const { id, ...updates } = vehicle;
      const { data, error } = await supabase
        .from("vehicles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Véhicule mis à jour avec succès");
    },
    onError: (error: any) => {
      console.error("Error updating vehicle:", error);
      toast.error(`Erreur lors de la mise à jour du véhicule: ${error.message}`);
    }
  });

  // Supprimer un véhicule
  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Véhicule supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Error deleting vehicle:", error);
      toast.error(`Erreur lors de la suppression du véhicule: ${error.message}`);
    }
  });

  return {
    vehicles,
    isLoading,
    error,
    addVehicle,
    isAdding,
    updateVehicle,
    isUpdating,
    deleteVehicle,
    isDeleting
  };
};
