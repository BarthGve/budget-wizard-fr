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
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${className || ""}`}>
      {/* Carte des dépenses mensuelles */}
      <RetailerStatsCard
        title="Mensuel"
        amount={monthlyTotal}
        count={monthlyCount}
        label="Charges mensuelles"
        color="blue"
        previousAmount={previousMonthTotal}
        icon={<Calendar className="h-5 w-5" />}
      />
      
      {/* Carte des dépenses annuelles */}
      <RetailerStatsCard
        title="Annuel"
        amount={yearlyTotal}
        count={yearlyCount}
        label="Charges annuelles"
        color="purple"
        previousAmount={previousYearTotal}
        icon={<Wallet className="h-5 w-5" />}
      />
      
      {/* Carte de la moyenne mensuelle */}
      <RetailerStatsCard
        title="Moyenne"
        amount={monthlyAverage}
        count={monthlyAverageCount}
        label="Moyenne par mois"
        color="orange"
        icon={<Calculator className="h-5 w-5" />}
      />
    </div>
  );
}
