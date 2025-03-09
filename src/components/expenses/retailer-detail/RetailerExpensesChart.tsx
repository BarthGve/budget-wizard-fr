
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { Calendar, BarChart3, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <Card className="backdrop-blur-sm bg-background/95  border-purple-100">
        <CardHeader className="pb-2">
          <motion.div 
            className="flex items-center justify-between" 
            variants={itemVariants}
          >
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Évolution des dépenses
            </CardTitle>
            
            <div className="flex items-center p-1 bg-purple-50 rounded-full border border-purple-100">
              <div className="flex items-center space-x-2 px-3">
                <Calendar className={`h-4 w-4 ${viewMode === 'monthly' ? 'text-purple-600' : 'text-gray-400'} transition-colors`} />
                <Label 
                  htmlFor="chart-view-mode" 
                  className={`${viewMode === 'monthly' ? 'text-purple-600 font-medium' : 'text-gray-400'} transition-colors`}
                >
                  Mensuel
                </Label>
              </div>
              
              <Switch
                id="chart-view-mode"
                checked={viewMode === 'yearly'}
                onCheckedChange={(checked) => setViewMode(checked ? 'yearly' : 'monthly')}
                className="data-[state=checked]:bg-purple-600"
              />
              
              <div className="flex items-center space-x-2 px-3">
                <Label 
                  htmlFor="chart-view-mode" 
                  className={`${viewMode === 'yearly' ? 'text-purple-600 font-medium' : 'text-gray-400'} transition-colors`}
                >
                  Annuel
                </Label>
                <BarChart3 className={`h-4 w-4 ${viewMode === 'yearly' ? 'text-purple-600' : 'text-gray-400'} transition-colors`} />
              </div>
            </div>
          </motion.div>
        </CardHeader>
        
        <CardContent className="pt-4">
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
                  <BarChart3 className="h-12 w-12 text-gray-300" />
                  <p className="text-center">
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