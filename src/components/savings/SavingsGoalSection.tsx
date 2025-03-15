import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { motion } from "framer-motion";

// Définition des types des props
interface SavingsGoalSectionProps {
  profile: {
    savings_goal_percentage: number;
  } | null;
  totalMonthlyAmount: number;
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
  }> | null;
}

// Composant principal
export const SavingsGoalSection = ({
  profile,
  totalMonthlyAmount,
  monthlySavings,
}: SavingsGoalSectionProps) => {
  return (
    <motion.div
      className="grid gap-4 mt-6 
                 grid-cols-1  // Mobile : une seule colonne (empilé verticalement)
                 sm:grid-cols-2  // Sm (640px ou plus) : deux colonnes
                 lg:grid-cols-12" // LG (1024px ou plus) : disposition spécifique
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Section principale Goal (Responsive : prend plus d'espace sur lg) */}
      <div className="col-span-12 sm:col-span-1 lg:col-span-8">
        <SavingsGoal
          savingsPercentage={profile?.savings_goal_percentage || 0}
          totalMonthlyAmount={totalMonthlyAmount}
        />
      </div>

      {/* Section Pie Chart (Responsive : prend moins d'espace sur lg) */}
      <div className="col-span-12 sm:col-span-1 lg:col-span-4">
        <SavingsPieChart
          monthlySavings={monthlySavings || []}
          totalSavings={totalMonthlyAmount}
        />
      </div>
    </motion.div>
  );
};
