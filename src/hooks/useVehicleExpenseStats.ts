
import { VehicleExpense } from "@/types/vehicle";
import { useMemo } from "react";

export const useVehicleExpenseStats = (expenses: VehicleExpense[] | undefined) => {
  return useMemo(() => {
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
        }
      };
    }

    const currentYear = new Date().getFullYear();
    const currentYearExpenses = expenses.filter(expense => {
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseYear === currentYear;
    });

    // Calculer les statistiques pour toutes les dépenses
    const fuelExpenses = expenses.filter(expense => expense.expense_type === 'carburant');
    const totalFuelExpense = fuelExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalFuelVolume = fuelExpenses.reduce((sum, expense) => sum + (expense.fuel_volume || 0), 0);
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculer les statistiques pour les dépenses de l'année en cours
    const currentYearFuelExpenses = currentYearExpenses.filter(expense => expense.expense_type === 'carburant');
    const ytdTotalFuelExpense = currentYearFuelExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const ytdTotalFuelVolume = currentYearFuelExpenses.reduce((sum, expense) => sum + (expense.fuel_volume || 0), 0);
    const ytdTotalExpense = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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
      }
    };
  }, [expenses]);
};
