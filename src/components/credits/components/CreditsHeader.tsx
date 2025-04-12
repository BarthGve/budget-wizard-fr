
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { CreditDialog } from "../CreditDialog";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

export const CreditsHeader = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6",
        // Sur mobile, ajout de marge en haut pour éviter les chevauchements
        isMobile && "mt-14"
      )}
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
            "bg-gradient-to-br from-primary-100 to-primary-50",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-primary-900/40 dark:to-primary-800/30 dark:shadow-primary-900/10"
          )}
        >
          <CreditCard className={cn(
            "h-6 w-6",
            "text-primary-600",
            "dark:text-primary-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-primary-600 via-primary-500 to-violet-500",
            // Dark mode gradient
            "dark:bg-gradient-to-r dark:from-primary-400 dark:via-primary-300 dark:to-violet-400"
          )}>
            Crédits
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Gérez vos crédits et leurs échéances
          </p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <CreditDialog 
          trigger={
            <Button 
              variant="outline"
              className={cn(
                "h-10 px-4 border transition-all duration-200 rounded-md",
                "hover:scale-[1.02] active:scale-[0.98]",
                // Light mode
                "bg-white border-primary-200 text-primary-600",
                "hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700",
                // Dark mode
                "dark:bg-gray-800 dark:border-primary-800/60 dark:text-primary-400",
                "dark:hover:bg-primary-900/20 dark:hover:border-primary-700 dark:hover:text-primary-300"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 10px -2px rgba(139, 92, 246, 0.15)"
                  : "0 2px 10px -2px rgba(139, 92, 246, 0.1)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                  // Light mode
                  "bg-primary-100/80 text-primary-600",
                  // Dark mode
                  "dark:bg-primary-800/50 dark:text-primary-300"
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
