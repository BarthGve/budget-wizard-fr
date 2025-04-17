
import { motion } from "framer-motion";
import { DashboardPreferences } from "@/types/profile";
import { DashboardCards } from "../dashboard-tab/DashboardCards";
import { SavingsProjectsCard } from "../SavingsProjectsCard";
import { SavingsProject } from "@/types/savings-project";

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
  savingsProjects?: SavingsProject[];
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
  savingsProjects = []
}: DashboardCardsSectionProps) => {
  const shouldRenderCards = 
    dashboardPreferences.show_revenue_card || 
    dashboardPreferences.show_expenses_card || 
    dashboardPreferences.show_credits_card || 
    dashboardPreferences.show_savings_card;

  const shouldRenderSavingsProjectsCard = 
    dashboardPreferences.show_savings_projects_card && savingsProjects.length > 0;

  if (!shouldRenderCards && !shouldRenderSavingsProjectsCard) return null;

  return (
    <motion.div variants={sectionVariants}>
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

      {shouldRenderSavingsProjectsCard && (
        <div className="mt-6">
          <SavingsProjectsCard
            savingsProjects={savingsProjects}
          />
        </div>
      )}
    </motion.div>
  );
};
