
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleExpense } from "@/types/vehicle";
import { useEffect, useMemo, useState } from "react";

interface VehicleExpenseWithMileage extends VehicleExpense {
  previous_mileage?: number;
  distance_traveled?: number;
}

// Interface pour les statistiques calculées
interface VehicleStats {
  // Globales
  totalExpenses: number;
  totalFuelExpenses: number;
  totalFuelVolume: number;
  averageFuelPrice: number;
  // Consommation
  hasFuelExpenses: boolean;
  averageFuelConsumption: number;
  recentAverageFuelConsumption: number;
  // Coût kilométrique
  costPerKm: {
    fuel: number;
    total: number;
  };
  // Kilométrage
  mileageLimit: number;
}

export const useVehicleStats = (vehicleId: string) => {
  const [mileageLimit, setMileageLimit] = useState(15000); // Valeur par défaut

  // Récupérer les dépenses
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["vehicle-expenses-stats", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_expenses")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching vehicle expenses for stats:", error);
        throw error;
      }

      return data as VehicleExpense[];
    },
  });

  // Compute all stats from expenses
  const stats = useMemo<VehicleStats | null>(() => {
    if (!expenses || expenses.length === 0) {
      return null;
    }

    // Trier les dépenses par date (plus ancienne à plus récente)
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filtrer et traiter les dépenses de carburant
    const fuelExpenses = sortedExpenses.filter(
      (expense) => expense.expense_type === "carburant" && expense.fuel_volume && expense.fuel_volume > 0
    );

    // Identifier les enregistrements de kilométrage et calculer les distances parcourues
    const expensesWithMileage = sortedExpenses
      .filter((expense) => expense.mileage !== null && expense.mileage !== undefined)
      .map((expense, index, array) => {
        const previous = index > 0 ? array[index - 1] : null;
        const distance = previous ? expense.mileage! - previous.mileage! : 0;
        
        return {
          ...expense,
          previous_mileage: previous?.mileage || null,
          distance_traveled: distance > 0 ? distance : 0
        };
      });

    // Récupération des 6 derniers mois pour les statistiques récentes
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentFuelExpenses = fuelExpenses.filter(
      (expense) => new Date(expense.date) >= sixMonthsAgo
    );

    // Analyse des dépenses de carburant pour calculer la consommation
    let totalFuelVolume = 0;
    let totalFuelExpense = 0;
    let totalDistance = 0;
    
    let recentFuelVolume = 0;
    let recentDistance = 0;

    // Calcul de la consommation de carburant basée sur le kilométrage et le volume
    const fuelExpensesWithDistance: VehicleExpenseWithMileage[] = [];
    
    fuelExpenses.forEach((expense, index, array) => {
      // Si c'est une dépense de carburant avec volume et kilométrage
      if (expense.fuel_volume && expense.mileage && expense.fuel_volume > 0) {
        totalFuelVolume += expense.fuel_volume;
        totalFuelExpense += expense.amount;
        
        // Vérifier si c'est une dépense récente
        if (new Date(expense.date) >= sixMonthsAgo) {
          recentFuelVolume += expense.fuel_volume;
          
          // Trouver un plein précédent avec kilométrage
          for (let i = index - 1; i >= 0; i--) {
            if (array[i].mileage && array[i].fuel_volume && array[i].fuel_volume > 0) {
              const distance = expense.mileage - array[i].mileage;
              
              if (distance > 0) {
                recentDistance += distance;
                break;
              }
            }
          }
        }
        
        // Trouver un plein précédent avec kilométrage
        if (index > 0) {
          for (let i = index - 1; i >= 0; i--) {
            if (array[i].mileage && array[i].fuel_volume && array[i].fuel_volume > 0) {
              const distance = expense.mileage - array[i].mileage;
              
              if (distance > 0) {
                totalDistance += distance;
                
                fuelExpensesWithDistance.push({
                  ...expense,
                  previous_mileage: array[i].mileage,
                  distance_traveled: distance
                });
                
                break;
              }
            }
          }
        }
      }
    });

    const hasFuelExpenses = fuelExpenses.length > 0;
    
    // Calcul des totaux
    const totalExpenses = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calcul des statistiques de consommation
    const averageFuelConsumption = totalDistance > 0 
      ? (totalFuelVolume * 100) / totalDistance 
      : 0;
      
    const recentAverageFuelConsumption = recentDistance > 0 
      ? (recentFuelVolume * 100) / recentDistance 
      : averageFuelConsumption;

    // Calcul des coûts par kilomètre
    const costPerKmFuel = totalDistance > 0 
      ? totalFuelExpense / totalDistance 
      : 0;
      
    const costPerKmTotal = totalDistance > 0 
      ? totalExpenses / totalDistance 
      : 0;

    return {
      totalExpenses,
      totalFuelExpenses: totalFuelExpense,
      totalFuelVolume,
      averageFuelPrice: totalFuelVolume > 0 ? totalFuelExpense / totalFuelVolume : 0,
      
      hasFuelExpenses,
      averageFuelConsumption,
      recentAverageFuelConsumption,
      
      costPerKm: {
        fuel: costPerKmFuel,
        total: costPerKmTotal
      },
      
      mileageLimit // À terme, cette valeur pourra être configurée par l'utilisateur
    };
  }, [expenses]);

  // Préparation des données pour le graphique de consommation
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [];
    }

    // Filtrer les pleins de carburant avec kilométrage et volume
    const fuelExpenses = expenses.filter(
      (expense) => 
        expense.expense_type === "carburant" && 
        expense.fuel_volume && 
        expense.fuel_volume > 0 && 
        expense.mileage
    );

    // Trier par date
    const sortedFuelExpenses = [...fuelExpenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculer la consommation entre chaque plein
    const consumptionData = [];
    
    for (let i = 1; i < sortedFuelExpenses.length; i++) {
      const current = sortedFuelExpenses[i];
      const previous = sortedFuelExpenses[i - 1];
      
      // Si on a des kilométrages et que la distance est positive
      if (current.mileage && previous.mileage && current.mileage > previous.mileage) {
        const distance = current.mileage - previous.mileage;
        const volume = current.fuel_volume!;
        const consumption = (volume * 100) / distance;
        const price = current.amount / volume;
        
        const date = new Date(current.date);
        const month = date.toLocaleDateString('fr-FR', { month: 'short' });
        
        consumptionData.push({
          date: current.date,
          month: `${month} ${date.getFullYear()}`,
          consumption: parseFloat(consumption.toFixed(2)),
          price: parseFloat(price.toFixed(3)),
          volume: volume,
          mileage: current.mileage
        });
      }
    }

    return consumptionData;
  }, [expenses]);

  // Calcul des données pour le suivi du kilométrage
  const mileageData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { currentMileage: 0, yearStart: 0, yearProgress: 0 };
    }

    // Récupérer les entrées avec kilométrage, triées par date
    const mileageExpenses = expenses
      .filter(expense => expense.mileage !== null && expense.mileage !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (mileageExpenses.length === 0) {
      return { currentMileage: 0, yearStart: 0, yearProgress: 0 };
    }
    
    // Récupérer le dernier kilométrage enregistré
    const currentMileage = mileageExpenses[mileageExpenses.length - 1].mileage!;
    
    // Calculer le kilométrage au début de l'année
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    
    let yearStart = 0;
    
    // Trouver la dernière entrée avant le début de l'année
    const entriesBeforeYear = mileageExpenses.filter(
      expense => new Date(expense.date) < startOfYear
    );
    
    if (entriesBeforeYear.length > 0) {
      // Prendre le dernier kilométrage avant le début de l'année
      yearStart = entriesBeforeYear[entriesBeforeYear.length - 1].mileage!;
    } else if (mileageExpenses.length > 0) {
      // Si pas d'entrée avant le début de l'année, prendre le premier kilométrage disponible
      yearStart = mileageExpenses[0].mileage!;
    }
    
    // Calculer la progression de l'année (en pourcentage)
    const now = new Date();
    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    const endOfThisYear = new Date(now.getFullYear() + 1, 0, 0);
    const yearDuration = endOfThisYear.getTime() - startOfThisYear.getTime();
    const timePassed = now.getTime() - startOfThisYear.getTime();
    const yearProgress = Math.round((timePassed / yearDuration) * 100);

    return {
      currentMileage,
      yearStart,
      yearProgress
    };
  }, [expenses]);

  // Préparation des données pour le graphique de répartition des dépenses
  const expenseDistribution = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [];
    }
    
    // Calculer les totaux par catégorie
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (!categoryTotals[expense.expense_type]) {
        categoryTotals[expense.expense_type] = 0;
      }
      categoryTotals[expense.expense_type] += expense.amount;
    });
    
    // Mapping des couleurs
    const categoryColors: Record<string, string> = {
      carburant: "#9b87f5",
      loyer: "#F97316",
      entretien: "#22c55e",
      assurance: "#06b6d4",
      reparation: "#ec4899",
      amende: "#ef4444",
      peage: "#f59e0b",
      autre: "#8b5cf6"
    };
    
    // Mapping des noms
    const categoryNames: Record<string, string> = {
      carburant: "Carburant",
      loyer: "Loyer/Crédit",
      entretien: "Entretien",
      assurance: "Assurance",
      reparation: "Réparation",
      amende: "Amendes",
      peage: "Péages",
      autre: "Autres"
    };
    
    // Créer les données pour le graphique
    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: categoryNames[category] || category,
      value,
      color: categoryColors[category] || "#8E9196"
    }));
  }, [expenses]);

  // Préparation des données pour le graphique de comparaison annuelle
  const yearlyComparison = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return [];
    }
    
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    // Filtrer les dépenses par année
    const currentYearExpenses = expenses.filter(expense => 
      new Date(expense.date).getFullYear() === currentYear
    );
    
    const previousYearExpenses = expenses.filter(expense => 
      new Date(expense.date).getFullYear() === previousYear
    );
    
    // Définir les catégories à comparer
    const categoriesToCompare = ["carburant", "entretien", "reparation", "assurance"];
    
    // Créer les données pour le graphique
    const comparisonData = categoriesToCompare.map(category => {
      const currentYearTotal = currentYearExpenses
        .filter(expense => expense.expense_type === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
        
      const previousYearTotal = previousYearExpenses
        .filter(expense => expense.expense_type === category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      // Mapping des noms
      const categoryNames: Record<string, string> = {
        carburant: "Carburant",
        entretien: "Entretien",
        reparation: "Réparation",
        assurance: "Assurance"
      };
      
      return {
        name: categoryNames[category] || category,
        currentYear: currentYearTotal,
        previousYear: previousYearTotal
      };
    });
    
    return comparisonData;
  }, [expenses]);

  return {
    stats,
    isLoading,
    chartData,
    mileageData,
    expenseDistribution,
    yearlyComparison
  };
};
