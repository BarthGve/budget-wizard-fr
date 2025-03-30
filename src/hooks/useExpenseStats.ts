
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";

export const useExpenseStats = (viewMode: "monthly" | "yearly" = "monthly") => {
  const { currentUser } = useCurrentUser();

  // Obtenir les dates de début et fin selon la période sélectionnée
  const now = new Date();
  
  // Pour les statistiques mensuelles
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  // Pour les statistiques annuelles
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  
  // Sélection des dates selon le mode de vue
  const firstDay = viewMode === "monthly" ? firstDayOfMonth : firstDayOfYear;
  const lastDay = viewMode === "monthly" ? lastDayOfMonth : lastDayOfYear;
  
  const firstDayStr = firstDay.toISOString().split('T')[0];
  const lastDayStr = lastDay.toISOString().split('T')[0];

  // Récupérer TOUTES les dépenses
  const { data: allExpenses, isLoading: isExpensesLoading } = useQuery({
    queryKey: ["all-expenses-for-stats", viewMode],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("profile_id", currentUser.id);

      if (error) {
        console.error("Error fetching all expenses:", error);
        return [];
      }

      return data;
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 10, // 10 secondes pour une réactivité accrue
    refetchOnWindowFocus: true,
  });

  // Filtrer les dépenses selon la période sélectionnée
  const filteredExpenses = allExpenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= firstDay && expenseDate <= lastDay;
  }) || [];
  
  // Calculer le total des dépenses pour la période sélectionnée
  const expensesTotal = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  const periodLabel = viewMode === "monthly" ? "mois en cours" : "année en cours";
  console.log(`Total dépenses ${periodLabel}: ${expensesTotal}€ (${filteredExpenses.length} dépenses)`);

  // Vérifier s'il y a des véhicules actifs
  const { data: activeVehicles, isLoading: isVehiclesLoading } = useQuery({
    queryKey: ["active-vehicles-check"],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const { data, error } = await supabase
        .from("vehicles")
        .select("id")
        .eq("profile_id", currentUser.id)
        .eq("status", "actif");

      if (error) {
        console.error("Error fetching active vehicles:", error);
        return [];
      }

      return data;
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60, // 1 minute pour une réactivité accrue
  });

  const hasActiveVehicles = activeVehicles && activeVehicles.length > 0;

  // Récupérer les dépenses carburant pour la période sélectionnée
  const { data: fuelExpenses, isLoading: isFuelLoading } = useQuery({
    queryKey: ["period-fuel-expenses", viewMode, firstDayStr, lastDayStr],
    queryFn: async () => {
      if (!currentUser?.id) return { total: 0, count: 0, volume: 0 };
      
      // Modification pour inclure les véhicules vendus (status: 'vendu')
      const { data, error } = await supabase
        .from("vehicle_expenses")
        .select("amount, fuel_volume, vehicles!inner(profile_id, status)")
        .eq("vehicles.profile_id", currentUser.id)
        .in("vehicles.status", ["actif", "vendu"]) // Inclure les véhicules vendus
        .eq("expense_type", "carburant")
        .gte("date", firstDayStr)
        .lte("date", lastDayStr);

      if (error) {
        console.error("Error fetching fuel expenses:", error);
        return { total: 0, count: 0, volume: 0 };
      }

      const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const volume = data.reduce((sum, expense) => sum + Number(expense.fuel_volume || 0), 0);
      
      console.log(`Total dépenses carburant ${periodLabel} (véhicules actifs et vendus): ${total}€ (${data.length} dépenses)`);
      
      return { 
        total, 
        count: data.length,
        volume
      };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 10, // 10 secondes pour une réactivité accrue
    refetchOnWindowFocus: true,
  });

  return {
    expensesTotal,
    fuelExpensesTotal: fuelExpenses?.total || 0,
    fuelExpensesCount: fuelExpenses?.count || 0,
    fuelVolume: fuelExpenses?.volume || 0,
    isLoading: isExpensesLoading || isFuelLoading || isVehiclesLoading,
    periodLabel: viewMode === "monthly" ? "mensuel" : "annuel",
    hasActiveVehicles // Nouvelle propriété
  };
};
