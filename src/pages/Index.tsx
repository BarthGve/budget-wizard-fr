
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState } from "react";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { DashboardBanners } from "@/components/dashboard/dashboard-banners/DashboardBanners";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const { contributors, monthlySavings, profile, recurringExpenses } = useDashboardData();

  // Obtenir le nom du mois courant
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });
  
  // Utiliser le hook personnalisé pour les calculs
  const dashboardData = useDashboardViewCalculations(
    currentView,
    contributors,
    monthlySavings,
    recurringExpenses,
    profile
  );

  // Animation variants pour l'effet de stagger
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

  return (
    <DashboardLayout>
      <motion.div 
        className="grid gap-6 mt-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* En-tête du dashboard avec sélecteur de vue */}
        <DashboardHeader 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          currentMonthName={currentMonthName} 
        />

        {/* Bandeaux de création */}
        <DashboardBanners />
        
        {/* Contenu principal du tableau de bord */}
        <DashboardTabContent
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
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
