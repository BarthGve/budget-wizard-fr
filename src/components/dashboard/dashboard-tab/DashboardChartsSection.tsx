
import { memo } from "react";
import { motion } from "framer-motion";
import { DashboardCharts } from "../dashboard-content/DashboardCharts";

const MemoizedDashboardCharts = memo(DashboardCharts);

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

/**
 * Composant qui affiche les graphiques du dashboard
 */
export const DashboardChartsSection = ({
  expenses,
  savings,
  totalMensualites,
  credits,
  recurringExpenses,
  monthlySavings,
}: DashboardChartsProps) => {
  return (
    <motion.div variants={rowVariants}>
      <MemoizedDashboardCharts
        expenses={expenses}
        savings={savings}
        totalMensualites={totalMensualites}
        credits={credits}
        recurringExpenses={recurringExpenses}
        monthlySavings={monthlySavings}
      />
    </motion.div>
  );
};
