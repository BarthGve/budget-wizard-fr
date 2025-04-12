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
            "bg-gradient-to-br from-tertiary/20 to-tertiary/10",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-tertiary/30 dark:to-tertiary/20 dark:shadow-tertiary/10"
          )}
        >
          <ClipboardList className={cn(
            "h-6 w-6",
            "text-tertiary",
            "dark:text-tertiary"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-tertiary via-tertiary to-tertiary",
            // Dark mode gradient
            "dark:bg-gradient-to-r dark:from-tertiary dark:via-tertiary dark:to-tertiary"
          )}>
            Charges
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
                "bg-white border-tertiary/20 text-tertiary",
                "hover:border-tertiary/30 hover:bg-tertiary/10 hover:text-tertiary",
                // Dark mode
                "dark:bg-gray-800 dark:border-tertiary/40 dark:text-tertiary",
                "dark:hover:bg-tertiary/20 dark:hover:border-tertiary dark:hover:text-tertiary"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 10px -2px rgba(180, 83, 9, 0.15)" // ajuster selon la teinte réelle
                  : "0 2px 10px -2px rgba(180, 83, 9, 0.1)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                  // Light mode
                  "bg-tertiary/10 text-tertiary",
                  // Dark mode
                  "dark:bg-tertiary/20 dark:text-tertiary"
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