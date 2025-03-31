
import { motion } from "framer-motion";
import { ExpenseStatsSection } from "../dashboard-tab/ExpenseStats";
import { DashboardPreferences } from "@/types/profile";

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
  dashboardPreferences
}: ExpenseStatsWrapperProps) => {
  if (!dashboardPreferences.show_expense_stats) return null;

  return (
    <motion.div variants={sectionVariants}>
      <ExpenseStatsSection 
        totalExpenses={totalExpenses}
        viewMode={viewMode}
        totalFuelExpenses={totalFuelExpenses}
        fuelVolume={fuelVolume}
        fuelExpensesCount={fuelExpensesCount}
        profile={profile}
        hasActiveVehicles={hasActiveVehicles}
      />
    </motion.div>
  );
};
