
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressSectionProps {
  progressPercentage: number;
  isComplete: boolean;
}

export const ProgressSection = ({ progressPercentage, isComplete }: ProgressSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <PiggyBank className={cn(
            "h-4 w-4 mr-1.5",
            "text-emerald-500 dark:text-emerald-400"
          )} />
          <span className={cn(
            "font-medium",
            "text-emerald-700 dark:text-emerald-300"
          )}>
            Épargne accumulée
          </span>
        </div>
        <span className="font-semibold">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      {/* Progress bar with animated gradient for completed projects */}
      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className={cn(
            "h-full rounded-full",
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-500"
              : "bg-emerald-500 dark:bg-emerald-400"
          )}
          style={{ width: `${progressPercentage}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
};
