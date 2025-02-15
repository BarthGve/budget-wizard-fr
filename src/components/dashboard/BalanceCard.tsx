
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  isMonthly?: boolean;
}

export const BalanceCard = ({ balance, isMonthly = true }: BalanceCardProps) => {
  return (
    <Card>
      <CardHeader className="py-[16px]">
        <CardTitle className="text-2xl">Solde</CardTitle>
        <CardDescription>
          Montant restant après charges et épargne
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {balance.toFixed(2)} €
        </p>
      </CardContent>
    </Card>
  );
};
