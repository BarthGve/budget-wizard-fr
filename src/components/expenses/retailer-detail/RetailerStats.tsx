
import { RetailerStatsCard } from "@/components/expenses/RetailerStatsCard";

interface RetailerStatsProps {
  monthlyTotal: number;
  monthlyCount: number;
  yearlyTotal: number;
  yearlyCount: number;
  monthlyAverage: number;
  monthlyAverageCount: number;
  previousMonthTotal?: number;
  previousYearTotal?: number;
}

export function RetailerStats({
  monthlyTotal,
  monthlyCount,
  yearlyTotal,
  yearlyCount,
  monthlyAverage,
  monthlyAverageCount,
  previousMonthTotal,
  previousYearTotal
}: RetailerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RetailerStatsCard
        title="Dépenses du mois"
        amount={monthlyTotal}
        count={monthlyCount}
        label="achats ce mois-ci"
        className="bg-gradient-to-br from-blue-500 to-indigo-600"
        previousAmount={previousMonthTotal}
      />
      
      <RetailerStatsCard
        title="Dépenses de l'année"
        amount={yearlyTotal}
        count={yearlyCount}
        label="achats cette année"
        className="bg-gradient-to-br from-purple-500 to-pink-600"
        previousAmount={previousYearTotal}
      />
      
      <RetailerStatsCard
        title="Moyenne mensuelle"
        amount={monthlyAverage}
        count={monthlyAverageCount}
        label="achats par mois"
        className="bg-gradient-to-br from-orange-500 to-amber-600"
      />
    </div>
  );
}
