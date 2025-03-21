
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { format, parseISO, startOfYear, endOfYear, subYears } from "date-fns";
import { fr } from "date-fns/locale";

interface Expense {
  id: string;
  date: string;
  amount: number;
  expense_type: string;
  vehicle_id: string;
}

export const useExpensesChartData = (vehicleId: string, showMultiYear: boolean = false) => {
  const currentYear = new Date().getFullYear();

  // Requête pour récupérer les dépenses du véhicule
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["vehicle-expenses-chart", vehicleId, showMultiYear],
    queryFn: async () => {
      // Si on affiche les 5 dernières années, on remonte 5 ans en arrière
      const startDate = showMultiYear
        ? startOfYear(subYears(new Date(), 4)) // 5 années incluant celle en cours
        : startOfYear(new Date(currentYear, 0, 1));
      
      const endDate = endOfYear(new Date(currentYear, 11, 31));
      
      const { data, error } = await supabase
        .from("vehicle_expenses")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .gte("date", startDate.toISOString().split("T")[0])
        .lte("date", endDate.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (error) {
        console.error("Erreur lors de la récupération des dépenses:", error);
        return [];
      }

      return data as Expense[];
    },
    enabled: !!vehicleId,
  });

  // Transformer les données pour le graphique
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    if (showMultiYear) {
      // Regrouper par année
      const yearlyData = expenses.reduce((acc, expense) => {
        const date = parseISO(expense.date);
        const year = date.getFullYear();
        
        if (!acc[year]) {
          acc[year] = {
            year: year,
            name: year.toString(),
            carburant: 0,
            entretien: 0,
            assurance: 0,
            reparation: 0,
            autre: 0
          };
        }
        
        const expenseType = expense.expense_type.toLowerCase();
        
        if (expenseType === "carburant") {
          acc[year].carburant += expense.amount;
        } else if (expenseType === "entretien") {
          acc[year].entretien += expense.amount;
        } else if (expenseType === "assurance") {
          acc[year].assurance += expense.amount;
        } else if (expenseType === "reparation") {
          acc[year].reparation += expense.amount;
        } else {
          acc[year].autre += expense.amount;
        }
        
        return acc;
      }, {} as Record<number, any>);
      
      // Convertir en tableau et trier par année
      return Object.values(yearlyData).sort((a, b) => a.year - b.year);
    } else {
      // Mode par mois pour l'année courante (comportement original)
      const monthsData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return {
          month: month,
          name: format(new Date(currentYear, i, 1), 'MMM', { locale: fr }),
          carburant: 0,
          entretien: 0,
          assurance: 0,
          reparation: 0,
          autre: 0
        };
      });

      // Remplir les données avec les dépenses existantes (uniquement pour l'année en cours)
      expenses.forEach(expense => {
        const date = parseISO(expense.date);
        
        // Vérifier si c'est l'année courante
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          
          // Mapper le type de dépense à la catégorie correspondante
          const expenseType = expense.expense_type.toLowerCase();
          
          if (expenseType === "carburant") {
            monthsData[monthIndex].carburant += expense.amount;
          } else if (expenseType === "entretien") {
            monthsData[monthIndex].entretien += expense.amount;
          } else if (expenseType === "assurance") {
            monthsData[monthIndex].assurance += expense.amount;
          } else if (expenseType === "reparation") {
            monthsData[monthIndex].reparation += expense.amount;
          } else {
            monthsData[monthIndex].autre += expense.amount;
          }
        }
      });

      return monthsData;
    }
  }, [expenses, currentYear, showMultiYear]);

  // Un titre descriptif selon le mode
  const chartTitle = showMultiYear ? "Dépenses annuelles" : "Dépenses mensuelles";
  const chartDescription = showMultiYear 
    ? "Répartition des dépenses annuelles sur les 5 dernières années" 
    : "Répartition des dépenses mensuelles pour l'année en cours";

  return {
    expenses,
    isLoading,
    chartData,
    currentYear,
    chartTitle,
    chartDescription
  };
};
