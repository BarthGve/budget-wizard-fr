
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { useDashboardOptimized } from "@/hooks/useDashboardOptimized";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { useRealtimeManager } from "@/hooks/useRealtimeManager";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { useState, useMemo } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons/DashboardSkeleton";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  
  // Gestionnaire temps réel optimisé
  useRealtimeManager();

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

  // Récupérer l'ID utilisateur de manière optimisée
  const { data: { user } = {}, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes de cache
  });

  // Statistiques des dépenses optimisées
  const { 
    expensesTotal, 
    fuelExpensesTotal, 
    fuelExpensesCount, 
    fuelVolume,
    hasActiveVehicles,
    isLoading: isStatsLoading
  } = useExpenseStats(currentView);

  // Rafraîchir les données lors du montage si nécessaire
  useEffect(() => {
    if (user?.id && !dashboardData) {
      refreshDashboard();
    }
  }, [user?.id, dashboardData, refreshDashboard]);
  
  // Calculs optimisés du dashboard
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

  // Vérifier si les données sont en cours de chargement
  const isLoading = isUserLoading || isDashboardLoading || isStatsLoading;

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
            contributors={contributors || []}
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

export default Dashboard;
