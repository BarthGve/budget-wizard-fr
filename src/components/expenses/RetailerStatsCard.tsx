
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface RetailerStatsCardProps {
  title: string;
  amount: number;
  count: number;
  label: string;
  className?: string;
}

export function RetailerStatsCard({ title, amount, count, label, className }: RetailerStatsCardProps) {
  return (
    <Card className={cn("p-6 text-white", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 space-y-1">
        <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
        <p className="text-sm opacity-90">
          {count.toFixed(1)} {label}
        </p>
      </div>
    </Card>
  );
}
