
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

export const SavingsHeader = () => {
  return (
    <motion.div 
      className="flex-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
              Épargne
            </h1>
            <p className="text-muted-foreground">
              Prévoyez vos versements mensuels d'épargne
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
