
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const EmptySavingsState = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="col-span-full"
    >
      <div
        className={cn(
          "rounded-lg py-10 px-6 text-center",
          "bg-gradient-to-b from-gray-50 to-gray-100/80 border border-gray-200/70",
          "dark:bg-gradient-to-b dark:from-gray-800/50 dark:to-gray-900/50 dark:border-gray-700/50"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 2px 8px -2px rgba(0, 0, 0, 0.15)"
            : "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={cn(
              "p-3 rounded-full",
              "bg-gradient-to-br from-quaternary-100 to-quaternary-50",
              "dark:bg-gradient-to-br dark:from-teal-900/40 dark:to-teal-800/30"
            )}
          >
            <PiggyBank/>
          </div>
          <h3
            className={cn(
              "text-lg font-medium bg-clip-text text-transparent",
              "bg-gradient-to-r from-quaternary-600 via-teal-500 to-quaternary-500",
              "dark:bg-gradient-to-r dark:from-quaternary-400 dark:via-quaternary-300 dark:to-quaternary-400"
            )}
          >
            Aucune épargne
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Vous n'avez pas défini d'épargne mensuelle. Ajoutez une épargne pour commencer.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
