
import { motion } from "framer-motion";
import { ExpenseStatsSection } from "../dashboard-tab/ExpenseStats";
import { DashboardPreferences } from "@/types/profile";
import { SavingsProject } from "@/types/savings-project";
import { WalletCards } from "lucide-react";

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

interface ExpenseStatsWrapperProps {
  totalExpenses: number;
  viewMode: "monthly" | "yearly";
  totalFuelExpenses: number;
  fuelVolume: number;
  fuelExpensesCount: number;
  profile: any;
  hasActiveVehicles: boolean;
  dashboardPreferences: DashboardPreferences;
  savingsProjects?: SavingsProject[];
}

/**
 * Wrapper pour la section des statistiques de dépenses
 */
export const ExpenseStatsWrapper = ({
  totalExpenses,
  viewMode,
  totalFuelExpenses,
  fuelVolume,
  fuelExpensesCount,
  profile,
  hasActiveVehicles,
  dashboardPreferences,
  savingsProjects = []
}: ExpenseStatsWrapperProps) => {
  if (!dashboardPreferences.show_expense_stats) return null;

  return (
    <motion.div variants={sectionVariants}>
      <div className="flex items-center justify-between mb-4">
        <h2 className=
          "font-bold tracking-tight text-xl flex items-center gap-2 
         
          bg-gradient-to-r from-primary-600 to-primary-500  bg-clip-text text-transparent
         dark:from-primary-400 dark:to-primary-200"
        >
          <div className="p-1 rounded bg-primary-100 dark:bg-primay-800/40"
          >
            <WalletCards className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          </div>
          Dépenses
        </h2>
  </div>
      <ExpenseStatsSection 
        totalExpenses={totalExpenses}
        viewMode={viewMode}
        totalFuelExpenses={totalFuelExpenses}
        fuelVolume={fuelVolume}
        fuelExpensesCount={fuelExpensesCount}
        profile={profile}
        hasActiveVehicles={hasActiveVehicles}
        savingsProjects={savingsProjects}
        dashboardPreferences={dashboardPreferences}
      />
    </motion.div>
  );
};
