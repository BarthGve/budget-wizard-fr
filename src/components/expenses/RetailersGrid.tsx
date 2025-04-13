
import { RetailerCard } from "./RetailerCard";
import { useEffect, useState } from "react";
import { RetailerCardSkeleton } from "./skeletons/RetailerCardSkeleton";

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
  isLoading?: boolean;
}

export function RetailersGrid({
  retailers,
  expenses,
  expensesByRetailer,
  onExpenseUpdated,
  viewMode,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <RetailerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {retailersData.map((item, index) => (
        <RetailerCard
          key={item.retailer.id}
          retailer={item.retailer}
          expenses={item.expenses || []}
          onExpenseUpdated={onExpenseUpdated}
          viewMode={viewMode}
          colorScheme={colorSchemes[index]}
        />
      ))}
    </div>
  );
}
