
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Expense } from "@/types/expense";

// Interface pour les dépenses de carburant qui contient fuel_volume
interface FuelExpense extends Expense {
  fuel_volume?: number;
  expense_type: string;
}

export const useExpenseStats = (viewMode: "monthly" | "yearly") => {
  const now = new Date();
  
  // Définir les dates de début et de fin selon le mode de vue
  const startDate = viewMode === "monthly" 
    ? startOfMonth(now) 
    : startOfYear(now);
  
  const endDate = viewMode === "monthly" 
    ? endOfMonth(now) 
    : endOfYear(now);

  // Requête pour les statistiques des dépenses
  const { data: expensesData, isLoading } = useQuery({
    queryKey: ["expenses-stats", viewMode, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      try {
        // Récupérer toutes les dépenses pour la période
        const { data: expenses, error } = await supabase
          .from("expenses")
          .select("*")
          .gte("date", startDate.toISOString())
          .lte("date", endDate.toISOString());

        if (error) throw error;

        // Récupérer les dépenses de carburant
        const { data: fuelExpenses, error: fuelError } = await supabase
          .from("vehicle_expenses")  // Utiliser la table vehicle_expenses pour les dépenses de carburant
          .select("*")
          .eq("expense_type", "carburant")
          .gte("date", startDate.toISOString())
          .lte("date", endDate.toISOString());

        if (fuelError) throw fuelError;

        // Vérifier s'il y a des véhicules actifs
        const { data: vehicles, error: vehiclesError } = await supabase
          .from("vehicles")
          .select("id")
          .eq("status", "actif");

        if (vehiclesError) throw vehiclesError;

        return {
          expenses: expenses || [],
          fuelExpenses: fuelExpenses || [],
          hasActiveVehicles: vehicles && vehicles.length > 0
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de dépenses:", error);
        return {
          expenses: [],
          fuelExpenses: [],
          hasActiveVehicles: false
        };
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });

  const expensesTotal = expensesData?.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
  const fuelExpensesTotal = expensesData?.fuelExpenses.reduce((sum, expense: any) => sum + (expense.amount || 0), 0) || 0;
  const fuelExpensesCount = expensesData?.fuelExpenses.length || 0;
  const fuelVolume = expensesData?.fuelExpenses.reduce((sum, expense: any) => sum + (expense.fuel_volume || 0), 0) || 0;
  const hasActiveVehicles = expensesData?.hasActiveVehicles || false;

  return {
    expensesTotal,
    fuelExpensesTotal,
    fuelExpensesCount,
    fuelVolume,
    hasActiveVehicles,
    isLoading
  };
};

export default useExpenseStats;
