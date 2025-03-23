
import { startOfYear, endOfYear, subYears } from "date-fns";

interface Expense {
  id: string;
  date: string;
  amount: number;
  retailer_id: string;
  comment?: string;
}

export const useYearlyTotals = (expenses: Expense[] | undefined) => {
  const now = new Date();
  
  // Calcul des totaux pour la carte de total annuel
  const currentYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfYear(now) && expenseDate <= endOfYear(now);
  }) || [];
  
  const currentYearTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const lastYearStart = startOfYear(subYears(now, 1));
  const lastYearEnd = endOfYear(subYears(now, 1));
  
  const lastYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= lastYearStart && expenseDate <= lastYearEnd;
  }) || [];
  
  const lastYearTotal = lastYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    currentYearTotal,
    lastYearTotal,
    currentYearExpenses,
    lastYearExpenses
  };
};
