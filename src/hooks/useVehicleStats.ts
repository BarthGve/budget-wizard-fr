import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleExpense } from "@/types/vehicle";
import { useEffect, useMemo, useState } from "react";
import { useVehicle } from "./queries/useVehicle";

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
  
  // Récupérer les informations du véhicule pour avoir la date d'acquisition
  const { data: vehicle } = useVehicle(vehicleId);

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

    // Filtrer les pleins de carburant avec volume
    const fuelExpenses = expenses.filter(
      (expense) => 
        expense.expense_type === "carburant" && 
        expense.fuel_volume && 
        expense.fuel_volume > 0
    );

    // Trier par date
    const sortedFuelExpenses = [...fuelExpenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculer la date limite pour l'année glissante (12 mois en arrière à partir d'aujourd'hui)
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Filtrer les dépenses des 12 derniers mois uniquement
    const rollingYearExpenses = sortedFuelExpenses.filter(
      expense => new Date(expense.date) >= oneYearAgo
    );

    // Créer les données pour le graphique - Changement majeur ici:
    // Maintenant, nous incluons tous les pleins de carburant, pas seulement ceux
    // pour lesquels on peut calculer une distance parcourue
    const consumptionData = rollingYearExpenses.map(expense => {
      const volume = expense.fuel_volume!;
      const price = expense.amount / volume;
      
      const date = new Date(expense.date);
      const month = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      return {
        date: expense.date,
        month: `${month} ${date.getFullYear()}`,
        price: parseFloat(price.toFixed(3)),
        volume: volume,
        mileage: expense.mileage
      };
    });

    return consumptionData;
  }, [expenses]);

  // Calcul des données pour le suivi du kilométrage
  const mileageData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { currentMileage: 0, yearStart: 0, yearProgress: 0 };
    }

    // On récupère l'année courante pour filtrer les dépenses
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    
    // Date d'acquisition du véhicule
    const acquisitionDate = vehicle ? new Date(vehicle.acquisition_date) : null;
    const wasAcquiredBeforeYearStart = acquisitionDate && acquisitionDate < startOfYear;
    
    // Trier toutes les dépenses par date (plus récentes en premier)
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Filtrer les dépenses de l'année en cours
    const currentYearExpenses = sortedExpenses.filter(
      expense => new Date(expense.date) >= startOfYear
    );
    
    // Trouver la dépense la plus récente de l'année courante avec un kilométrage
    let currentMileage = 0;
    const latestExpenseWithMileage = currentYearExpenses.find(
      expense => expense.mileage !== null && expense.mileage !== undefined
    );
    
    if (latestExpenseWithMileage) {
      // Si on a trouvé une dépense avec kilométrage dans l'année courante
      currentMileage = latestExpenseWithMileage.mileage!;
    } else {
      // Sinon, chercher dans les dépenses des années précédentes
      const previousExpenseWithMileage = sortedExpenses.find(
        expense => expense.mileage !== null && expense.mileage !== undefined
      );
      
      currentMileage = previousExpenseWithMileage ? previousExpenseWithMileage.mileage! : 0;
    }
    
    // Calculer le kilométrage au début de l'année
    // Filtrer les dépenses avant le début de l'année, triées de la plus récente à la plus ancienne
    const expensesBeforeYear = sortedExpenses.filter(
      expense => new Date(expense.date) < startOfYear
    );
    
    // Trouver la dernière dépense avec kilométrage avant le début de l'année
    let yearStart = 0;
    const lastExpenseBeforeYear = expensesBeforeYear.find(
      expense => expense.mileage !== null && expense.mileage !== undefined
    );
    
    if (lastExpenseBeforeYear) {
      // Si on a une dépense avec kilométrage avant le début de l'année
      yearStart = lastExpenseBeforeYear.mileage!;
    } else if (!wasAcquiredBeforeYearStart) {
      // Si le véhicule a été acquis après le début de l'année, on utilise 0
      yearStart = 0;
    } else {
      // Pour les autres cas, on prend 0 pour éviter des calculs négatifs
      yearStart = 0;
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
  }, [expenses, vehicle]);

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
