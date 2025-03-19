
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleExpense } from "@/types/vehicle";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useVehicleExpenses = (vehicleId: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  // Récupérer la liste des dépenses d'un véhicule
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ["vehicle-expenses", vehicleId],
    queryFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicle_expenses")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      return data as VehicleExpense[];
    },
    enabled: !!currentUser && !!vehicleId
  });

  // Ajouter une dépense
  const { mutate: addExpense, isPending: isAdding } = useMutation({
    mutationFn: async (expense: Omit<VehicleExpense, "id">) => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicle_expenses")
        .insert(expense)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as VehicleExpense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-expenses", vehicleId] });
      toast.success("Dépense ajoutée avec succès");
    },
    onError: (error: any) => {
      console.error("Error adding expense:", error);
      toast.error(`Erreur lors de l'ajout de la dépense: ${error.message}`);
    }
  });

  // Supprimer une dépense
  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vehicle_expenses")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-expenses", vehicleId] });
      toast.success("Dépense supprimée avec succès");
    },
    onError: (error: any) => {
      console.error("Error deleting expense:", error);
      toast.error(`Erreur lors de la suppression de la dépense: ${error.message}`);
    }
  });

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    isAdding,
    deleteExpense,
    isDeleting
  };
};
