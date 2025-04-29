
import { motion } from "framer-motion";
import { DashboardPreferences } from "@/types/profile";
import { DashboardCards } from "../dashboard-tab/DashboardCards";
import { BarChart3 } from "lucide-react";

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
<motion.div variants={sectionVariants} className="mt-4">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
      <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-300" />
    </div>
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Tableau de bord</h2>
  </div>
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
