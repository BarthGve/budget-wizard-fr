
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleExpense } from "@/types/vehicle";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useVehicleExpenses = (vehicleId: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();

  // Récupérer la liste des dépenses d'un véhicule
  const { data: expenses, isLoading, error, refetch } = useQuery({
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
    enabled: !!currentUser && !!vehicleId,
    staleTime: 1000 * 10, // Réduire le temps de cache à 10 secondes
    refetchOnWindowFocus: true // Activer le refetch automatique au focus
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
      // Forcer l'invalidation complète de la requête
      queryClient.invalidateQueries({ 
        queryKey: ["vehicle-expenses", vehicleId],
        refetchType: 'all'
      });
      
      // Refetch immédiat pour s'assurer que les données sont à jour
      refetch();
      
      toast.success("Dépense ajoutée avec succès");
    },
    onError: (error: any) => {
      console.error("Error adding expense:", error);
      toast.error(`Erreur lors de l'ajout de la dépense: ${error.message}`);
    }
  });

  // Mettre à jour une dépense
  const { mutate: updateExpense, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...expense }: VehicleExpense) => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("vehicle_expenses")
        .update(expense)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as VehicleExpense;
    },
    onSuccess: () => {
      // Forcer l'invalidation complète de la requête
      queryClient.invalidateQueries({ 
        queryKey: ["vehicle-expenses", vehicleId],
        refetchType: 'all'
      });
      
      // Refetch immédiat pour s'assurer que les données sont à jour
      refetch();
      
      toast.success("Dépense mise à jour avec succès");
    },
    onError: (error: any) => {
      console.error("Error updating expense:", error);
      toast.error(`Erreur lors de la mise à jour de la dépense: ${error.message}`);
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
      // Forcer l'invalidation complète de la requête
      queryClient.invalidateQueries({ 
        queryKey: ["vehicle-expenses", vehicleId],
        refetchType: 'all'
      });
      
      // Refetch immédiat pour s'assurer que les données sont à jour
      refetch();
      
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
    updateExpense,
    isUpdating,
    deleteExpense,
    isDeleting,
    refetch
  };
};
