
import { memo } from "react";
import { motion } from "framer-motion";
import { MonthlyExpensesCard } from "../MonthlyExpensesCard";
import { VehicleFuelExpensesCard } from "../VehicleFuelExpensesCard";
import { SavingsProjectsCard } from "../SavingsProjectsCard";
import { DashboardPreferences } from "@/types/profile";
import { SavingsProject } from "@/types/savings-project";

const MemoizedMonthlyExpensesCard = memo(MonthlyExpensesCard);
const MemoizedVehicleFuelExpensesCard = memo(VehicleFuelExpensesCard);
const MemoizedSavingsProjectsCard = memo(SavingsProjectsCard);

// Animation variants
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

interface ExpenseStatsProps {
  totalExpenses: number;
  viewMode: "monthly" | "yearly";
  totalFuelExpenses: number;
  fuelVolume?: number;
  fuelExpensesCount?: number;
  profile: any;
  hasActiveVehicles: boolean;
  savingsProjects?: SavingsProject[];
  dashboardPreferences: DashboardPreferences;
}

/**
 * Composant qui affiche les statistiques des dépenses
 */
export const ExpenseStatsSection = ({
  totalExpenses,
  viewMode,
  totalFuelExpenses,
  fuelVolume = 0,
  fuelExpensesCount = 0,
  profile,
  hasActiveVehicles,
  savingsProjects = [],
  dashboardPreferences
}: ExpenseStatsProps) => {
  // Déterminer si la carte des projets d'épargne doit être affichée
  const shouldShowSavingsProjectsCard = dashboardPreferences.show_savings_projects_card && savingsProjects.length > 0;

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-3"
      variants={rowVariants}
    >
      <MemoizedMonthlyExpensesCard 
        totalExpenses={totalExpenses} 
        viewMode={viewMode}
      />
      <MemoizedVehicleFuelExpensesCard 
        totalFuelExpenses={totalFuelExpenses}
        fuelVolume={fuelVolume}
        fuelExpensesCount={fuelExpensesCount}
        profile={profile}
        viewMode={viewMode}
        hasActiveVehicles={hasActiveVehicles}
      />
      {shouldShowSavingsProjectsCard && (
        <MemoizedSavingsProjectsCard
          savingsProjects={savingsProjects}
        />
      )}
    </motion.div>
  );
};
