import { RetailerStatsCard } from "@/components/expenses/RetailerStatsCard";
import { Calendar, Wallet, Calculator, BarChart2 } from "lucide-react";

interface RetailerStatsProps {
  monthlyTotal: number;
  monthlyCount: number;
  yearlyTotal: number;
  yearlyCount: number;
  monthlyAverage: number;
  monthlyAverageCount: number;
  previousMonthTotal?: number;
  previousYearTotal?: number;
  className?: string;
  compactView?: boolean;
}

export function RetailerStats({
  monthlyTotal,
  monthlyCount,
  yearlyTotal,
  yearlyCount,
  monthlyAverage,
  monthlyAverageCount,
  previousMonthTotal,
  previousYearTotal,
  className,
  compactView = false
}: RetailerStatsProps) {
  // Détermine la disposition des grilles en fonction de la vue compacte ou non
  const gridLayout = compactView 
    ? "grid grid-cols-1 sm:grid-cols-3 gap-3"
    : "grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6";

  return (
    <div className={gridLayout + (className ? ` ${className}` : "")}>
      <RetailerStatsCard
        title="Dépenses du mois"
        amount={monthlyTotal}
        count={monthlyCount}
        label="achats ce mois-ci"
        colorScheme="blue"
        previousAmount={previousMonthTotal}
        icon={<Calendar className="h-5 w-5 text-blue-200" />}
      />
      
      <RetailerStatsCard
        title="Dépenses de l'année"
        amount={yearlyTotal}
        count={yearlyCount}
        label="achats cette année"
        colorScheme="purple"
        previousAmount={previousYearTotal}
        icon={<Wallet className="h-5 w-5 text-purple-200" />}
      />
      
      <RetailerStatsCard
        title="Moyenne mensuelle"
        amount={monthlyAverage}
        count={monthlyAverageCount}
        label={monthlyAverageCount === 1 ? "achat par mois" : "achats par mois"}
        colorScheme="orange"
        icon={<Calculator className="h-5 w-5 text-orange-200" />}
      />
    </div>
  );
}

// Version avancée avec plus d'options et de statistiques
export function RetailerStatsAdvanced({
  monthlyTotal,
  monthlyCount,
  yearlyTotal,
  yearlyCount,
  monthlyAverage,
  monthlyAverageCount,
  previousMonthTotal,
  previousYearTotal,
  additionalStats = {},
  className
}: RetailerStatsProps & {
  additionalStats?: {
    maxExpense?: { amount: number; date: string },
    frequentPurchases?: { count: number; trend?: number },
    yearOverYearChange?: { percentage: number; trend?: 'up' | 'down' | 'stable' }
  }
}) {
  const { maxExpense, frequentPurchases, yearOverYearChange } = additionalStats;
  
  return (
    <div className={`space-y-6 ${className || ""}`}>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Statistiques clés</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
        <RetailerStatsCard
          title="Dépenses du mois"
          amount={monthlyTotal}
          count={monthlyCount}
          label="achats ce mois-ci"
          colorScheme="blue"
          previousAmount={previousMonthTotal}
          icon={<Calendar className="h-5 w-5 text-blue-200" />}
        />
        
        <RetailerStatsCard
          title="Dépenses de l'année"
          amount={yearlyTotal}
          count={yearlyCount}
          label="achats cette année"
          colorScheme="purple"
          previousAmount={previousYearTotal}
          icon={<Wallet className="h-5 w-5 text-purple-200" />}
        />
        
        <RetailerStatsCard
          title="Moyenne mensuelle"
          amount={monthlyAverage}
          count={monthlyAverageCount}
          label={monthlyAverageCount === 1 ? "achat par mois" : "achats par mois"}
          colorScheme="orange"
          icon={<Calculator className="h-5 w-5 text-orange-200" />}
        />
      </div>
      
      {(maxExpense || frequentPurchases || yearOverYearChange) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-3">Analyses complémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
            {maxExpense && (
              <RetailerStatsCard
                title="Dépense maximale"
                amount={maxExpense.amount}
                count={1}
                label={`le ${new Date(maxExpense.date).toLocaleDateString('fr-FR')}`}
                colorScheme="green"
                icon={<BarChart2 className="h-5 w-5 text-green-200" />}
              />
            )}
            
            {frequentPurchases && (
              <RetailerStatsCard
                title="Fréquence d'achat"
                amount={(yearlyTotal / frequentPurchases.count) || 0}
                count={frequentPurchases.count}
                label="achats réguliers"
                colorScheme="red"
                previousAmount={frequentPurchases.trend ? yearlyTotal / (frequentPurchases.count - frequentPurchases.trend) : undefined}
                icon={<Calendar className="h-5 w-5 text-red-200" />}
              />
            )}
            
            {yearOverYearChange && (
              <RetailerStatsCard
                title="Évolution annuelle"
                amount={yearlyTotal * (1 - (yearOverYearChange.percentage / 100))}
                count={yearOverYearChange.percentage}
                label={`% par rapport à l'an dernier`}
                colorScheme="blue"
                previousAmount={yearlyTotal}
                icon={<BarChart2 className="h-5 w-5 text-blue-200" />}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
