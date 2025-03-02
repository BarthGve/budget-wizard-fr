
import { RecurringExpensesPieChart } from "../RecurringExpensesPieChart";
import { SavingsPieChart } from "../SavingsPieChart";
import { CreditsPieChart } from "../CreditsPieChart";
import { motion } from "framer-motion";

interface DashboardChartsProps {
  expenses: number;
  savings: number;
  totalMensualites: number;
  credits: any[] | null;
  recurringExpenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  monthlySavings: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
}

export const DashboardCharts = ({
  expenses,
  savings,
  totalMensualites,
  credits,
  recurringExpenses,
  monthlySavings,
}: DashboardChartsProps) => {
  // Animation variants for container
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
      className="grid gap-6 md:grid-cols-3"
      variants={containerVariants}
    >
      {recurringExpenses.length > 0 && (
        <motion.div variants={itemVariants}>
          <RecurringExpensesPieChart
            recurringExpenses={recurringExpenses}
            totalExpenses={expenses}
          />
        </motion.div>
      )}
      {credits && credits.length > 0 && (
        <motion.div variants={itemVariants}>
          <CreditsPieChart
            credits={credits}
            totalMensualites={totalMensualites}
          />
        </motion.div>
      )}
      {monthlySavings.length > 0 && (
        <motion.div variants={itemVariants}>
          <SavingsPieChart
            monthlySavings={monthlySavings}
            totalSavings={savings}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
