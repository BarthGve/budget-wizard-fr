
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpensesChartHeaderProps {
  viewMode: 'monthly' | 'yearly';
  onViewModeChange: (mode: 'monthly' | 'yearly') => void;
}

/**
 * Composant d'en-tête pour le graphique des dépenses avec sélecteur de mode
 */
export function ExpensesChartHeader({ viewMode, onViewModeChange }: ExpensesChartHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between pb-2 relative z-10">
      <div>
        <h3 className={cn(
          "text-xl font-semibold flex items-center gap-2",
          // Light mode
          "text-blue-700",
          // Dark mode
          "dark:text-blue-300"
        )}>
          <div className={cn(
            "p-1.5 rounded",
            // Light mode
            "bg-blue-100",
            // Dark mode
            "dark:bg-blue-800/40"
          )}>
            <BarChart3 className={cn(
              "h-5 w-5",
              // Light mode
              "text-blue-600",
              // Dark mode
              "dark:text-blue-400"
            )} />
          </div>
          Évolution des dépenses
        </h3>
        <p className={cn(
          "mt-1 text-sm",
          // Light mode
          "text-blue-600/80",
          // Dark mode
          "dark:text-blue-400/90"
        )}>
          Évolution de vos dépenses {viewMode === 'monthly' ? 'mensuelles' : 'annuelles'} chez ce commerçant
        </p>
      </div>
      
      <div className="flex items-center p-1 bg-blue-50 rounded-full border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/60">
        <div className="flex items-center space-x-2 px-3">
          <Calendar className={`h-4 w-4 ${viewMode === 'monthly' ? 'text-blue-600' : 'text-gray-400'} transition-colors dark:${viewMode === 'monthly' ? 'text-blue-300' : 'text-gray-500'}`} />
          <Label 
            htmlFor="chart-view-mode" 
            className={`${viewMode === 'monthly' ? 'text-blue-600 font-medium dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'} transition-colors`}
          >
            Mensuel
          </Label>
        </div>
        
        <Switch
          id="chart-view-mode"
          checked={viewMode === 'yearly'}
          onCheckedChange={(checked) => onViewModeChange(checked ? 'yearly' : 'monthly')}
          className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
        />
        
        <div className="flex items-center space-x-2 px-3">
          <Label 
            htmlFor="chart-view-mode" 
            className={`${viewMode === 'yearly' ? 'text-blue-600 font-medium dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'} transition-colors`}
          >
            Annuel
          </Label>
          <BarChart3 className={`h-4 w-4 ${viewMode === 'yearly' ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'} transition-colors`} />
        </div>
      </div>
    </div>
  );
}
