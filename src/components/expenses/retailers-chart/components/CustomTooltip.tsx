
import React from "react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  viewMode: "monthly" | "yearly" | "monthly-in-year";
}

export const CustomTooltip = ({ active, payload, label, viewMode }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const isMonthlyViewMode = viewMode === "monthly";
  const isYearlyViewMode = viewMode === "yearly";
  const isMonthlyInYearViewMode = viewMode === "monthly-in-year";
  
  // Récupérer le montant total depuis les données
  const totalAmount = payload[0]?.payload?.totalAmount || 0;
  
  const getFormattedLabel = () => {
    if (isMonthlyViewMode) {
      return `${payload[0]?.payload?.retailerName || ""}`;
    } else if (isYearlyViewMode) {
      return `Année ${label}`;
    } else if (isMonthlyInYearViewMode) {
      return `${label} ${new Date().getFullYear()}`;
    }
    return label;
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border dark:border-gray-600", // Bordure plus visible en mode sombre
      "p-4 rounded-lg shadow-lg min-w-[200px]", // Padding augmenté, min-width augmenté
      "flex flex-col gap-2",
      "dark:text-gray-100", // Texte plus clair en mode sombre
      "backdrop-blur-sm dark:backdrop-blur-md" // Effet de flou pour améliorer la lisibilité
    )}>
      <p className="font-medium text-gray-800 dark:text-white border-b pb-1 mb-1 border-gray-200 dark:border-gray-600">
        {getFormattedLabel()}
      </p>
      
      {/* Afficher le montant total pour les vues annuelle et mensuelle */}
      {(isYearlyViewMode || isMonthlyInYearViewMode) && (
        <div className="pb-2 mb-1 border-b border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-800 dark:text-gray-100">
            Total: <span className="font-medium text-tertiary-700 dark:text-tertiary-300">{formatCurrency(totalAmount)}</span>
          </p>
        </div>
      )}
      
      {isMonthlyViewMode ? (
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-tertiary-500 dark:bg-tertiary-400" />
          <p className="text-sm text-gray-800 dark:text-gray-100">
            <span className="font-medium">{formatCurrency(payload[0]?.value || 0)}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {payload.map((entry, index) => {
            // Ne pas inclure totalAmount dans la liste
            if (entry.dataKey === 'totalAmount') return null;
            
            return (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {entry.name}: <span className="font-medium">{formatCurrency(entry.value || 0)}</span>
                </p>
              </div>
            );
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
};
