
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState, useMemo, memo, useEffect } from "react";
import { DashboardTabContent } from "@/components/dashboard/DashboardTabContent";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/DashboardHeader";
import { DashboardBanners } from "@/components/dashboard/dashboard-banners/DashboardBanners";
import { useDashboardViewCalculations } from "@/hooks/useDashboardViewCalculations";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { useIncomeVerification } from "@/hooks/useIncomeVerification";
import { OnboardingDialog } from "@/components/auth/OnboardingDialog";
import CardLoader from "@/components/ui/cardloader";

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
  const { contributors, monthlySavings, profile, recurringExpenses, refetch } = useDashboardData();
  const { fuelExpensesTotal, fuelExpensesCount, fuelVolume } = useExpenseStats(currentView);
  const { showOnboardingDialog, setShowOnboardingDialog } = useIncomeVerification();
  const [isLoading, setIsLoading] = useState(true);

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
  
  // Automatiquement refetch les données après le montage
  useEffect(() => {
    // Rafraîchir les données après le montage
    const fetchTimeout = setTimeout(() => {
      refetch();
    }, 300);
    
    // Masquer le loader après un certain temps pour éviter de rester bloqué
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    
    return () => {
      clearTimeout(fetchTimeout);
      clearTimeout(loadingTimeout);
    };
  }, [refetch]);
  
  // Gérer la fin du chargement
  useEffect(() => {
    if (contributors && monthlySavings && recurringExpenses) {
      setIsLoading(false);
    }
  }, [contributors, monthlySavings, recurringExpenses]);

  // Fonction memoizée pour changer la vue
  const handleViewChange = useMemo(() => {
    return (view: "monthly" | "yearly") => {
      setCurrentView(view);
    };
  }, []);

  // Afficher le loader pendant le chargement initial
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
          <CardLoader />
          <p className="text-gray-500 mt-4">Chargement de votre tableau de bord...</p>
        </div>
      </DashboardLayout>
    );
  }

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
          fuelExpensesTotal={fuelExpensesTotal}
          fuelExpensesCount={fuelExpensesCount}
          fuelVolume={fuelVolume}
        />

        {/* Onboarding Dialog */}
        <OnboardingDialog
          open={showOnboardingDialog}
          onOpenChange={setShowOnboardingDialog}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
