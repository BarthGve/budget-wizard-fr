
import { cn } from "@/lib/utils";
import { AmountDisplay } from "./AmountDisplay";
import { PercentageChange } from "./PercentageChange";
import { RetailerHeader } from "./RetailerHeader";
import { useRetailerCardData } from "./useRetailerCardData";

interface RetailerCardContentProps {
  retailer: {
    id: string;
    name: string;
    logo_url?: string;
  };
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
    comment?: string;
  }>;
  viewMode: "monthly" | "yearly";
  onAddExpense: () => void;
}

export function RetailerCardContent({ 
  retailer, 
  expenses, 
  viewMode, 
  onAddExpense 
}: RetailerCardContentProps) {
  const {
    totalCurrentPeriod,
    totalPreviousPeriod,
    percentageChange,
    periodLabel,
    hasIncreased,
    hasChanged,
    isIncrease,
    comparisonLabel,
    prevTotal
  } = useRetailerCardData({ expenses, viewMode });

  return (
    <div className="p-5 relative z-10">
      <RetailerHeader 
        retailer={retailer} 
        onAddExpense={onAddExpense} 
      />
      
      <div className="space-y-3">
        <AmountDisplay 
          periodLabel={periodLabel}
          amount={totalCurrentPeriod}
          prevAmount={prevTotal}
          hasIncreased={hasIncreased}
          hasChanged={hasChanged}
        />
        
        <PercentageChange 
          isIncrease={isIncrease}
          percentageChange={percentageChange}
          comparisonLabel={comparisonLabel}
          showIndicator={totalPreviousPeriod > 0}
        />
      </div>
    </div>
  );
}
