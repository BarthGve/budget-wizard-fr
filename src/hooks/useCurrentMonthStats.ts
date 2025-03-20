
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";

export const useCurrentMonthStats = () => {
  const { currentUser } = useCurrentUser();

  // Obtenir les dates de début et fin du mois courant
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const firstDayStr = firstDay.toISOString().split('T')[0];
  const lastDayStr = lastDay.toISOString().split('T')[0];

  // Récupérer les dépenses du mois en cours
  const { data: monthlyExpenses, isLoading: isExpensesLoading } = useQuery({
    queryKey: ["monthly-expenses", firstDayStr, lastDayStr],
    queryFn: async () => {
      if (!currentUser?.id) return { total: 0 };
      
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .eq("profile_id", currentUser.id)
        .gte("date", firstDayStr)
        .lte("date", lastDayStr);

      if (error) {
        console.error("Error fetching monthly expenses:", error);
        return { total: 0 };
      }

      const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      return { total };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Récupérer les dépenses carburant du mois en cours pour tous les véhicules
  const { data: fuelExpenses, isLoading: isFuelLoading } = useQuery({
    queryKey: ["monthly-fuel-expenses", firstDayStr, lastDayStr],
    queryFn: async () => {
      if (!currentUser?.id) return { total: 0 };
      
      const { data, error } = await supabase
        .from("vehicle_expenses")
        .select("amount, vehicles!inner(profile_id, status)")
        .eq("vehicles.profile_id", currentUser.id)
        .eq("vehicles.status", "actif")
        .eq("expense_type", "carburant")
        .gte("date", firstDayStr)
        .lte("date", lastDayStr);

      if (error) {
        console.error("Error fetching fuel expenses:", error);
        return { total: 0 };
      }

      const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
      return { total };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    monthlyExpensesTotal: monthlyExpenses?.total || 0,
    fuelExpensesTotal: fuelExpenses?.total || 0,
    isLoading: isExpensesLoading || isFuelLoading
  };
};
