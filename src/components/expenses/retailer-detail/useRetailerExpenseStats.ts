
import { useMemo } from "react";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
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
        monthlyAverageCount: 0
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const currentYearExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear;
    });

    const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyCount = currentMonthExpenses.length;
    
    const yearlyTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const yearlyCount = currentYearExpenses.length;

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
      monthlyAverageCount
    };
  }, [expenses]);
}
