
import { motion } from "framer-motion";
import { DashboardPreferences } from "@/types/profile";
import { DashboardCards } from "../dashboard-tab/DashboardCards";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

interface DashboardCardsSectionProps {
  revenue: number;
  expenses: number;
  totalMensualites: number;
  savings: number;
  savingsGoal: number;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  recurringExpenses: Array<{
    amount: number;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  currentView: "monthly" | "yearly";
  dashboardPreferences: DashboardPreferences;
}

/**
 * Section des cartes de statistiques dans le tableau de bord
 */
export const DashboardCardsSection = ({
  revenue,
  expenses,
  totalMensualites,
  savings,
  savingsGoal,
  contributorShares,
  recurringExpenses,
  currentView,
  dashboardPreferences,
}: DashboardCardsSectionProps) => {
  const shouldRenderCards = 
    dashboardPreferences.show_revenue_card || 
    dashboardPreferences.show_expenses_card || 
    dashboardPreferences.show_credits_card || 
    dashboardPreferences.show_savings_card;

  if (!shouldRenderCards) return null;

  return (
    <motion.div variants={sectionVariants}>
  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Budget</h2>
  <DashboardCards 
    revenue={revenue}
    expenses={expenses}
    totalMensualites={totalMensualites}
    savings={savings}
    savingsGoal={savingsGoal}
    contributorShares={contributorShares}
    recurringExpenses={recurringExpenses}
    currentView={currentView}
    dashboardPreferences={dashboardPreferences}
  />
</motion.div>
  );
};
