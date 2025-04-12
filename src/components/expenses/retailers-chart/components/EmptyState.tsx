
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
      // Light mode
      "bg-white border-blue-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:hover:bg-blue-900/20 dark:border-blue-800/50"
    )}>
      {/* Fond radial gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
      )} />
      
      <CardHeader className="pb-2 pt-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={cn(
              // Light mode
              "bg-blue-100 text-blue-700",
              // Dark mode
              "dark:bg-blue-800/40 dark:text-blue-300",
              // Common
              "p-2 rounded-lg"
            )}>
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              // Light mode
              "text-blue-700",
              // Dark mode
              "dark:text-blue-300"
            )}>
              {viewMode === 'monthly' 
                ? "Dépenses par enseigne (mois en cours)" 
                : "Dépenses annuelles par enseigne"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-6 relative z-10">
        <div className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">
            {viewMode === 'monthly' 
              ? "Aucune dépense ce mois-ci" 
              : "Aucune donnée annuelle disponible"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
