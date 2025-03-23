
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <motion.div
      className="grid gap-4 mt-6 w-full
                 grid-cols-1  // Mobile : une seule colonne (empilé verticalement)
                 lg:grid-cols-12" // LG (1024px ou plus) : disposition spécifique
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: isMobile ? 1 : 1.01 }} // Désactiver l'effet hover sur mobile
    >
      {/* Section principale Goal (prend toute la largeur sur mobile) */}
      <div className="col-span-12 lg:col-span-8 w-full">
        <SavingsGoal
          savingsPercentage={profile?.savings_goal_percentage || 0}
          totalMonthlyAmount={totalMonthlyAmount}
        />
      </div>

      {/* Section Pie Chart (masquée sur mobile) */}
      {!isMobile && (
        <div className="col-span-12 lg:col-span-4 w-full">
          <SavingsPieChart
            monthlySavings={monthlySavings || []}
            totalSavings={totalMonthlyAmount}
          />
        </div>
      )}
    </motion.div>
  );
};
