import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const SavingsHeader = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-4 mb-2 flex items-center justify-between"
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(
            "p-2.5 rounded-lg shadow-sm mt-0.5",
            // Light mode
            "bg-gradient-to-br from-emerald-100 to-green-50",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-emerald-900/40 dark:to-green-800/30 dark:shadow-emerald-900/10"
          )}
        >
          <PiggyBank className={cn(
            "h-6 w-6",
            "text-emerald-600",
            "dark:text-emerald-400"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400",
            // Dark mode gradient
            "dark:bg-gradient-to-r dark:from-emerald-400 dark:via-green-400 dark:to-teal-300"
          )}>
            Épargne
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Prévoyez vos versements mensuels d'épargne
          </p>
        </div>
      </div>
    </motion.div>
  );
};
