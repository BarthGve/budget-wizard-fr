
import React, { useEffect, useMemo } from "react";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { useDashboardOptimized } from "@/hooks/useDashboardOptimized";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/skeletons/DashboardSkeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useState } from "react";
import { prefetchCriticalData } from "@/utils/cacheOptimization";
import { useQueryClient } from "@tanstack/react-query";

const DashboardOptimized = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const queryClient = useQueryClient();
  
  // Hook principal optimisé
  const { 
    dashboardData, 
    isLoading: isDashboardLoading, 
    refreshDashboard,
    contributors,
    recurringExpenses,
    monthlySavings,
    profile
  } = useDashboardOptimized();

  // Statistiques des dépenses optimisées
  const { 
    expensesTotal, 
    fuelExpensesTotal, 
    fuelExpensesCount, 
    fuelVolume,
    hasActiveVehicles,
    isLoading: isStatsLoading
  } = useExpenseStats(currentView);

  // Calculs mémorisés du dashboard
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
    contributors,
    monthlySavings,
    recurringExpenses,
    profile
  );

  // Préchargement des données critiques
  useEffect(() => {
    if (profile?.id) {
      prefetchCriticalData(queryClient, profile.id);
    }
  }, [profile?.id, queryClient]);

  // Nom du mois actuel mémorisé
  const currentMonthName = useMemo(() => {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return months[new Date().getMonth()];
  }, []);

  // Animation optimisée
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }), []);

  const isLoading = isDashboardLoading || isStatsLoading;

  // Gestion d'erreur simplifiée
  if (!dashboardData && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-red-500 mb-2">Erreur de chargement</h2>
        <p className="text-gray-600">Un problème est survenu lors du chargement du tableau de bord.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={refreshDashboard}
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
        <DashboardHeader 
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentMonthName={currentMonthName}
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
            contributors={contributors}
            contributorShares={contributorShares}
            expenseShares={expenseShares}
            recurringExpenses={recurringExpensesForChart || []}
            monthlySavings={monthlySavingsForChart || []}
            currentView={currentView}
            fuelExpensesTotal={fuelExpensesTotal}
            fuelExpensesCount={fuelExpensesCount}
            fuelVolume={fuelVolume}
            hasActiveVehicles={hasActiveVehicles}
            savingsProjects={dashboardData?.savingsProjects || []}
          />
        )}
      </motion.div>
    </TooltipProvider>
  );
};

export default DashboardOptimized;
