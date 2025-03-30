
import { cn } from "@/lib/utils";
import { BarChart2, FileBarChart, AlertCircle } from "lucide-react";

export const ExpensesChartEmpty = () => {
  return (
    <div className={cn(
      "h-full w-full flex flex-col items-center justify-center",
      "bg-gray-50/50 dark:bg-gray-800/30 rounded-md",
      "border border-dashed border-gray-300 dark:border-gray-700"
    )}>
      <div className={cn(
        "p-3 rounded-full",
        "bg-gray-100 dark:bg-gray-800",
        "text-gray-400 dark:text-gray-500"
      )}>
        <FileBarChart className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-gray-600 dark:text-gray-400 font-medium text-base">
        Aucune dépense
      </h3>
      <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md text-center px-4 mt-1">
        Ajoutez des dépenses pour ce véhicule pour visualiser leur évolution au fil du temps.
      </p>
    </div>
  );
};
