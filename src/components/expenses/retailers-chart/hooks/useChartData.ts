
import { useMemo } from "react";
import { Expense } from "@/types/expense";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, getYear, isThisYear } from "date-fns";

interface RetailerExpense {
  retailerId: string;
  retailerName: string;
  totalAmount: number;
}

interface RetailerInfo {
  id: string;
  name: string;
}

/**
 * Hook pour calculer et formater les données pour les graphiques
 */
export const useChartData = (
  expenses: Expense[],
  retailers: RetailerInfo[],
  viewMode: 'monthly' | 'yearly',
  yearlyViewMode: 'yearly-totals' | 'monthly-in-year' = 'yearly-totals'
) => {
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
        .slice(0, 15); // Augmenter le nombre d'enseignes affichées de 10 à 15
    }
    
    return [];
  }, [expenses, retailers, viewMode]);

  // ---- MODE ANNUEL : DÉPENSES ANNUELLES EMPILÉES ----
  const yearlyData = useMemo(() => {
    if (viewMode === 'yearly') {
      if (yearlyViewMode === 'yearly-totals') {
        // Regrouper les dépenses par année et par enseigne (comportement actuel)
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
          .map(([year, categories]) => ({
            year,
            ...categories
          }))
          .sort((a, b) => {
            const yearA = parseInt(a.year, 10);
            const yearB = parseInt(b.year, 10);
            return yearA - yearB;
          });
      } else {
        // Nouvelle vue: dépenses mensuelles pour l'année en cours
        const currentYear = new Date().getFullYear();
        const monthsData = Array.from({ length: 12 }, (_, i) => {
          const monthName = new Date(currentYear, i, 1).toLocaleDateString('fr-FR', { month: 'short' });
          return { 
            month: monthName, 
            index: i,
            // On initialise un objet vide qui contiendra les montants par enseigne
            ...retailers.reduce((acc, retailer) => ({ ...acc, [retailer.name]: 0 }), {})
          };
        });

        // On ajoute les dépenses de l'année en cours au mois correspondant
        expenses.forEach(expense => {
          const expenseDate = parseISO(expense.date);
          if (getYear(expenseDate) === currentYear) {
            const month = expenseDate.getMonth();
            const retailer = retailers.find(r => r.id === expense.retailer_id);
            const retailerName = retailer?.name || "Inconnu";
            
            if (typeof monthsData[month][retailerName] === 'number') {
              monthsData[month][retailerName] += expense.amount;
            } else {
              monthsData[month][retailerName] = expense.amount;
            }
          }
        });

        return monthsData;
      }
    }
    
    return [];
  }, [expenses, retailers, viewMode, yearlyViewMode]);

  // Déterminer les principales enseignes et créer une catégorie "Autres" pour la vue annuelle
  const topRetailers = useMemo(() => {
    if (viewMode === 'yearly') {
      if (yearlyViewMode === 'yearly-totals') {
        // Calcul des principales enseignes (pour la vue totaux annuels)
        const totalByRetailer: Record<string, number> = {};
        
        yearlyData.forEach(yearData => {
          Object.entries(yearData).forEach(([key, value]) => {
            if (key !== 'year' && key !== 'month' && key !== 'index') {
              if (!totalByRetailer[key]) {
                totalByRetailer[key] = 0;
              }
              totalByRetailer[key] += Number(value);
            }
          });
        });
        
        // On trie les enseignes par montant total décroissant
        const sortedRetailers = Object.entries(totalByRetailer)
          .sort((a, b) => b[1] - a[1]);
        
        // On garde les 10 principales enseignes (au lieu de 5)
        const top10 = sortedRetailers.slice(0, 10).map(([name]) => name);
        
        // On ajoute une catégorie "Autres" si nécessaire
        if (sortedRetailers.length > 10) {
          // Agréger les montants des autres enseignes dans chaque année
          yearlyData.forEach(yearData => {
            let otherAmount = 0;
            Object.entries(yearData).forEach(([key, value]) => {
              if (key !== 'year' && key !== 'month' && key !== 'index' && !top10.includes(key)) {
                otherAmount += Number(value);
                delete yearData[key]; // Supprimer l'enseigne individuelle
              }
            });
            // Ajouter la catégorie "Autres" si son montant est > 0
            if (otherAmount > 0) {
              yearData["Autres"] = otherAmount;
            }
          });
          
          return [...top10, "Autres"];
        }
        
        return top10;
      } else {
        // Pour la vue mensuelle en année courante
        const thisYearExpenses = expenses.filter(expense => {
          const expenseDate = parseISO(expense.date);
          return isThisYear(expenseDate);
        });
        
        const retailerTotals: Record<string, number> = {};
        
        thisYearExpenses.forEach(expense => {
          const retailer = retailers.find(r => r.id === expense.retailer_id);
          const retailerName = retailer?.name || "Inconnu";
          
          if (!retailerTotals[retailerName]) {
            retailerTotals[retailerName] = 0;
          }
          
          retailerTotals[retailerName] += expense.amount;
        });
        
        // On trie les enseignes par montant total décroissant
        const sortedRetailers = Object.entries(retailerTotals)
          .sort((a, b) => b[1] - a[1]);
        
        // On garde les 10 principales enseignes (au lieu de 5)
        const top10 = sortedRetailers.slice(0, 10).map(([name]) => name);
        
        // On ajoute une catégorie "Autres" si nécessaire
        if (sortedRetailers.length > 10) {
          // On calcule le total des "autres" enseignes
          let otherTotal = 0;
          sortedRetailers.slice(10).forEach(([_, amount]) => {
            otherTotal += amount;
          });
          
          // On ajoute les "autres" à chaque mois dans les données
          yearlyData.forEach(monthData => {
            // Calculer la proportion pour ce mois
            const monthTotal = Object.entries(monthData)
              .filter(([key, _]) => key !== 'month' && key !== 'index' && !top10.includes(key))
              .reduce((sum, [_, value]) => sum + Number(value), 0);
            
            // Supprimer les enseignes non principales
            Object.keys(monthData).forEach(key => {
              if (key !== 'month' && key !== 'index' && !top10.includes(key)) {
                delete monthData[key];
              }
            });
            
            // Ajouter la catégorie "Autres" si son montant est > 0
            if (monthTotal > 0) {
              monthData["Autres"] = monthTotal;
            }
          });
          
          return [...top10, "Autres"];
        }
        
        return top10;
      }
    }
    
    return [];
  }, [expenses, retailers, viewMode, yearlyData, yearlyViewMode]);

  return {
    retailerExpenses,
    yearlyData,
    topRetailers,
    hasData: (viewMode === 'monthly' && retailerExpenses.length > 0) || 
             (viewMode === 'yearly' && yearlyData.length > 0)
  };
};
