
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface TriggerButtonProps {
  onClick: () => void;
  isDarkMode: boolean;
}

export const TriggerButton = ({ onClick, isDarkMode }: TriggerButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      variant="outline"
      className={cn(
        "h-10 px-3 sm:px-4 border transition-all duration-200 rounded-md",
        "hover:scale-[1.02] active:scale-[0.98]",
        // Light mode
        "bg-white border-amber-200 text-amber-600",
        "hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700",
        // Dark mode
        "dark:bg-gray-800 dark:border-amber-800/60 dark:text-amber-400",
        "dark:hover:bg-amber-900/20 dark:hover:border-amber-700 dark:hover:text-amber-300"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 2px 10px -2px rgba(245, 158, 11, 0.15)"
          : "0 2px 10px -2px rgba(245, 158, 11, 0.1)"
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
          "bg-amber-100/80 text-amber-600",
          "dark:bg-amber-800/50 dark:text-amber-300"
        )}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        <span className="font-medium text-sm">Ajouter</span>
      </div>
    </Button>
  );
};
