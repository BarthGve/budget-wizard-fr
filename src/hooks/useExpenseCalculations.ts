
import { useMemo } from "react";

/**
 * Hook pour effectuer les calculs financiers du tableau de bord
 */
export function useExpenseCalculations(
  monthlySavings = [],
  recurringExpenses = []
) {
  return useMemo(() => {
    // Calculer les économies totales
    const savings = monthlySavings?.reduce((sum, saving) => sum + saving.amount, 0) || 0;
    
    // Calculer l'objectif d'économies
    const savingsGoal = 1000; // Valeur par défaut, à remplacer par une valeur dynamique si disponible
    
    // Calculer les dépenses récurrentes
    const expenses = recurringExpenses
      ?.filter(expense => expense.periodicity === "monthly")
      .reduce((sum, expense) => sum + expense.amount, 0) || 0;
    
    // Estimer les revenus (simplifié pour l'exemple)
    const revenue = expenses + savings + 500; // Ajouter une marge fictive
    
    // Calculer le solde
    const balance = revenue - expenses - savings;
    
    return {
      savings,
      savingsGoal,
      expenses,
      revenue,
      balance
    };
  }, [monthlySavings, recurringExpenses]);
}
