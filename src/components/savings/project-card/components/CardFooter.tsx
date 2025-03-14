
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SavingsProject } from "@/types/savings-project";

interface CardFooterProps {
  onSelect: (project: SavingsProject) => void;
  project: SavingsProject;
}

export const CardFooter = ({ onSelect, project }: CardFooterProps) => {
  return (
    <motion.div 
      className="mt-auto"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => onSelect(project)}
        className={cn(
          "w-full py-2 px-3 rounded-md flex items-center justify-between text-sm font-medium transition-colors",
          // Light mode
          "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
          // Dark mode
          "dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/30"
        )}
      >
        <span>Voir les détails</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};
