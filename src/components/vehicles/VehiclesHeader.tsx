
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import { AddVehicleDialog } from "./AddVehicleDialog";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const VehiclesHeader = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
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
            "bg-gradient-to-br from-gray-100 to-gray-50",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-gray-900/40 dark:to-gray-800/30 dark:shadow-gray-900/10"
          )}
        >
          <Car className={cn(
            "h-6 w-6",
            "text-gray-600",
            "dark:text-gray-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-gray-600 via-gray-500 to-gray-500",
            // Dark mode gradient
            "dark:bg-gradient-to-r dark:from-gray-400 dark:via-gray-300 dark:to-gray-400"
          )}>
            Véhicules
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Gérez vos véhicules et suivez leurs dépenses
          </p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <AddVehicleDialog 
          trigger={
            <Button 
              variant="outline"
              className={cn(
                "h-10 px-4 border transition-all duration-200 rounded-md",
                "hover:scale-[1.02] active:scale-[0.98]",
                // Light mode
                "bg-white border-gray-200 text-gray-600",
                "hover:border-gray-300 hover:bg-gray-50/50 hover:text-gray-700",
                // Dark mode
                "dark:bg-gray-800 dark:border-gray-800/60 dark:text-gray-400",
                "dark:hover:bg-gray-900/20 dark:hover:border-gray-700 dark:hover:text-gray-300"
              )}
              style={{
                boxShadow: isDarkMode
                  ? "0 2px 10px -2px rgba(169, 169, 169, 0.15)"
                  : "0 2px 10px -2px rgba(169, 169, 169, 0.1)"
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                  // Light mode
                  "bg-gray-100/80 text-gray-600",
                  // Dark mode
                  "dark:bg-gray-800/50 dark:text-gray-300"
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
