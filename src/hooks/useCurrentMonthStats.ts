
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";

export const useCurrentMonthStats = () => {
  const { currentUser } = useCurrentUser();

  // Obtenir les dates de début et fin du mois courant
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  const firstDayStr = firstDay.toISOString().split('T')[0];
  const lastDayStr = lastDay.toISOString().split('T')[0];

  // Récupérer TOUTES les dépenses, exactement comme dans la page Expenses
  const { data: allExpenses, isLoading: isExpensesLoading } = useQuery({
    queryKey: ["all-expenses-for-stats"],
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

  // Filtrer les dépenses du mois en cours côté client, exactement comme dans Expenses.tsx
  const monthlyExpenses = allExpenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= firstDay && expenseDate <= lastDay;
  }) || [];
  
  // Calculer le total exactement comme dans la page Expenses
  const monthlyExpensesTotal = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  console.log(`Total dépenses mois en cours (méthode identique à Expenses): ${monthlyExpensesTotal}€ (${monthlyExpenses.length} dépenses)`);

  // Récupérer les dépenses carburant du mois en cours pour tous les véhicules actifs
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
      
      console.log(`Total dépenses carburant mois en cours: ${total}€ (${data.length} dépenses)`);
      
      return { total, count: data.length };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 10, // 10 secondes pour une réactivité accrue
    refetchOnWindowFocus: true,
  });

  return {
    monthlyExpensesTotal,
    fuelExpensesTotal: fuelExpenses?.total || 0,
    isLoading: isExpensesLoading || isFuelLoading
  };
};
