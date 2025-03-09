import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
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
          <Calendar className={cn(
            "h-6 w-6",
            "text-blue-600",
            "dark:text-blue-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight",
            // Light mode - couleur unie
            "text-blue-700",
            // Dark mode - couleur unie
            "dark:text-blue-300"
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
              className={cn(
                "shadow-md font-medium transition-all duration-200",
                // Light mode styling
                "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                // Dark mode styling
                "dark:bg-gradient-to-r dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700",
                // Text color for both modes
                "text-white"
              )}
              // Animation au survol
              style={{
                boxShadow: isDarkMode
                  ? "0 4px 14px -2px rgba(30, 64, 175, 0.25)"
                  : "0 4px 14px -2px rgba(37, 99, 235, 0.25)"
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle charge
            </Button>
          }
        />
      </motion.div>
    </motion.div>
  );
};
