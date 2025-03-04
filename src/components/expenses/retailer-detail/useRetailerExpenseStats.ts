
import { useMemo } from "react";
import { subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

export function useRetailerExpenseStats(expenses: Expense[] | undefined) {
  return useMemo(() => {
    if (!expenses) {
      return {
        currentMonthExpenses: [],
        currentYearExpenses: [],
        monthlyTotal: 0,
        monthlyCount: 0,
        yearlyTotal: 0,
        yearlyCount: 0,
        monthlyAverage: 0,
        monthlyAverageCount: 0,
        previousMonthTotal: 0,
        previousYearTotal: 0
      };
    }

    const currentDate = new Date();
    
    // Mois courant
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    
    // Mois précédent
    const previousMonthDate = subMonths(currentDate, 1);
    const previousMonthStart = startOfMonth(previousMonthDate);
    const previousMonthEnd = endOfMonth(previousMonthDate);
    
    // Année courante
    const currentYearStart = startOfYear(currentDate);
    const currentYearEnd = endOfYear(currentDate);
    
    // Année précédente
    const previousYearDate = subYears(currentDate, 1);
    const previousYearStart = startOfYear(previousYearDate);
    const previousYearEnd = endOfYear(previousYearDate);
    
    // Filtrer les dépenses pour chaque période
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
    });
    
    const previousMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
    });

    const currentYearExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentYearStart && expenseDate <= currentYearEnd;
    });
    
    const previousYearExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= previousYearStart && expenseDate <= previousYearEnd;
    });

    // Calculer les totaux
    const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyCount = currentMonthExpenses.length;
    
    const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const yearlyTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const yearlyCount = currentYearExpenses.length;
    
    const previousYearTotal = previousYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calcul de la moyenne mensuelle
    const allExpenses = expenses || [];
    const expenseDates = allExpenses.map(expense => new Date(expense.date));
    
    let monthlyAverage = 0;
    let monthlyAverageCount = 0;
    
    if (expenseDates.length > 0) {
      const oldestDate = new Date(Math.min(...expenseDates.map(date => date.getTime())));
      const totalMonths = 
        (currentDate.getFullYear() - oldestDate.getFullYear()) * 12 + 
        (currentDate.getMonth() - oldestDate.getMonth()) + 1;
      
      monthlyAverage = allExpenses.reduce((sum, expense) => sum + expense.amount, 0) / totalMonths;
      monthlyAverageCount = allExpenses.length / totalMonths;
    }

    return {
      currentMonthExpenses,
      currentYearExpenses,
      monthlyTotal,
      monthlyCount,
      yearlyTotal,
      yearlyCount,
      monthlyAverage,
      monthlyAverageCount,
      previousMonthTotal,
      previousYearTotal
    };
  }, [expenses]);
}
