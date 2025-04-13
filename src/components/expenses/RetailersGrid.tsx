
import { RetailerCard } from "./RetailerCard";
import { MiniRetailerCard } from "./MiniRetailerCard";
import { useEffect, useState } from "react";
import { RetailerCardSkeleton } from "./skeletons/RetailerCardSkeleton";
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
}

export function RetailersGrid({
  retailers,
  expenses,
  expensesByRetailer,
  onExpenseUpdated,
  viewMode,
  displayMode = "grid",
  isLoading = false,
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
      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <RetailerCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(
      displayMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
        : "grid grid-cols-1 gap-3"
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
