
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { Calendar, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

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
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
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
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
              // Light mode
              "text-blue-700",
              // Dark mode
              "dark:text-blue-300"
            )}>
              <div className={cn(
                "p-1.5 rounded",
                // Light mode
                "bg-blue-100",
                // Dark mode
                "dark:bg-blue-800/40"
              )}>
                <TrendingUp className={cn(
                  "h-5 w-5",
                  // Light mode
                  "text-blue-600",
                  // Dark mode
                  "dark:text-blue-400"
                )} />
              </div>
              Évolution des dépenses
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              // Light mode
              "text-blue-600/80",
              // Dark mode
              "dark:text-blue-400/90"
            )}>
              Évolution de vos dépenses {viewMode === 'monthly' ? 'mensuelles' : 'annuelles'} chez ce commerçant
            </CardDescription>
          </div>
          
          <div className="flex items-center p-1 bg-blue-50 rounded-full border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/60">
            <div className="flex items-center space-x-2 px-3">
              <Calendar className={`h-4 w-4 ${viewMode === 'monthly' ? 'text-blue-600' : 'text-gray-400'} transition-colors dark:${viewMode === 'monthly' ? 'text-blue-300' : 'text-gray-500'}`} />
              <Label 
                htmlFor="chart-view-mode" 
                className={`${viewMode === 'monthly' ? 'text-blue-600 font-medium dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'} transition-colors`}
              >
                Mensuel
              </Label>
            </div>
            
            <Switch
              id="chart-view-mode"
              checked={viewMode === 'yearly'}
              onCheckedChange={(checked) => setViewMode(checked ? 'yearly' : 'monthly')}
              className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
            />
            
            <div className="flex items-center space-x-2 px-3">
              <Label 
                htmlFor="chart-view-mode" 
                className={`${viewMode === 'yearly' ? 'text-blue-600 font-medium dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'} transition-colors`}
              >
                Annuel
              </Label>
              <BarChart3 className={`h-4 w-4 ${viewMode === 'yearly' ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'} transition-colors`} />
            </div>
          </div>
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
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2"
                  variants={itemVariants}
                >
                  <BarChart3 className="h-12 w-12 text-blue-200 dark:text-blue-800/40" />
                  <p className="text-center text-blue-600/70 dark:text-blue-400/70">
                    Aucune donnée disponible pour afficher l'évolution des dépenses
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
