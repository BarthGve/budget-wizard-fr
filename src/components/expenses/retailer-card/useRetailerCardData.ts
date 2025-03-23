
import { useState, useEffect, useMemo } from "react";
import { startOfYear, endOfYear, subYears, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
}

interface RetailerCardDataProps {
  expenses: Expense[];
  viewMode: "monthly" | "yearly";
}

export function useRetailerCardData({ expenses, viewMode }: RetailerCardDataProps) {
  const [prevTotal, setPrevTotal] = useState(0);
  const now = new Date();

  // Calcul des totaux pour la période actuelle et précédente
  const { totalCurrentPeriod, totalPreviousPeriod, percentageChange, periodLabel } = useMemo(() => {
    if (viewMode === "monthly") {
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);

      const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
      });

      const totalCurrentMonth = currentMonthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const previousMonthStart = startOfMonth(subMonths(now, 1));
      const previousMonthEnd = endOfMonth(subMonths(now, 1));

      const previousMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
      });

      const totalPreviousMonth = previousMonthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const monthPercentageChange =
        totalPreviousMonth === 0
          ? 100
          : ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;

      return {
        totalCurrentPeriod: totalCurrentMonth,
        totalPreviousPeriod: totalPreviousMonth,
        percentageChange: monthPercentageChange,
        periodLabel: "Mois en cours",
      };
    } else {
      const currentYearStart = startOfYear(now);
      const currentYearEnd = endOfYear(now);

      const currentYearExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentYearStart && expenseDate <= currentYearEnd;
      });

      const totalCurrentYear = currentYearExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const lastYearStart = startOfYear(subYears(now, 1));
      const lastYearEnd = endOfYear(subYears(now, 1));

      const lastYearExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= lastYearStart && expenseDate <= lastYearEnd;
      });

      const totalLastYear = lastYearExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const yearPercentageChange =
        totalLastYear === 0
          ? 100
          : ((totalCurrentYear - totalLastYear) / totalLastYear) * 100;

      return {
        totalCurrentPeriod: totalCurrentYear,
        totalPreviousPeriod: totalLastYear,
        percentageChange: yearPercentageChange,
        periodLabel: "Année en cours",
      };
    }
  }, [viewMode, expenses, now]);

  // Effet pour détecter les changements de montant total
  useEffect(() => {
    setPrevTotal(totalCurrentPeriod);
  }, [totalCurrentPeriod]);

  // Déterminer si le montant a augmenté ou diminué pour l'animation
  const hasIncreased = totalCurrentPeriod > prevTotal;
  const hasChanged = totalCurrentPeriod !== prevTotal && prevTotal !== 0;
  const isIncrease = percentageChange > 0;
  const comparisonLabel = viewMode === 'monthly' ? "vs mois précédent" : "vs année précédente";

  return {
    totalCurrentPeriod,
    totalPreviousPeriod,
    percentageChange,
    periodLabel,
    hasIncreased,
    hasChanged,
    isIncrease,
    comparisonLabel,
    prevTotal
  };
}
