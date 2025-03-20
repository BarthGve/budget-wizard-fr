
import { VehicleExpenseStatsCard } from "./VehicleExpenseStatsCard";
import { useVehicleExpenseStats } from "@/hooks/useVehicleExpenseStats";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { Droplets, DollarSign } from "lucide-react";
import { formatVolume, formatPricePerLiter } from "@/utils/format";
import { motion } from "framer-motion";

interface VehicleExpenseStatsProps {
  vehicleId: string;
}

export const VehicleExpenseStats = ({ vehicleId }: VehicleExpenseStatsProps) => {
  const { expenses, isLoading } = useVehicleExpenses(vehicleId);
  const stats = useVehicleExpenseStats(expenses);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
        <div className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
      </div>
    );
  }
  
  const yearToDateStats = stats.yearToDateExpenses;
  
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <VehicleExpenseStatsCard
          title="Dépenses de carburant"
          amount={yearToDateStats.totalFuelExpense}
          description={`${yearToDateStats.expenseCount > 0 ? 'Année en cours' : 'Aucune dépense cette année'}`}
          secondaryValue={yearToDateStats.totalFuelVolume > 0 
            ? `${formatVolume(yearToDateStats.totalFuelVolume)} • ${formatPricePerLiter(yearToDateStats.averageFuelPrice)}`
            : undefined}
          icon={<Droplets className="h-5 w-5" />}
          colorScheme="green"
        />
      </motion.div>
      
      <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <VehicleExpenseStatsCard
          title="Total des dépenses"
          amount={yearToDateStats.totalExpense}
          description={`${yearToDateStats.expenseCount} dépense(s) cette année`}
          icon={<DollarSign className="h-5 w-5" />}
          colorScheme="purple"
        />
      </motion.div>
    </motion.div>
  );
};
