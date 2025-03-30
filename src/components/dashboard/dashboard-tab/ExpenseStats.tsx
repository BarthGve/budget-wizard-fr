
import { memo } from "react";
import { motion } from "framer-motion";
import { MonthlyExpensesCard } from "../MonthlyExpensesCard";
import { VehicleFuelExpensesCard } from "../VehicleFuelExpensesCard";

const MemoizedMonthlyExpensesCard = memo(MonthlyExpensesCard);
const MemoizedVehicleFuelExpensesCard = memo(VehicleFuelExpensesCard);

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
  fuelVolume: number;
  fuelExpensesCount: number;
  profile: any;
  hasActiveVehicles?: boolean;
}

/**
 * Composant qui affiche les statistiques des dépenses
 */
export const ExpenseStatsSection = ({
  totalExpenses,
  viewMode,
  totalFuelExpenses,
  fuelVolume,
  fuelExpensesCount,
  profile,
  hasActiveVehicles = false
}: ExpenseStatsProps) => {
  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2"
      variants={rowVariants}
    >
      <MemoizedMonthlyExpensesCard 
        totalExpenses={totalExpenses} 
        viewMode={viewMode}
      />
      
      {/* N'afficher la carte carburant que s'il y a des véhicules actifs */}
      {hasActiveVehicles && (
        <MemoizedVehicleFuelExpensesCard 
          totalFuelExpenses={totalFuelExpenses}
          fuelVolume={fuelVolume}
          fuelExpensesCount={fuelExpensesCount}
          profile={profile}
          viewMode={viewMode}
        />
      )}
    </motion.div>
  );
};
