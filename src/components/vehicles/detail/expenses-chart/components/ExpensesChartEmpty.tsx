
import { BarChart } from "lucide-react";

export const ExpensesChartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2 h-[250px]">
      <BarChart className="h-12 w-12 text-gray-200 dark:text-gray-700" />
      <p className="text-center text-gray-500 dark:text-gray-400">
        Aucune dépense enregistrée pour cette année
      </p>
    </div>
  );
};
