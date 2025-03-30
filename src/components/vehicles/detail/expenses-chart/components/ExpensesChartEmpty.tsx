
import { cn } from "@/lib/utils";
import { BarChart2, FileBarChart, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export const ExpensesChartEmpty = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "h-full w-full flex flex-col items-center justify-center py-12",
        "bg-gradient-to-b from-gray-50/80 to-gray-100/30 dark:from-gray-800/30 dark:to-gray-800/20 rounded-md",
        "border border-dashed border-gray-300 dark:border-gray-700"
      )}
    >
      <div className={cn(
        "p-4 rounded-full",
        "bg-gradient-to-br from-gray-100 to-gray-200/80 dark:from-gray-800 dark:to-gray-700/80",
        "shadow-sm dark:shadow-gray-900/50",
        "text-gray-400 dark:text-gray-500"
      )}>
        <FileBarChart className="h-10 w-10" />
      </div>
      
      <h3 className="mt-5 text-gray-600 dark:text-gray-300 font-medium text-lg">
        Aucune dépense enregistrée
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md text-center px-6 mt-2">
        Ajoutez des dépenses pour ce véhicule pour visualiser leur évolution au fil du temps.
      </p>
      
      <div className="mt-6 flex gap-1.5 items-center text-gray-400 dark:text-gray-500 text-xs">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Les graphiques s'afficheront automatiquement dès que des dépenses seront ajoutées</span>
      </div>
    </motion.div>
  );
};
