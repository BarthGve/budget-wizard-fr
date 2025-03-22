
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { Calendar, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useViewModeToggle } from "./chart/useViewModeToggle";
import { ChartEmptyState } from "./chart/ChartEmptyState";
import { ChartHeader } from "./chart/ChartHeader";
import { ChartContent } from "./chart/ChartContent";

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
  // Utiliser un hook personnalisé pour la gestion du mode d'affichage
  const { viewMode, toggleViewMode } = useViewModeToggle();
  
  // Animations communes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-sm",
        // Light mode
        "bg-white border-blue-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:border-blue-800/50 dark:shadow-blue-900/10"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          // Light mode
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
          // Dark mode
          "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
        )} />
        
        <ChartHeader 
          viewMode={viewMode} 
          toggleViewMode={toggleViewMode} 
        />
        
        <CardContent className="pt-4 relative z-10">
          <AnimatePresence mode="wait">
            {expenses.length > 0 ? (
              <ChartContent 
                expenses={expenses} 
                viewMode={viewMode} 
              />
            ) : (
              <ChartEmptyState />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
