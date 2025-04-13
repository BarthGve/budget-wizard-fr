
import { RetailerCard } from "./retailer-card/RetailerCard";
import { MiniRetailerCard } from "./MiniRetailerCard";
import { useEffect, useState } from "react";
import { RetailerCardSkeleton } from "./skeletons/RetailerCardSkeleton";
import { MiniRetailerCardSkeleton } from "./skeletons/MiniRetailerCardSkeleton";
import { cn } from "@/lib/utils";

export interface Retailer {
  id: string;
  name: string;
  logo_url?: string;
}

export interface SimpleExpense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerWithExpenses {
  retailer: Retailer;
  expenses: SimpleExpense[];
}

interface RetailersGridProps {
  // Deux façons alternatives de passer les données
  retailers?: Retailer[];
  expenses?: SimpleExpense[];
  // OU
  expensesByRetailer?: RetailerWithExpenses[];
  
  onExpenseUpdated: () => void;
  viewMode: "monthly" | "yearly";
  displayMode?: "grid" | "list";
  isLoading?: boolean;
  className?: string;
}

export function RetailersGrid({
  retailers,
  expenses,
  expensesByRetailer,
  onExpenseUpdated,
  viewMode,
  displayMode = "grid",
  isLoading = false,
  className,
}: RetailersGridProps) {
  // État pour alterner les styles de couleur des cartes
  const [colorSchemes, setColorSchemes] = useState<Array<"blue" | "purple" | "amber">>([]);

  // Traiter les données selon le format d'entrée
  const retailersData = expensesByRetailer || 
    (retailers && expenses ? retailers.map(retailer => ({
      retailer,
      expenses: expenses.filter(expense => expense.retailer_id === retailer.id) || []
    })) : []);

  // Générer les schémas de couleur pour chaque retailer
  useEffect(() => {
    const schemes: Array<"blue" | "purple" | "amber"> = [];
    const colorOptions: Array<"blue" | "purple" | "amber"> = ["blue", "purple", "amber"];
    
    retailersData.forEach((_, index) => {
      schemes.push(colorOptions[index % colorOptions.length]);
    });
    
    setColorSchemes(schemes);
  }, [retailersData]);

  if (isLoading) {
    return (
      <div className={cn(
        displayMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
        "py-8",
        className
      )}>
        {[...Array(8)].map((_, index) => (
          displayMode === 'grid' 
            ? <RetailerCardSkeleton key={index} /> 
            : <MiniRetailerCardSkeleton key={index} delay={index} />
        ))}
      </div>
    );
  }
  
  if (retailersData.length === 0) {
    return (
      <div className={cn("py-8", className)}>
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            Aucune enseigne trouvée
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ajoutez des enseignes dans vos paramètres pour commencer à suivre vos dépenses
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      displayMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
      "py-8",
      className
    )}>
      {retailersData.map((item, index) => (
        displayMode === 'grid' ? (
          <RetailerCard
            key={item.retailer.id}
            retailer={item.retailer}
            expenses={item.expenses || []}
            onExpenseUpdated={onExpenseUpdated}
            viewMode={viewMode}
          />
        ) : (
          <MiniRetailerCard
            key={item.retailer.id}
            retailer={item.retailer}
            expenses={item.expenses || []}
            onExpenseUpdated={onExpenseUpdated}
            viewMode={viewMode}
          />
        )
      ))}
    </div>
  );
}
