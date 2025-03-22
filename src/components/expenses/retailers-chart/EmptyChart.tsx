
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyChartProps {
  viewMode: 'monthly' | 'yearly';
}

export function EmptyChart({ viewMode }: EmptyChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {viewMode === 'monthly' 
            ? "Dépenses par enseigne (mois en cours)" 
            : "Dépenses annuelles par enseigne"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">
            {viewMode === 'monthly' 
              ? "Aucune dépense ce mois-ci" 
              : "Aucune donnée annuelle disponible"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
