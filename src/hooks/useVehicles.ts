
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useVehicles = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  // Récupérer la liste des véhicules
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("profile_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Vehicle[];
    },
    enabled: !!currentUser
  });

  // Fonction utilitaire pour supprimer les charges récurrentes associées à un véhicule
  const deleteRecurringExpenses = async (vehicleId: string) => {
    // Récupérer les charges récurrentes associées
    const { data: recurringExpenses, error: fetchError } = await supabase
      .from("recurring_expenses")
      .select("id, name")
      .eq("vehicle_id", vehicleId);
    
    if (fetchError) {
      console.error("Erreur lors de la récupération des charges récurrentes:", fetchError);
      return { success: false, count: 0, expenses: [] };
    }
    
    if (!recurringExpenses || recurringExpenses.length === 0) {
      return { success: true, count: 0, expenses: [] };
    }
    
    // Supprimer les charges récurrentes
    const { error: deleteError } = await supabase
      .from("recurring_expenses")
      .delete()
      .eq("vehicle_id", vehicleId);
    
    if (deleteError) {
      console.error("Erreur lors de la suppression des charges récurrentes:", deleteError);
      return { success: false, count: 0, expenses: [] };
    }
    
    return { 
      success: true, 
      count: recurringExpenses.length,
      expenses: recurringExpenses.map(expense => expense.name)
    };
  };

  // Ajouter un véhicule
  const { mutate: addVehicle, isPending: isAdding } = useMutation({
    mutationFn: async (vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">) => {
      if (!currentUser) throw new Error("User not authenticated");

      const vehicleWithProfileId = {
        ...vehicle,
        profile_id: currentUser.id
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

  // Marquer un véhicule comme vendu
  const { mutate: markVehicleAsSold, isPending: isMarking } = useMutation({
    mutationFn: async (id: string) => {
      // Supprimer les charges récurrentes associées avant de marquer comme vendu
      const recurringResult = await deleteRecurringExpenses(id);

      // Mettre à jour le statut du véhicule
      const { data, error } = await supabase
        .from("vehicles")
        .update({ status: "vendu" })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { vehicle: data as Vehicle, recurringResult };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      
      toast.success("Véhicule marqué comme vendu avec succès");
      
      // Afficher une notification concernant les charges récurrentes supprimées
      if (data.recurringResult.count > 0) {
        toast.info(
          `${data.recurringResult.count} charge(s) récurrente(s) associée(s) à ce véhicule ont été supprimées`,
          { 
            description: data.recurringResult.expenses.join(", "),
            duration: 5000
          }
        );
      }
    },
    onError: (error: any) => {
      console.error("Error marking vehicle as sold:", error);
      toast.error(`Erreur lors du marquage du véhicule comme vendu: ${error.message}`);
    }
  });

  // Supprimer un véhicule
  const { mutate: deleteVehicle, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      // Supprimer les charges récurrentes associées avant de supprimer le véhicule
      const recurringResult = await deleteRecurringExpenses(id);

      // Supprimer le véhicule
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return { vehicleId: id, recurringResult };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      
      toast.success("Véhicule supprimé avec succès");
      
      // Afficher une notification concernant les charges récurrentes supprimées
      if (data.recurringResult.count > 0) {
        toast.info(
          `${data.recurringResult.count} charge(s) récurrente(s) associée(s) à ce véhicule ont été supprimées`,
          { 
            description: data.recurringResult.expenses.join(", "),
            duration: 5000
          }
        );
      }
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
    isDeleting,
    markVehicleAsSold,
    isMarking
  };
};
