import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { useDashboardQueries } from "@/hooks/useDashboardQueries";
import StyledLoader from "@/components/ui/StyledLoader";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  // État pour gérer le mode d'affichage (mensuel/annuel)
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const { user } = useAuth();
  
  // Données du tableau de bord
  const { dashboardData, refetchDashboard, isLoading, error } = useDashboardQueries(user?.id);

  // Récupérer les statistiques des dépenses, y compris les dépenses carburant
  const { 
    expensesTotal, 
    fuelExpensesTotal, 
    fuelExpensesCount, 
    fuelVolume,
    hasActiveVehicles 
  } = useExpenseStats(currentView);

  // Rafraîchir les données lorsque le composant est monté
  useEffect(() => {
    if (user?.id) {
      console.log("Rafraîchissement des données du dashboard au montage");
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.5 }
    }
  };

  // Afficher un loader pendant le chargement ou en cas d'erreur
  if (isLoading || !dashboardData || !user) {
    return <StyledLoader />;
  }
  
  // Gérer les cas d'erreur
  if (error) {
    console.error("Erreur dans le dashboard:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Erreur de chargement</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Une erreur est survenue lors du chargement de vos données.
        </p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => refetchDashboard()}
        >
          Réessayer
        </button>
      </div>
    );
  }

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
        />
      </motion.div>
    </TooltipProvider>
  );
};

export default Dashboard;
