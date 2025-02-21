
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

interface YearlyTotalCardProps {
  currentYearTotal: number;
  previousYearTotal: number;
}

export function YearlyTotalCard({ currentYearTotal, previousYearTotal }: YearlyTotalCardProps) {
  const percentageChange = previousYearTotal === 0 
    ? 100 
    : ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;

  const isIncrease = percentageChange > 0;

  return (
    <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-shadow duration-300">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-white">Total des dépenses</CardTitle>
        </div>
        <CardDescription className="text-white opacity-80">
          Année en cours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-white">
            {formatCurrency(currentYearTotal)}
          </p>
          <div className="flex items-center gap-1">
            {isIncrease ? (
              <ArrowUpIcon className="h-4 w-4 text-red-400" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-green-400" />
            )}
            <span className={cn("font-medium", 
              isIncrease ? "text-red-400" : "text-green-400"
            )}>
              {Math.abs(percentageChange).toFixed(1)}% par rapport à l'année précédente
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
