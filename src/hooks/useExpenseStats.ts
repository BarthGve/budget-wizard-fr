
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState, useEffect } from "react";

/**
 * Hook pour récupérer les statistiques des dépenses
 */
export const useExpenseStats = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Obtenir le premier et dernier jour du mois courant
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Formatage des dates pour Supabase
  const firstDayFormatted = firstDayOfMonth.toISOString().split('T')[0];
  const lastDayFormatted = lastDayOfMonth.toISOString().split('T')[0];

  // Requête pour les dépenses du mois courant
  const { data: currentMonthExpenses, isLoading: isLoadingMonthlyExpenses } = useQuery({
    queryKey: ["current-month-expenses", currentUser?.id, firstDayFormatted],
    queryFn: async () => {
      if (!currentUser) throw new Error("Utilisateur non authentifié");

      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .eq("profile_id", currentUser.id.toString()) // Conversion de l'ID en chaîne de caractères
        .gte("date", firstDayFormatted)
        .lte("date", lastDayFormatted);

      if (error) throw error;

      // Calculer le total des dépenses
      const total = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return {
        total,
        count: data.length
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Requête pour les dépenses de carburant des véhicules actifs
  const { data: vehicleFuelExpenses, isLoading: isLoadingFuelExpenses } = useQuery({
    queryKey: ["vehicle-fuel-expenses", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error("Utilisateur non authentifié");

      // D'abord récupérer les véhicules actifs
      const { data: vehicles, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("id")
        .eq("profile_id", currentUser.id.toString()) // Conversion de l'ID en chaîne de caractères
        .eq("status", "actif");

      if (vehiclesError) throw vehiclesError;
      
      if (!vehicles || vehicles.length === 0) {
        return { total: 0, count: 0 };
      }

      // Récupérer les dépenses de carburant pour ces véhicules
      const vehicleIds = vehicles.map(v => v.id);
      const { data: expenses, error: expensesError } = await supabase
        .from("vehicle_expenses")
        .select("amount")
        .in("vehicle_id", vehicleIds)
        .eq("expense_type", "carburant");

      if (expensesError) throw expensesError;

      // Calculer le total des dépenses de carburant
      const total = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      return {
        total,
        count: expenses.length
      };
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["current-month-expenses"] });
    queryClient.invalidateQueries({ queryKey: ["vehicle-fuel-expenses"] });
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Effet pour nettoyer l'état
  useEffect(() => {
    return () => {
      setIsRefreshing(false);
    };
  }, []);

  return {
    currentMonthExpenses: currentMonthExpenses || { total: 0, count: 0 },
    vehicleFuelExpenses: vehicleFuelExpenses || { total: 0, count: 0 },
    isLoading: isLoadingMonthlyExpenses || isLoadingFuelExpenses || isRefreshing,
    refreshData
  };
};
