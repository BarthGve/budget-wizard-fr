
import { formatCurrency } from "@/utils/format";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  viewMode: 'monthly' | 'yearly';
}

export function CustomTooltip({ active, payload, label, viewMode }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    if (viewMode === 'monthly') {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Total: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    } else {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">Année {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
  }
  return null;
}
