import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const RecurringExpensesHeader = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-2.5 rounded-lg shadow-sm mt-0.5",
            // Light mode
            "bg-gradient-to-br from-blue-100 to-blue-50",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-blue-800/30 dark:shadow-blue-900/10"
          )}
        >
          <ClipboardList className={cn(
            "h-6 w-6",
            "text-blue-600",
            "dark:text-blue-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500",
            // Dark mode gradient (plus lumineux pour meilleure lisibilité)
            "dark:bg-gradient-to-r dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400"
          )}>
            Charges récurrentes
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Gérez vos charges récurrentes et leurs échéances
          </p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <RecurringExpenseDialog
          trigger={
            <Button 
              variant="outline"
              className={cn(
                "h-10 px-4 border transition-all duration-200 rounded-md",
                "hover:scale-[1.02] active:scale-[0.98]",
                // Light mode
                "bg-white border-blue-200 text-blue-600",
                "hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700",
                // Dark mode
                "dark:bg-gray-800 dark:border-blue-800/60 dark:text-blue-400",
                "dark:hover:bg-blue-900/20 dark:hover:border-blue-700 dark:hover:text-blue-300"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 10px -2px rgba(30, 64, 175, 0.15)"
                  : "0 2px 10px -2px rgba(37, 99, 235, 0.1)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                  // Light mode
                  "bg-blue-100/80 text-blue-600",
                  // Dark mode
                  "dark:bg-blue-800/50 dark:text-blue-300"
                )}>
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="font-medium text-sm">Ajouter</span>
              </div>
            </Button>
          }
        />
      </motion.div>
    </motion.div>
  );
};
