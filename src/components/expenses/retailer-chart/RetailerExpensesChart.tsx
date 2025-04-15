
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useChartDisplay } from "./hooks/useChartDisplay";
import { ExpensesChartHeader } from "./components/ExpensesChartHeader";
import { ChartBackground } from "./components/ChartBackground";
import { EmptyChart } from "./components/EmptyChart";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerExpensesChartProps {
  expenses: Expense[];
}

export function RetailerExpensesChart({ expenses }: RetailerExpensesChartProps) {
  const { viewMode, isMobileScreen, handleViewModeChange } = useChartDisplay();
  const [dataVersion, setDataVersion] = useState(0);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  // Si on est sur mobile, ne pas afficher le composant du tout
  if (isMobileScreen) {
    return null;
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-lg",
        // Light mode
        "bg-white border-blue-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:border-tertiary-800/50 dark:shadow-tertiary-900/10"
      )}>
        <ChartBackground />
        
        <CardHeader className="relative z-10">
          <ExpensesChartHeader 
            viewMode={viewMode} 
            onViewModeChange={handleViewModeChange} 
          />
        </CardHeader>
        
        <CardContent className="pt-4 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`chart-${viewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {expenses.length > 0 ? (
                <ExpensesChart expenses={expenses} viewMode={viewMode} />
              ) : (
                <EmptyChart />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
