
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { useDashboardQueries } from "@/hooks/useDashboardQueries";
import StyledLoader from "@/components/ui/StyledLoader";
import { useExpenseCalculations } from "@/hooks/useExpenseCalculations";
import { useContributors } from "@/hooks/useContributors";
import { motion } from "framer-motion";
import { useRealtimeListeners } from "@/hooks/useRealtimeListeners";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useExpenseStats } from "@/hooks/useExpenseStats";

const Dashboard = () => {
  // Configurer les écouteurs de mises à jour en temps réel
  useRealtimeListeners();

  // Récupérer l'ID utilisateur
  const { data: { user } = {} } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  // Définir la vue par défaut
  const currentView = "monthly";

  // Récupérer les données des dépenses
  const { 
    expensesTotal,
    fuelExpensesTotal,
    fuelExpensesCount,
    fuelVolume,
    activeFuelExpensesTotal,
    activeFuelExpensesCount,
    activeFuelVolume,
    hasActiveVehicles
  } = useExpenseStats(currentView);

  // Données du tableau de bord
  const { dashboardData, refetchDashboard } = useDashboardQueries(user?.id);

  // Rafraîchir les données lorsque le composant est monté
  useEffect(() => {
    if (user?.id) {
      refetchDashboard();
    }
  }, [user?.id, refetchDashboard]);

  // Calculs des dépenses
  const { revenue, expenses, savings, balance, savingsGoal } = useExpenseCalculations(
    dashboardData?.monthlySavings,
    dashboardData?.recurringExpenses
  );

  // Données des contributeurs
  const { 
    contributorShares, 
    expenseShares 
  } = useContributors(dashboardData?.contributors || [], expenses);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.1, duration: 0.5 }
    }
  };

  // Afficher un loader pendant le chargement
  if (!dashboardData || !user) {
    return <StyledLoader />;
  }

  // Préparer les recurring expenses avec le bon typage pour periodicity
  const typedRecurringExpenses = dashboardData.recurringExpenses?.map(expense => ({
    ...expense,
    periodicity: expense.periodicity as "monthly" | "quarterly" | "yearly"
  })) || [];

  return (
    <TooltipProvider>
      <motion.div 
        className="container px-4 py-6 mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <DashboardTabContent
          revenue={revenue}
          expenses={expenses}
          savings={savings}
          balance={balance}
          savingsGoal={savingsGoal}
          contributors={dashboardData.contributors || []}
          contributorShares={contributorShares}
          expenseShares={expenseShares}
          recurringExpenses={typedRecurringExpenses}
          monthlySavings={dashboardData.monthlySavings || []}
          currentView={currentView}
          fuelExpensesTotal={fuelExpensesTotal}
          fuelExpensesCount={fuelExpensesCount}
          fuelVolume={fuelVolume}
          activeFuelExpensesTotal={activeFuelExpensesTotal}
          activeFuelExpensesCount={activeFuelExpensesCount}
          activeFuelVolume={activeFuelVolume}
        />
      </motion.div>
    </TooltipProvider>
  );
};

export default Dashboard;
