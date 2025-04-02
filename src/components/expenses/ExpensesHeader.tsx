import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
            className="flex items-center p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-inner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 px-3">
              <Switch 
                id="view-mode" 
                checked={viewMode === 'yearly'} 
                onCheckedChange={checked => setViewMode(checked ? 'yearly' : 'monthly')}
                className={cn(
                  "data-[state=checked]:bg-blue-500",
                  "dark:data-[state=checked]:bg-blue-600"
                )}
              />
              <Label 
                htmlFor="view-mode"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Vue annuelle
              </Label>
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
