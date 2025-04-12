
import { Card, CardContent } from "@/components/ui/card";
import { Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export const NoArchivedCredits = () => {
  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden",
      // Light mode
      "bg-white border-primary-100", 
      // Dark mode
      "dark:bg-gray-800/90 dark:border-primary-800/50"
    )}>
      <CardContent className="py-8">
        <div className={cn(
          "flex flex-col items-center justify-center gap-4 text-center",
          // Light mode
          "text-primary-500/80",
          // Dark mode
          "dark:text-primary-400/80"
        )}>
          <Archive className="h-10 w-10 opacity-40" />
          <div className="space-y-2">
            <h3 className={cn(
              "font-semibold text-lg",
              // Light mode
              "text-primary-700",
              // Dark mode
              "dark:text-primary-300"
            )}>
              Aucun crédit archivé
            </h3>
            <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
              Les crédits remboursés apparaîtront ici lorsque vous en aurez.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
