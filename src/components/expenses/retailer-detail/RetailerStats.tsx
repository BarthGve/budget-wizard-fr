
import { RetailerStatsCard } from "@/components/expenses/RetailerStatsCard";
import { Calendar, Wallet, Calculator } from "lucide-react";
import { motion } from "framer-motion";

interface RetailerStatsProps {
  monthlyTotal: number;
  monthlyCount: number;
  yearlyTotal: number;
  yearlyCount: number;
  monthlyAverage: number;
  monthlyAverageCount: number;
  previousMonthTotal?: number;
  previousYearTotal?: number;
  className?: string;
}

export function RetailerStats({
  monthlyTotal,
  monthlyCount,
  yearlyTotal,
  yearlyCount,
  monthlyAverage,
  monthlyAverageCount,
  previousMonthTotal,
  previousYearTotal,
  className
}: RetailerStatsProps) {
  // Animation variants pour l'apparition des cartes
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

  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className || ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Carte des dépenses mensuelles */}
      <motion.div variants={itemVariants}>
        <RetailerStatsCard
          title="Dépenses du mois"
          amount={monthlyTotal}
          count={monthlyCount}
          label="achats ce mois-ci"
          className="border shadow-lg overflow-hidden bg-gradient-to-br from-tertiary-50 to-tertiary-100 dark:from-tertiary-900/20 dark:to-tertiary-800/10"
          previousAmount={previousMonthTotal}
          icon={<Calendar className="h-5 w-5 text-tertiary-500 dark:text-tertiary-300" />}
          colorScheme="tertiary"
        />
      </motion.div>
      
      {/* Carte des dépenses annuelles */}
      <motion.div variants={itemVariants} >
        <RetailerStatsCard
          title="Dépenses de l'année"
          amount={yearlyTotal}
          count={yearlyCount}
          label="achats cette année"
          className="border shadow-lg overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10"
          previousAmount={previousYearTotal}
          icon={<Wallet className="h-5 w-5 text-purple-500 dark:text-purple-300" />}
          colorScheme="purple"
        />
      </motion.div>
      
      {/* Carte de la moyenne mensuelle */}
      <motion.div variants={itemVariants} >
        <RetailerStatsCard
          title="Moyenne mensuelle"
          amount={monthlyAverage}
          count={monthlyAverageCount}
          label="achats par mois"
          className="border shadow-lg overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10"
          icon={<Calculator className="h-5 w-5 text-amber-500 dark:text-amber-300" />}
          colorScheme="amber"
        />
      </motion.div>
    </motion.div>
  );
}
