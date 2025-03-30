
import { motion } from "framer-motion";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { useCreditsFetcher } from "./dashboard-tab/CreditsFetcher";
import { useCreditStats } from "./dashboard-tab/CreditStats";
import { useContributorMapper } from "./dashboard-tab/ContributorMapper";
import { useProfileFetcher } from "./dashboard-tab/ProfileFetcher";
import { DashboardCards } from "./dashboard-tab/DashboardCards";
import { ExpenseStatsSection } from "./dashboard-tab/ExpenseStats";
import { DashboardChartsSection } from "./dashboard-tab/DashboardChartsSection";
import { ContributorsSection } from "./dashboard-tab/ContributorsSection";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DashboardPreferences } from "@/types/profile";

interface DashboardTabContentProps {
  revenue: number;
  expenses: number;
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
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Fonction utilitaire pour vérifier si un objet est du type DashboardPreferences
const isDashboardPreferences = (obj: any): obj is DashboardPreferences => {
  return obj !== null && 
         typeof obj === 'object' &&
         // Vérification des propriétés essentielles, même si null/undefined
         'show_revenue_card' in obj ||
         'show_expenses_card' in obj ||
         'show_credits_card' in obj ||
         'show_savings_card' in obj ||
         'show_expense_stats' in obj ||
         'show_charts' in obj ||
         'show_contributors' in obj;
};

export const DashboardTabContent = ({
  revenue,
  expenses,
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
}: DashboardTabContentProps) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  const { data: credits = [] } = useCreditsFetcher();
  const { expensesTotal, hasActiveVehicles } = useExpenseStats(currentView);
  const { totalMensualites } = useCreditStats({ credits, firstDayOfMonth });
  const mappedContributors = useContributorMapper({ contributors });
  const { data: profile } = useProfileFetcher();
  
  // Définir les préférences par défaut
  const defaultPreferences: DashboardPreferences = {
    show_revenue_card: true,
    show_expenses_card: true,
    show_credits_card: true,
    show_savings_card: true,
    show_expense_stats: true,
    show_charts: true,
    show_contributors: true
  };
  
  // Vérifier et convertir les préférences du tableau de bord
  let dashboardPrefs: DashboardPreferences = defaultPreferences;
  
  if (profile?.dashboard_preferences) {
    // Vérifier si les préférences du profil sont du type attendu
    if (isDashboardPreferences(profile.dashboard_preferences)) {
      // Fusionner avec les valeurs par défaut pour s'assurer que toutes les propriétés sont présentes
      dashboardPrefs = {
        ...defaultPreferences,
        ...profile.dashboard_preferences
      };
    } else {
      console.warn("Format de préférences du tableau de bord invalide, utilisation des valeurs par défaut");
    }
  }

  return (
    <motion.div 
      className="space-y-8 max-w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Afficher les cartes uniquement si au moins une des cartes est activée */}
      {(dashboardPrefs.show_revenue_card || 
        dashboardPrefs.show_expenses_card || 
        dashboardPrefs.show_credits_card || 
        dashboardPrefs.show_savings_card) && (
        <DashboardCards 
          revenue={revenue}
          expenses={expenses}
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
      )}
      
      {/* Afficher les statistiques de dépenses uniquement si activées */}
      {dashboardPrefs.show_expense_stats && (
        <ExpenseStatsSection 
          totalExpenses={expensesTotal}
          viewMode={currentView}
          totalFuelExpenses={fuelExpensesTotal}
          fuelVolume={fuelVolume}
          fuelExpensesCount={fuelExpensesCount}
          profile={profile}
          hasActiveVehicles={hasActiveVehicles}
        />
      )}
      
      {/* Afficher les graphiques uniquement si activés et si on n'est pas sur mobile */}
      {!isMobileScreen && dashboardPrefs.show_charts && (
        <DashboardChartsSection 
          expenses={expenses}
          savings={savings}
          totalMensualites={totalMensualites}
          credits={credits}
          recurringExpenses={recurringExpenses}
          monthlySavings={monthlySavings}
        />
      )}
      
      {/* Afficher la section des contributeurs uniquement si activée */}
      {dashboardPrefs.show_contributors && (
        <ContributorsSection 
          contributors={mappedContributors}
          expenses={expenses}
          totalMensualites={totalMensualites}
        />
      )}
    </motion.div>
  );
};
