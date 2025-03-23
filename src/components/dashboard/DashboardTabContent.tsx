
import { motion } from "framer-motion";
import { useExpenseStats } from "@/hooks/useExpenseStats";
import { useCreditsFetcher } from "./dashboard-tab/CreditsFetcher";
import { useCreditStats } from "./dashboard-tab/CreditStats";
import { useContributorMapper } from "./dashboard-tab/ContributorMapper";
import { useProfileFetcher } from "./dashboard-tab/ProfileFetcher";
import { DashboardCardsSection } from "./dashboard-tab/DashboardCards";
import { ExpenseStatsSection } from "./dashboard-tab/ExpenseStats";
import { DashboardChartsSection } from "./dashboard-tab/DashboardChartsSection";
import { ContributorsSection } from "./dashboard-tab/ContributorsSection";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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

// Animation variants
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
  
  // Utiliser useMediaQuery pour détecter les petits écrans (smartphones)
  const isMobileScreen = useMediaQuery("(max-width: 768px)");

  // Utiliser les hooks extraits
  const { data: credits = [] } = useCreditsFetcher();
  const { expensesTotal } = useExpenseStats(currentView);
  const { totalMensualites } = useCreditStats({ credits, firstDayOfMonth });
  const mappedContributors = useContributorMapper({ contributors });
  const { data: profile } = useProfileFetcher();

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Section des cartes principales */}
      <DashboardCardsSection 
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
      />
      
      {/* Section des statistiques de dépenses */}
      <ExpenseStatsSection 
        totalExpenses={expensesTotal}
        viewMode={currentView}
        totalFuelExpenses={fuelExpensesTotal}
        fuelVolume={fuelVolume}
        fuelExpensesCount={fuelExpensesCount}
        profile={profile}
      />
      
      {/* Section des graphiques - masquée sur mobile */}
      {!isMobileScreen && (
        <DashboardChartsSection 
          expenses={expenses}
          savings={savings}
          totalMensualites={totalMensualites}
          credits={credits}
          recurringExpenses={recurringExpenses}
          monthlySavings={monthlySavings}
        />
      )}
      
      {/* Section des contributeurs */}
      <ContributorsSection 
        contributors={mappedContributors}
        expenses={expenses}
        totalMensualites={totalMensualites}
      />
    </motion.div>
  );
};
