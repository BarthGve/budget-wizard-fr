
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { motion } from "framer-motion";

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

export const SavingsGoalSection = ({ 
  profile, 
  totalMonthlyAmount, 
  monthlySavings 
}: SavingsGoalSectionProps) => {
  return (
    <motion.div 
      className="grid gap-4 grid-cols-12 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="col-span-8">
        <SavingsGoal 
          savingsPercentage={profile?.savings_goal_percentage || 0} 
          totalMonthlyAmount={totalMonthlyAmount} 
        />
      </div>
      <div className="col-span-4">
        <SavingsPieChart 
          monthlySavings={monthlySavings || []} 
          totalSavings={totalMonthlyAmount} 
        />
      </div>
    </motion.div>
  );
};
