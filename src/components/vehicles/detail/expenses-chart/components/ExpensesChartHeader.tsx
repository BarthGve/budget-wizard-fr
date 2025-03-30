
import { BarChart3, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div>
        <h3 className={cn(
          "text-base font-medium flex items-center gap-2",
          "text-gray-800 dark:text-gray-200"
        )}>
          <BarChart3 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
      
      {!isVehicleSold && (
        <Button
          onClick={onToggleView}
          size="sm"
          className={cn(
            "gap-1.5 h-9 px-3 font-normal text-sm self-start",
            "bg-gray-100 hover:bg-gray-200 text-gray-600",
            "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300",
            "border border-gray-200 dark:border-gray-700"
          )}
          variant="outline"
        >
          <Calendar className="h-3.5 w-3.5" />
          {showMultiYear ? "Vue mensuelle" : "Vue annuelle"}
        </Button>
      )}
    </div>
  );
};
