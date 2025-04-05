
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  isMonthly?: boolean;
}

export const BalanceCard = ({
  balance,
  isMonthly = true
}: BalanceCardProps) => {
  return (
    <Card className="bg-background h-full">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Solde</CardTitle>
          <Scale className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Montant disponible</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {balance.toFixed(0)} €
        </p>
      </CardContent>
    </Card>
  );
};
