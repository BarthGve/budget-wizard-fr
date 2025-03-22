
import { motion } from "framer-motion";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";

interface ChartContentProps {
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
    comment?: string;
    retailer_id: string;
  }>;
  viewMode: 'monthly' | 'yearly';
}

export function ChartContent({ expenses, viewMode }: ChartContentProps) {
  return (
    <motion.div
      key={`chart-${viewMode}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <ExpensesChart expenses={expenses} viewMode={viewMode} />
    </motion.div>
  );
}
