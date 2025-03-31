
import { useMemo } from "react";
import { calculateTotalRevenue } from "@/utils/dashboardCalculations";

/**
 * Hook pour effectuer les calculs financiers du tableau de bord
 */
export function useExpenseCalculations(
  monthlySavings = [],
  recurringExpenses = [],
  contributors = []
) {
  return useMemo(() => {
    // Calculer les revenus à partir des contributeurs
    const revenue = calculateTotalRevenue(contributors);
    
    // Calculer les économies totales
    const savings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
    
    // Calculer l'objectif d'économies
    const savingsGoal = 1000; // Valeur par défaut, à remplacer par une valeur dynamique si disponible
    
    // Calculer les dépenses récurrentes
    const expenses = recurringExpenses
      ?.filter(expense => expense.periodicity === "monthly")
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;
    
    // Calculer le solde
    const balance = revenue - expenses - savings;
    
    return {
      savings,
      savingsGoal,
      expenses,
      revenue,
      balance
    };
  }, [monthlySavings, recurringExpenses, contributors]);
}
