
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
        "bg-white border-quinary-200 text-quinary-600",
        "hover:border-quinary-300 hover:bg-quinary-50/50 hover:text-quinary-700",
        // Dark mode
        "dark:bg-gray-800 dark:border-quinary-800/60 dark:text-quinary-400",
        "dark:hover:bg-quinary-900/20 dark:hover:border-quinary-700 dark:hover:text-quinary-300"
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
          "bg-quinary-100/80 text-quinary-600",
          "dark:bg-quinary-800/50 dark:text-quinary-300"
        )}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        <span className="font-medium text-sm">Ajouter</span>
      </div>
    </Button>
  );
};
