
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { ShoppingBasket, Calendar, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";

interface ExpensesHeaderProps {
  viewMode: 'monthly' | 'yearly';
  setViewMode: (mode: 'monthly' | 'yearly') => void;
  onExpenseAdded: () => void;
}

export const ExpensesHeader = ({ viewMode, setViewMode, onExpenseAdded }: ExpensesHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  
  // Utiliser useMediaQuery pour détecter les écrans mobiles
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <motion.div 
      className="pb-4 mb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={cn(
        "flex flex-col gap-4",
        isMobile ? "" : "flex-row justify-between items-center"
      )}>
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={cn(
              "p-2.5 rounded-lg shadow-sm mt-0.5",
              "bg-gradient-to-br from-blue-100 to-cyan-50",
              "dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-cyan-800/30 dark:shadow-blue-900/10"
            )}
          >
            <ShoppingBasket className={cn(
              "h-6 w-6",
              "text-blue-600",
              "dark:text-blue-400"
            )} />
          </motion.div>
        
          <div>
            <h1 className={cn(
              "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
              "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500",
              "dark:bg-gradient-to-r dark:from-blue-400 dark:via-blue-300 dark:to-cyan-400"
            )}>
              Dépenses
            </h1>
            <p className={cn(
              "text-sm mt-1",
              "text-gray-500",
              "dark:text-gray-400"
            )}>
              Suivez les dépenses que vous réalisez auprès de certaines enseignes
            </p>
          </div>
        </div>
    
        <div className={cn(
          "flex items-center",
          isMobile ? "justify-between w-full" : "gap-8"
        )}>
          <motion.div 
            className="flex items-center p-1 bg-blue-50 rounded-full border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/60"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 px-3">
              <Calendar className={cn(
                "h-4 w-4",
                viewMode === 'monthly' 
                  ? "text-blue-600 dark:text-blue-300" 
                  : "text-gray-400 dark:text-gray-500"
              )} />
              <Label 
                htmlFor="view-mode"
                className={cn(
                  viewMode === 'monthly' 
                    ? "text-blue-600 font-medium dark:text-blue-300" 
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                Mensuel
              </Label>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'monthly' ? 'yearly' : 'monthly')}
              className={cn(
                "flex items-center px-0 py-0 border-0",
                viewMode === 'yearly'
                  ? "bg-transparent text-gray-400 dark:text-gray-500" 
                  : "bg-blue-600 text-white rounded-full w-6 h-6 min-w-6 dark:bg-blue-500"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2 px-3">
              <Label 
                htmlFor="view-mode"
                className={cn(
                  viewMode === 'yearly' 
                    ? "text-blue-600 font-medium dark:text-blue-300" 
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                Annuel
              </Label>
              <BarChart3 className={cn(
                "h-4 w-4",
                viewMode === 'yearly' 
                  ? "text-blue-600 dark:text-blue-300" 
                  : "text-gray-400 dark:text-gray-500"
              )} />
            </div>
          </motion.div>
          <AddExpenseDialog 
            onExpenseAdded={onExpenseAdded} 
            open={addExpenseDialogOpen} 
            onOpenChange={setAddExpenseDialogOpen} 
          />
        </div>
      </div>
    </motion.div>
  );
};
