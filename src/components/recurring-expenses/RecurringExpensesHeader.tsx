import { Button } from "@/components/ui/button";
import { Plus, Calendar, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const RecurringExpensesHeader = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [isHovered, setIsHovered] = useState(false);
  
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
              className={cn(
                "relative overflow-hidden group rounded-full pl-5 pr-6  h-auto font-medium transition-all duration-300",
                // Default state
                "border-0 shadow-lg", 
                // Animation états
                "hover:shadow-xl active:scale-[0.98]",
                // Light mode styling
                "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                "hover:from-blue-600 hover:to-blue-700",
                // Dark mode styling
                "dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-700 dark:text-blue-50",
                "dark:hover:from-blue-500 dark:hover:to-blue-600"
              )}
              style={{
                boxShadow: isHovered
                  ? isDarkMode
                    ? "0 8px 24px -4px rgba(30, 64, 175, 0.4), 0 2px 8px -2px rgba(30, 64, 175, 0.3)"
                    : "0 8px 24px -4px rgba(37, 99, 235, 0.35), 0 2px 8px -2px rgba(37, 99, 235, 0.25)"
                  : isDarkMode
                    ? "0 6px 20px -4px rgba(30, 64, 175, 0.35), 0 2px 6px -2px rgba(30, 64, 175, 0.2)"
                    : "0 6px 20px -4px rgba(37, 99, 235, 0.3), 0 2px 6px -2px rgba(37, 99, 235, 0.2)"
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Cercle d'effet de particules (visible uniquement au survol) */}
              <span className={cn(
                "absolute inset-0 overflow-hidden rounded-full",
                "transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0"
              )}>
                <span className={cn(
                  "absolute w-12 h-12 rounded-full",
                  "transform -translate-x-1/2 -translate-y-1/2",
                  "bg-blue-300/20 dark:bg-blue-300/15",
                  "animate-ripple-fast"
                )} style={{ left: "50%", top: "50%" }} />
                <span className={cn(
                  "absolute w-16 h-16 rounded-full",
                  "transform -translate-x-1/2 -translate-y-1/2",
                  "bg-blue-300/15 dark:bg-blue-300/10",
                  "animate-ripple-slow",
                  "delay-150"
                )} style={{ left: "50%", top: "50%" }} />
              </span>
              
              {/* Icône et texte */}
              <div className="flex items-center gap-2.5 relative z-10">
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  "bg-blue-400/30 dark:bg-blue-300/20",
                  "group-hover:scale-110"
                )}>
                  <motion.div
                    animate={isHovered ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </motion.div>
                </span>
                
                <motion.span 
                  className="font-semibold text-sm"
                  animate={isHovered 
                    ? { y: 0, opacity: 1 } 
                    : { y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Ajouter une charge
                </motion.span>
              </div>
            </Button>
          }
        />
      </motion.div>
    </motion.div>
  );
};
