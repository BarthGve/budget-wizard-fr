
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export const NoActiveCredits = () => {
  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden",
      // Light mode
      "bg-white border-senary-100", 
      // Dark mode
      "dark:bg-gray-800/90 dark:border-senary-800/50"
    )}>
      <CardContent className="py-12">
        <div className={cn(
          "flex flex-col items-center justify-center gap-4 text-center",
          // Light mode
          "text-senary-500/80",
          // Dark mode
          "dark:text-senary-400/80"
        )}>
          <CreditCard className="h-12 w-12 opacity-40" />
          <div className="space-y-2">
            <h3 className={cn(
              "font-semibold text-lg",
              // Light mode
              "text-senary-700",
              // Dark mode
              "dark:text-senary-300"
            )}>
              Aucun crédit actif
            </h3>
            <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
              Vous n'avez pas encore de crédits actifs. Commencez par ajouter un nouveau crédit.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
