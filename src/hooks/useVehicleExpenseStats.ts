
import { VehicleExpense } from "@/types/vehicle";
import { useMemo } from "react";

export const useVehicleExpenseStats = (expenses: VehicleExpense[] | undefined) => {
  return useMemo(() => {
    console.log("Computing vehicle expense stats:", expenses?.length || 0, "expenses");
    
    if (!expenses || expenses.length === 0) {
      return {
        totalFuelExpense: 0,
        totalFuelVolume: 0,
        averageFuelPrice: 0,
        totalExpense: 0,
        expenseCount: 0,
        yearToDateExpenses: {
          totalFuelExpense: 0,
          totalFuelVolume: 0,
          averageFuelPrice: 0,
          totalExpense: 0,
          expenseCount: 0
        },
        monthlyExpenseAverage: 0,
        expensesByCategory: {}
      };
    }

    const currentYear = new Date().getFullYear();
    const currentYearExpenses = expenses.filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseYear === currentYear;
    });

    // Calculer les statistiques pour toutes les dépenses (incluant les véhicules vendus)
    const fuelExpenses = expenses.filter(expense => expense.expense_type === 'carburant');
    const totalFuelExpense = fuelExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalFuelVolume = fuelExpenses.reduce((sum, expense) => sum + (expense.fuel_volume || 0), 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculer les statistiques pour les dépenses de l'année en cours
    const currentYearFuelExpenses = currentYearExpenses.filter(expense => expense.expense_type === 'carburant');
    const ytdTotalFuelExpense = currentYearFuelExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const ytdTotalFuelVolume = currentYearFuelExpenses.reduce((sum, expense) => sum + (expense.fuel_volume || 0), 0);
    const ytdTotalExpense = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculer la moyenne mensuelle des dépenses
    const oldestExpenseDate = new Date(Math.min(...expenses.map(e => new Date(e.date).getTime())));
    const now = new Date();
    const monthsActive = (now.getFullYear() - oldestExpenseDate.getFullYear()) * 12 + 
                         (now.getMonth() - oldestExpenseDate.getMonth()) + 1;
    const monthlyExpenseAverage = monthsActive > 0 ? totalExpense / monthsActive : 0;

    // Calculer les dépenses par catégorie
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.expense_type;
      if (!acc[category]) {
        acc[category] = {
          total: 0,
          count: 0
        };
      }
      acc[category].total += expense.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number, count: number }>);
    
    console.log("Stats calculated:", {
      totalExpense,
      expenseCount: expenses.length,
      totalFuelExpense,
      totalFuelVolume
    });

    return {
      totalFuelExpense,
      totalFuelVolume,
      averageFuelPrice: totalFuelVolume > 0 ? totalFuelExpense / totalFuelVolume : 0,
      totalExpense,
      expenseCount: expenses.length,
      yearToDateExpenses: {
        totalFuelExpense: ytdTotalFuelExpense,
        totalFuelVolume: ytdTotalFuelVolume,
        averageFuelPrice: ytdTotalFuelVolume > 0 ? ytdTotalFuelExpense / ytdTotalFuelVolume : 0,
        totalExpense: ytdTotalExpense,
        expenseCount: currentYearExpenses.length
      },
      monthlyExpenseAverage,
      expensesByCategory
    };
  }, [expenses]);
};
