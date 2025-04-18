
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { useDashboardQueries } from "@/hooks/useDashboardQueries";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";
import { useContributors } from "@/hooks/useContributors";
import { motion } from "framer-motion";
import { useRealtimeListeners } from "@/hooks/useRealtimeListeners";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { useState } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons/DashboardSkeleton";

const Dashboard = () => {
  // État pour gérer le mode d'affichage (mensuel/annuel)
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  
  // Configurer les écouteurs de mises à jour en temps réel
  useRealtimeListeners();

  // Récupérer l'ID utilisateur
  const { data: { user } = {}, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  // Données du tableau de bord
  const { dashboardData, refetchDashboard, isLoading: isDashboardLoading } = useDashboardQueries(user?.id);

  // Récupérer les statistiques des dépenses, y compris les dépenses carburant
  const { 
    expensesTotal, 
    fuelExpensesTotal, 
    fuelExpensesCount, 
    fuelVolume,
    hasActiveVehicles,
    isLoading: isStatsLoading
  } = useExpenseStats(currentView);

  // Rafraîchir les données lorsque le composant est monté
  useEffect(() => {
    if (user?.id) {
      refetchDashboard();
    }
  }, [user?.id, refetchDashboard]);
  
  // Utiliser useDashboardViewCalculations pour prendre en compte la vue actuelle
  const {
    revenue,
    expenses,
    savings,
    balance,
    savingsGoal,
    contributorShares,
    expenseShares,
    recurringExpensesForChart,
    monthlySavingsForChart
  } = useDashboardViewCalculations(
    currentView,
    dashboardData?.contributors,
    dashboardData?.monthlySavings,
    dashboardData?.recurringExpenses,
    dashboardData?.profile
  );

  // Obtenir le nom du mois actuel
  const getCurrentMonthName = () => {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return months[new Date().getMonth()];
  };

  // Animation simplifiée
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Vérifier si les données sont en cours de chargement
  const isLoading = isUserLoading || isDashboardLoading || isStatsLoading || !dashboardData;

  // Ajouter une gestion des erreurs et un fallback
  try {
    return (
      <TooltipProvider>
        <motion.div 
          className="container px-4 py-6 mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Ajouter l'en-tête du tableau de bord */}
          <DashboardHeader 
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentMonthName={getCurrentMonthName()}
          />
          
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <DashboardTabContent
              revenue={revenue}
              expenses={expenses}
              savings={savings}
              balance={balance}
              savingsGoal={savingsGoal}
              contributors={dashboardData.contributors || []}
              contributorShares={contributorShares}
              expenseShares={expenseShares}
              recurringExpenses={recurringExpensesForChart || []}
              monthlySavings={monthlySavingsForChart || []}
              currentView={currentView}
              fuelExpensesTotal={fuelExpensesTotal}
              fuelExpensesCount={fuelExpensesCount}
              fuelVolume={fuelVolume}
              hasActiveVehicles={hasActiveVehicles}
              savingsProjects={dashboardData.savingsProjects || []}
            />
          )}
        </motion.div>
      </TooltipProvider>
    );
  } catch (error) {
    console.error("Erreur lors du rendu du tableau de bord:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-red-500 mb-2">Erreur de chargement</h2>
        <p className="text-gray-600">Un problème est survenu lors du chargement du tableau de bord.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Actualiser la page
        </button>
      </div>
    );
  }
};

export default Dashboard;
