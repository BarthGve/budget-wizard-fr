import { RetailerStatsCard } from "@/components/expenses/RetailerStatsCard";
import { Calendar, Wallet, Calculator } from "lucide-react";

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
  className
}: RetailerStatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className || ""}`}>
      {/* Carte des dépenses mensuelles */}
      <RetailerStatsCard
        title="Dépenses du mois"
        amount={monthlyTotal}
        count={monthlyCount}
        label="achats ce mois-ci"
        className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 text-white border-blue-400/20"
        previousAmount={previousMonthTotal}
        icon={<Calendar className="h-5 w-5 text-blue-200" />}
      />
      
      {/* Carte des dépenses annuelles */}
      <RetailerStatsCard
        title="Dépenses de l'année"
        amount={yearlyTotal}
        count={yearlyCount}
        label="achats cette année"
        className="bg-gradient-to-br from-violet-600/90 to-purple-700/90 text-white border-purple-400/20"
        previousAmount={previousYearTotal}
        icon={<Wallet className="h-5 w-5 text-purple-200" />}
      />
      
      {/* Carte de la moyenne mensuelle */}
      <RetailerStatsCard
        title="Moyenne mensuelle"
        amount={monthlyAverage}
        count={monthlyAverageCount}
        label="achats par mois"
        className="bg-gradient-to-br from-amber-500/90 to-orange-600/90 text-white border-orange-400/20"
        icon={<Calculator className="h-5 w-5 text-orange-200" />}
      />
    </div>
  );
}
