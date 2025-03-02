
import { RevenueCard } from "../RevenueCard";
import { ExpensesCard } from "../ExpensesCard";
import { CreditCard } from "../CreditCard";
import { SavingsCard } from "../SavingsCard";
import { motion } from "framer-motion";

interface DashboardCardsProps {
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
}

export const DashboardCards = ({
  revenue,
  expenses,
  totalMensualites,
  savings,
  savingsGoal,
  contributorShares,
  recurringExpenses,
}: DashboardCardsProps) => {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <RevenueCard
          totalRevenue={revenue}
          contributorShares={contributorShares}
        />
            <motion.div variants={itemVariants}>
        <CreditCard
          totalMensualites={totalMensualites}
          totalRevenue={revenue}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ExpensesCard
          totalExpenses={expenses}
          recurringExpenses={recurringExpenses}
        />
      </motion.div>
  
      </motion.div>
      <motion.div variants={itemVariants}>
        <SavingsCard
          totalMonthlySavings={savings}
          savingsGoal={savingsGoal}
        />
      </motion.div>
    </motion.div>
  );
};
