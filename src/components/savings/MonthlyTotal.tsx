
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";

interface MonthlyTotalProps {
  totalMonthlyAmount: number;
}

export const MonthlyTotal = ({ totalMonthlyAmount }: MonthlyTotalProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          <CardTitle>Total mensuel</CardTitle>
        </div>
        <CardDescription>
          Montant total de vos versements mensuels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-4xl font-bold">{totalMonthlyAmount}€</p>
          <p className="text-sm text-muted-foreground mt-2">par mois</p>
        </div>
      </CardContent>
    </Card>
  );
};
