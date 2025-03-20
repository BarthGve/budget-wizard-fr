
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState, useMemo, memo } from "react";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { DashboardBanners } from "@/components/dashboard/dashboard-banners/DashboardBanners";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";

// Composants memoizés pour éviter les re-rendus inutiles
const MemoizedDashboardHeader = memo(DashboardHeader);
const MemoizedDashboardBanners = memo(DashboardBanners);
const MemoizedDashboardTabContent = memo(DashboardTabContent);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const { contributors, monthlySavings, profile, recurringExpenses } = useDashboardData();

  // Obtenir le nom du mois courant (memoizé)
  const currentMonthName = useMemo(() => {
    return new Date().toLocaleString('fr-FR', { month: 'long' });
  }, []);
  
  // Utiliser le hook personnalisé pour les calculs
  const dashboardData = useDashboardViewCalculations(
    currentView,
    contributors,
    monthlySavings,
    recurringExpenses,
    profile
  );

  // Fonction memoizée pour changer la vue
  const handleViewChange = useMemo(() => {
    return (view: "monthly" | "yearly") => {
      setCurrentView(view);
    };
  }, []);

  return (
    <DashboardLayout>
      <motion.div 
        className="grid mt-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* En-tête du dashboard avec sélecteur de vue */}
        <MemoizedDashboardHeader 
          currentView={currentView} 
          setCurrentView={handleViewChange} 
          currentMonthName={currentMonthName} 
        />

        {/* Bandeaux de création */}
        <MemoizedDashboardBanners />
        
        {/* Contenu principal du tableau de bord */}
        <MemoizedDashboardTabContent
          revenue={dashboardData.revenue}
          expenses={dashboardData.expenses}
          savings={dashboardData.savings}
          balance={dashboardData.balance}
          savingsGoal={dashboardData.savingsGoal}
          contributorShares={dashboardData.contributorShares}
          expenseShares={dashboardData.expenseShares}
          recurringExpenses={dashboardData.recurringExpensesForChart}
          monthlySavings={dashboardData.monthlySavingsForChart}
          contributors={contributors || []}
          currentView={currentView}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
