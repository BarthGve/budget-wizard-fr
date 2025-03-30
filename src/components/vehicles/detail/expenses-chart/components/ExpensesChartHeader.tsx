
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ExpensesChartHeaderProps {
  title: string;
  description: string;
  showMultiYear: boolean;
  onToggleView: () => void;
  isVehicleSold?: boolean;
}

export const ExpensesChartHeader = ({
  title,
  description,
  showMultiYear,
  onToggleView,
  isVehicleSold = false
}: ExpensesChartHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className={cn(
          "text-base font-medium flex items-center gap-2",
          "text-gray-800 dark:text-gray-200"
        )}>
          <div className={cn(
            "p-1.5 rounded",
            "bg-gray-100 dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700"
          )}>
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-1">
          {description}
        </p>
      </motion.div>
      
      {!isVehicleSold && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button
            onClick={onToggleView}
            size="sm"
            className={cn(
              "gap-1.5 h-9 px-4 font-medium text-sm self-start",
              "bg-gray-100 hover:bg-gray-200 text-gray-700",
              "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300",
              "border border-gray-200 dark:border-gray-700",
              "shadow-sm"
            )}
            variant="outline"
          >
            <Calendar className="h-3.5 w-3.5" />
            {showMultiYear ? "Vue mensuelle" : "Vue annuelle"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
