import { motion } from "framer-motion";
import { Banknote } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const ContributorsHeader = () => {
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
            "bg-gradient-to-br from-quinary/20 to-quinary/10",
            // Dark mode
            "dark:bg-gradient-to-br dark:from-quinary/40 dark:to-quinary/30 dark:shadow-quinary/10"
          )}
        >
          <Banknote className={cn(
            "h-6 w-6",
            "text-quinary",
            "dark:text-quinary"
          )} />
        </motion.div>
        
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-clip-text text-transparent",
            // Light mode gradient
            "bg-gradient-to-r from-quinary/80 via-quinary/60 to-quinary/40",
            // Dark mode gradient
            "dark:bg-gradient-to-r dark:from-quinary/60 dark:via-quinary/50 dark:to-quinary/30"
          )}>
            Revenus
          </h1>
          <p className={cn(
            "text-sm mt-1",
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Indiquez vos rentrées d'argent régulières
          </p>
        </div>
      </div>
    </motion.div>
  );
};