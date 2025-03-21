
import { BarChartBig } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ExpensesChartHeader = () => {
  return (
    <>
      <CardTitle className={cn(
        "text-xl font-semibold flex items-center gap-2",
        // Light mode
        "text-gray-700",
        // Dark mode
        "dark:text-gray-300"
      )}>
        <div className={cn(
          "p-1.5 rounded",
          // Light mode
          "bg-gray-100",
          // Dark mode
          "dark:bg-gray-800/40"
        )}>
          <BarChartBig className={cn(
            "h-5 w-5",
            // Light mode
            "text-gray-600",
            // Dark mode
            "dark:text-gray-400"
          )} />
        </div>
        Dépenses mensuelles
      </CardTitle>
      <CardDescription className={cn(
        "mt-1 text-sm",
        // Light mode
        "text-gray-600/80",
        // Dark mode
        "dark:text-gray-400/90"
      )}>
        Répartition des dépenses mensuelles par catégorie pour l'année en cours
      </CardDescription>
    </>
  );
};
