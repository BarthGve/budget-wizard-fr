
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
  // Memoize individual calculations to prevent recalculations on each render
  const totalRevenue = useMemo(() => 
    calculateTotalRevenue(contributors || []), 
    [contributors]
  );

  const monthlyExpenses = useMemo(() => 
    calculateMonthlyExpenses(recurringExpenses || []), 
    [recurringExpenses]
  );

  const yearlyExpenses = useMemo(() => 
    calculateYearlyExpenses(recurringExpenses || []), 
    [recurringExpenses]
  );

  const totalMonthlySavings = useMemo(() => 
    calculateTotalSavings(monthlySavings || []), 
    [monthlySavings]
  );

  const yearlyRevenue = useMemo(() => totalRevenue * 12, [totalRevenue]);
  const yearlyMonthlySavings = useMemo(() => totalMonthlySavings * 12, [totalMonthlySavings]);

  // Memoize balance calculations using previously memoized values
  const monthlyBalance = useMemo(() => 
    totalRevenue - monthlyExpenses - totalMonthlySavings, 
    [totalRevenue, monthlyExpenses, totalMonthlySavings]
  );

  const yearlyBalance = useMemo(() => 
    yearlyRevenue - yearlyExpenses - yearlyMonthlySavings, 
    [yearlyRevenue, yearlyExpenses, yearlyMonthlySavings]
  );

  // Memoize savings goal calculation
  const savingsGoal = useMemo(() => {
    const baseAmount = currentView === "yearly" ? yearlyRevenue : totalRevenue;
    return profile?.savings_goal_percentage 
      ? baseAmount * profile.savings_goal_percentage / 100 
      : 0;
  }, [currentView, yearlyRevenue, totalRevenue, profile?.savings_goal_percentage]);

  // Memoize chart data preparation
  const expensesForPieChart = useMemo(() => 
    getExpensesForPieChart(recurringExpenses || [], currentView),
    [recurringExpenses, currentView]
  );

  const savingsForPieChart = useMemo(() => 
    getSavingsForPieChart(monthlySavings || [], currentView),
    [monthlySavings, currentView]
  );

  // Memoize share calculations
  const contributorShares = useMemo(() => 
    getCumulativeContributionPercentages(contributors || [], totalRevenue),
    [contributors, totalRevenue]
  );

  const expenseShares = useMemo(() => 
    getCumulativeExpensePercentages(contributors || [], monthlyExpenses),
    [contributors, monthlyExpenses]
  );

  // Final return value memoization
  return useMemo(() => {
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
  }, [
    currentView, 
    totalRevenue, 
    yearlyRevenue, 
    monthlyExpenses, 
    yearlyExpenses, 
    totalMonthlySavings,
    yearlyMonthlySavings,
    monthlyBalance,
    yearlyBalance,
    savingsGoal,
    contributorShares,
    expenseShares,
    expensesForPieChart,
    savingsForPieChart
  ]);
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
