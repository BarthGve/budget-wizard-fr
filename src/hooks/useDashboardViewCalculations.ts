
import { useMemo } from "react";
import {
  calculateTotalRevenue,
  calculateMonthlyExpenses,
  calculateYearlyExpenses,
  calculateTotalSavings,
  getCumulativeContributionPercentages,
  getCumulativeExpensePercentages,
} from "@/utils/dashboardCalculations";

export function useDashboardViewCalculations(
  currentView: "monthly" | "yearly",
  contributors: Array<{
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner: boolean;
    profile_id: string;
  }> | undefined,
  monthlySavings: Array<any> | undefined,
  recurringExpenses: Array<any> | undefined,
  profile: any | undefined
) {
  return useMemo(() => {
    // Calcul des revenus
    const totalRevenue = calculateTotalRevenue(contributors || []);
    const yearlyRevenue = totalRevenue * 12;

    // Calcul des dépenses
    const monthlyExpenses = calculateMonthlyExpenses(recurringExpenses || []);
    const yearlyExpenses = calculateYearlyExpenses(recurringExpenses || []);

    // Calcul des épargnes
    const totalMonthlySavings = calculateTotalSavings(monthlySavings || []);
    const yearlyMonthlySavings = totalMonthlySavings * 12;

    // Calcul des soldes
    const monthlyBalance = totalRevenue - monthlyExpenses - totalMonthlySavings;
    const yearlyBalance = yearlyRevenue - yearlyExpenses - yearlyMonthlySavings;

    // Calcul de l'objectif d'épargne
    const savingsGoal = profile?.savings_goal_percentage 
      ? (currentView === "yearly" ? yearlyRevenue : totalRevenue) * profile.savings_goal_percentage / 100 
      : 0;

    // Préparation des données pour les graphiques
    const expensesForPieChart = getExpensesForPieChart(recurringExpenses || [], currentView);
    const savingsForPieChart = getSavingsForPieChart(monthlySavings || [], currentView);
    
    // Préparation des parts de contributions et de dépenses
    const contributorShares = getCumulativeContributionPercentages(contributors || [], totalRevenue);
    const expenseShares = getCumulativeExpensePercentages(contributors || [], monthlyExpenses);

    return {
      revenue: currentView === "monthly" ? totalRevenue : yearlyRevenue,
      expenses: currentView === "monthly" ? monthlyExpenses : yearlyExpenses,
      savings: currentView === "monthly" ? totalMonthlySavings : yearlyMonthlySavings,
      balance: currentView === "monthly" ? monthlyBalance : yearlyBalance,
      savingsGoal,
      contributorShares,
      expenseShares,
      recurringExpensesForChart: expensesForPieChart,
      monthlySavingsForChart: savingsForPieChart,
      monthlyCalculations: {
        revenue: totalRevenue,
        expenses: monthlyExpenses,
        savings: totalMonthlySavings,
      },
      yearlyCalculations: {
        revenue: yearlyRevenue,
        expenses: yearlyExpenses,
        savings: yearlyMonthlySavings,
      }
    };
  }, [currentView, contributors, monthlySavings, recurringExpenses, profile]);
}

// Fonction utilitaire pour préparer les données des dépenses pour le graphique en camembert
function getExpensesForPieChart(recurringExpenses: Array<any>, currentView: "monthly" | "yearly") {
  if (!recurringExpenses || recurringExpenses.length === 0) return [];

  return recurringExpenses.map(expense => {
    let amount = expense.amount;
    if (currentView === "yearly") {
      if (expense.periodicity === "monthly") {
        amount = expense.amount * 12;
      } else if (expense.periodicity === "quarterly") {
        amount = expense.amount * 4;
      }
    } else {
      if (expense.periodicity === "quarterly") {
        amount = expense.amount / 3;
      } else if (expense.periodicity === "yearly") {
        amount = expense.amount / 12;
      }
    }
    
    return {
      id: expense.id,
      name: expense.name,
      amount,
      category: expense.category,
      debit_day: expense.debit_day,
      debit_month: expense.debit_month,
      periodicity: expense.periodicity as "monthly" | "quarterly" | "yearly"
    };
  });
}

// Fonction utilitaire pour préparer les données d'épargne pour le graphique en camembert
function getSavingsForPieChart(monthlySavings: Array<any>, currentView: "monthly" | "yearly") {
  if (!monthlySavings || monthlySavings.length === 0) return [];
  
  if (currentView === "yearly") {
    return monthlySavings.map(saving => ({
      ...saving,
      amount: saving.amount * 12
    }));
  }
  return monthlySavings;
}
