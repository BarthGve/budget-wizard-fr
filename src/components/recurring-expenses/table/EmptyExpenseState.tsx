
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

export const EmptyExpenseState = () => {
  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden",
      // Light mode
      "bg-white border-tertiary-100", 
      // Dark mode
      "dark:bg-gray-800/90 dark:border-tertiary-800/50"
    )}>
      <CardContent className="py-12">
        <div className={cn(
          "flex flex-col items-center justify-center gap-4 text-center",
          // Light mode
          "text-tertiary-500/80",
          // Dark mode
          "dark:text-tertiary-400/80"
        )}>
          <FileText className="h-12 w-12 opacity-40" />
          <div className="space-y-2">
            <h3 className={cn(
              "font-semibold text-lg",
              // Light mode
              "text-tertiary-700",
              // Dark mode
              "dark:text-tertiary-300"
            )}>
              Aucune charge récurrente
            </h3>
            <p className="max-w-md text-sm">
              Vous n'avez pas encore ajouté de charges récurrentes. Commencez par ajouter une nouvelle dépense.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
