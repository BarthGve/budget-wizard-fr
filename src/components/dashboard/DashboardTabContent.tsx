
import { motion } from "framer-motion";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { useCreditsFetcher } from "./dashboard-tab/CreditsFetcher";
import { useCreditStats } from "./dashboard-tab/CreditStats";
import { useContributorMapper } from "./dashboard-tab/ContributorMapper";
import { useProfileFetcher } from "./dashboard-tab/ProfileFetcher";
import { useDashboardPreferencesResolver } from "@/hooks/useDashboardPreferencesResolver";
import { DashboardCardsSection } from "./dashboard-sections/DashboardCardsSection";
import { ExpenseStatsWrapper } from "./dashboard-sections/ExpenseStatsWrapper";
import { ChartsWrapper } from "./dashboard-sections/ChartsWrapper";
import { ContributorsWrapper } from "./dashboard-sections/ContributorsWrapper";
import { defaultDashboardPreferences } from "@/utils/dashboard-preferences";

interface DashboardTabContentProps {
  revenue: number;
  expenses: number; // Nous n'utilisons plus cette valeur directement
  savings: number;
  balance: number;
  savingsGoal: number;
  contributors: Array<{
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner: boolean;
    profile_id: string;
  }>;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  expenseShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  recurringExpenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  currentView: "monthly" | "yearly";
  fuelExpensesTotal?: number;
  fuelExpensesCount?: number;
  fuelVolume?: number;
  hasActiveVehicles?: boolean;
}

// Animation simplifiée
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const DashboardTabContent = ({
  revenue,
  expenses, // On garde pour des raisons de compatibilité, mais on n'utilise pas
  savings,
  balance,
  savingsGoal,
  contributors,
  contributorShares,
  expenseShares,
  recurringExpenses,
  monthlySavings,
  currentView,
  fuelExpensesTotal = 0,
  fuelExpensesCount = 0,
  fuelVolume = 0,
  hasActiveVehicles = false,
}: DashboardTabContentProps) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Utiliser le hook useExpenseStats pour obtenir les statistiques de dépenses
  const { expensesTotal } = useExpenseStats(currentView);
  const { data: credits = [] } = useCreditsFetcher();
  const { totalMensualites } = useCreditStats({ credits, firstDayOfMonth });
  const mappedContributors = useContributorMapper({ contributors });
  const { data: profile } = useProfileFetcher();
  
  const { dashboardPrefs = defaultDashboardPreferences } = useDashboardPreferencesResolver(profile);

  // Gérer les erreurs potentielles
  try {
    return (
      <motion.div 
        className="space-y-8 max-w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <DashboardCardsSection 
          revenue={revenue}
          expenses={expensesTotal} // Utiliser expensesTotal au lieu de expenses
          totalMensualites={totalMensualites}
          savings={savings}
          savingsGoal={savingsGoal}
          contributorShares={contributorShares}
          recurringExpenses={recurringExpenses.map(expense => ({
            amount: expense.amount,
            debit_day: expense.debit_day,
            debit_month: expense.debit_month,
            periodicity: expense.periodicity
          }))}
          currentView={currentView}
          dashboardPreferences={dashboardPrefs}
        />
        
        <ExpenseStatsWrapper 
          totalExpenses={expensesTotal}
          viewMode={currentView}
          totalFuelExpenses={fuelExpensesTotal}
          fuelVolume={fuelVolume}
          fuelExpensesCount={fuelExpensesCount}
          profile={profile}
          hasActiveVehicles={hasActiveVehicles}
          dashboardPreferences={dashboardPrefs}
        />
        
        <ChartsWrapper 
          expenses={expensesTotal} // Utiliser expensesTotal au lieu de expenses
          savings={savings}
          totalMensualites={totalMensualites}
          credits={credits}
          recurringExpenses={recurringExpenses}
          monthlySavings={monthlySavings}
          dashboardPreferences={dashboardPrefs}
        />
        
        <ContributorsWrapper 
          contributors={mappedContributors}
          expenses={expensesTotal} // Utiliser expensesTotal au lieu de expenses
          totalMensualites={totalMensualites}
          dashboardPreferences={dashboardPrefs}
        />
      </motion.div>
    );
  } catch (error) {
    console.error("Erreur dans DashboardTabContent:", error);
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-800/30">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Impossible de charger le contenu</h3>
        <p className="text-red-600 dark:text-red-400">Un problème est survenu lors du chargement des données du tableau de bord.</p>
      </div>
    );
  }
};
