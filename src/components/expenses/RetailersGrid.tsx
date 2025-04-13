
import { RetailerCard } from "./RetailerCard";
import { useEffect, useState } from "react";
import { RetailerCardSkeleton } from "./skeletons/RetailerCardSkeleton";

interface RetailersGridProps {
  retailers: Array<{
    id: string;
    name: string;
    logo_url?: string;
  }>;
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
    comment?: string;
    retailer_id: string;
  }>;
  onExpenseUpdated: () => void;
  viewMode: "monthly" | "yearly";
  isLoading?: boolean;
}

export function RetailersGrid({
  retailers,
  expenses,
  onExpenseUpdated,
  viewMode,
  isLoading = false,
}: RetailersGridProps) {
  // État pour alterner les styles de couleur des cartes
  const [colorSchemes, setColorSchemes] = useState<Array<"blue" | "purple" | "amber">>([]);

  // Générer les schémas de couleur pour chaque retailer
  useEffect(() => {
    const schemes: Array<"blue" | "purple" | "amber"> = [];
    const colorOptions: Array<"blue" | "purple" | "amber"> = ["blue", "purple", "amber"];
    
    retailers.forEach((_, index) => {
      schemes.push(colorOptions[index % colorOptions.length]);
    });
    
    setColorSchemes(schemes);
  }, [retailers]);

  // Regrouper les dépenses par retailer_id
  const expensesByRetailer = expenses.reduce((acc, expense) => {
    if (!acc[expense.retailer_id]) {
      acc[expense.retailer_id] = [];
    }
    acc[expense.retailer_id].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

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
      {retailers.map((retailer, index) => (
        <RetailerCard
          key={retailer.id}
          retailer={retailer}
          expenses={expensesByRetailer[retailer.id] || []}
          onExpenseUpdated={onExpenseUpdated}
          viewMode={viewMode}
          colorScheme={colorSchemes[index]}
        />
      ))}
    </div>
  );
}
