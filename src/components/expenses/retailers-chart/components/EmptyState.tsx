
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  viewMode: 'monthly' | 'yearly';
}

/**
 * Composant pour afficher un état vide lorsqu'il n'y a pas de données
 */
export const EmptyState = ({ viewMode }: EmptyStateProps) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 h-full relative",
      "border shadow-sm hover:shadow-md",

    )}>

      
      <CardHeader className="pb-2 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={cn(
              // Light mode
              "bg-tertiary-100 text-tertiary-700",
              // Dark mode
              "dark:bg-tertiary-800/40 dark:text-tertiary-300",
              // Common
              "p-2 rounded-lg"
            )}>
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              // Light mode
              "text-tertiary-700",
              // Dark mode
              "dark:text-tertiary-300"
            )}>
              {viewMode === 'monthly' 
                ? "Dépenses par enseigne (mois en cours)" 
                : "Dépenses annuelles par enseigne"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-6 relative z-10">
        <div className="flex flex-col items-center justify-center h-[250px] space-y-4">
          <div className={cn(
            "p-3 rounded-full",
            "bg-tertiary-100/60 text-tertiary-500/80",
            "dark:bg-tertiary-900/30 dark:text-tertiary-400/90"
          )}>
            <BarChart3 className="h-8 w-8" />
          </div>
          
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            {viewMode === 'monthly' 
              ? "Aucune dépense enregistrée ce mois-ci" 
              : "Aucune donnée annuelle disponible"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
