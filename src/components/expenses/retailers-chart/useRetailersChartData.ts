
import { useMemo } from "react";
import { Expense } from "@/types/expense";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, getYear } from "date-fns";

interface RetailerExpense {
  retailerId: string;
  retailerName: string;
  totalAmount: number;
}

export function useRetailersChartData(
  expenses: Expense[],
  retailers: Array<{ id: string; name: string }>,
  viewMode: 'monthly' | 'yearly'
) {
  // ---- MODE MENSUEL : DÉPENSES PAR ENSEIGNE DU MOIS COURANT ----
  const retailerExpenses = useMemo(() => {
    if (viewMode === 'monthly') {
      const now = new Date();
      const firstDayOfMonth = startOfMonth(now);
      const lastDayOfMonth = endOfMonth(now);

      // Filtrer les dépenses du mois en cours
      const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, {
          start: firstDayOfMonth,
          end: lastDayOfMonth
        });
      });
      
      // Calculer les dépenses par enseigne
      const expensesByRetailer = currentMonthExpenses.reduce((acc, expense) => {
        const retailerId = expense.retailer_id;
        if (!acc[retailerId]) {
          const retailer = retailers.find(r => r.id === retailerId);
          acc[retailerId] = {
            retailerId,
            retailerName: retailer?.name || "Inconnu",
            totalAmount: 0
          };
        }
        acc[retailerId].totalAmount += expense.amount;
        return acc;
      }, {} as Record<string, RetailerExpense>);

      // Convertir l'objet en tableau et trier par montant total (décroissant)
      return Object.values(expensesByRetailer)
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 10); // Limiter aux 10 premiers pour une meilleure lisibilité
    }
    
    return [];
  }, [expenses, retailers, viewMode]);

  // ---- MODE ANNUEL : DÉPENSES ANNUELLES EMPILÉES ----
  const yearlyData = useMemo(() => {
    if (viewMode === 'yearly') {
      // Regrouper les dépenses par année et par enseigne
      const yearlyExpensesByRetailer: Record<string, Record<string, number>> = {};
      
      expenses.forEach(expense => {
        const expenseDate = parseISO(expense.date);
        const year = getYear(expenseDate).toString();
        const retailerId = expense.retailer_id;
        const retailer = retailers.find(r => r.id === retailerId);
        const retailerName = retailer?.name || "Inconnu";
        
        if (!yearlyExpensesByRetailer[year]) {
          yearlyExpensesByRetailer[year] = {};
        }
        
        if (!yearlyExpensesByRetailer[year][retailerName]) {
          yearlyExpensesByRetailer[year][retailerName] = 0;
        }
        
        yearlyExpensesByRetailer[year][retailerName] += expense.amount;
      });
      
      // Transformer les données pour le graphique empilé
      return Object.entries(yearlyExpensesByRetailer)
        .map(([year, retailers]) => ({
          year,
          ...retailers
        }))
        .sort((a, b) => {
          // Conversion explicite des chaînes en nombres pour la comparaison
          const yearA = parseInt(a.year, 10);
          const yearB = parseInt(b.year, 10);
          return yearA - yearB;
        });
    }
    
    return [];
  }, [expenses, retailers, viewMode]);

  // Déterminer les 5 principales enseignes pour la vue annuelle
  const topRetailers = useMemo(() => {
    if (viewMode === 'yearly') {
      // Calculer le total des dépenses par enseigne sur toutes les années
      const totalByRetailer: Record<string, number> = {};
      
      yearlyData.forEach(yearData => {
        Object.entries(yearData).forEach(([key, value]) => {
          if (key !== 'year') {
            if (!totalByRetailer[key]) {
              totalByRetailer[key] = 0;
            }
            // Conversion explicite en nombre avant l'addition
            totalByRetailer[key] += Number(value);
          }
        });
      });
      
      // Trier et retourner les 5 principales enseignes
      return Object.entries(totalByRetailer)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name);
    }
    
    return [];
  }, [yearlyData, viewMode]);

  return {
    retailerExpenses,
    yearlyData,
    topRetailers,
    formattedRetailerExpenses: retailerExpenses.map(item => ({
      name: item.retailerName,
      total: item.totalAmount
    }))
  };
}
